// backend/controllers/productBDDController.js

const ProductBDDService = require('../services/productBDDServices');

class ProductBDDController {

  async createProduct(req, res) {
    try {
      const newProduct = await ProductBDDService.createProductBDD(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllProducts(req, res) {
    try {
      const products = await ProductBDDService.getAllProductBDD();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProductById(req, res) {
    const { id } = req.params;
    try {
      const product = await ProductBDDService.getProductBDDById(id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProductHistory(req, res) {
    const { id } = req.params;
    try {
      const result = await ProductBDDService.getProductBDDHistory(id);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération de l'historique : " + error.message });
    }
  }

  async updateProduct(req, res) {
    const { id } = req.params;
    try {
      const updatedProduct = await ProductBDDService.updateProductBDD({ id_produitBDD: id, ...req.body });
      if (updatedProduct) {
        res.json({
          message: "Product updated",
          updatedProduct
        });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteProduct(req, res) {
    const { id } = req.params;
    try {
      const result = await ProductBDDService.deleteProductBDD(id);
      if (result) {
        res.json({ message: 'Product deleted successfully' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ProductBDDController();



/*

async function updateProduct(req, res) {
  const { id_produitBDD, newPrixVenteUnite, newFournisseur } = req.body;

  try {
    await productService.updateProductBDD(id_produitBDD, newPrixVenteUnite, newFournisseur);
    res.status(200).send('Product updated successfully');
  } catch (error) {
    res.status(500).send('Error updating product');
  }
}

*/