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