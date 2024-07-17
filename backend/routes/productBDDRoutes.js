// backend/routes/productBDDRoutes.js

const express = require('express');
const router = express.Router();
const cors = require('cors');
const productBDDController = require('../controllers/productBDDController');
const { authMiddleware, roleMiddleware } = require('../../backend/middleware/authMiddleware');
const { ROLES } = require('../../backend/constantes');

const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

router.use(cors(corsOptions));

router.post('/', authMiddleware, roleMiddleware([ROLES.MANAGER]), productBDDController.createProduct);
router.get('/', authMiddleware, roleMiddleware([ROLES.MANAGER, ROLES.VENDEUR]), productBDDController.getAllProducts);
router.get('/:id', authMiddleware, roleMiddleware([ROLES.MANAGER, ROLES.VENDEUR]), productBDDController.getProductById);
router.get('/:id/history', authMiddleware, roleMiddleware([ROLES.MANAGER]), productBDDController.getProductHistory);
router.put('/:id', authMiddleware, roleMiddleware([ROLES.MANAGER]), productBDDController.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware([ROLES.MANAGER]), productBDDController.deleteProduct);

module.exports = router;
