// Importerar modul
const mongoose = require('mongoose');

// Definierar schemaobjekt för en övning
const exerciseSchema = new mongoose.Schema({
    exercisename: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    }
});

// Kompilerar schemaobjektet till ett model-objekt som exporteras
module.exports = mongoose.model('Exercise', exerciseSchema);