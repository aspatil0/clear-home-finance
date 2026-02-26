const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

router.get('/:societyId', maintenanceController.getConfig);
router.post('/:societyId', maintenanceController.updateConfig);

module.exports = router;
