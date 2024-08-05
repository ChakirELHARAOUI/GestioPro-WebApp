const CommandeGlobaleService = require('../services/CommandeGlobaleService');

exports.createCommandeGlobale = async (req, res) => {
  try {
    const { userIds, ...CommandeGlobaleData } = req.body;
    
    if (!userIds || userIds.length === 0) {
      return res.status(400).json({ message: "userIds est requis" });
    }

    const result = await CommandeGlobaleService.createCommandeGlobale(CommandeGlobaleData, userIds);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllCommandeGlobale = async (req, res) => {
  try {
    const commandes = await CommandeGlobaleService.getAllCommandesEntreprise();
    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCommandeGlobale = async (req, res) => {
  try {
    const commande = await CommandeGlobaleService.getCommandeGlobale(req.params.id);
    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.json(commande);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCommandeGlobale = async (req, res) => {
  try {
    const { id } = req.params;
    const { userIds, ...updateData } = req.body;

    const result = await CommandeGlobaleService.updateCommandeGlobale(id, updateData, userIds);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteCommandeGlobale = async (req, res) => {
  try {
    const result = await CommandeGlobaleService.deleteCommandeGlobale(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.json({ message: 'Commande supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
