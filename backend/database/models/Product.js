// backend/database/models/Product.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id_produit: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'Products',
    timestamps: false, 
  });

  return Product;
};
