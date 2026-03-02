// src/services/fileMetadata.service.js
const { FileRecord } = require('../models');
const logger = require('../utils/logger');

/**
 * Create file metadata entry in DB
 */
async function createFileRecord({
  tenantId,
  applicationId,
  module,
  originalName,
  storedName,
  mimeType,
  size,
  storageEngine,
  storagePath,
  uploadedBy,
  tags,
  checksum,
}) {
  const record = await FileRecord.create({
    tenantId,
    applicationId,
    module,
    originalName,
    storedName,
    mimeType,
    size,
    storageEngine,
    storagePath,
    uploadedBy,
    tags,
    checksum,
  });

  logger.info(`[FileMetadata] Created record ${record.id} (${originalName})`);
  return record;
}

module.exports = { createFileRecord };
