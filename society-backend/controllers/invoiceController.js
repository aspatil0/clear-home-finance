// const Invoice = require('../models/Invoice');

// // Get all invoices for a society
// exports.getInvoices = async (req, res) => {
//   const { societyId } = req.query;
//   try {
//     const invoices = await Invoice.findAll({ where: { societyId } });
//     res.json(invoices);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch invoices' });
//   }
// };

// // Create or update invoices for all flats
// exports.generateInvoices = async (req, res) => {
//   const { societyId, invoices } = req.body;
//   try {
//     // Remove old invoices for this month (optional)
//     // await Invoice.destroy({ where: { societyId, date: req.body.date } });
//     // Upsert invoices
//     for (const inv of invoices) {
//       await Invoice.upsert(inv);
//     }
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to generate invoices' });
//   }
// };
const Invoice = require("../models/Invoice");
const { Op } = require('sequelize');
const axios = require('axios');

const AUTH_URL = process.env.AUTH_SERVICE_URL;
const INVOICE_URL = process.env.INVOICE_SERVICE_URL;
const PAYMENT_URL = process.env.PAYMENT_SERVICE_URL;
const httpClient = axios.create({ timeout: 5000 });

async function verifyUserFromHeader(req) {
  if (!AUTH_URL) return null; // auth service not configured, skip
  const token = req.headers.authorization || req.headers.Authorization;
  if (!token) return null;
  try {
    const resp = await httpClient.get(`${AUTH_URL.replace(/\/$/, '')}/verify`, {
      headers: { Authorization: token },
    });
    return resp.data;
  } catch (err) {
    console.warn('[invoiceController] auth verify failed:', err.message);
    return null;
  }
}

async function syncInvoiceToRemote(invoice) {
  if (!INVOICE_URL) return;
  try {
    await httpClient.post(`${INVOICE_URL.replace(/\/$/, '')}/invoices`, invoice);
  } catch (err) {
    console.warn('[invoiceController] sync to remote invoice service failed:', err.message);
  }
}

async function notifyPaymentWrapper(invoice) {
  if (!PAYMENT_URL) return;
  try {
    // best-effort notify the payment wrapper; do not block on failure
    await httpClient.post(`${PAYMENT_URL.replace(/\/$/, '')}/payments`, {
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount,
      societyId: invoice.societyId,
      paidDate: invoice.paidDate || new Date(),
    });
  } catch (err) {
    console.warn('[invoiceController] notify payment wrapper failed:', err.message);
  }
}

// Get invoices by society
exports.getInvoices = async (req, res) => {
  try {
    const { societyId } = req.query;

    const invoices = await Invoice.findAll({
      where: { societyId },
      order: [["createdAt", "DESC"]],
    });

    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
};

// Generate invoices
exports.generateInvoices = async (req, res) => {
  const { societyId, invoices } = req.body;

  // If an auth service is configured, require a successful verification
  if (AUTH_URL) {
    const verified = await verifyUserFromHeader(req);
    if (!verified) return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!societyId || !Array.isArray(invoices) || invoices.length === 0) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    console.log(`GenerateInvoices request received. societyId=${societyId} count=${invoices.length}`);
    try {
      console.log('Full payload:', JSON.stringify(req.body, null, 2));
    } catch (e) {
      console.log('Payload logging failed', e);
    }

    // Use a transaction and upsert each invoice to avoid unique constraint failures
    const t = await Invoice.sequelize.transaction();
    try {
      for (const inv of invoices) {
        // validate required fields
        if (!inv.invoiceNumber || !inv.flatId || !inv.amount) {
          throw new Error(`Missing required invoice fields for invoice: ${JSON.stringify(inv)}`);
        }

        await Invoice.upsert(
          {
            invoiceNumber: inv.invoiceNumber,
            flatId: inv.flatId,
            societyId: societyId,
            ownerName: inv.ownerName || "",
            amount: inv.amount,
            status: inv.status || "Unpaid",
            dueDate: inv.dueDate,
            paidDate: inv.paidDate || null,
          },
          { transaction: t }
        );
      }

      await t.commit();
      // fire-and-forget: sync created/updated invoices to remote invoice service if configured
      try {
        if (INVOICE_URL) {
          for (const inv of invoices) {
            // include societyId to remote payload
            syncInvoiceToRemote({ ...inv, societyId });
          }
        }
      } catch (e) {
        console.warn('[invoiceController] background sync scheduling failed:', e.message);
      }

      res.json({ success: true });
    } catch (errInner) {
      await t.rollback();
      console.error('Invoice upsert failed:', errInner);
      if (errInner?.errors) console.error('Sequelize errors:', errInner.errors);
      return res.status(500).json({ error: 'Failed to upsert invoices', detail: errInner.message, name: errInner.name });
    }
  } catch (err) {
    console.error("Invoice generation failed:", err);
    if (err?.stack) console.error(err.stack);
    res.status(500).json({ error: "Failed to generate invoices", detail: err.message, name: err.name });
  }
};

// Mark an invoice as paid
exports.markPaid = async (req, res) => {
  try {
    const invoiceNumber = req.params.invoiceNumber;
    console.log(`[invoiceController] markPaid called for invoiceNumber=${invoiceNumber} method=${req.method}`);
    if (!invoiceNumber) return res.status(400).json({ error: 'Missing invoice identifier' });

    const inv = await Invoice.findOne({ where: { invoiceNumber } });
    if (!inv) {
      console.warn(`[invoiceController] invoice not found for exact invoiceNumber=${invoiceNumber}. Attempting fuzzy search.`);
      // try a case-insensitive / like search to help debug
      try {
        const fuzzy = await Invoice.findAll({ where: { invoiceNumber: { [Op.like]: `%${invoiceNumber}%` } }, limit: 10 });
        console.log(`[invoiceController] fuzzy search returned ${Array.isArray(fuzzy) ? fuzzy.length : 0} rows`);
        if (Array.isArray(fuzzy) && fuzzy.length > 0) {
          console.log('Sample matches:', fuzzy.map(f => f.invoiceNumber));
        }
      } catch (e) {
        console.error('[invoiceController] fuzzy search error:', e);
      }
      return res.status(404).json({ error: 'Invoice not found', invoiceNumber });
    }

    inv.status = 'Paid';
    inv.paidDate = new Date();
    await inv.save();

    // Notify payment wrapper (best-effort, non-blocking)
    try {
      notifyPaymentWrapper({
        invoiceNumber: inv.invoiceNumber,
        amount: inv.amount,
        societyId: inv.societyId,
        paidDate: inv.paidDate,
      });
    } catch (e) {
      console.warn('[invoiceController] scheduling payment notify failed:', e.message);
    }

    res.json({ success: true, invoice: inv });
  } catch (err) {
    console.error('markPaid error:', err);
    res.status(500).json({ error: 'Failed to mark invoice paid' });
  }
};

// Get single invoice by invoiceNumber
exports.getInvoice = async (req, res) => {
  try {
    const invoiceNumber = req.params.invoiceNumber;
    console.log(`[invoiceController] getInvoice called for invoiceNumber=${invoiceNumber}`);
    if (!invoiceNumber) return res.status(400).json({ error: 'Missing invoice identifier' });

    const inv = await Invoice.findOne({ where: { invoiceNumber } });
    if (!inv) return res.status(404).json({ error: 'Invoice not found' });
    res.json(inv);
  } catch (err) {
    console.error('getInvoice error:', err);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
};