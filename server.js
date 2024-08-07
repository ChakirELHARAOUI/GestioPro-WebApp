// server.js
require('dotenv').config();
const cors = require('cors');
const app = require('./app');
const { sequelize } = require('./backend/database/index');
const PORT = process.env.PORT || 3000;
require('dotenv').config();

// Configurez CORS pour autoriser les requêtes depuis le frontend
app.use(cors({
  origin: 'http://localhost:3001', // Remplacez par l'URL de votre application front-end
  credentials: true, // Si vous avez besoin de supporter les cookies ou l'authentification
}));

sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie');
    const FORCE_SYNC = process.env.RESET_DB === 'true';;
    const SEED_DB = process.env.RESET_DB === 'true';;
    require('./sync')(FORCE_SYNC, SEED_DB).then(() => {
      app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
      });
    }).catch(err => {
      console.error('Erreur lors de la synchronisation des modèles :', err);
    });
  })
  .catch(err => {
    console.error('Impossible de se connecter à la base de données :', err);
  });
