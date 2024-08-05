// backend/database/index.js

const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/config');
const path = require('path');

/*const sequelize = new Sequelize(dbConfig.development.database, dbConfig.development.username, dbConfig.development.password, {
    host: dbConfig.development.host,
    dialect: dbConfig.development.dialect,
    logging: false
});*/

const sequelize = new Sequelize(dbConfig.test.database, dbConfig.test.username, dbConfig.test.password, {
  host: dbConfig.test.host,
  dialect: dbConfig.test.dialect,
  logging: false
});

const db = {};

// Fonction pour importer un modèle
const importModel = (modelName) => {
    return require(path.join(__dirname, 'models', modelName))(sequelize, DataTypes);
};

// Importation des modèles
db.User = importModel('User');
db.CatalogueProduit = importModel('CatalogueProduit');                          //ProductBDD
db.CatalogueProduitHistory = importModel('CatalogueProduitHistory');           //ProductBDDHistory 
db.QuantiteProduit = importModel('QuantiteProduit');                            //Product
db.CommandeGlobale = importModel('CommandeGlobale');                            //CommandeEntreprise
db.CommandeSecteur = importModel('CommandeSecteur');
db.RecetteSecteur = importModel('RecetteSecteur');
db.StockSecteur = importModel('StockSecteur');
db.VersementSecteur = importModel('VersementSecteur');
db.ChargeSecteur = importModel('ChargeSecteur');
db.InvenduSecteur = importModel('InvenduSecteur');
db.PerteSecteur = importModel('PerteSecteur');

// Define the junction table for many-to-many relationship
db.UserCommandeGlobale = sequelize.define('UserCommandeGlobale', {}, { timestamps: false });

// Define the many-to-many relationships
db.User.belongsToMany(db.CommandeGlobale, { through: db.UserCommandeGlobale, foreignKey: 'userId', otherKey: 'CommandeGlobaleId' });
db.CommandeGlobale.belongsToMany(db.User, { through: db.UserCommandeGlobale, foreignKey: 'CommandeGlobaleId', otherKey: 'userId' });

// Définition des associations avec cascade

db.User.hasMany(db.CommandeSecteur, { foreignKey: 'id_User', onDelete: 'CASCADE', hooks: true });
db.User.hasOne(db.StockSecteur, { foreignKey: 'id_User', onDelete: 'CASCADE', hooks: true });
db.User.hasMany(db.RecetteSecteur, { foreignKey: 'id_User', onDelete: 'CASCADE', hooks: true });
db.User.hasMany(db.VersementSecteur, { foreignKey: 'id_User', onDelete: 'CASCADE', hooks: true });
db.User.hasMany(db.ChargeSecteur, { foreignKey: 'id_User', onDelete: 'CASCADE', hooks: true });
db.User.hasMany(db.InvenduSecteur, { foreignKey: 'id_User', onDelete: 'CASCADE', hooks: true });
db.User.hasMany(db.PerteSecteur, { foreignKey: 'id_User', onDelete: 'CASCADE', hooks: true });

db.CatalogueProduit.hasMany(db.QuantiteProduit, { foreignKey: 'id_catalogueProduit', onDelete: 'CASCADE', hooks: true });
db.CatalogueProduit.hasMany(db.CatalogueProduitHistory, { foreignKey: 'id_catalogueProduit', onDelete: 'CASCADE', hooks: true });

db.QuantiteProduit.belongsTo(db.CatalogueProduit, { foreignKey: 'id_catalogueProduit' });
db.QuantiteProduit.belongsTo(db.CommandeSecteur, { foreignKey: 'idCommandeSecteur' });
db.QuantiteProduit.belongsTo(db.StockSecteur, { foreignKey: 'idStockSecteur' });

db.CatalogueProduitHistory.belongsTo(db.CatalogueProduit, { foreignKey: 'id_produitBDD' });

db.CommandeGlobale.hasMany(db.CommandeSecteur, { foreignKey: 'idCommandeGlobale', onDelete: 'CASCADE', hooks: true });

db.CommandeSecteur.belongsTo(db.User, { foreignKey: 'id_User' });
db.CommandeSecteur.belongsTo(db.CommandeGlobale, { foreignKey: 'idCommandeGlobale' });
db.CommandeSecteur.belongsTo(db.StockSecteur, { foreignKey: 'idStockSecteur' });
db.CommandeSecteur.hasOne(db.RecetteSecteur, { foreignKey: 'idCommandeSecteur', onDelete: 'CASCADE', hooks: true });
db.CommandeSecteur.hasMany(db.QuantiteProduit, { foreignKey: 'idCommandeSecteur', onDelete: 'CASCADE', hooks: true });

db.StockSecteur.belongsTo(db.User, { foreignKey: 'id_User' });
db.StockSecteur.hasMany(db.CommandeSecteur, { foreignKey: 'idStockSecteur', onDelete: 'CASCADE', hooks: true });
db.StockSecteur.hasMany(db.QuantiteProduit, { foreignKey: 'idStockSecteur', onDelete: 'CASCADE', hooks: true });

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




// Hooks pour la création conjointe
  
db.RecetteSecteur.afterCreate(async (recetteSecteur, options) => {
  if (!options.transaction) return;
  await db.VersementSecteur.create({ idRecetteSecteur: recetteSecteur.idRecetteSecteur }, { transaction: options.transaction });
  await db.ChargeSecteur.create({ idRecetteSecteur: recetteSecteur.idRecetteSecteur }, { transaction: options.transaction });
  await db.InvenduSecteur.create({ idRecetteSecteur: recetteSecteur.idRecetteSecteur }, { transaction: options.transaction });
  await db.PerteSecteur.create({ idRecetteSecteur: recetteSecteur.idRecetteSecteur }, { transaction: options.transaction });
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
