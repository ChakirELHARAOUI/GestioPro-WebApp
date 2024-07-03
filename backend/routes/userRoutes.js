// database/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const cors = require('cors'); // Ajoutez cette ligne
const userController = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../../backend/middleware/authMiddleware');
const { ROLES } = require('../../backend/constantes');

// Configuration CORS spécifique pour les routes d'utilisateurs
const corsOptions = {
  origin: 'http://localhost:3001', // Remplacez par l'URL de votre front-end
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Appliquez CORS à toutes les routes d'utilisateurs
router.use(cors(corsOptions));

// Route publique pour la connexion
router.post('/login', userController.login);

// Routes protégées pour CRUD sur les utilisateurs
router.post('/AddUser', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), userController.createUser);
router.get('/getUsers', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), userController.getUsers);
router.get('/getUser/:id', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), userController.getUserById);
router.put('/updateUser/:id', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), userController.updateUser);
router.delete('/deleteUser/:id', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), userController.deleteUser);

// Route pour obtenir le profil de l'utilisateur connecté
//router.get('/profile', authMiddleware, userController.getUserProfile);

module.exports = router;
