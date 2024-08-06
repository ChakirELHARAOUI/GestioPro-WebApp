const CommandeGlobaleService = require('../services/CommandeGlobaleService');
const { CommandeGlobale, CommandeSecteur, User, sequelize } = require('../database/index');

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

exports.getAllCommandeGlobales = async (req, res) => {
  try {
    const commandeGlobales = await CommandeGlobale.findAll({
      include: [
        {
          model: CommandeSecteur,
          include: [User]
        }
      ]
    });
    res.json(commandeGlobales);
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


exports.getCommandeGlobaleById = async (req, res) => {
  try {
    const commandeGlobale = await CommandeGlobale.findByPk(req.params.id, {
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
      return res.status(404).json({ message: 'Commande Globale not found' });
    }
    res.json(commandeGlobale);
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
