// Importerar moduler
const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exercise.controller');
const verifyToken = require('../middlewares/verifytoken.middleware');
const multer = require("multer");

// Konfigurerar lagring av filer i katalogen uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}${file.originalname}`);
    }
});
const upload = multer({ storage });

// Hämta alla övningar
router.get('/exercises', exerciseController.getExercises);

// Hämta en övning utifrån ID (skyddad av token)
router.get('/exercises/:id', verifyToken, exerciseController.getExerciseById);

// Lägg till övning (skyddad av token)
router.post('/exercises', verifyToken, upload.single('filename'), exerciseController.addExercise);

// Uppdatera en övning utifrån ID (skyddad av token)
router.put('/exercises/:id', verifyToken, exerciseController.updateExercise);

// Radera en övning utifrån ID (skyddad av token)
router.delete('/exercises/:id', verifyToken, exerciseController.deleteExercise);

// Exporterar router
module.exports = router;