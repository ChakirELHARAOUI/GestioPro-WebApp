// backend/routes/productBDDRoutes.js

const express = require('express');
const router = express.Router();
const productBDDController = require('../controllers/productBDDController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Route pour obtenir tous les produits
router.get('/', authMiddleware, productBDDController.getAllProducts);

// Route pour obtenir un produit spécifique par son ID
router.get('/:id', authMiddleware, productBDDController.getProductById);

// Route pour mettre à jour un produit
router.put('/update', authMiddleware, productBDDController.updateProduct);

// Route pour obtenir l'historique d'un produit
router.get('/history/:id_produitBDD', authMiddleware, productBDDController.getProductHistory);

// Route pour créer un nouveau produit
router.post('/create', authMiddleware, productBDDController.createProduct);

// Route pour supprimer un produit
router.delete('/delete/:id', authMiddleware, productBDDController.deleteProduct);

// Route pour obtenir les produits par secteur
router.get('/sector/:sector', authMiddleware, productBDDController.getProductsBySector);

module.exports = router;
