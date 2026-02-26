const express = require('express');
const router = express.Router();
const flatController = require('../controllers/flatController');

// Create a new flat
router.post('/', flatController.createFlat);
// Get all flats for a society
router.get('/society/:societyId', flatController.getFlatsBySociety);
// Delete a flat by id
router.delete('/:id', flatController.deleteFlat);
// Update a flat by id
router.put('/:id', flatController.updateFlat);

module.exports = router;
