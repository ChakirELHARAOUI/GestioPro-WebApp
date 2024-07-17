
const db = require('../database/index');

exports.createCommandeEntreprise = async (commandeData) => {
  const commande = new db.CommandeEntreprise(commandeData);
  return await commande.save();
};

exports.getAllCommandesEntreprise = async () => {
  return await db.CommandeEntreprise.find();
};

exports.getCommandeEntreprise = async (id) => {
  return await db.CommandeEntreprise.findById(id);
};

exports.updateCommandeEntreprise = async (id, updateData) => {
  return await db.CommandeEntreprise.findByIdAndUpdate(id, updateData, { new: true });
};

exports.deleteCommandeEntreprise = async (id) => {
  return await db.CommandeEntreprise.findByIdAndDelete(id);
};
