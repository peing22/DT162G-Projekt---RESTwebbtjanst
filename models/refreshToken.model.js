// Importerar moduler
const mongoose = require('mongoose');
const config = require('../config/auth.config');
const { v4: uuidv4 } = require('uuid');

// Definierar schema-objekt för en förnyad token
const refreshTokenSchema = new mongoose.Schema({
    token: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    expiryDate: Date,
});

// Metod för att skapa en förnyad token
refreshTokenSchema.statics.createToken = async function (user) {
    
    // Skapar en ny instans av aktuell tid
    let expiredAt = new Date();

    // Adderar den tid som är specificerad i auth.config-filen
    expiredAt.setSeconds(
        expiredAt.getSeconds() + config.jwtRefreshExpiration
    );

    // Genererar en unik token
    let _token = uuidv4();

    // Skapar en instans av RefreshToken
    let _object = new this({
        token: _token,
        user: user._id,
        expiryDate: expiredAt.getTime(),
    });

    // Sparar objektet i databasen
    let refreshToken = await _object.save();

    // Returnerar den förnyade token
    return refreshToken.token;
}

// Metod för att verifiera när token går ut
refreshTokenSchema.statics.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
}

// Kompilerar schemaobjektet till ett model-objekt som exporteras
module.exports =  mongoose.model('RefreshToken', refreshTokenSchema);