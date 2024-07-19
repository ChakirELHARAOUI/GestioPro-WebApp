// backend/database/models/StockSecteur.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StockSecteur = sequelize.define('StockSecteur', {
    idStockSecteur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sector: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique : false
    },
    nombreCagette: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    credit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0
    }
  }, {
    tableName: 'StockSecteurs',
    timestamps: false, 
  });

  return StockSecteur;
};

