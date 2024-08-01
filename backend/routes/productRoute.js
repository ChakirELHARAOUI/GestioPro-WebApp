const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { ROLES } = require('../constantes');

router.post('/', authMiddleware, roleMiddleware([ROLES.MANAGER]), productController.createProduct);
router.get('/', authMiddleware, productController.getAllProducts);
router.get('/:id', authMiddleware, productController.getProductById);
router.put('/:id', authMiddleware, roleMiddleware([ROLES.MANAGER]), productController.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware([ROLES.MANAGER]), productController.deleteProduct);

module.exports = router;
