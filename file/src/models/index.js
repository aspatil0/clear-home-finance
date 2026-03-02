// src/models/index.js
const { Sequelize } = require('sequelize');
const dbConfig = require('../config/db.config'); // we'll create this next
const logger = require('../utils/logger');

// Initialize Sequelize instance
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    logging: false,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import all models
db.FileRecord = require('./FileRecord')(sequelize);

// Export
module.exports = db;
