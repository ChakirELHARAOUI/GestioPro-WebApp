const { noTrueLogging } = require('sequelize/lib/utils/deprecations');
const { sequelize } = require('./backend/database/index');

module.exports = async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true /*,force: true*/ }) //  { ,force: true } pour supprimer et recréer les tables
    console.log('Modèles Sequelize synchronisés');
  } catch (err) {
    console.error('Erreur lors de la synchronisation des modèles :', err);
    throw err;
  }
};