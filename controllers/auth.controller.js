// Importerar moduler
const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Funktion för att registrera en användare
const register = async (req, res) => {

    try {
        // Kontrollerar att användarnamn och lösenord är angivna
        if (!req.body.username || !req.body.password) {
            return res.status(400).send({ message: "Användarnamn och lösenord måste anges" });
        }

        // Skapar en ny användarinstans med hashat lösenord
        const user = new User({
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, 8)
        });
        // Sparar användaren i databasen
        const savedUser = await user.save();

        // Skickar respons vid lyckad registrering
        return res.send({ message: "Lyckad registrering" });

    } catch (err) {
        // Loggar error och skickar respons
        console.error('Fel vid registrering:', err);
        return res.status(500).send({ message: "Ett fel uppstod vid registrering" });
    }
}

// Funktion för att logga in en användare
const login = async (req, res) => {

    try {
        // Kontrollerar att användarnamn och lösenord är angivna
        if (!req.body.username || !req.body.password) {
            return res.status(400).send({ message: "Användarnamn och lösenord måste anges" });
        }

        // Söker efter användare i databasen
        const user = await User.findOne({ username: req.body.username });

        // Skickar respons om användaren inte kan hittas
        if (!user) {
            return res.status(404).send({ message: "Användaren kunde inte hittas" });
        }

        // Jämför det angivna lösenordet med det lagrade hash-värdet
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        // Sätter access token till null och skickar respons om lösanordet inte är giltigt
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Felaktigt lösenord"
            });
        }

        // Genererar en access token för användaren
        let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: config.jwtExpiration });

        // Genererar en förnyad token för användaren
        let refreshToken = await RefreshToken.createToken(user);

        // Skickar respons med användarinformation och tokens
        return res.status(200).send({
            id: user._id,
            username: user.username,
            accessToken: token,
            refreshToken: refreshToken
        });

    } catch (err) {
        // Loggar error och skickar respons
        console.error('Fel vid inloggning:', err);
        return res.status(500).send({ message: "Ett fel uppstod vid inloggning" });
    }
}

// Funktion för att hantera en förnyelse av access token
const refreshToken = async (req, res) => {

    // Hämtar refreshToken från förfrågan
    const { refreshToken: requestToken } = req.body;

    // Skickar respons om requestToken är null
    if (requestToken == null) {
        return res.status(403).json({ message: "Förnyad token krävs!" });
    }

    try {
        // Hämtar refreshToken från databasen
        let refreshToken = await RefreshToken.findOne({ token: requestToken });

        // Skickar respons om refreshToken saknas i databasen
        if (!refreshToken) {
            res.status(403).json({ message: "Förnyad token saknas i databasen!" });
            return;
        }

        // Raderar refreshToken från databasen och skickar respons om refreshToken har förlorat sin giltighetstid
        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.findOneAndDelete(refreshToken._id, { useFindAndModify: false }).exec();
            res.status(403).json({
                message: "Förnyad token har åtgått. Logga in på nytt!",
            });
            return;
        }

        // Genererar en ny access token baserat på användarens ID
        let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        // Returnerar ny access token och refreshToken som respons
        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        // Felhantering om något går fel under processen
        console.error('Fel vid förnyelse av token:', err);
        return res.status(500).send({ message: err.message });
    }
}

// Funktion för att logga ut en användare
const logout = async (req, res) => {
    try {
        // Sätter sessionen till null för att logga ut användaren
        req.session = null;

        // Skickar respons att användaren är utloggad
        return res.status(200).send({ message: "Utloggad" });

    } catch (err) {
        // Loggar error och skickar respons
        console.error('Fel vid utloggning:', err);
        return res.status(500).send({ message: "Ett fel uppstod vid utloggning" });
    }
}

// Exporterar funktioner
module.exports = { register, login, refreshToken, logout }