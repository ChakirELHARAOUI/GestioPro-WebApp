// backend/routes/CommandeGlobaleRoutes.js

const express = require('express');
const router = express.Router();
const commandeGlobaleController = require('../controllers/CommandeGlobaleController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { ROLES } = require('../constantes');

router.post('/', authMiddleware, roleMiddleware([ROLES.MANAGER]),commandeGlobaleController.createCommandeGlobale);
router.get('/', authMiddleware, roleMiddleware([ROLES.MANAGER, ROLES.VENDEUR]), commandeGlobaleController.getAllCommandeGlobale);
router.get('/:id', authMiddleware, roleMiddleware([ROLES.MANAGER]),commandeGlobaleController.getCommandeGlobale);
router.put('/:id', authMiddleware, roleMiddleware([ROLES.MANAGER]),commandeGlobaleController.updateCommandeGlobale);
router.delete('/:id', authMiddleware,roleMiddleware([ROLES.MANAGER]),  commandeGlobaleController.deleteCommandeGlobale);

module.exports = router;
