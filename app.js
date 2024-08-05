const express = require('express');
const cors = require('cors');
const auth_Route = require('./backend/routes/AuthRoute');
const user_Route = require('./backend/routes/UserRoute');
const CatalogueProduit_Route = require('./backend/routes/CatalogueProduitRoute');
const CommandeGlobale_Route = require('./backend/routes/CommandeGlobaleRoute');
const commandeSecteur_Route = require('./backend/routes/CommandeSecteurRoute');
const QuantiteProduit_Route = require('./backend/routes/QuantiteProduitRoute');


const app = express();

// Configuration CORS globale
const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use('/api/auth', auth_Route);
app.use('/api/users', user_Route);
app.use('/api/catalogueProduit', CatalogueProduit_Route);
app.use('/api/commandeEntreprise', CommandeGlobale_Route);
app.use('/api/commande-secteur', commandeSecteur_Route);
app.use('/api/products', QuantiteProduit_Route);


// Exemple de route pour vérifier le fonctionnement du serveur
app.get('/', (req, res) => {
  res.send('Serveur en ligne !');
});

module.exports = app;
