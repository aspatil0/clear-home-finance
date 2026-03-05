const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AutoInvoice = sequelize.define('AutoInvoice', {
  societyId: { type: DataTypes.INTEGER, allowNull: false },
  tenantId: { type: DataTypes.STRING, allowNull: false },
  tenantName: { type: DataTypes.STRING, allowNull: false },
  issueDate: { type: DataTypes.DATEONLY, allowNull: false },
  recurrenceType: { type: DataTypes.ENUM('monthly', 'weekly', 'yearly'), allowNull: false },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  items: { type: DataTypes.JSON, allowNull: false },
  active: { type: DataTypes.BOOLEAN, defaultValue: true },
  nextRunDate: { type: DataTypes.DATEONLY, allowNull: true },
  createdBy: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: 'autoinvoices',
  timestamps: true,
});

module.exports = AutoInvoice;
