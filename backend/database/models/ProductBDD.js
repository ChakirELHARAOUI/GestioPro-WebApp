// backend/database/models/ProductBDD.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductBDD = sequelize.define('ProductBDD', {
    id_produitBDD: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prixVenteUnite: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fournisseur: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'ProductBDDs',
    timestamps: true,
  });

  return ProductBDD;
};
