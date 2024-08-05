// backend/services/commandeEntrepriseService.js

const db = require('../database/index');
const moment = require('moment');

// Fonctions auxiliaires

const createCommandeSecteur = async (userId, commandeEntrepriseId, stockSecteurId, transaction) => {
  return await db.CommandeSecteur.create({
    id_User: userId,
    idCommandeEntreprise: commandeEntrepriseId,
    etat: 'initial',
    idStockSecteur: stockSecteurId
  }, { transaction });
};

const associateUsersToCommandeEntreprise = async (commandeEntreprise, userIds, transaction) => {
  await commandeEntreprise.addUsers(userIds, { transaction });
};

const initializeCommandeSecteurs = async (commandeEntreprise, userIds, transaction) => {
  for (const userId of userIds) {
    const stockSecteur = await findStockSecteur(userId, transaction);
    await createCommandeSecteur(userId, commandeEntreprise.idCommandeEntreprise, stockSecteur.idStockSecteur, transaction);
  }
};

const findStockSecteur = async (userId, transaction) => {
  const stockSecteur = await db.StockSecteur.findOne({
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
    await associateUsersToCommandeEntreprise(commande, newUserIds, transaction);
    await initializeCommandeSecteurs(commande, newUserIds, transaction);
  }
};

const dissociateUsersAndDeleteCommandeSecteurs = async (commande, userIds, transaction) => {
  const currentUserIds = await commande.getUsers({ attributes: ['id_User'], transaction }).then(users => users.map(user => user.id_User));
  const removedUserIds = currentUserIds.filter(userId => !userIds.includes(userId));

  if (removedUserIds.length > 0) {
    await commande.removeUsers(removedUserIds, { transaction });
    await db.CommandeSecteur.destroy({
      where: {
        id_User: removedUserIds,
        idCommandeEntreprise: commande.idCommandeEntreprise
      },
      transaction
    });
  }
};

const findCommandeEntrepriseById = async (id) => {
  const commande = await db.CommandeEntreprise.findByPk(id);
  if (!commande) {
    throw new Error('Commande not found');
  }
  return commande;
};

const formatCommandeEntrepriseOutput = async (commande) => {
  const users = await commande.getUsers();
  return {
    idCommandeEntreprise: commande.idCommandeEntreprise,
    dateDepart: moment(commande.dateDepart).format('D/MM/YYYY'),
    etat: commande.etat,
    users: users.map(user => ({
      id_User: user.id_User,
      username: user.username
    }))
  };
};

// Fonctions exportées

exports.createCommandeEntreprise = async (commandeEntrepriseData, userIds) => {
  const transaction = await db.sequelize.transaction();
  try {
    // Convertir la date de départ en objet Date
    const dateDepart = moment(commandeEntrepriseData.dateDepart, 'D/MM/YYYY');

    // Vérifier si la date de départ est ultérieure à aujourd'hui
    if (dateDepart.isBefore(moment(), 'day')) {
      throw new Error("La date de départ ne peut pas être avant à la date d'aujourd'hui");
    }

    const commandeEntreprise = await db.CommandeEntreprise.create({
      ...commandeEntrepriseData,
      dateDepart: dateDepart.toDate()
    }, { transaction });

    await associateUsersToCommandeEntreprise(commandeEntreprise, userIds, transaction);
    await initializeCommandeSecteurs(commandeEntreprise, userIds, transaction);
    await transaction.commit();
    return await formatCommandeEntrepriseOutput(commandeEntreprise);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating CommandeEntreprise:', error);
    throw error;
  }
};



exports.getAllCommandesEntreprise = async () => {
  const commandes = await db.CommandeEntreprise.findAll({
    include: [{
      model: db.User,
      attributes: ['id_User', 'username'],
      through: { attributes: [] }
    }]
  });
  return Promise.all(commandes.map(formatCommandeEntrepriseOutput));
};

exports.getCommandeEntreprise = async (id) => {
  const commande = await db.CommandeEntreprise.findByPk(id, {
    include: [{
      model: db.User,
      attributes: ['id_User', 'username'],
      through: { attributes: [] }
    }]
  });
  if (!commande) {
    throw new Error('Commande not found');
  }
  return formatCommandeEntrepriseOutput(commande);
};

exports.updateCommandeEntreprise = async (id, updateData, userIds) => {
  const transaction = await db.sequelize.transaction();
  try {
    const commande = await findCommandeEntrepriseById(id);

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
    return await formatCommandeEntrepriseOutput(commande);
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating CommandeEntreprise:', error);
    throw error;
  }
};

exports.deleteCommandeEntreprise = async (id) => {
  try {
    const commande = await findCommandeEntrepriseById(id);
    await commande.destroy();
    return { message: 'Commande deleted successfully' };
  } catch (error) {
    console.error('Error deleting CommandeEntreprise:', error);
    throw error;
  }
};
