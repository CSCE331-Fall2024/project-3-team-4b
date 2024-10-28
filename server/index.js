const express = require('express');
const app = express();
const cors = require('cors');
const containerRoutes = require('./routes/containerRoutes');

app.use(cors());

app.use('/api', containerRoutes);

app.get("/", (req, res) => {
    res.send("Server is running.");
});

app.listen(5000, console.log(`Server started on PORT ${5000}`));

module.exports = app;