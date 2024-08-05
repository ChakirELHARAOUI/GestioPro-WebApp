// backend/services/productBDDService.js

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
      throw new Error('This product already exists');
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
    const { id_produitBDD, name, fournisseur, prixVenteUnite } = productData;
    
    const product = await db.ProductBDD.findByPk(id_produitBDD);
    if (!product) throw new Error('Product not found');

    const existingProduct = await db.ProductBDD.findOne({
      where: { name: productData.name}
    });
    console.log(existingProduct);
    if (existingProduct && existingProduct.id_produitBDD !== id_produitBDD) {
      throw new Error('This product already exists');
    }
    
    const changedFields = {};
    if (name && product.name !== name) changedFields.name = name;
    if (fournisseur && product.fournisseur !== fournisseur) changedFields.fournisseur = fournisseur;
    
    const newPrice = parseFloat(prixVenteUnite);
    if (!isNaN(newPrice) && Math.abs(product.prixVenteUnite - newPrice) >= 0.01) {
      changedFields.prixVenteUnite = newPrice;
      await db.ProductBDDHistory.create({
        id_produitBDD,
        prixVenteUnite: product.prixVenteUnite,
        updatedAt: new Date()
      });
    }
    
    if (Object.keys(changedFields).length === 0) {
      return { message: "Rien n'a été modifié" };
    }
    
    const updatedProduct = await product.update(changedFields);
    return { product: updatedProduct };
  }

  async deleteProductBDD(id) {
    const t = await db.sequelize.transaction();
    try {
      console.log(`Tentative de suppression du produit avec l'ID: ${id}`);
      const product = await db.ProductBDD.findByPk(id, { transaction: t });
      console.log("ProductBDDService | product = ", product);
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
}

module.exports = new ProductBDDService();
