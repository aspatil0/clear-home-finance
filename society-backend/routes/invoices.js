const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

console.log('[invoices.js] invoices route module loaded');

// Log incoming requests to help debug 404/route issues
router.use((req, res, next) => {
	try {
		console.log(`[invoices route] ${req.method} ${req.originalUrl}`);
	} catch (e) {
		// ignore logging errors
	}
	next();
});

// Health check for invoices router
router.get('/health', (req, res) => {
	res.json({ ok: true, route: 'invoices' });
});

router.get('/', invoiceController.getInvoices);
router.post('/generate', invoiceController.generateInvoices);
// fetch single invoice by invoiceNumber (for debugging)
router.get('/:invoiceNumber', invoiceController.getInvoice);
router.put('/:invoiceNumber/pay', invoiceController.markPaid);

module.exports = router;
