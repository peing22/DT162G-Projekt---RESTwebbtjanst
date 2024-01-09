// Importerar moduler
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verifyToken = require('../middlewares/verifytoken.middleware');

// Registrera en ny användare (skyddad av JWT)
router.post('/register', verifyToken, authController.register);

// Logga in en användare
router.post('/login', authController.login);

// Förnya JWT
router.post('/refreshtoken', authController.refreshToken)

// Logga ut en användare
router.post('/logout/:id', authController.logout);

// Exporterar router
module.exports = router;