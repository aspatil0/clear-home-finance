const sequelize = require('../config/db');

async function run() {
  try {
    console.log('Starting autoinvoices backfill...');
    // Fill missing tenantId/tenantName from societies
    const updateSql = `
      UPDATE autoinvoices a
      JOIN societies s ON a.societyId = s.id
      SET a.tenantId = COALESCE(a.tenantId, s.tenantId),
          a.tenantName = COALESCE(a.tenantName, s.name),
          a.createdBy = COALESCE(a.createdBy, s.email)
      WHERE a.tenantId IS NULL OR a.tenantName IS NULL OR a.createdBy IS NULL
    `;
    const [results, meta] = await sequelize.query(updateSql);
    // meta may contain affectedRows depending on the dialect/driver
    const affected = (meta && (meta.affectedRows ?? meta.changedRows)) ?? 'unknown';
    console.log('Rows updated:', affected);

    // Alter columns to NOT NULL (adjust length as needed)
    await sequelize.query(`ALTER TABLE autoinvoices MODIFY tenantId VARCHAR(255) NOT NULL`);
    await sequelize.query(`ALTER TABLE autoinvoices MODIFY tenantName VARCHAR(255) NOT NULL`);
    console.log('Altered autoinvoices columns to NOT NULL');

    console.log('Backfill completed.');
    process.exit(0);
  } catch (err) {
    console.error('Backfill error:', err);
    process.exit(1);
  }
}

run();
