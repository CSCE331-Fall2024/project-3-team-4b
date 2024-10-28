const express = require('express');
const containerRoutes = require('./routes/containerRoutes');

const app = express;

app.use(express.json());
app.use('/api', containerRoutes);

module.exports = app;