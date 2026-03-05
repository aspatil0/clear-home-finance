const express = require('express');
const router = express.Router();
const FinalInvoice = require('../models/FinalInvoice');

const User = require('../models/User');

// POST /finalinvoices
router.post('/', async (req, res) => {
  try {
    const invoice = await FinalInvoice.create(req.body);
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /finalinvoices?societyId=7&residentId=41
router.get('/', async (req, res) => {
  try {
    const { societyId, residentId } = req.query;
    const where = {};
    if (societyId) where.societyId = societyId;
    if (residentId) where.residentId = residentId;
    const invoices = await FinalInvoice.findAll({ where });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// POST /finalinvoices/bulk -> create final invoice for all residents of a society
router.post('/bulk', async (req, res) => {
  try {
    const { societyId, applicationId, tenantId, tenantName, issueDate, dueDate, totalAmount, createdBy, gracePeriodDays, description, items } = req.body;
    if (!societyId) return res.status(400).json({ error: 'societyId required' });
    const residents = await User.findAll({ where: { societyId } });
    const created = [];
    for (const r of residents) {
      const fi = await FinalInvoice.create({
        applicationId: applicationId || `Bulk-${Date.now()}`,
        tenantId: tenantId || '',
        tenantName: tenantName || '',
        residentId: r.id,
        societyId: Number(societyId),
        issueDate: issueDate,
        dueDate: dueDate || issueDate,
        totalAmount: totalAmount,
        createdBy: createdBy || 'system',
        gracePeriodDays: gracePeriodDays || 0,
        description: description || null,
        items: items || [],
      });
      created.push(fi);
    }
    res.json({ success: true, createdCount: created.length, createdIds: created.slice(0, 20).map(c => c.id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
