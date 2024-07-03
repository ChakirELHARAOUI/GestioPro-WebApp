
// backend/database/models/User.js

const { DataTypes } = require('sequelize');
const { ROLES } = require('../../constantes');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id_User: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: ROLES.VENDEUR // 0
    }
  },{
      tableName: 'Users',
      timestamps: false, 
  });
  
  return User;
};