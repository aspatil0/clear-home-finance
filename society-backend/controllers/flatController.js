const Flat = require('../models/Flat');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createFlat = async (req, res) => {
  try {
    const { flatNumber, ownerName, email, area, societyId } = req.body;
    const flat = await Flat.create({ flatNumber, ownerName, email, area, societyId });

    // If an email was provided, ensure a resident user exists for that email
    if (email) {
      const existing = await User.findOne({ where: { email } });
      if (!existing) {
        const defaultPassword = 'resident123';
        const hashed = await bcrypt.hash(defaultPassword, 10); //hash
        await User.create({
          email,
          password: hashed,
          role: 'resident',
          societyId: societyId || null,
          flatNumber: flatNumber || null
        });
      } else {
        // update society/flat mapping if missing
        let changed = false;
        if (!existing.societyId && societyId) {
          existing.societyId = societyId;
          changed = true;
        }
        if (!existing.flatNumber && flatNumber) {
          existing.flatNumber = flatNumber;
          changed = true;
        }
        if (changed) await existing.save();
      }
    }

    res.status(201).json(flat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getFlatsBySociety = async (req, res) => {
  try {
    const { societyId } = req.params;
    const flats = await Flat.findAll({ where: { societyId } });
    res.json(flats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteFlat = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Flat.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Flat deleted successfully' });
    } else {
      res.status(404).json({ error: 'Flat not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateFlat = async (req, res) => {
  try {
    const { id } = req.params;
    const { flatNumber, ownerName, email, area, societyId } = req.body;
    const [updated] = await Flat.update(
      { flatNumber, ownerName, email, area, societyId },
      { where: { id } }
    );
    if (!updated) return res.status(404).json({ error: 'Flat not found' });
    const updatedFlat = await Flat.findByPk(id);
    res.json(updatedFlat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
