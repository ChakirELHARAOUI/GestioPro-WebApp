// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const cors = require('cors');
const userController = require('../controllers/UserController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { ROLES } = require('../constantes');

const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

router.use(cors(corsOptions));

// RESTful routes
router.post('/', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), userController.createUser);
router.get('/', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), userController.getUsers);
router.get('/:id', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), userController.getUserById);
router.put('/:id', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), userController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]), userController.deleteUser);

module.exports = router;
