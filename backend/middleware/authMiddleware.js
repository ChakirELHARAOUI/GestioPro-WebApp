// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const db = require('../database/index');
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


const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied !!' });
    }
    next();
  };
};
module.exports = { authMiddleware, roleMiddleware  };


