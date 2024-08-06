const commandeSecteurService = require('../services/CommandeSecteurService');

exports.createCommandeSecteur = async (req, res) => {
  try {
    const { quantiteProduits, ...commandeSecteurData } = req.body;
    const commandeSecteur = await commandeSecteurService.createCommandeSecteur(commandeSecteurData, quantiteProduits);
    res.status(201).json(commandeSecteur);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllCommandeSecteurs = async (req, res) => {
  try {
    const commandeSecteurs = await commandeSecteurService.getAllCommandeSecteurs();
    res.json(commandeSecteurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCommandeSecteurById = async (req, res) => {
  try {
    const commandeSecteur = await commandeSecteurService.getCommandeSecteurById(req.params.id);
    if (!commandeSecteur) {
      return res.status(404).json({ message: 'CommandeSecteur not found' });
    }
    res.json(commandeSecteur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCommandeSecteur = async (req, res) => {
  try {
    const { quantiteProduits, ...commandeSecteurData } = req.body;
    const commandeSecteur = await commandeSecteurService.updateCommandeSecteur(req.params.id, commandeSecteurData, quantiteProduits);
    if (!commandeSecteur) {
      return res.status(404).json({ message: 'CommandeSecteur not found' });
    }
    res.json(commandeSecteur);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteCommandeSecteur = async (req, res) => {
  try {
    const result = await commandeSecteurService.deleteCommandeSecteur(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'CommandeSecteur not found' });
    }
    res.json({ message: 'CommandeSecteur deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
