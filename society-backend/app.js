require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const flatRoutes = require('./routes/flats');
const authRoutes = require('./routes/auth');
const societyRoutes = require('./routes/societies');

const maintenanceRoutes = require('./routes/maintenance');

const userRoutes = require('./routes/users');
const app = express();
app.use(cors());
app.use(express.json());
// Users route (must be after app is initialized)
app.use('/users', userRoutes);
// Flat routes
app.use('/flats', flatRoutes);
app.use('/auth', authRoutes);

// Helper to get local user metadata by email (used by frontend fallback)
app.get('/user-metadata/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const User = require('./models/User');
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ societyId: user.societyId, role: user.role, flatNumber: user.flatNumber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Societies
app.use('/societies', societyRoutes);
// Maintenance
app.use('/maintenance', maintenanceRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Society backend is running!');
});

const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// Note: invoice/auto-invoice features removed.
