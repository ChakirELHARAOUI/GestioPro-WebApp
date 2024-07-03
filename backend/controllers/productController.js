//backend/controllers/productController.js

const productService = require('../services/productBDDServices');

async function updateProduct(req, res) {
  const { id_produitBDD, newPrixVenteUnite, newFournisseur } = req.body;

  try {
    await productService.updateProductBDD(id_produitBDD, newPrixVenteUnite, newFournisseur);
    res.status(200).send('Product updated successfully');
  } catch (error) {
    res.status(500).send('Error updating product');
  }
}

async function getProductHistory(req, res) {
  const { id_produitBDD } = req.params;

  try {
    const history = await productService.getProductPriceHistory(id_produitBDD);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).send('Error fetching product history');
  }
}

module.exports = {
  updateProduct,
  getProductHistory
};
