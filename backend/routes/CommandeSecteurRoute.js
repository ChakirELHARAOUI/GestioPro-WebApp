const express = require('express');
const router = express.Router();
const commandeSecteurController = require('../controllers/CommandeSecteurController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { ROLES } = require('../constantes');

router.post('/', authMiddleware, roleMiddleware([ROLES.MANAGER]), commandeSecteurController.createCommandeSecteur);
router.get('/', authMiddleware, roleMiddleware([ROLES.MANAGER, ROLES.VENDEUR]), commandeSecteurController.getAllCommandeSecteurs);
router.get('/:id', authMiddleware, roleMiddleware([ROLES.MANAGER, ROLES.VENDEUR]), commandeSecteurController.getCommandeSecteurById);
router.put('/:id', authMiddleware, roleMiddleware([ROLES.MANAGER]), commandeSecteurController.updateCommandeSecteur);
router.delete('/:id', authMiddleware, roleMiddleware([ROLES.MANAGER]), commandeSecteurController.deleteCommandeSecteur);

module.exports = router;
