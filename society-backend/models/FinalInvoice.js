const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const FinalInvoice = sequelize.define('FinalInvoice', {
  applicationId: { type: DataTypes.STRING, allowNull: false },
  tenantName: { type: DataTypes.STRING, allowNull: false },
  tenantId: { type: DataTypes.STRING, allowNull: false },
  residentId: { type: DataTypes.INTEGER, allowNull: false },
  societyId: { type: DataTypes.INTEGER, allowNull: false },
  issueDate: { type: DataTypes.DATEONLY, allowNull: false },
  dueDate: { type: DataTypes.DATEONLY, allowNull: false },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  createdBy: { type: DataTypes.STRING, allowNull: false },
  gracePeriodDays: { type: DataTypes.INTEGER, allowNull: true },
  description: { type: DataTypes.STRING, allowNull: true },
  items: { type: DataTypes.JSON, allowNull: false },
});

module.exports = FinalInvoice;
