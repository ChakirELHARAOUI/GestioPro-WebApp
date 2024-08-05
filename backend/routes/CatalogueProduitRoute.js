// backend/routes/productBDDRoutes.js

const express = require('express');
const router = express.Router();
const cors = require('cors');
const catalogueProduitController = require('../controllers/CatalogueProduitController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { ROLES } = require('../constantes');

const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

router.use(cors(corsOptions));

router.post('/', authMiddleware, roleMiddleware([ROLES.MANAGER]), catalogueProduitController.createProduct);
router.get('/', authMiddleware, roleMiddleware([ROLES.MANAGER, ROLES.VENDEUR]), catalogueProduitController.getAllProducts);
router.get('/:id', authMiddleware, roleMiddleware([ROLES.MANAGER, ROLES.VENDEUR]), catalogueProduitController.getProductById);
router.get('/:id/history', authMiddleware, roleMiddleware([ROLES.MANAGER]), catalogueProduitController.getProductHistory);
router.put('/:id', authMiddleware, roleMiddleware([ROLES.MANAGER]), catalogueProduitController.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware([ROLES.MANAGER]), catalogueProduitController.deleteProduct);

module.exports = router;
