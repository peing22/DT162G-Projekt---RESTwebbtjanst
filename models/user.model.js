// Importerar modul
const mongoose = require('mongoose');

// Definierar schemaobjekt för en användare
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Kompilerar schemaobjektet till ett model-objekt som exporteras
module.exports = mongoose.model('User', userSchema);