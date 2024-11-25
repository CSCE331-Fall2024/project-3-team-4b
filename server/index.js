const express = require('express');
const app = express();
const cors = require('cors');

const containerRoutes = require('./routes/containerRoutes');
const menuItemsRoutes = require("./routes/menuItemsRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const menuRoutes = require("./routes/menuRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const orderRoutes = require("./routes/orderRoutes");
const employeesRoutes = require("./routes/employeesRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const authenticationRoutes = require("./routes/authenticationRoutes");
const orderItemsRoutes = require("./routes/orderItemsRoutes");

const allowedOrigins = [
	"http://localhost:3000",
	"https://project-3-team-4b-client.vercel.app",
	"http://localhost:5001",
];


const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api", containerRoutes);
app.use("/api", menuItemsRoutes);
app.use("/api", inventoryRoutes);
app.use("/api", menuRoutes);
app.use("/api", recipeRoutes);
app.use("/api", orderRoutes);
app.use("/api", employeesRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", authenticationRoutes);
app.use("/api", orderItemsRoutes);


app.get("/", (req, res) => {
	res.send("Server is running.");
});

app.listen(5001, console.log(`Server started on PORT ${5001}`));

module.exports = app;