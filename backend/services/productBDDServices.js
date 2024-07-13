// backend/services/db.ProductBDDService.js

const db = require('../database/index');
const { Op } = require('sequelize');

class ProductBDDService {

  async createProductBDD(productData) {
    // Vérifier si le produit existe déjà
    const existingProduct = await db.ProductBDD.findOne({
      where: {
        name: productData.name,
      }
    });
  
    if (existingProduct) {
      throw new Error('This porduct already exist');
    }
  
    return db.ProductBDD.create(productData);
  }

  async getAllProductBDD() {
    return db.ProductBDD.findAll();
  }

  async getProductBDDById(id) {
    return db.ProductBDD.findByPk(id);
  }

  async getProductBDDHistory(id_produitBDD) {
    const product = await db.ProductBDD.findByPk(id_produitBDD);
    if (!product) {
      throw new Error('Produit non trouvé');
    }
  
    const history = await db.ProductBDDHistory.findAll({
      where: { id_produitBDD },
      order: [['updatedAt', 'DESC']]
    });
  
    return {
      product: {
        id_produitBDD: product.id_produitBDD,
        name: product.name,
        currentPrice: product.prixVenteUnite,
        fournisseur: product.fournisseur,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      },
      priceHistory: history.map(entry => ({
        date: entry.updatedAt,
        price: entry.prixVenteUnite
      }))
    };
  }
  

  async updateProductBDD(productData) {
    const { id_produitBDD, newFournisseur, newPrixVenteUnite } = productData;
    const product = await db.ProductBDD.findByPk(id_produitBDD);
  
    if (!product) {
      throw new Error('Product not found');
    }
  
    let isChanged = false;
    let priceChanged = false;
    const changedFields = {};
    let oldPrixVenteUnite = product.prixVenteUnite;

    // Vérifier et mettre à jour le fournisseur si nécessaire
    if (product.fournisseur !== newFournisseur) {
      changedFields.fournisseur = newFournisseur;
      isChanged = true;
    }
  
    // Vérifier et mettre à jour le prix de vente unitaire si nécessaire
    if (Math.abs(parseFloat(product.prixVenteUnite) - parseFloat(newPrixVenteUnite)) >= 0.01) {

      changedFields.prixVenteUnite = newPrixVenteUnite;
      isChanged = true;
      priceChanged = true;
    }
  
    // Si rien n'a changé, retourner un message spécifique
    if (!isChanged) {
      return { message: "Rien n'a été modifié" };
    }
  
    // Créer une entrée dans l'historique si le prix a changé
    if (priceChanged) {
      await db.ProductBDDHistory.create({
        id_produitBDD: id_produitBDD,
        prixVenteUnite: oldPrixVenteUnite,
        updatedAt: new Date()
      });
    }
  
    // Mettre à jour le produit avec les champs modifiés
    const updatedProduct = await product.update(changedFields);
  
    return {
      product: updatedProduct
    };
  }
  

  async deleteProductBDD(id) {
    const t = await db.sequelize.transaction();
    try {
      console.log(`Tentative de suppression du produit avec l'ID: ${id}`);
      const product = await db.ProductBDD.findByPk(id, { transaction: t });
      console.log("ProductBDDServices | product = ", product);
      if (!product) {
        console.log(`Produit avec l'ID ${id} non trouvé`);
        await t.rollback();
        throw new Error('Product not found');
      }
      
      // Supprimer d'abord les enregistrements d'historique associés
      await db.ProductBDDHistory.destroy({
        where: { id_produitBDD: id },
        transaction: t
      });
      
      console.log(`Suppression du produit avec l'ID: ${id}`);
      await product.destroy({ transaction: t });
      
      await t.commit();
      console.log(`Produit avec l'ID ${id} supprimé avec succès`);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du produit avec l'ID ${id}:`, error);
      await t.rollback();
      throw error;
    }
  }
  

  

  // Méthodes supplémentaires qui pourraient être utiles

  async searchProducts(searchTerm) {
    return db.ProductBDD.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } }
        ]
      }
    });
  }

  async getProductsBySector(sector) {
    return db.ProductBDD.findAll({
      where: { sector }
    });
  }

  async updateStock(id, quantity) {
    const product = await db.ProductBDD.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product.update({ stock: product.stock + quantity });
  }

  async getProductsWithLowStock(threshold) {
    return db.ProductBDD.findAll({
      where: {
        stock: { [Op.lte]: threshold }
      }
    });
  }
}

module.exports = new ProductBDDService();





/*const db = require('../database/index');

async function updatedb.ProductBDD(id_produitBDD, newPrixVenteUnite, newFournisseur) {
  const product = await db.db.ProductBDD.findByPk(id_produitBDD);

  if (product) {
    // Check if price has changed
    if (product.prixVenteUnite !== newPrixVenteUnite) {
      // Create history entry
      await db.db.ProductBDDHistory.create({
        prixVenteUnite: product.prixVenteUnite,
        id_produitBDD: product.id_produitBDD
      });

      // Update product price
      product.prixVenteUnite = newPrixVenteUnite;
    }

    // Update supplier if it has changed
    if (product.fournisseur !== newFournisseur) {
      product.fournisseur = newFournisseur;
    }

    await product.save();
  }
}

async function getProductPriceHistory(id_produitBDD) {
  const history = await db.db.ProductBDDHistory.findAll({
    where: { id_produitBDD },
    order: [['createdAt', 'ASC']]
  });

  return history.map(entry => ({
    date: entry.createdAt,
    prixVenteUnite: entry.prixVenteUnite
  }));


  module.exports = {
  updatedb.ProductBDD,
  getProductPriceHistory
};
}*/