// Importerar moduler
const jwt = require('jsonwebtoken');
const { TokenExpiredError } = jwt;

// Middleware-funktion för att verifiera accessToken
verifyToken = (req, res, next) => {

    // Hämtar accessToken från headerinformationen i förfrågan
    let accessToken = req.headers['x-access-token'];

    // Om det inte finns någon accessToken skickas respons
    if (!accessToken) {
        return res.status(403).send({ message: 'Ingen accesstoken tillhandahållen!' });
    }

    // Verifierar accessToken med hjälp av jwt.verify-metoden
    jwt.verify(accessToken, process.env.TOKEN_SECRET, (err) => {

            // Om fel vid verifiering anropas catchError och vidare bearbetning av förfrågan stoppas
            if (err) {
                return catchError(err, res);
            }
            // Går vidare med bearbetning av förfrågan
            next();
        });
}

// Funktion för att hantera fel vid verifiering av accessToken
const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {

        // Skicker respons om accessToken har gått ut
        return res.status(401).send({ message: 'Obehörig! Accesstoken har gått ut!' });
    }
    // Skickar respons om felet beror på något annat
    return res.sendStatus(401).send({ message: 'Obehörig!' });
}

// Exporterar funktionen
module.exports = verifyToken;