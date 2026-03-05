require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const { Op } = require('sequelize');
const flatRoutes = require('./routes/flats');
const authRoutes = require('./routes/auth');
const societyRoutes = require('./routes/societies');

const maintenanceRoutes = require('./routes/maintenance');

const userRoutes = require('./routes/users');

const finalInvoiceRoutes = require('./routes/finalinvoices');
const invoiceRoutes = require('./routes/invoices');
const autoInvoiceRoutes = require('./routes/autoinvoices');


const app = express();
app.use(cors());
app.use(express.json());
// Users route (must be after app is initialized)
app.use('/users', userRoutes);
// FinalInvoices route
app.use('/finalinvoices', finalInvoiceRoutes);
app.use('/autoinvoices', autoInvoiceRoutes);

// Flat routes
app.use('/flats', flatRoutes);
app.use('/auth', authRoutes);
app.use('/invoices', invoiceRoutes);

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

// Simple scheduler to process auto-invoices every hour
const processAutoInvoices = async () => {
  try {
    const AutoInvoice = require('./models/AutoInvoice');
    const FinalInvoice = require('./models/FinalInvoice');
    const User = require('./models/User');

    const today = new Date();
    const todayStr = today.toISOString().slice(0,10);

    // Process any autoinvoice whose nextRunDate is today or in the past (catch up missed runs)
    const pending = await AutoInvoice.findAll({ where: { active: true, nextRunDate: { [Op.lte]: todayStr } } });
    for (const cfg of pending) {
      // ensure nextRunDate is set
      if (!cfg.nextRunDate) cfg.nextRunDate = cfg.issueDate;

      // loop through missed occurrences up to today
      while (new Date(cfg.nextRunDate) <= today) {
        const occurrenceDate = cfg.nextRunDate; // yyyy-mm-dd string
        const residents = await User.findAll({ where: { societyId: cfg.societyId } });
        for (const r of residents) {
          // create final invoice per resident if not already created for this occurrence
          const appId = cfg.applicationId || `Auto-${cfg.id}`;
          const existing = await FinalInvoice.findOne({ where: { applicationId: appId, residentId: r.id, issueDate: occurrenceDate } });
          if (existing) continue;
          await FinalInvoice.create({
            applicationId: appId,
            tenantId: cfg.tenantId || '',
            tenantName: cfg.tenantName || '',
            residentId: r.id,
            societyId: cfg.societyId,
            issueDate: occurrenceDate,
            dueDate: occurrenceDate,
            totalAmount: cfg.totalAmount,
            createdBy: cfg.createdBy || 'system',
            gracePeriodDays: cfg.gracePeriodDays || 0,
            description: `Auto invoice (${cfg.recurrenceType})`,
            items: cfg.items,
          });
        }

        // advance nextRunDate according to recurrence
        const next = new Date(cfg.nextRunDate || cfg.issueDate);
        if (cfg.recurrenceType === 'monthly') next.setMonth(next.getMonth() + 1);
        else if (cfg.recurrenceType === 'weekly') next.setDate(next.getDate() + 7);
        else if (cfg.recurrenceType === 'yearly') next.setFullYear(next.getFullYear() + 1);

        cfg.nextRunDate = next.toISOString().slice(0,10);
        await cfg.save();
      }
    }
  } catch (err) {
    console.error('Auto invoice processing error', err);
  }
};

// run once at startup then every hour
processAutoInvoices();
setInterval(processAutoInvoices, 60 * 60 * 1000);
