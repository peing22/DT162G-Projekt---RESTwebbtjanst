// Importerar moduler
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Registrera en ny användare
router.post('/register', authController.register);

// Logga in en användare
router.post('/login', authController.login);

router.post('/refreshtoken', authController.refreshToken)

// Logga ut en användare
router.post('/logout/:id', authController.logout);

// Exporterar router
module.exports = router;