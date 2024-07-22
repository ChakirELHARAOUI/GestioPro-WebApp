// backend/database/index.js

const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/config');
const path = require('path');
const { getStockSecteurByUserId } = require('../utils');

const sequelize = new Sequelize(dbConfig.development.database, dbConfig.development.username, dbConfig.development.password, {
    host: dbConfig.development.host,
    dialect: dbConfig.development.dialect,
    logging: false
});

const db = {};

// Fonction pour importer un modèle
const importModel = (modelName) => {
    return require(path.join(__dirname, 'models', modelName))(sequelize, DataTypes);
};

// Importation des modèles
db.User = importModel('User');
db.ProductBDD = importModel('ProductBDD');
db.ProductBDDHistory = importModel('ProductBDDHistory');
db.Product = importModel('Product');
db.CommandeEntreprise = importModel('CommandeEntreprise');
db.CommandeSecteur = importModel('CommandeSecteur');
db.RecetteSecteur = importModel('RecetteSecteur');
db.StockSecteur = importModel('StockSecteur');
db.VersementSecteur = importModel('VersementSecteur');
db.ChargeSecteur = importModel('ChargeSecteur');
db.InvenduSecteur = importModel('InvenduSecteur');
db.PerteSecteur = importModel('PerteSecteur');

// Define the junction table for many-to-many relationship
db.UserCommandeEntreprise = sequelize.define('UserCommandeEntreprise', {}, { timestamps: false });

// Define the many-to-many relationships
db.User.belongsToMany(db.CommandeEntreprise, { through: db.UserCommandeEntreprise, foreignKey: 'userId', otherKey: 'commandeEntrepriseId' });
db.CommandeEntreprise.belongsToMany(db.User, { through: db.UserCommandeEntreprise, foreignKey: 'commandeEntrepriseId', otherKey: 'userId' });

// Définition des associations avec cascade

db.User.hasMany(db.CommandeSecteur, { foreignKey: 'id_User', onDelete: 'CASCADE', hooks: true });
db.User.hasOne(db.StockSecteur, { foreignKey: 'id_User', onDelete: 'CASCADE', hooks: true });
db.User.hasMany(db.RecetteSecteur, { foreignKey: 'id_User', onDelete: 'CASCADE', hooks: true });
db.User.hasMany(db.VersementSecteur, { foreignKey: 'id_User', onDelete: 'CASCADE', hooks: true });
db.User.hasMany(db.ChargeSecteur, { foreignKey: 'id_User', onDelete: 'CASCADE', hooks: true });
db.User.hasMany(db.InvenduSecteur, { foreignKey: 'id_User', onDelete: 'CASCADE', hooks: true });
db.User.hasMany(db.PerteSecteur, { foreignKey: 'id_User', onDelete: 'CASCADE', hooks: true });

db.ProductBDD.hasMany(db.Product, { foreignKey: 'id_produitBDD', onDelete: 'CASCADE', hooks: true });
db.ProductBDD.hasMany(db.ProductBDDHistory, { foreignKey: 'id_produitBDD', onDelete: 'CASCADE', hooks: true });

db.Product.belongsTo(db.ProductBDD, { foreignKey: 'id_produitBDD' });
db.Product.belongsTo(db.CommandeSecteur, { foreignKey: 'idCommandeSecteur' });
db.Product.belongsTo(db.StockSecteur, { foreignKey: 'idStockSecteur' });

db.ProductBDDHistory.belongsTo(db.ProductBDD, { foreignKey: 'id_produitBDD' });

db.CommandeEntreprise.hasMany(db.CommandeSecteur, { foreignKey: 'idCommandeEntreprise', onDelete: 'CASCADE', hooks: true });

db.CommandeSecteur.belongsTo(db.User, { foreignKey: 'id_User' });
db.CommandeSecteur.belongsTo(db.CommandeEntreprise, { foreignKey: 'idCommandeEntreprise' });
db.CommandeSecteur.belongsTo(db.StockSecteur, { foreignKey: 'idStockSecteur' });
db.CommandeSecteur.hasOne(db.RecetteSecteur, { foreignKey: 'idCommandeSecteur', onDelete: 'CASCADE', hooks: true });
db.CommandeSecteur.hasMany(db.Product, { foreignKey: 'idCommandeSecteur', onDelete: 'CASCADE', hooks: true });

db.StockSecteur.belongsTo(db.User, { foreignKey: 'id_User' });
db.StockSecteur.hasMany(db.CommandeSecteur, { foreignKey: 'idStockSecteur', onDelete: 'CASCADE', hooks: true });
db.StockSecteur.hasMany(db.Product, { foreignKey: 'idStockSecteur', onDelete: 'CASCADE', hooks: true });

db.RecetteSecteur.belongsTo(db.User, { foreignKey: 'id_User' });
db.RecetteSecteur.belongsTo(db.CommandeSecteur, { foreignKey: 'idCommandeSecteur' });
db.RecetteSecteur.hasOne(db.VersementSecteur, { foreignKey: 'idRecetteSecteur', onDelete: 'CASCADE', hooks: true });
db.RecetteSecteur.hasMany(db.ChargeSecteur, { foreignKey: 'idRecetteSecteur', onDelete: 'CASCADE', hooks: true });
db.RecetteSecteur.hasOne(db.InvenduSecteur, { foreignKey: 'idRecetteSecteur', onDelete: 'CASCADE', hooks: true });
db.RecetteSecteur.hasOne(db.PerteSecteur, { foreignKey: 'idRecetteSecteur', onDelete: 'CASCADE', hooks: true });

db.VersementSecteur.belongsTo(db.User, { foreignKey: 'id_User' });
db.VersementSecteur.belongsTo(db.RecetteSecteur, { foreignKey: 'idRecetteSecteur' });

db.ChargeSecteur.belongsTo(db.User, { foreignKey: 'id_User' });
db.ChargeSecteur.belongsTo(db.RecetteSecteur, { foreignKey: 'idRecetteSecteur' });

db.InvenduSecteur.belongsTo(db.User, { foreignKey: 'id_User' });
db.InvenduSecteur.belongsTo(db.RecetteSecteur, { foreignKey: 'idRecetteSecteur' });

db.PerteSecteur.belongsTo(db.User, { foreignKey: 'id_User' });
db.PerteSecteur.belongsTo(db.RecetteSecteur, { foreignKey: 'idRecetteSecteur' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;


// Hooks pour la création conjointe
db.User.afterCreate(async (user, options) => {
    if (!options.transaction) return;
    try {
      await db.StockSecteur.create({
        id_User: user.id_User,
        sector: user.sector, 
        nombreCagette: 0,
        credit: 0
      }, { transaction: options.transaction });
    } catch (error) {
      console.error('Error creating StockSecteur:', error);
      throw error; 
    }
});



db.CommandeEntreprise.afterCreate(async (commandeEntreprise, options) => {
  if (!options.transaction) return;
  console.log("Index | commandeEntreprise.Id : ",commandeEntreprise.idCommandeEntreprise);

  try {
    const userCommandeEntreprises = await db.UserCommandeEntreprise.findAll({
      where: { commandeEntrepriseId: commandeEntreprise.idCommandeEntreprise },
      attributes: ['userId'],
      transaction: options.transaction
    });
    console.log("Index | userCommandeEntreprises : ",userCommandeEntreprises);

    for (const userCommandeEntreprise of userCommandeEntreprises) {
      const userId = userCommandeEntreprise.userId;
      try {
        const idStockSecteur = await getStockSecteurByUserId(db, userId);
        console.log(`Created CommandeSecteur for user ${userId} with idStockSecteur: ${idStockSecteur}`);
        await CommandeSecteur.create({
          id_User: userId,
          idCommandeEntreprise: commandeEntreprise.idCommandeEntreprise,
          etat: 'initial',
          idStockSecteur: idStockSecteur
        }, { transaction: options.transaction });
      } catch (error) {
        console.error(`Error creating CommandeSecteur for user ${userId}:`, error);
        throw error; // Relance l'erreur pour annuler la transaction
      }
    }
  } catch (error) {
    console.error('Error in CommandeEntreprise afterCreate hook:', error);
    throw error; // Relance l'erreur pour annuler la transaction
  }
});
  
  
  
db.RecetteSecteur.afterCreate(async (recetteSecteur, options) => {
  if (!options.transaction) return;
  await db.VersementSecteur.create({ idRecetteSecteur: recetteSecteur.idRecetteSecteur }, { transaction: options.transaction });
  await db.ChargeSecteur.create({ idRecetteSecteur: recetteSecteur.idRecetteSecteur }, { transaction: options.transaction });
  await db.InvenduSecteur.create({ idRecetteSecteur: recetteSecteur.idRecetteSecteur }, { transaction: options.transaction });
  await db.PerteSecteur.create({ idRecetteSecteur: recetteSecteur.idRecetteSecteur }, { transaction: options.transaction });
});

module.exports = db;
