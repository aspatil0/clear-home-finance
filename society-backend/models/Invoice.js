// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');

// const Invoice = sequelize.define('Invoice', {
//   id: {
//     type: DataTypes.STRING,
//     primaryKey: true,
//   },
//   flat: DataTypes.STRING,
//   owner: DataTypes.STRING,
//   amount: DataTypes.INTEGER,
//   status: DataTypes.STRING,
//   date: DataTypes.DATE,
//   societyId: DataTypes.INTEGER,
// });

// module.exports = Invoice;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Invoice = sequelize.define(
  "Invoice",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    invoiceNumber: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
    },

    flatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    societyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    ownerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("Unpaid", "Paid", "Overdue"),
      allowNull: false,
      defaultValue: "Unpaid",
    },

    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    paidDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "invoices",
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = Invoice;