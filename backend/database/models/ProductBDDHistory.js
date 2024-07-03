// backend/database/models/ProductBDDHistories.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ProductBDDHistory = sequelize.define('ProductBDDHistory', {
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
    tableName: 'ProductBDDHistories',
    timestamps: true,
  });

  return ProductBDDHistory;
};
