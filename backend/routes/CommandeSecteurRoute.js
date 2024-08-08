const express = require('express');
const router = express.Router();
const commandeSecteurController = require('../controllers/CommandeSecteurController');
const { authMiddleware, managerOrAdminOnly } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, managerOrAdminOnly, commandeSecteurController.createCommandeSecteur);
router.get('/', authMiddleware, commandeSecteurController.getAllCommandeSecteurs);
router.get('/:id', authMiddleware, commandeSecteurController.getCommandeSecteurById);
router.put('/:id', authMiddleware, managerOrAdminOnly, commandeSecteurController.updateCommandeSecteur);
router.delete('/:id', authMiddleware, managerOrAdminOnly, commandeSecteurController.deleteCommandeSecteur);

module.exports = router;
