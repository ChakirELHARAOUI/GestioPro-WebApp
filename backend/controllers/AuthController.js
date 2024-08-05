// backend/controller/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authService = require('../services/AuthService');


async function login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await authService.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Nom d\'utilisateur  incorrect' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }
  
      const token = jwt.sign({ id: user.id_User, username: user.username, sector: user.sector, role : user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ user: { username: user.username }, token });   // A supprimer le username de resulat de la requete, c'est juste pour le test
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}


async function getUserProfile(req, res) {
  try {
    const user = await authService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  login,
  getUserProfile
};

