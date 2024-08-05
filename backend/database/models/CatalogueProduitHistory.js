// backend/database/models/ProductBDDHistories.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CatalogueProduitHistory = sequelize.define('CatalogueProduitHistory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    prixVenteUnite: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    }
  }, {
    tableName: 'CatalogueProduitHistory',
    timestamps: true,
  });

  return CatalogueProduitHistory;
};
