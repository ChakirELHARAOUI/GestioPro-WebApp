// backend/database/models/PerteSecteur.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PerteSecteur = sequelize.define('PerteSecteur', {
    idPerteSecteur: {
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
    tableName: 'PerteSecteurs',
    timestamps: true,
  });

  return PerteSecteur;
};
