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

    // Créer des produits
    const products = [
      { name: 'Lait Collaimo 1L', prixVenteUnite: 10.5, fournisseur: 'Collaimo' },
      { name: 'Yaourt Collaimo 500g', prixVenteUnite: 5.75, fournisseur: 'Collaimo' },
      { name: 'Fromage Collaimo 250g', prixVenteUnite: 15.25, fournisseur: 'Collaimo' },
      { name: 'Crème fraîche Collaimo 200ml', prixVenteUnite: 8.0, fournisseur: 'Collaimo' },
      { name: 'Beurre Collaimo 250g', prixVenteUnite: 12.5, fournisseur: 'Collaimo' },
    ];

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
