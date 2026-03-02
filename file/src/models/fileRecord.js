// src/models/FileRecord.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  /**
   * FileRecord
   * ----------
   * Represents metadata for any uploaded file in the system.
   * This is a generic table that supports multiple applications & tenants.
   */
  const FileRecord = sequelize.define('FileRecord', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      comment: 'Unique file identifier',
    },

    tenantId: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: 'Tenant identifier (multi-tenant isolation)',
    },

    applicationId: {
      type: DataTypes.STRING(64),
      allowNull: false,
      comment: 'Owning application (e.g., PAYPLATTER, EDURASHI, etc.)',
    },

    module: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: 'Optional module name (e.g., INVOICE, PAYMENT, HRMS)',
    },

    originalName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Original file name uploaded by user',
    },

    storedName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Unique system-generated file name for storage',
    },

    mimeType: {
      type: DataTypes.STRING(128),
      allowNull: false,
      comment: 'MIME type of uploaded file',
    },

    size: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: 'File size in bytes',
    },

    storageEngine: {
      type: DataTypes.ENUM('local', 's3', 'minio'),
      allowNull: false,
      defaultValue: 'local',
      comment: 'Where the file is stored',
    },

    storagePath: {
      type: DataTypes.STRING(512),
      allowNull: false,
      comment: 'Full path or URI to stored file',
    },

    checksum: {
      type: DataTypes.STRING(128),
      allowNull: true,
      comment: 'Optional hash for data integrity verification',
    },

    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Arbitrary tags or labels for search/filtering',
    },

    uploadedBy: {
      type: DataTypes.STRING(64),
      allowNull: true,
      comment: 'User ID who uploaded the file',
    },

    status: {
      type: DataTypes.ENUM('ACTIVE', 'DELETED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
      comment: 'Soft delete flag for file lifecycle management',
    },
  }, {
    tableName: 'file_records',
    timestamps: true,  // createdAt, updatedAt
    indexes: [
      { fields: ['tenantId', 'applicationId'] },
      { fields: ['module'] },
      { fields: ['status'] },
    ],
  });

  return FileRecord;
};
