// Importerar moduler
const express = require('express');
const router = express.Router();
const testController = require('../controllers/test.controller');
const verifyToken = require('../middlewares/authJwt');

// TEST-route
router.get('/test', verifyToken, testController.test);

// Exporterar router
module.exports = router;