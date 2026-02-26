const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('superadmin', 'admin', 'treasurer', 'resident'), allowNull: false },
  societyId: { type: DataTypes.INTEGER, allowNull: true }, // null for superadmin
  flatNumber: { type: DataTypes.STRING, allowNull: true }
});

module.exports = User;
