const express = require('express');
const router = express.Router();
const AutoInvoice = require('../models/AutoInvoice');
const Society = require('../models/Society');
const FinalInvoice = require('../models/FinalInvoice');
const User = require('../models/User');

// POST /autoinvoices
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    // ensure tenant info exists; if missing, pull from Society
    let tenantId = body.tenantId;
    let tenantName = body.tenantName;
    if ((!tenantId || !tenantName) && body.societyId) {
      const society = await Society.findByPk(body.societyId);
      if (society) {
        if (!tenantId) tenantId = society.tenantId;
        if (!tenantName) tenantName = society.name;
      }
    }

    // compute nextRunDate from issueDate + recurrence (initially set to issueDate)
    const ai = await AutoInvoice.create({
      ...body,
      tenantId,
      tenantName,
      nextRunDate: body.issueDate,
    });

    // If caller asked to run immediately (runNow=true), create FinalInvoice entries for all residents now
    const runNow = body.runNow === true || body.runNow === 'true';
    if (runNow) {
      try {
        const residents = await User.findAll({ where: { societyId: ai.societyId } });
        // prefer applicationId passed in request body (admin-provided); fallback to ai.applicationId or Auto-<id>
        const appId = body.applicationId || ai.applicationId || `Auto-${ai.id}`;
        for (const r of residents) {
          // avoid duplicates: don't create if an invoice for this applicationId, residentId and issueDate already exists
          const existing = await FinalInvoice.findOne({ where: { applicationId: appId, residentId: r.id, issueDate: ai.issueDate } });
          if (existing) continue;
          await FinalInvoice.create({
            applicationId: appId,
            tenantId: ai.tenantId || '',
            tenantName: ai.tenantName || '',
            residentId: r.id,
            societyId: ai.societyId,
            issueDate: ai.issueDate,
            dueDate: ai.issueDate,
            totalAmount: ai.totalAmount,
            createdBy: ai.createdBy || 'system',
            gracePeriodDays: ai.gracePeriodDays || 0,
            description: `Auto invoice (${ai.recurrenceType})`,
            items: ai.items,
          });
        }

        // advance nextRunDate according to recurrence
        const next = new Date(ai.nextRunDate || ai.issueDate);
        if (ai.recurrenceType === 'monthly') next.setMonth(next.getMonth() + 1);
        else if (ai.recurrenceType === 'weekly') next.setDate(next.getDate() + 7);
        else if (ai.recurrenceType === 'yearly') next.setFullYear(next.getFullYear() + 1);
        ai.nextRunDate = next.toISOString().slice(0,10);
        await ai.save();
      } catch (err) {
        console.error('AutoInvoice immediate run error', err);
      }
    }

    res.status(201).json(ai);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /autoinvoices?societyId=7
router.get('/', async (req, res) => {
  try {
    const { societyId } = req.query;
    const where = {};
    if (societyId) where.societyId = societyId;
    const rows = await AutoInvoice.findAll({ where });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /autoinvoices/:id to update (e.g., deactivate)
router.patch('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const ai = await AutoInvoice.findByPk(id);
    if (!ai) return res.status(404).json({ error: 'Not found' });
    await ai.update(req.body);
    res.json(ai);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /autoinvoices/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const ai = await AutoInvoice.findByPk(id);
    if (!ai) return res.status(404).json({ error: 'Not found' });
    await ai.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
