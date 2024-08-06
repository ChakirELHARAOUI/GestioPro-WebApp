// backend/database/models/Product.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const QuantiteProduit  = sequelize.define('QuantiteProduit ', {
    id_quantiteProduit: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'QuantiteProduit ',
    timestamps: false, 
  });

  return QuantiteProduit ;
};
