const express = require('express');
const cors = require('cors');
const authRoutes = require('./backend/routes/authRoute');
const userRoutes = require('./backend/routes/userRoute');
const productRoutes = require('./backend/routes/productBDDRoute');
const CommandeEntrepriseRoutes = require('./backend/routes/commEntreRoute');
const commandeSecteurRoutes = require('./backend/routes/commSectRoute');
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
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/commandeEntreprise', CommandeEntrepriseRoutes);
app.use('/api/commande-secteur', commandeSecteurRoutes);


// Exemple de route pour vérifier le fonctionnement du serveur
app.get('/', (req, res) => {
  res.send('Serveur en ligne !');
});

module.exports = app;
