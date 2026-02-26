require('dotenv').config();
const sequelize = require('./config/db');
require('./models/User');
require('./models/Society');
require('./models/Flat');

sequelize.sync({ alter: true }).then(() => {
  console.log('All models were synchronized successfully.');
  process.exit();
}).catch(err => {
  console.error('Error syncing models:', err);
  process.exit(1);
});
