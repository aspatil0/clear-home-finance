const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Society = sequelize.define('Society', {
  tenantId: { type: DataTypes.STRING, allowNull: false, unique: true },
  uniqueSocietyId: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false }, // admin email for login
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Society;
