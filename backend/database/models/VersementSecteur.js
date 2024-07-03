// backend/database/models/VersementSecteur.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const VersementSecteur = sequelize.define('VersementSecteur', {
    idVersementSecteur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sector: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  }, {
    tableName: 'VersementSecteurs',
    timestamps: false, 
  });

  return VersementSecteur;
};

