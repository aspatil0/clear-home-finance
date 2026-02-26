const express = require('express');
const router = express.Router();
const societyController = require('../controllers/societyController');

router.get('/:id', societyController.getSociety);
router.put('/:id', societyController.updateSociety);
router.post('/', societyController.createSociety);

module.exports = router;
