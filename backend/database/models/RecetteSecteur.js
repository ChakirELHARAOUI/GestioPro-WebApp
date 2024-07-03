// backend/database/models/RecetteSecteur.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RecetteSecteur = sequelize.define('RecetteSecteur', {
    idRecetteSecteur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    montant: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    }
  }, {
    tableName: 'RecetteSecteurs',
    timestamps: false, 
  });

  return RecetteSecteur;
};