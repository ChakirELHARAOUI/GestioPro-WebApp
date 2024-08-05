// backend/database/models/ProductBDD.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CatalogueProduit = sequelize.define('CatalogueProduit', {
    id_catalogueProduit: {
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
    tableName: 'CatalogueProduit',
    timestamps: true,
  });

  return CatalogueProduit;
};
