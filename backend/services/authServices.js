// backend/services/authService.js

const db = require('../database/index');
const { User } = db;

async function getUserByUsername(username) {
  return await User.findOne({ where: { username } });
}

async function getUserById(id) {
  return await User.findByPk(id);
}

module.exports = {
  getUserByUsername,
  getUserById
};
