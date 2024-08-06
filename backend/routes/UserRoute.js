// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const cors = require('cors');
const userController = require('../controllers/UserController');
const { authMiddleware, managerOrAdminOnly } = require('../middleware/authMiddleware');
const { ROLES } = require('../constantes');

const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

router.use(cors(corsOptions));

// RESTful routes
router.post('/', authMiddleware, managerOrAdminOnly, userController.createUser);
router.get('/', authMiddleware, managerOrAdminOnly, userController.getUsers);
router.get('/:id', authMiddleware, managerOrAdminOnly, userController.getUserById);
router.put('/:id', authMiddleware, managerOrAdminOnly, userController.updateUser);
router.delete('/:id', authMiddleware, managerOrAdminOnly, userController.deleteUser);

module.exports = router;
