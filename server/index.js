const express = require('express');
const app = express();
const cors = require('cors');
const containerRoutes = require('./routes/containerRoutes');
const inventoryRoutes = require("./routes/inventoryRoutes");

app.use(cors());
app.use(express.json());

app.use("/api", containerRoutes);
app.use("/api", inventoryRoutes);

app.get("/", (req, res) => {
	res.send("Server is running.");
});

app.listen(5001, console.log(`Server started on PORT ${5001}`));

module.exports = app;