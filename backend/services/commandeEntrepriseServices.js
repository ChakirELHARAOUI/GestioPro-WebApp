// backend/services/commandeEntrepriseServices.js

const db = require('../database/index');

exports.createCommandeEntreprise = async (commandeData) => {
  const commande = new db.CommandeEntreprise(commandeData);
  return await commande.save();
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
