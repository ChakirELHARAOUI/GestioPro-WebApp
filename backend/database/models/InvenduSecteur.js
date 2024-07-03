// backend/database/models/InvenduSecteur.js
  
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const InvenduSecteur = sequelize.define('InvenduSecteur', {
    idInvendu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    montant: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'InvenduSecteurs',
    timestamps: true,
  });

  return InvenduSecteur;
};
