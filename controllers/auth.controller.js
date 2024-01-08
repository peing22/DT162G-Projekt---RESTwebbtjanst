// Importerar moduler
const User = require('../models/user.model');
const RefreshToken = require('../models/refreshtoken.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Funktion för att registrera en användare
const register = async (req, res) => {

    try {
        // Kontrollerar att användarnamn och lösenord är angivna
        if (!req.body.username || !req.body.password) {
            return res.status(400).send({ message: 'Ange användarnamn och lösenord!' });
        }

        // Skapar en ny användarinstans med hashat lösenord
        const user = new User({
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, 8)
        });
        // Sparar användaren i databasen
        const savedUser = await user.save();

        // Skickar respons vid lyckad registrering
        return res.send({ message: 'Lyckad registrering!' });

    } catch (err) {
        // Loggar error och skickar respons
        console.error('Fel vid registrering:', err);
        return res.status(500).send({ message: 'Ett fel uppstod vid registrering!' });
    }
}

// Funktion för att logga in en användare
const login = async (req, res) => {

    try {
        // Kontrollerar att användarnamn och lösenord är angivna
        if (!req.body.username || !req.body.password) {
            return res.status(400).send({ message: 'Ange användarnamn och lösenord!' });
        }

        // Söker efter användare i databasen
        const user = await User.findOne({ username: req.body.username });

        // Skickar respons om användaren inte kan hittas
        if (!user) {
            return res.status(404).send({ message: 'Felaktigt användarnamn!' });
        }

        // Jämför det angivna lösenordet med det lagrade hash-värdet
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        // Skickar respons om lösenordet inte är giltigt
        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Felaktigt lösenord!' });
        }

        // Genererar en accessToken för användaren
        let token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        // Genererar en refreshToken för användaren
        let refreshToken = await RefreshToken.createToken(user);

        // Skickar respons med användarinformation, accessToken och refreshToken
        return res.status(200).send({
            id: user._id,
            username: user.username,
            accessToken: token,
            refreshToken: refreshToken
        });

    } catch (err) {
        // Loggar error och skickar respons
        console.error('Fel vid inloggning:', err);
        return res.status(500).send({ message: 'Ett fel uppstod vid inloggning!' });
    }
}

// Funktion för att hantera en refreshToken
const refreshToken = async (req, res) => {

    // Lagrar refreshToken från förfrågan i variabeln requestToken
    const requestToken = req.body.refreshToken;

    // Skickar respons om requestToken är null
    if (requestToken == null) {
        return res.status(403).json({ message: 'Refreshtoken krävs!' });
    }

    try {
        // Lagrar refreshToken om requestToken existerar som token i databasen
        let refreshToken = await RefreshToken.findOne({ token: requestToken });

        // Skickar respons om refreshToken är null
        if (!refreshToken) {
            res.status(403).json({ message: 'Behörighet att administrera saknas!' });
            return;
        }

        // Raderar refreshToken från databasen och skickar respons om refreshToken har förlorat sin giltighetstid
        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.findOneAndDelete({ _id: refreshToken._id }).exec();
            res.status(403).json({ message: 'Behörighet att administrera har upphört. Logga ut och logga in på nytt!' });
            return;
        }

        // Genererar en ny accessToken baserat på användarens ID
        let newAccessToken = jwt.sign({ id: refreshToken.user._id }, process.env.TOKEN_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN, });

        // Returnerar ny accessToken och refreshToken som respons
        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token
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
        // Skickar respons om användar-ID saknas i URL:en
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).send({ message: 'Användar-ID måste skickas med!' });
        }

        // Skickar respons om användaren inte existerar i databasen
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return res.status(404).send({ message: 'Användaren finns inte i databasen!' });
        }

        // Tar bort refreshToken från databasen baserat på användarens ID
        await RefreshToken.findOneAndDelete({ user: userId }).exec();

        // Skickar respons att användaren är utloggad
        return res.status(200).send({ message: 'Utloggad!' });

    } catch (err) {
        // Loggar error och skickar respons
        console.error('Fel vid utloggning:', err);
        return res.status(500).send({ message: 'Ett fel uppstod vid utloggning!' });
    }
}

// Exporterar funktioner
module.exports = { register, login, refreshToken, logout }