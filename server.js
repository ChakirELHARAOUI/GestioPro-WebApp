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

// Authentification à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie');
    // Synchronisation des modèles après une connexion réussie
    require('./sync')().then(() => {
      // Démarrage du serveur après la synchronisation
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
