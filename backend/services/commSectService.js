const db = require('../database');
const CommandeSecteur = db.CommandeSecteur;

class CommandeSecteurService {
  static async createCommandeSecteur(data) {
    return await CommandeSecteur.create(data);
  }

  static async getAllCommandeSecteurs() {
    return await CommandeSecteur.findAll();
  }

  static async getCommandeSecteurById(id) {
    return await CommandeSecteur.findByPk(id);
  }

  static async updateCommandeSecteur(id, data) {
    const commandeSecteur = await CommandeSecteur.findByPk(id);
    if (commandeSecteur) {
      return await commandeSecteur.update(data);
    }
    return null;
  }

  static async deleteCommandeSecteur(id) {
    const commandeSecteur = await CommandeSecteur.findByPk(id);
    if (commandeSecteur) {
      await commandeSecteur.destroy();
      return true;
    }
    return false;
  }
}

module.exports = CommandeSecteurService;
