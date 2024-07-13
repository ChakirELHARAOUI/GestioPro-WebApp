// backend/routes/productBDDRoutes.js

const express = require('express');
const router = express.Router();
const cors = require('cors');
const productBDDController = require('../controllers/productBDDController');
const { authMiddleware, roleMiddleware } = require('../../backend/middleware/authMiddleware');
const { ROLES } = require('../../backend/constantes');

// Configuration CORS spécifique pour les routes d'utilisateurs
const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

// Appliquez CORS à toutes les routes d'utilisateurs
router.use(cors(corsOptions));

// Route pour créer un nouveau produit
router.post('/createProductBDD', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),productBDDController.createProduct);

// Route pour obtenir tous les produits
router.get('/getAllProductsBDD', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER, ROLES.VENDEUR]), productBDDController.getAllProducts);
// Route pour obtenir un produit spécifique par son ID
router.get('/getProductBDD/:id', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER, ROLES.VENDEUR]), productBDDController.getProductById);
// Route pour obtenir l'historique d'un produit
router.get('/getProductBDDHistory', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), productBDDController.getProductHistory);

// Route pour mettre à jour un produit
router.put('/updateProductBDD', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), productBDDController.updateProduct);

// Route pour supprimer un produit
router.delete('/deleteProductBDD', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), productBDDController.deleteProduct);

module.exports = router;
