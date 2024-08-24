const { CommandeGlobale, CommandeSecteur, User, QuantiteProduit, CatalogueProduit, StockSecteur, sequelize } = require('../database/index');
const moment = require('moment');
const CommandeSecteurService = require('./CommandeSecteurService');

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
      username: user.username,
      role: user.role
    }))
  };
};

// Fonctions exportées

exports.createCommandeGlobale = async (CommandeGlobaleData, userIds) => {
  const transaction = await sequelize.transaction();
  try {
    const dateDepart = CommandeGlobaleData.dateDepart 
      ? moment(CommandeGlobaleData.dateDepart, 'D/MM/YYYY') 
      : moment().startOf('day');

    if (dateDepart.isBefore(moment(), 'day')) {
      throw new Error("La date de départ ne peut pas être avant à la date d'aujourd'hui");
    }

    const commandeGlobale = await CommandeGlobale.create({
      ...CommandeGlobaleData,
      dateDepart: dateDepart.toDate()
    }, { transaction });

    await associateUsersToCommandeGlobale(commandeGlobale, userIds, transaction);
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
      attributes: ['id_User', 'username', 'role'],
      through: { attributes: [] }
    }]
  });
  return Promise.all(commandes.map(formatCommandeGlobaleOutput));
};

exports.getAllCommandeGlobales = async () => {
  const commandeGlobales = await CommandeGlobale.findAll({
    include: [
      {
        model: CommandeSecteur,
        include: [User]
      }
    ]
  });
  return commandeGlobales;
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

exports.getCommandeGlobaleById = async (id) => {
  const commandeGlobale = await CommandeGlobale.findByPk(id, {
    include: [
      {
        model: CommandeSecteur,
        include: [
          {
            model: QuantiteProduit,
            include: [CatalogueProduit]
          },
          User
        ]
      }
    ]
  });
  if (!commandeGlobale) {
    throw new Error('Commande Globale not found');
  }
  return commandeGlobale;
};

exports.updateCommandeGlobale = async (id, updateData, userIds, quantiteProduits) => {
  const transaction = await sequelize.transaction();
  try {
    const commande = await findCommandeGlobaleById(id);

    if (updateData.dateDepart) {
      commande.dateDepart = moment(updateData.dateDepart, 'D/MM/YYYY').toDate();
    }
    if (updateData.etat !== undefined) {
      commande.etat = updateData.etat;
    }

    await commande.save({ transaction });

    if (userIds && userIds.length > 0) {
      await dissociateUsersAndDeleteCommandeSecteurs(commande, userIds, transaction);
      await associateNewUsersAndInitializeCommandeSecteurs(commande, userIds, transaction);
    }

    /*
    // Mettre à jour les produits pour chaque commande secteur
    for (const userId of userIds) {
      const commandeSecteur = await CommandeSecteur.findOne({
        where: { id_User: userId, idCommandeGlobale: id },
        transaction
      });

      if (commandeSecteur) {
        await CommandeSecteurService.updateQuantiteProduitsForSecteur(commandeSecteur.idCommandeSecteur, quantiteProduits[userId], transaction);
      }
    }
*/
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

exports.getQuantiteProduitsForCommandeGlobale = async (id) => {
  const commandeGlobale = await CommandeGlobale.findByPk(id, {
    include: [
      {
        model: CommandeSecteur,
        include: [
          {
            model: QuantiteProduit,
            as: 'QuantiteProduits',  // Utilisez l'alias correct
            include: [CatalogueProduit]
          },
          {
            model: User,
            attributes: ['id_User', 'username']
          }
        ]
      }
    ]
  });

  if (!commandeGlobale) {
    throw new Error('Commande Globale not found');
  }

  const quantiteProduits = {};

  commandeGlobale.CommandeSecteurs.forEach(secteur => {
    secteur.QuantiteProduits.forEach(qp => {
      if (!quantiteProduits[qp.id_catalogueProduit]) {
        quantiteProduits[qp.id_catalogueProduit] = {
          nom: qp.CatalogueProduit.name,
          vendeurs: {},
          total: 0
        };
      }
      if (!quantiteProduits[qp.id_catalogueProduit].vendeurs[secteur.User.username]) {
        quantiteProduits[qp.id_catalogueProduit].vendeurs[secteur.User.username] = 0;
      }
      quantiteProduits[qp.id_catalogueProduit].vendeurs[secteur.User.username] += qp.quantite;
      quantiteProduits[qp.id_catalogueProduit].total += qp.quantite;
    });
  });

  return Object.values(quantiteProduits);
};

