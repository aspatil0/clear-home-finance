// src/server.js
require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    logger.info('✅ Database connected successfully.');

    app.listen(PORT, () => {
      logger.info(`🚀 File Management Service running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('❌ Unable to connect to database:', err.message);
    process.exit(1);
  }
})();
