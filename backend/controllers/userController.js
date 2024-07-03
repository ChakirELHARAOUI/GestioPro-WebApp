// database/controllers/userController.js


const userService = require('../services/userServices');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


async function createUser(req, res) {
  const { username, password, sector, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.createUser({ username, password: hashedPassword, sector, role });
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUsers(req, res) {
  try {
    const users = await userService.getUsers();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUserById(req, res) {
  const userId = req.params.id;

  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateUser(req, res) {
  const userId = req.params.id;
  const { username, password, sector, role } = req.body;

  try {
    const user = await userService.updateUser(userId, { username, password, sector, role });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteUser(req, res) {
  const userId = req.params.id;

  try {
    await userService.deleteUser(userId);
    res.status(200).json({ message: 'Utilisateur supprimé avec succès.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await userService.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }

    const token = jwt.sign({ id: user.id_User }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ user: { id: user.id, username: user.username, sector: user.sector, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  login
};
