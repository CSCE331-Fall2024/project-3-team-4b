const express = require('express');
const {getAllMenuData } = require('../controllers/menuController');

const router = express.Router();

router.get('/menu', getAllMenuData);

module.exports = router;