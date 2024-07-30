// backend/services/commandeEntrepriseService.js

const db = require('../database/index');


exports.createCommandeEntreprise = async (commandeEntrepriseData, userIds) => {
  const transaction = await db.sequelize.transaction();
  try {
    // Créer la CommandeEntreprise
    const commandeEntreprise = await db.CommandeEntreprise.create(commandeEntrepriseData, { transaction });

    // Associer les utilisateurs à la CommandeEntreprise
    await commandeEntreprise.addUsers(userIds, { transaction });

    // Initialiser les CommandeSecteur pour chaque utilisateur
    for (const userId of userIds) {
      const stockSecteur = await db.StockSecteur.findOne({
        where: { id_User: userId },
        transaction
      });

      if (!stockSecteur) {
        throw new Error(`No StockSecteur found for user ${userId}`);
      }

      await db.CommandeSecteur.create({
        id_User: userId,
        idCommandeEntreprise: commandeEntreprise.idCommandeEntreprise,
        etat: 'initial',
        idStockSecteur: stockSecteur.idStockSecteur
      }, { transaction });
    }

    // Si tout s'est bien passé, on valide la transaction
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




