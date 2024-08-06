// backend/routes/productBDDRoutes.js

const express = require('express');
const router = express.Router();
const cors = require('cors');
const catalogueProduitController = require('../controllers/CatalogueProduitController');
const { authMiddleware, managerOrAdminOnly } = require('../middleware/authMiddleware');
const { ROLES } = require('../constantes');

const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

router.use(cors(corsOptions));

router.post('/', authMiddleware, managerOrAdminOnly, catalogueProduitController.createProduct);
router.get('/', authMiddleware, catalogueProduitController.getAllProducts);
router.get('/:id', authMiddleware, catalogueProduitController.getProductById);
router.get('/:id/history', authMiddleware, managerOrAdminOnly, catalogueProduitController.getProductHistory);
router.put('/:id', authMiddleware, managerOrAdminOnly, catalogueProduitController.updateProduct);
router.delete('/:id', authMiddleware, managerOrAdminOnly, catalogueProduitController.deleteProduct);

module.exports = router;
