const pool = require('../config/dbConfig');

exports.getAllContainerData = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM container');
    res.json({'title':'Containers', 'body': result.rows});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};