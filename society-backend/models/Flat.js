const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Society = require('./Society');

const Flat = sequelize.define('Flat', {
  flatNumber: { type: DataTypes.STRING, allowNull: false },
  ownerName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  area: { type: DataTypes.INTEGER, allowNull: false }
});

Flat.belongsTo(Society, { foreignKey: 'societyId' });
Society.hasMany(Flat, { foreignKey: 'societyId' });

module.exports = Flat;
