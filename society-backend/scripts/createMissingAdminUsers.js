const Society = require('./models/Society');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function createMissingAdminUsers() {
  const societies = await Society.findAll();
  for (const soc of societies) {
    if (!soc.email) continue;
    const existing = await User.findOne({ where: { email: soc.email, role: 'admin', societyId: soc.id } });
    if (!existing) {
      const hashedPassword = await bcrypt.hash('society@admin123', 10);
      await User.create({
        email: soc.email,
        password: hashedPassword,
        role: 'admin',
        societyId: soc.id,
        flatNumber: null
      });
      console.log(`Created admin user for society ${soc.name} (${soc.email})`);
    }
  }
  console.log('Done.');
}

createMissingAdminUsers().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
