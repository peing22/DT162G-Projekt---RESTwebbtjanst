// Importerar moduler
const jwt = require('jsonwebtoken');
const { TokenExpiredError } = jwt;

// Metod för att hantera fel vid verifiering av token
const catchError = (err, res) => {
    if (err instanceof TokenExpiredError) {

        // Skicker respons om accessToken har gått ut
        return res.status(401).send({ message: 'Obehörig! Accesstoken har gått ut!' });
    }
    // Skickar respons om felet beror på något annat
    return res.sendStatus(401).send({ message: 'Obehörig!' });
}

// Middleware-funktion
verifyToken = (req, res, next) => {

    // Hämtar accessToken från headerinformationen i förfrågan
    let token = req.headers['x-access-token'];

    // Om det inte finns någon accessToken skickas respons
    if (!token) {
        return res.status(403).send({ message: 'Ingen accesstoken tillhandahållen!' });
    }

    // Verifierar accessToken med hjälp av jwt.verify-metoden
    jwt.verify(token,
        process.env.TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return catchError(err, res);
            }

            // Lägg till användar-ID i förfrågan om accessToken är giltig
            req.userId = decoded.id;
            next();
        });
};

// Exporterar funktionen
module.exports = verifyToken;