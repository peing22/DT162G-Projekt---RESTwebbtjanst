// Importerar och konfigurerar dotenv
require('dotenv').config();

// Importerar moduler och routes
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');
const exerciseRoutes = require('./routes/exercise.routes');

// Skapar express-app
const app = express();

// Konfigurerar CORS
var corsOptions = {
    origin: process.env.CORS_ORIGIN.split(',')
};
app.use(cors(corsOptions));

// Gör det möjligt att tolka och hantera JSON-data
app.use(express.json());

// Gör det möjligt att tolka data skickad via URL-parametrar
app.use(express.urlencoded({ extended: true }));

// Lagrar URL till databas
const mongoString = process.env.DATABASE_URL;

// Ansluter till databas
mongoose.connect(mongoString);
const database = mongoose.connection;

// Skriver felmeddelande om anslutning misslyckas
database.on('error', (error) => {
    console.log(error)
});

// Skriver meddelande när databasen är ansluten
database.once('connected', () => {
    console.log('Databasen är ansluten');
});

// Använder routes
app.use(authRoutes);
app.use(exerciseRoutes);

// Gör det möjligt att komma åt filer i uploads-katalogen
app.use('/uploads', express.static('uploads'));

// Lagrar portnummer som servern ska lyssnar på
const PORT = process.env.PORT;

// Startar server och skriver ut meddelande
app.listen(PORT, () => {
    console.log(`Server startad på port ${PORT}`)
});
