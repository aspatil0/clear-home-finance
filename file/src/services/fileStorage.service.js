// src/services/fileStorage.service.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const STORAGE_ROOT = process.env.STORAGE_ROOT || path.join(__dirname, '../../uploads');

/**
 * Ensure tenant-specific directory exists.
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Save a file locally.
 * Returns metadata like storedName, storagePath, and size.
 */
async function saveFile(file, tenantId, applicationId) {
  const tenantDir = path.join(STORAGE_ROOT, tenantId, applicationId);
  ensureDir(tenantDir);

  const storedName = `${uuidv4()}-${file.originalname}`;
  const storagePath = path.join(tenantDir, storedName);

  await fs.promises.writeFile(storagePath, file.buffer);
  const stats = fs.statSync(storagePath);

  logger.info(`[FileStorage] Saved ${storedName} (${stats.size} bytes)`);

  return {
    storedName,
    storagePath,
    size: stats.size,
    mimeType: file.mimetype,
  };
}

/**
 * Get file as a readable stream.
 */
function getFileStream(storagePath) {
  return fs.createReadStream(storagePath);
}

/**
 * Delete file (soft delete at metadata level usually).
 */
async function deleteFile(storagePath) {
  if (fs.existsSync(storagePath)) {
    await fs.promises.unlink(storagePath);
    logger.warn(`[FileStorage] Deleted file ${storagePath}`);
  }
}

module.exports = {
  saveFile,
  getFileStream,
  deleteFile,
};
