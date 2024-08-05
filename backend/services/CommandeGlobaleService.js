// backend/services/CommandeGlobaleService.js

const {User, CommandeGlobale, CommandeSecteur, StockSecteur, sequelize} = require('../database/index');  //CommandeGlobale
const moment = require('moment');

// Fonctions auxiliaires

const createCommandeSecteur = async (userId, CommandeGlobaleId, stockSecteurId, transaction) => {
  return await CommandeSecteur.create({
    id_User: userId,
    idCommandeGlobale: CommandeGlobaleId,
    etat: 'initial',
    idStockSecteur: stockSecteurId
  }, { transaction });
};

const associateUsersToCommandeGlobale = async (CommandeGlobale, userIds, transaction) => {
  await CommandeGlobale.addUsers(userIds, { transaction });
};

const initializeCommandeSecteurs = async (CommandeGlobale, userIds, transaction) => {
  for (const userId of userIds) {
    const stockSecteur = await findStockSecteur(userId, transaction);
    await createCommandeSecteur(userId, CommandeGlobale.idCommandeGlobale, stockSecteur.idStockSecteur, transaction);
  }
};

const findStockSecteur = async (userId, transaction) => {
  const stockSecteur = await StockSecteur.findOne({
    where: { id_User: userId },
    transaction
  });

  if (!stockSecteur) {
    throw new Error(`No StockSecteur found for user ${userId}`);
  }

  return stockSecteur;
};

const associateNewUsersAndInitializeCommandeSecteurs = async (commande, userIds, transaction) => {
  const currentUserIds = await commande.getUsers({ attributes: ['id_User'], transaction }).then(users => users.map(user => user.id_User));
  const newUserIds = userIds.filter(userId => !currentUserIds.includes(userId));

  if (newUserIds.length > 0) {
    await associateUsersToCommandeGlobale(commande, newUserIds, transaction);
    await initializeCommandeSecteurs(commande, newUserIds, transaction);
  }
};

const dissociateUsersAndDeleteCommandeSecteurs = async (commande, userIds, transaction) => {
  const currentUserIds = await commande.getUsers({ attributes: ['id_User'], transaction }).then(users => users.map(user => user.id_User));
  const removedUserIds = currentUserIds.filter(userId => !userIds.includes(userId));

  if (removedUserIds.length > 0) {
    await commande.removeUsers(removedUserIds, { transaction });
    await CommandeSecteur.destroy({
      where: {
        id_User: removedUserIds,
        idCommandeGlobale: commande.idCommandeGlobale
      },
      transaction
    });
  }
};

const findCommandeGlobaleById = async (id) => {
  const commande = await CommandeGlobale.findByPk(id);
  if (!commande) {
    throw new Error('Commande not found');
  }
  return commande;
};

const formatCommandeGlobaleOutput = async (commande) => {
  const users = await commande.getUsers();
  return {
    idCommandeGlobale: commande.idCommandeGlobale,
    dateDepart: moment(commande.dateDepart).format('D/MM/YYYY'),
    etat: commande.etat,
    users: users.map(user => ({
      id_User: user.id_User,
      username: user.username
    }))
  };
};

// Fonctions exportées

exports.createCommandeGlobale = async (CommandeGlobaleData, userIds) => {
  const transaction = await sequelize.transaction();
  try {
    // Utiliser la date d'aujourd'hui si dateDepart n'est pas fournie
    const dateDepart = CommandeGlobaleData.dateDepart 
      ? moment(CommandeGlobaleData.dateDepart, 'D/MM/YYYY') 
      : moment().startOf('day');

    // Vérifier si la date de départ est ultérieure à aujourd'hui
    if (dateDepart.isBefore(moment(), 'day')) {
      throw new Error("La date de départ ne peut pas être avant à la date d'aujourd'hui");
    }

    console.log("Creating commandeGlobal ....");
    const commandeGlobale = await CommandeGlobale.create({
      ...CommandeGlobaleData,
      dateDepart: dateDepart.toDate()
    }, { transaction });

    console.log("CommandeGlobale Created ....");

    console.log("Associating users to CommandeGlobale ....");
    await associateUsersToCommandeGlobale(commandeGlobale, userIds, transaction);
    console.log("Initializing CommandeSecteurs ....");
    await initializeCommandeSecteurs(commandeGlobale, userIds, transaction);
    await transaction.commit();
    return await formatCommandeGlobaleOutput(commandeGlobale);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating CommandeGlobale:', error);
    throw error;
  }
};



exports.getAllCommandesEntreprise = async () => {
  const commandes = await CommandeGlobale.findAll({
    include: [{
      model: User,
      attributes: ['id_User', 'username'],
      through: { attributes: [] }
    }]
  });
  return Promise.all(commandes.map(formatCommandeGlobaleOutput));
};

exports.getCommandeGlobale = async (id) => {
  const commande = await CommandeGlobale.findByPk(id, {
    include: [{
      model: User,
      attributes: ['id_User', 'username'],
      through: { attributes: [] }
    }]
  });
  if (!commande) {
    throw new Error('Commande not found');
  }
  return formatCommandeGlobaleOutput(commande);
};

exports.updateCommandeGlobale = async (id, updateData, userIds) => {
  const transaction = await sequelize.transaction();
  try {
    const commande = await findCommandeGlobaleById(id);

    // Mise à jour des champs si fournis
    if (updateData.dateDepart) {
      commande.dateDepart = moment(updateData.dateDepart, 'D/MM/YYYY').toDate();
    }
    if (updateData.etat !== undefined) {
      commande.etat = updateData.etat;
    }

    await commande.save({ transaction });

    // Mise à jour des utilisateurs si fournis
    if (userIds && userIds.length > 0) {
      await dissociateUsersAndDeleteCommandeSecteurs(commande, userIds, transaction);
      await associateNewUsersAndInitializeCommandeSecteurs(commande, userIds, transaction);
    }

    await transaction.commit();
    return await formatCommandeGlobaleOutput(commande);
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating CommandeGlobale:', error);
    throw error;
  }
};

exports.deleteCommandeGlobale = async (id) => {
  try {
    const commande = await findCommandeGlobaleById(id);
    await commande.destroy();
    return { message: 'Commande deleted successfully' };
  } catch (error) {
    console.error('Error deleting CommandeGlobale:', error);
    throw error;
  }
};
