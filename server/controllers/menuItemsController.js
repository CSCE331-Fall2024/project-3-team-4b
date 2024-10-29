const pool = require("../config/dbConfig");

exports.getMenuItems = async (req, res) => {
	try {
		const result = await pool.query("SELECT * FROM menu_items");
		res.status(200).json(result.rows);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};
