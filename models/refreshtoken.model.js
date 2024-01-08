// Importerar moduler
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Definierar schema-objekt för en refreshToken
const refreshTokenSchema = new mongoose.Schema({
    token: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    expiryDate: Date,
});

// Metod för att skapa en refreshToken
refreshTokenSchema.statics.createToken = async function (user) {

    // Skapar en ny instans av aktuell tid och adderar 7200000 (2h)
    let expiredAt = new Date();
    expiredAt.setTime(expiredAt.getTime() + parseInt(process.env.JWT_REFRESH_EXPIRES_IN));

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

    // Returnerar refreshToken
    return refreshToken.token;
}

// Metod för att verifiera när refreshToken går ut
refreshTokenSchema.statics.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
}

// Kompilerar schemaobjektet till ett model-objekt som exporteras
module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
