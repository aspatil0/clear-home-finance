// Get all societies
exports.getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.findAll({ order: [['createdAt', 'DESC']] });
    res.json(societies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const Society = require('../models/Society');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getSociety = async (req, res) => {
  try {
    const { id } = req.params;
    const soc = await Society.findByPk(id);
    if (!soc) return res.status(404).json({ error: 'Society not found' });
    res.json(soc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateSociety = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;
    console.log(`[societyController] updateSociety called for id=${id} body=`, req.body);
    const soc = await Society.findByPk(id);
    if (!soc) return res.status(404).json({ error: 'Society not found' });
    if (name !== undefined) soc.name = name;
    if (address !== undefined) soc.address = address;
    await soc.save();
    res.json(soc);
  } catch (err) {
    console.error('[societyController] updateSociety error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createSociety = async (req, res) => {
  try {
    let { tenantId, uniqueSocietyId, email, name, address } = req.body;
    console.log('[createSociety] Incoming payload:', req.body);
    if (!email || !name) {
      return res.status(400).json({ error: 'email and name are required' });
    }
    // Auto-generate unique tenantId and uniqueSocietyId if not provided
    if (!tenantId) tenantId = 'tenant-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
    if (!uniqueSocietyId) uniqueSocietyId = 'soc-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
    console.log('[createSociety] Using values:', { tenantId, uniqueSocietyId, email, name, address });
    const soc = await Society.create({
      tenantId,
      uniqueSocietyId,
      email,
      name,
      address: address || ''
    });

    // Create admin user for this society
    const hashedPassword = await bcrypt.hash('society@admin123', 10);
    await User.create({
      email,
      password: hashedPassword,
      role: 'admin',
      societyId: soc.id,
      flatNumber: null
    });

    res.json(soc);
  } catch (err) {
    console.error('[createSociety] Error:', err);
    res.status(500).json({ error: err.message });
  }
};
