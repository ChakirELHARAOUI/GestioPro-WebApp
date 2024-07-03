// backend/database/models/ChargeSecteur.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ChargeSecteur = sequelize.define('ChargeSecteur', {
    idCharge: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
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
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    tableName: 'ChargeSecteurs',
    timestamps: true,
  });

  return ChargeSecteur;
};

