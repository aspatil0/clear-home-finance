const express = require('express');
const router = express.Router();
const FinalInvoice = require('../models/FinalInvoice');

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
