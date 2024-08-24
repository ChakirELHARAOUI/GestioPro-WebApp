// backend/seedDatabase.js
//const { sequelize, User, CatalogueProduit, CommandeGlobale, CommandeSecteur, QuantiteProduit } = require('./database/index');
const UserService = require('./services/UserService');
const CatalogueProduitService = require('./services/CatalogueProduitService');
const CommandeGlobaleService = require('./services/CommandeGlobaleService');

async function seedDatabase() {
  try {
    // Créer des utilisateurs
    const users = [
      { username: 'Admin 1',    sector:'default', password: 'test', role: 1 },
      { username: 'Manager 1',  sector:'default', password: 'test', role: 1 },
      { username: 'Vendeur 1',  sector:'default', password: 'test', role: 0 },
      { username: 'Vendeur 2',  sector:'default', password: 'test', role: 0 },
    ];

    for (const user of users) {
      await UserService.createUser(user);
    }

    // Créer des produits pour le catalogue
    const products = [
      // Produits du Fournisseur A
      { name: 'Produit A1', prixVenteUnite: 5600, fournisseur: 'Fournisseur A' },
      { name: 'Produit A2', prixVenteUnite: 3050, fournisseur: 'Fournisseur A' },
      { name: 'Produit A3', prixVenteUnite: 740,  fournisseur: 'Fournisseur A' },
      { name: 'Produit A4', prixVenteUnite: 8000, fournisseur: 'Fournisseur A' },

      // Produits du Fournisseur B
      { name: 'Produit B1', prixVenteUnite: 550,  fournisseur: 'Fournisseur B' },
      { name: 'Produit B2', prixVenteUnite: 1200, fournisseur: 'Fournisseur B' },
      { name: 'Produit B3', prixVenteUnite: 220,  fournisseur: 'Fournisseur B' },
      { name: 'Produit B4', prixVenteUnite: 270,  fournisseur: 'Fournisseur B' },

      // Produits du Fournisseur C
      { name: 'Produit C1', prixVenteUnite: 280,  fournisseur: 'Fournisseur C' },
      { name: 'Produit C2', prixVenteUnite: 360,  fournisseur: 'Fournisseur C' },
      { name: 'Produit C3', prixVenteUnite: 220,  fournisseur: 'Fournisseur C' },
      { name: 'Produit C4', prixVenteUnite: 3000, fournisseur: 'Fournisseur C' },

      // Produits du Fournisseur D
      { name: 'Produit D1', prixVenteUnite: 3150, fournisseur: 'Fournisseur D' },
    ];

    // Boucle pour créer chaque produit dans le catalogue
    for (const product of products) {
      await CatalogueProduitService.createCatalogueProduit(product);
    }

    // Créer des commandes globales
    const commandeGlobales = [
      { dateDepart: '24/08/2024', etat: false },
      { dateDepart: '25/08/2024', etat: false },
      { dateDepart: '29/08/2024', etat: true },
    ];

    for (const commande of commandeGlobales) {
      const userIds = [2, 3, 4]; // IDs des utilisateurs manager, vendeur1, vendeur2
      await CommandeGlobaleService.createCommandeGlobale(commande, userIds);
    }

    console.log('Base de données initialisée avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  }
}

module.exports = seedDatabase;
