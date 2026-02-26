const Society = require('../models/Society');

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
    const { name, address } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const soc = await Society.create({ name, address: address || '' });
    res.json(soc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
