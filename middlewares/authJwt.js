// Importerar moduler
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

// Middleware-funktion
verifyToken = (req, res, next) => {

    // Hämtar token från sessionsvariabeln i förfrågan
    let token = req.session.token;

    // Om det inte finns någon token skickas respons
    if (!token) {
        return res.status(403).send({ message: "Ingen token tillhandahållen!" });
    }

    // Verifierar token med hjälp av jwt.verify-metoden
    jwt.verify(token,
        config.secret,
        (err, decoded) => {
            if (err) {
                return res.status(401).send({ message: "Unauthorized!" });
            }

            // Lägg till användar-ID i förfrågan om token är giltig
            req.userId = decoded.id;
            next();
        });
};

// Exporterar funktionen
module.exports = verifyToken;