// database/controllers/productBDDController.js

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
    try {
      const product = await ProductBDDService.getProductBDDById(req.params.id);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const updatedProduct = await ProductBDDService.updateProductBDD(req.body);
      if (updatedProduct) {
        res.json({
          message : "Product updated",
          updatedProduct});
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getProductHistory(req, res) {
    try {
      const history = await ProductBDDService.getProductBDDHistory(req.params.id_produitBDD);
      if (history.length > 0) {
        res.json(history);
      } else {
        res.status(404).json({ message: 'No history found for this product' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const result = await ProductBDDService.deleteProductBDD(req.params.id);
      if (result) {
        res.json({ message: 'Product deleted successfully' });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProductsBySector(req, res) {
    try {
      const products = await ProductBDDService.getProductsBySector(req.params.sector);
      if (products.length > 0) {
        res.json(products);
      } else {
        res.status(404).json({ message: 'No products found for this sector' });
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