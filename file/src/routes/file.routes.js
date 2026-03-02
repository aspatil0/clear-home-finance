// src/routes/file.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // keep in memory
const fileController = require('../controllers/file.controller');

// Upload file
router.post('/upload', upload.single('file'), fileController.uploadFile);

// Get file metadata
router.get('/:fileId', fileController.getFileMetadata);

// Download file
router.get('/:fileId/download', fileController.downloadFile);

// List files with filters
router.get('/', fileController.listFiles);

// Soft delete a file
router.delete('/:fileId', fileController.deleteFile);



module.exports = router;
