// backend/database/models/CommandeSecteur.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CommandeSecteur = sequelize.define('CommandeSecteur', {
    idCommandeSecteur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dateSoumission: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    etat: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'initial',
    }
  }, {
    tableName: 'CommandeSecteurs',
    timestamps: true,
  });

  return CommandeSecteur;
};