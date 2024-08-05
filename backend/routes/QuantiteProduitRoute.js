const express = require('express');
const router = express.Router();
const quantiteProduitController = require('../controllers/QuantiteProduitController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { ROLES } = require('../constantes');

router.post('/', authMiddleware, roleMiddleware([ROLES.MANAGER]), quantiteProduitController.createProduct);
router.get('/', authMiddleware, quantiteProduitController.getAllProducts);
router.get('/:id', authMiddleware, quantiteProduitController.getProductById);
router.put('/:id', authMiddleware, roleMiddleware([ROLES.MANAGER]), quantiteProduitController.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware([ROLES.MANAGER]), quantiteProduitController.deleteProduct);

module.exports = router;
