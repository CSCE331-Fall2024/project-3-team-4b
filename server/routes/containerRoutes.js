const express = require('express');
const { getAllContainerData } = require('../controllers/containerController');

const router = express.Router();

router.get('/containers', getAllContainerData);

module.exports = router;