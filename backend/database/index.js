// backend/database/index.js

const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/config');
const path = require('path');


const sequelize = new Sequelize(dbConfig.development.database, dbConfig.development.username, dbConfig.development.password, {
    host: dbConfig.development.host,
    dialect: dbConfig.development.dialect,
    logging : false
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

// Définition des associations

db.User.hasMany(db.CommandeSecteur, { foreignKey: 'id_User' });
db.User.hasOne(db.StockSecteur, { foreignKey: 'id_User' });
db.User.hasMany(db.RecetteSecteur, { foreignKey: 'id_User' });
db.User.hasMany(db.VersementSecteur, { foreignKey: 'id_User' });
db.User.hasMany(db.ChargeSecteur, { foreignKey: 'id_User' });
db.User.hasMany(db.InvenduSecteur, { foreignKey: 'id_User' });
db.User.hasMany(db.PerteSecteur, { foreignKey: 'id_User' });


db.ProductBDD.hasMany(db.Product, { foreignKey: 'id_produitBDD' });
db.ProductBDD.hasMany(db.ProductBDDHistory, { foreignKey: 'id_produitBDD' });

db.Product.belongsTo(db.ProductBDD, { foreignKey: 'id_produitBDD' });
db.Product.belongsTo(db.CommandeSecteur, { foreignKey: 'idCommandeSecteur' });
db.Product.belongsTo(db.StockSecteur, { foreignKey: 'idStockSecteur' });

db.ProductBDDHistory.belongsTo(db.ProductBDD, { foreignKey: 'id_produitBDD' });

db.CommandeEntreprise.hasMany(db.CommandeSecteur, { foreignKey: 'idCommandeEntreprise' });

db.CommandeSecteur.belongsTo(db.User, { foreignKey: 'id_User' });
db.CommandeSecteur.belongsTo(db.CommandeEntreprise, { foreignKey: 'idCommandeEntreprise' });
db.CommandeSecteur.belongsTo(db.StockSecteur, { foreignKey: 'idStockSecteur' });
db.CommandeSecteur.hasOne(db.RecetteSecteur, { foreignKey: 'idCommandeSecteur' });
db.CommandeSecteur.hasMany(db.Product, { foreignKey: 'idCommandeSecteur' });


db.StockSecteur.belongsTo(db.User, { foreignKey: 'id_User' });
db.StockSecteur.hasMany(db.CommandeSecteur, { foreignKey: 'idStockSecteur' });
db.StockSecteur.hasMany(db.Product, { foreignKey: 'idStockSecteur' });


db.RecetteSecteur.belongsTo(db.User, { foreignKey: 'id_User' });
db.RecetteSecteur.belongsTo(db.CommandeSecteur, { foreignKey: 'idCommandeSecteur' });
db.RecetteSecteur.hasOne(db.VersementSecteur, { foreignKey: 'idRecetteSecteur' });
db.RecetteSecteur.hasMany(db.ChargeSecteur, { foreignKey: 'idRecetteSecteur' });
db.RecetteSecteur.hasOne(db.InvenduSecteur, { foreignKey: 'idRecetteSecteur' });
db.RecetteSecteur.hasOne(db.PerteSecteur, { foreignKey: 'idRecetteSecteur' });

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

module.exports = db;