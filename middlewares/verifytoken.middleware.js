// Importerar moduler
const jwt = require('jsonwebtoken');
const { TokenExpiredError } = jwt;

// Metod för att hantera fel vid verifiering av token
const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {

        // Skicker respons om token har gått ut
        return res.status(401).send({ message: 'Obehörig! Accesstoken har gått ut!' });
    }
    // Skickar respons om felet beror på något annat
    return res.sendStatus(401).send({ message: 'Obehörig!' });
}

// Middleware-funktion
verifyToken = (req, res, next) => {

    // Hämtar token från headerinformationen i förfrågan
    let token = req.headers['x-access-token'];

    // Om det inte finns någon token skickas respons
    if (!token) {
        return res.status(403).send({ message: 'Ingen accesstoken tillhandahållen!' });
    }

    // Verifierar token med hjälp av jwt.verify-metoden
    jwt.verify(token,
        process.env.TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return catchError(err, res);
            }

            // Lägg till användar-ID i förfrågan om token är giltig
            req.userId = decoded.id;
            next();
        });
};

// Exporterar funktionen
module.exports = verifyToken;