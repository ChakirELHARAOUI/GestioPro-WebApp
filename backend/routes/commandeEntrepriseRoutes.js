const express = require('express');
const router = express.Router();
const commandeEntrepriseController = require('../controllers/commandeEntrepriseController');
const { authMiddleware, roleMiddleware } = require('../../backend/middleware/authMiddleware');
const { ROLES } = require('../../backend/constantes');

router.post('/', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),commandeEntrepriseController.createCommandeEntreprise);
router.get('/', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER, ROLES.VENDEUR]), commandeEntrepriseController.getAllCommandesEntreprise);
router.get('/:id', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),commandeEntrepriseController.getCommandeEntreprise);
router.put('/:id', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),commandeEntrepriseController.updateCommandeEntreprise);
router.delete('/:id', authMiddleware,roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),  commandeEntrepriseController.deleteCommandeEntreprise);

module.exports = router;
