const commandeEntrepriseService = require('../services/commEntreService');

exports.createCommandeEntreprise = async (req, res) => {
  try {
    const { userIds, ...commandeEntrepriseData } = req.body;
    
    if (!userIds || userIds.length === 0) {
      return res.status(400).json({ message: "userIds est requis" });
    }

    const result = await commandeEntrepriseService.createCommandeEntreprise(commandeEntrepriseData, userIds);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const { id } = req.params;
    const { userIds, ...updateData } = req.body;

    const result = await commandeEntrepriseService.updateCommandeEntreprise(id, updateData, userIds);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
