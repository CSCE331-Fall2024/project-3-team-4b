const pool = require('../config/dbConfig');

// Fetch all container data
exports.getAllContainerData = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM container');
    res.json({ title: 'Containers', body: result.rows });
  } catch (error) {
    console.error("Error fetching container data:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create a new container entry
exports.createContainer = async (req, res) => {
  const { name, type, capacity } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO container (name, type, capacity) VALUES ($1, $2, $3) RETURNING *',
      [name, type, capacity]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating container:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a container by ID
exports.updateContainer = async (req, res) => {
  const { id } = req.params;
  const { name, type, capacity } = req.body;
  try {
    const result = await pool.query(
      'UPDATE container SET name = $1, type = $2, capacity = $3 WHERE container_id = $4 RETURNING *',
      [name, type, capacity, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Container not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating container:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a container by ID
exports.deleteContainer = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM container WHERE container_id = $1',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Container not found" });
    }
    res.json({ message: "Container deleted successfully" });
  } catch (error) {
    console.error("Error deleting container:", error);
    res.status(500).json({ error: error.message });
  }
};
