// backend/sync.js
const { sequelize } = require('./backend/database/index');
const seedDatabase = require('./backend/seedDatabase');

module.exports = async function syncDatabase(force = false, seed = false) {
  try {
    await sequelize.sync({ alter: true , force: force });
    console.log('Modèles Sequelize synchronisés');
    
    if (seed) {
      await seedDatabase();
    }
  } catch (err) {
    console.error('Erreur lors de la synchronisation des modèles :', err);
    throw err;
  }
};
