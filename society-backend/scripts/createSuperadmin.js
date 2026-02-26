require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const User = require('../models/User');

async function run() {
  const email = process.argv[2] || process.env.SUPERADMIN_EMAIL || 'superadmin@example.com';
  const password = process.argv[3] || process.env.SUPERADMIN_PASSWORD || 'SuperSecret123!';

  if (!email || !password) {
    console.error('Usage: node createSuperadmin.js <email> <password>');
    process.exit(1);
  }

  try {
    await sequelize.authenticate();
    console.log('DB connected');

    const hashed = bcrypt.hashSync(password, 10);

    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        email,
        password: hashed,
        role: 'superadmin',
        societyId: null,
        flatNumber: null,
      },
    });

    if (!created) {
      user.password = hashed;
      user.role = 'superadmin';
      user.societyId = null;
      user.flatNumber = null;
      await user.save();
      console.log('Updated existing user to superadmin:', email);
    } else {
      console.log('Created superadmin user:', email);
    }

    console.log('You can now login at POST /auth/login with this email and password');
    process.exit(0);
  } catch (err) {
    console.error('Error creating superadmin:', err);
    process.exit(1);
  }
}

run();
