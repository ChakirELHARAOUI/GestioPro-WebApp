// app.js 


const express = require('express');
const cors = require('cors'); // Ajoutez cette ligne
const userRoutes = require('./backend/routes/userRoutes');
const productRoutes = require('./backend/routes/productBDDRoutes');

const app = express();

// Configuration CORS
const corsOptions = {
  origin: 'http://localhost:3001', // Remplacez par l'URL de votre front-end
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Appliquez CORS à toutes les routes
app.use(cors(corsOptions));

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
//app.use('/api/products', productRoutes);

// Exemple de route pour vérifier le fonctionnement du serveur
app.get('/', (req, res) => {
  res.send('Serveur en ligne !');
});

module.exports = app;
