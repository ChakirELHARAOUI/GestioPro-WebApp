//backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const cors = require('cors');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Configuration CORS spécifique pour les routes d'authentification
const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Appliquez CORS à toutes les routes d'authentification
router.use(cors(corsOptions));

// Route publique pour la connexion
router.post('/login', authController.login);

// Route pour obtenir le profil de l'utilisateur connecté
router.get('/profile', authMiddleware, authController.getUserProfile);

module.exports = router;