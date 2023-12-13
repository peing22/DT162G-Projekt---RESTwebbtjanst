// Importerar moduler
const User = require('../models/user.model');
const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Exporterar funktion för att registrera en användare
exports.register = async (req, res) => {

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

// Exporterar funktion för att logga in en användare
exports.login = async (req, res) => {

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

        // Skickar respons om lösanordet inte är giltigt
        if (!passwordIsValid) {
            return res.status(401).send({ message: "Felaktigt lösenord" });
        }

        // Genererar en token för användaren
        const token = jwt.sign({ id: user.id },
            config.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 7200, // 2 timmar
            });

        // Sparar token i session för att användas vid senare förfrågan
        req.session.token = token;

        // Skickar respons med användarinformation
        return res.status(200).send({
            message: "Inloggad",
            id: user._id,
            username: user.username
        });

    } catch (err) {
        // Loggar error och skickar respons
        console.error('Fel vid inloggning:', err);
        return res.status(500).send({ message: "Ett fel uppstod vid inloggning" });
    }
}

// Exporterar funktion för att logga ut en användare
exports.logout = async (req, res) => {
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
};