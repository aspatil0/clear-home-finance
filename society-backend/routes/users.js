const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const User = require('../models/User');

// GET /users?role=resident&societyId=123
router.get('/', async (req, res) => {
  try {
    const { role, societyId } = req.query;
    const where = {};
    if (role) where.role = role;
    if (societyId) where.societyId = societyId;
    const users = await User.findAll({ where });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
