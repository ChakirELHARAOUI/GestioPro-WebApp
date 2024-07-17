// backend/database/models/CommandeEntreprise.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CommandeEntreprise = sequelize.define('CommandeEntreprise', {
    idCommandeEntreprise: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dateDepart: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, 
    },
    etat: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue : true
    }
  }, {
    tableName: 'CommandeEntreprises',
    timestamps: true,
  });

  return CommandeEntreprise;
};
