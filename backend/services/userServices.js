
// backend/services/userService.js

const db = require('../database/index');
const { User } = db;

// ... autres fonctions existantes ...

async function getUserByUsername(username) {
  return await User.findOne({ where: { username } });
}

module.exports = {
  // ... autres exports existants ...
  getUserByUsername
}
