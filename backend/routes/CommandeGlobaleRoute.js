// backend/routes/CommandeGlobaleRoutes.js

const express = require('express');
const router = express.Router();
const commandeGlobaleController = require('../controllers/CommandeGlobaleController');
const { authMiddleware, managerOrAdminOnly } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, managerOrAdminOnly, commandeGlobaleController.createCommandeGlobale);
router.get('/', authMiddleware, managerOrAdminOnly, commandeGlobaleController.getAllCommandeGlobale);
router.get('/all', authMiddleware, managerOrAdminOnly,commandeGlobaleController.getAllCommandeGlobales);  //TEST
router.get('/:id', authMiddleware, managerOrAdminOnly, commandeGlobaleController.getCommandeGlobale);
router.get('/2/:id', authMiddleware, managerOrAdminOnly, commandeGlobaleController.getCommandeGlobaleById); //TEST
router.put('/:id', authMiddleware, managerOrAdminOnly, commandeGlobaleController.updateCommandeGlobale);
router.delete('/:id', authMiddleware, managerOrAdminOnly, commandeGlobaleController.deleteCommandeGlobale);

module.exports = router;
