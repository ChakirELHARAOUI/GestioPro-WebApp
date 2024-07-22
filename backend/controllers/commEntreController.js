const commandeEntrepriseService = require('../services/commEntreService');

exports.createCommandeEntreprise = async (req, res) => {
  const { commandeEntrepriseData, userIds } = req.body;
  try {
    const commande = await commandeEntrepriseService.createCommandeEntreprise(commandeEntrepriseData, userIds);
    res.status(201).json(commande);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllCommandesEntreprise = async (req, res) => {
  try {
    const commandes = await commandeEntrepriseService.getAllCommandesEntreprise();
    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCommandeEntreprise = async (req, res) => {
  try {
    const commande = await commandeEntrepriseService.getCommandeEntreprise(req.params.id);
    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.json(commande);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCommandeEntreprise = async (req, res) => {
  try {
    const commande = await commandeEntrepriseService.updateCommandeEntreprise(req.params.id, req.body);
    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.json(commande);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCommandeEntreprise = async (req, res) => {
  try {
    const result = await commandeEntrepriseService.deleteCommandeEntreprise(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
