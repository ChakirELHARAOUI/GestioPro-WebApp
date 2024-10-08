const { CommandeSecteur, QuantiteProduit, User, CommandeGlobale, StockSecteur, RecetteSecteur, CatalogueProduit, sequelize } = require('../database/index');

class CommandeSecteurService {
  static async createCommandeSecteur(data, quantiteProduits) {
    const transaction = await sequelize.transaction();
    try {
      await this._verifyQuantiteProduits(quantiteProduits);
      const commandeSecteur = await this._createCommandeSecteurBase(data, transaction);
      await this._addQuantiteProduits(commandeSecteur.idCommandeSecteur, quantiteProduits, transaction);
      await transaction.commit();
      return this.getCommandeSecteurById(commandeSecteur.idCommandeSecteur);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async getAllCommandeSecteurs() {
    return await CommandeSecteur.findAll({
      include: [
        { model: QuantiteProduit, as: 'QuantiteProduits', include: [CatalogueProduit] }
      ]
    });
  }

  static async getCommandeSecteurById(id) {
    return await CommandeSecteur.findByPk(id, {
      include: [
        { model: QuantiteProduit, as: 'QuantiteProduits', include: [CatalogueProduit] },
        User,
        CommandeGlobale,
        StockSecteur,
        RecetteSecteur
      ]
    });
  }

  static async updateCommandeSecteur(id, data, quantiteProduits) {
    const transaction = await sequelize.transaction();
    try {

      const commandeSecteur = await this._verifyCommandeSecteur(id, transaction);
      await this._verifyQuantiteProduits(quantiteProduits, transaction);
      await this._updateCommandeSecteurBase(commandeSecteur, data, transaction);
      await this._updateQuantiteProduits(id, quantiteProduits, transaction);
      
      await transaction.commit();
      return await this.getCommandeSecteurById(id);
    } catch (error) {
      console.error("Error in updateCommandeSecteur:", error);
      await transaction.rollback();
      throw error;
    }
  }

  // Ajoutez cette fonction dans votre service CommandeSecteurService
static async updateQuantiteProduitsForSecteur(commandeSecteurId, quantiteProduits, transaction) {
  const existingQuantiteProduits = await QuantiteProduit.findAll({
    where: { idCommandeSecteur: commandeSecteurId },
    transaction
  });

  const existingQuantiteProduitsMap = new Map(
    existingQuantiteProduits.map(qp => [qp.id_catalogueProduit, qp])
  );

  for (const qp of quantiteProduits) {
    const existingQP = existingQuantiteProduitsMap.get(qp.id_catalogueProduit);

    if (existingQP) {
      if (existingQP.quantite !== qp.quantite) {
        await existingQP.update({ quantite: qp.quantite }, { transaction });
      }
      existingQuantiteProduitsMap.delete(qp.id_catalogueProduit);
    } else {
      await QuantiteProduit.create({
        ...qp,
        idCommandeSecteur: commandeSecteurId
      }, { transaction });
    }
  }

  for (const [, qpToDelete] of existingQuantiteProduitsMap) {
    await qpToDelete.destroy({ transaction });
  }
}


  static async deleteCommandeSecteur(id) {
    const transaction = await sequelize.transaction();
    try {
      const result = await this._deleteCommandeSecteurBase(id, transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Fonctions auxiliaires privées

  static async _verifyCommandeSecteur(idCommandeSecteur, transaction) {
    const commandeSecteur = await CommandeSecteur.findByPk(idCommandeSecteur, { transaction });
    if (!commandeSecteur) {
      throw new Error(`CommandeSecteur with id ${idCommandeSecteur} not found`);
    }
    return commandeSecteur;
  }


  static async _verifyQuantiteProduits(quantiteProduits, transaction) {
    for (const qp of quantiteProduits) {
      const catalogueProduct = await CatalogueProduit.findByPk(qp.id_catalogueProduit, { transaction });
      if (!catalogueProduct) {
        throw new Error(`Product with id ${qp.id_catalogueProduit} not found in CatalogueProduit`);
      }
    }
    return true;
  }

  static async _createCommandeSecteurBase(data, transaction) {
    return await CommandeSecteur.create(data, { transaction });
  }

  static async _addQuantiteProduits(commandeSecteurId, quantiteProduits, transaction) {
    if (quantiteProduits && quantiteProduits.length > 0) {
      await Promise.all(quantiteProduits.map(qp => 
        QuantiteProduit.create({ ...qp, idCommandeSecteur: commandeSecteurId }, { transaction })
      ));
    }
  }

  static async _updateCommandeSecteurBase(commandeSecteur, data, transaction) {
    if (data) {
      await commandeSecteur.update(data, { transaction });
    }
    return commandeSecteur;
  }
  static async _updateQuantiteProduits(id, quantiteProduits, transaction) {
    if (quantiteProduits) {
      const existingQuantiteProduits = await QuantiteProduit.findAll({
        where: { idCommandeSecteur: id },
        transaction
      });

      const existingQuantiteProduitsMap = new Map(
        existingQuantiteProduits.map(qp => [qp.id_catalogueProduit, qp])
      );

      for (const qp of quantiteProduits) {
        const existingQP = existingQuantiteProduitsMap.get(qp.id_catalogueProduit);

        if (existingQP) {
          if (existingQP.quantite !== qp.quantite) {
            await existingQP.update({ quantite: qp.quantite }, { transaction });
          }
          existingQuantiteProduitsMap.delete(qp.id_catalogueProduit);
        } else {
          await QuantiteProduit.create({
            ...qp,
            idCommandeSecteur: id
          }, { transaction });
        }
      }

      for (const [, qpToDelete] of existingQuantiteProduitsMap) {
        await qpToDelete.destroy({ transaction });
      }
    }
  }


  static async _deleteCommandeSecteurBase(id, transaction) {
    const commandeSecteur = await CommandeSecteur.findByPk(id);
    if (commandeSecteur) {
      await commandeSecteur.destroy({ transaction });
      return true;
    }
    return false;
  }
}

module.exports = CommandeSecteurService;



























 /*static async addQuantiteProduit(commandeSecteurId, quantiteProduitData) {
    return await QuantiteProduit.create({ ...quantiteProduitData, idCommandeSecteur: commandeSecteurId });


    static async updateQuantiteProduit(id, data) {
    const quantiteProduit = await QuantiteProduit.findByPk(id);
    if (quantiteProduit) {
      return await quantiteProduit.update(data);
    }
    return null;
  }


  static async deleteQuantiteProduit(id) {
    const quantiteProduit = await QuantiteProduit.findByPk(id);
    if (quantiteProduit) {
      await quantiteProduit.destroy();
      return true;
    }
    return false;
  }

  }*/