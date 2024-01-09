// Importerar moduler
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Definierar schemaobjekt för en refreshToken
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
    let expiresIn = new Date();
    expiresIn.setTime(expiresIn.getTime() + parseInt(process.env.REFRESHTOKEN_EXPIRES_IN));

    // Genererar en unik refreshToken
    let refreshToken = uuidv4();

    // Skapar en instans av RefreshToken-objektet
    let object = new this({
        token: refreshToken,
        user: user._id,
        expiryDate: expiresIn.getTime(),
    });

    // Sparar objektet i databasen och lagrar det i en variabel
    let refreshTokenObj = await object.save();

    // Returnerar refreshToken
    return refreshTokenObj.token;
}

// Metod för att verifiera när refreshToken går ut
refreshTokenSchema.statics.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
}

// Kompilerar schemaobjektet till ett model-objekt som exporteras
module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
