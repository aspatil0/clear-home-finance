// src/controllers/file.controller.js
const { createFileRecord } = require('../services/fileMetadata.service');
const { saveFile } = require('../services/fileStorage.service');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');
const { FileRecord } = require('../models');
const { getFileStream } = require('../services/fileStorage.service');

exports.uploadFile = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    const tenantId = req.body.tenantId || 'default-tenant';
    const applicationId = req.body.applicationId || 'GENERIC';
    const module = req.body.module || null;
    const uploadedBy = req.body.uploadedBy || 'system';
    const tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    const checksum = req.body.checksum || null;

    // 1️⃣ Save file locally
    const storageMeta = await saveFile(file, tenantId, applicationId);

    // 2️⃣ Create DB metadata entry
    const record = await createFileRecord({
      tenantId,
      applicationId,
      module,
      originalName: file.originalname,
      storedName: storageMeta.storedName,
      mimeType: storageMeta.mimeType,
      size: storageMeta.size,
      storageEngine: 'local',
      storagePath: storageMeta.storagePath,
      uploadedBy,
      tags,
      checksum,
    });

    logger.info(`[FileController] File uploaded: ${file.originalname} → ${record.id}`);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileId: record.id,
        originalName: record.originalName,
        storedName: record.storedName,
        size: record.size,
        mimeType: record.mimeType,
        storageEngine: record.storageEngine,
        storagePath: record.storagePath,
      },
    });
  } catch (err) {
    logger.error(`[FileController] Upload error: ${err.message}`);
    next(err);
  }
};

// =============================
//  GET FILE METADATA
// =============================
exports.getFileMetadata = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const file = await FileRecord.findByPk(fileId);

    if (!file)
      return res.status(404).json({ success: false, message: 'File not found' });

    res.status(200).json({
      success: true,
      message: 'File metadata retrieved successfully',
      data: file,
    });
  } catch (err) {
    next(err);
  }
};

// =============================
//  DOWNLOAD FILE STREAM
// =============================
exports.downloadFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const file = await FileRecord.findByPk(fileId);

    if (!file)
      return res.status(404).json({ success: false, message: 'File not found' });
    if (file.status === 'DELETED')
      return res.status(410).json({ success: false, message: 'File no longer available' });

    const stream = getFileStream(file.storagePath);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.setHeader('Content-Type', file.mimeType);
    stream.pipe(res);
  } catch (err) {
    next(err);
  }
};

// =============================
//  LIST FILES (with optional filters)
// =============================
exports.listFiles = async (req, res, next) => {
  try {
    const { tenantId, applicationId, module, uploadedBy, status = 'ACTIVE' } = req.query;
    const where = {};

    if (tenantId) where.tenantId = tenantId;
    if (applicationId) where.applicationId = applicationId;
    if (module) where.module = module;
    if (uploadedBy) where.uploadedBy = uploadedBy;
    if (status) where.status = status;

    const { FileRecord } = require('../models');
    const files = await FileRecord.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'Files fetched successfully',
      count: files.length,
      data: files,
    });
  } catch (err) {
    next(err);
  }
};

// =============================
//  SOFT DELETE FILE
// =============================
exports.deleteFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const { FileRecord } = require('../models');

    const file = await FileRecord.findByPk(fileId);
    if (!file)
      return res.status(404).json({ success: false, message: 'File not found' });
    if (file.status === 'DELETED')
      return res.status(410).json({ success: false, message: 'File already deleted' });

    await file.update({ status: 'DELETED', updatedAt: new Date() });

    res.status(200).json({
      success: true,
      message: `File ${file.originalName} marked as deleted.`,
      data: file,
    });
  } catch (err) {
    next(err);
  }
};
