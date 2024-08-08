// backend/seedDatabase.js
const { sequelize, User, CatalogueProduit, CommandeGlobale, CommandeSecteur, QuantiteProduit } = require('./database/index');
const UserService = require('./services/UserService');
const CatalogueProduitService = require('./services/CatalogueProduitService');
const CommandeGlobaleService = require('./services/CommandeGlobaleService');


async function seedDatabase() {
  try {
    // Créer des utilisateurs
    const users = [
      { username: 'admin',      sector:'default',   password: 'test', role: 1 },
      { username: 'manager',    sector:'default',   password: 'test', role: 1 },
      { username: 'vendeur1',   sector:'default',   password: 'test', role: 0 },
      { username: 'vendeur2',   sector:'default',   password: 'test', role: 0 },
    ];

    for (const user of users) {
      await UserService.createUser(user);
    }


    // Créer des produits pour le catalogue
    const products = [
      // Produits de Collaimo
      { name: 'UHT 1L', prixVenteUnite: 5600, fournisseur: 'Collaimo' },
      { name: 'UHT 1/2L', prixVenteUnite: 3050, fournisseur: 'Collaimo' },
      { name: 'Lben 1/2L', prixVenteUnite: 740, fournisseur: 'Collaimo' },
      { name: 'Beurre Collaimo 1K', prixVenteUnite: 8000, fournisseur: 'Collaimo' },

      // Produits de Chergui
      { name: 'RAIB PT /500', prixVenteUnite: 550, fournisseur: 'Chergui' },
      { name: 'JUS CH / 1200', prixVenteUnite: 1200, fournisseur: 'Chergui' },
      { name: 'DANON   72 CH', prixVenteUnite: 220, fournisseur: 'Chergui' },
      { name: 'BRASSEE   72', prixVenteUnite: 270, fournisseur: 'Chergui' },

      // Produits de Jawda
      { name: 'PRLY  /280', prixVenteUnite: 280, fournisseur: 'Jawda' },
      { name: 'GHILAL  72', prixVenteUnite: 360, fournisseur: 'Jawda' },
      { name: 'TENDRE 72  /220 ', prixVenteUnite: 220, fournisseur: 'Jawda' },
      { name: 'JUS   3000', prixVenteUnite: 3000, fournisseur: 'Jawda' },

      // Produits du vendeur local d'œufs
      { name: 'Œufs frais', prixVenteUnite: 3150, fournisseur: 'Oeufs' },
    ];

    // Boucle pour créer chaque produit dans le catalogue
    for (const product of products) {
      await CatalogueProduitService.createCatalogueProduit(product);
    }


    // Créer des commandes globales
    const commandeGlobales = [
      { dateDepart: '15/08/2024', etat: true },
      { dateDepart: '22/08/2024', etat: true },
      { dateDepart: '29/08/2024', etat: false },
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
