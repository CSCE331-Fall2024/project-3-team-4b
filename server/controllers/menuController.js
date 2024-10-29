const pool = require('../config/dbConfig');

exports.getAllMenuData = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};