//backend/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.put('/update', productController.updateProduct);
router.get('/history/:id_produitBDD', productController.getProductHistory);

module.exports = router;
