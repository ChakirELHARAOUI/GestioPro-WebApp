// backend/services/commandeEntrepriseService.js

const db = require('../database/index');
const { getStockSecteurByUserId } = require('../utils');

exports.createCommandeEntreprise = async (commandeEntrepriseData, userIds) => {
  const transaction = await db.sequelize.transaction();
  try {
    // Vérifiez que tous les utilisateurs ont un StockSecteur
    for (const userId of userIds) {
      try {
        await getStockSecteurByUserId(db, userId);
      } catch (error) {
        throw new Error(`Cannot create CommandeEntreprise: ${error.message}`);
      }
    }

    // Créer la CommandeEntreprise
    const commandeEntreprise = await db.CommandeEntreprise.create(commandeEntrepriseData, { transaction });

    // Associer les utilisateurs à la CommandeEntreprise
    await commandeEntreprise.addUsers(userIds, { transaction });

    // Les CommandeSecteur seront créées automatiquement par le hook afterCreate

    await transaction.commit();
    return commandeEntreprise;
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating CommandeEntreprise:', error);
    throw error;
  }
};



exports.getAllCommandesEntreprise = async () => {
  return await db.CommandeEntreprise.findAll();
};

exports.getCommandeEntreprise = async (id) => {
  return await db.CommandeEntreprise.findByPk(id);
};

exports.updateCommandeEntreprise = async (id, updateData) => {
  try {
    const commande = await db.CommandeEntreprise.findByPk(id);
    if (!commande) {
      throw new Error('Commande not found');
    }
    await commande.update(updateData);
    return commande;
  } catch (error) {
    console.error('Error updating CommandeEntreprise:', error);
    throw error;
  }
}


exports.deleteCommandeEntreprise = async (id) => {
    try {
      const commande = await db.CommandeEntreprise.findByPk(id);
      if (!commande) {
        throw new Error('Commande not found');
      }
      await commande.destroy();
      return { message: 'Commande deleted successfully' };
    } catch (error) {
      console.error('Error deleting CommandeEntreprise:', error);
      throw error;
    }  
};




