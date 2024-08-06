// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const db = require('../database/index');
const { ROLES } = require('../constantes');
const { User } = db;

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: ' Middleware : Utilisateur non trouvé' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Non autorisé' });
  }
};


const managerOrAdminOnly = (req, res, next) => {
  if (req.user.role !== ROLES.MANAGER && req.user.role !== ROLES.ADMIN) {
    return res.status(403).send({ error: 'Access denied.' });
  }
  next();
};
module.exports = { authMiddleware, managerOrAdminOnly  };


