const express = require('express');
const router = express.Router();
const quantiteProduitController = require('../controllers/QuantiteProduitController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { ROLES } = require('../constantes');

router.post('/',        authMiddleware,         quantiteProduitController.createProduct);
router.get('/',         authMiddleware,         quantiteProduitController.getAllProducts);
router.get('/:id',      authMiddleware,         quantiteProduitController.getProductById);
router.put('/:id',      authMiddleware,         quantiteProduitController.updateProduct);
router.delete('/:id',   authMiddleware,         quantiteProduitController.deleteProduct);

module.exports = router;
