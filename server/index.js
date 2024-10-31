const express = require('express');
const app = express();
const cors = require('cors');

const containerRoutes = require('./routes/containerRoutes');
const menuItemsRoutes = require("./routes/menuItemsRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const menuRoutes = require("./routes/menuRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use(cors());
app.use(express.json());

app.use("/api", containerRoutes);
app.use("/api", menuItemsRoutes);
app.use("/api", inventoryRoutes);
app.use("/api", menuRoutes);
app.use("/api", recipeRoutes);
app.use("/api", orderRoutes);


app.get("/", (req, res) => {
	res.send("Server is running.");
});

app.listen(5001, console.log(`Server started on PORT ${5001}`));

module.exports = app;