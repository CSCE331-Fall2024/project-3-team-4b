const express = require('express');
const app = express();
const cors = require('cors');
const containerRoutes = require('./routes/containerRoutes');
const inventoryRoutes = require("./routes/inventoryRoutes");
const menuRoutes = require("./routes/menuRoutes");

app.use(cors());
app.use(express.json());

app.use("/api", containerRoutes);
app.use("/api", inventoryRoutes);
app.use("/api", menuRoutes);

app.get("/", (req, res) => {
	res.send("Server is running.");
});

app.listen(5001, console.log(`Server started on PORT ${5001}`));

module.exports = app;