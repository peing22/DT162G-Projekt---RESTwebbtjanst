// Importerar moduler
const Exercise = require('../models/exercise.model');

// Funktion för att hämta alla övningar
const getExercises = async (req, res) => {
    try {
        // Hämtar alla övningar från databasen
        const exercises = await Exercise.find();

        // Skickar respons om övningar inte existerar
        if (exercises.length === 0) {
            return res.status(404).send({ message: 'Övningar kunde inte hittas' });
        }

        // Skickar respons i JSON-format
        res.json(exercises);

    } catch (error) {
        // Loggar error och skickar respons
        console.error('Fel vid hämtning av övningar:', error);
        res.status(500).send({ message: 'Ett fel uppstod vid hämtning av övningar' });
    }
}

// Funktion för att hämta en övning utifrån ID
const getExerciseById = async (req, res) => {
    try {
        // Hämtar övning från databasen baserat på ID
        const exercise = await Exercise.findById(req.params.id);

        // Skickar respons om övningen inte existerar
        if (!exercise) {
            return res.status(404).send({ message: 'Övningen kunde inte hittas' });
        }

        // Skickar respons i JSON-format
        res.json(exercise);

    } catch (error) {
        // Loggar error och skickar respons
        console.error('Fel vid hämtning av övning:', error);
        res.status(500).send({ message: 'Ett fel uppstod vid hämtning av övning' });
    }
}

// Funktion för att lägga till en övning med filuppladdning
const addExercise = async (req, res) => {
    try {
        // Skickar respons om nödvändig data inte finns i req.body
        if (!req.body.exercisename || !req.body.description) {
            return res.status(400).send({ message: 'Namn och beskrivning måste skickas med' });
        }

        // Kontrollera om filen finns i förfrågan
        const file = req.file;
        if (!file) {
            return res.status(400).send({ message: 'Videofil måste skickas med' });
        }

        // Skapar en ny övning med data från förfrågan
        const newExercise = new Exercise({
            exercisename: req.body.exercisename,
            description: req.body.description,
            filename: file.filename
        });

        // Sparar den nya övningen i databasen
        const savedExercise = await newExercise.save();

        // Skickar respons med den sparade övningen i JSON-format
        res.json(savedExercise);

    } catch (error) {
        // Loggar error och skickar respons
        console.error('Fel vid tillägg av övning:', error);
        res.status(500).send({ message: 'Ett fel uppstod vid tillägg av övning' });
    }
}

// Funktion för att uppdatera en övning utifrån ID
const updateExercise = async (req, res) => {
    try {
        // Skickar respons om nödvändig data inte finns i req.body
        if (!req.body.exercisename || !req.body.description) {
            return res.status(400).send({ message: 'Namn och beskrivning måste skickas med' });
        }

        // Hämtar befintlig övning från databasen
        const existingExercise = await Exercise.findById(req.params.id);

        // Skickar respons om övningen inte existerar
        if (!existingExercise) {
            return res.status(404).send({ message: 'Övningen kunde inte hittas' });
        }

        // Lagrar befintligt filenamn
        const filename = existingExercise.filename;

        // Uppdaterar övning i databasen baserat på ID med data från request body
        const updatedExercise = await Exercise.findByIdAndUpdate(
            req.params.id,
            {
                exercisename: req.body.exercisename,
                description: req.body.description,
                filename: filename
            },
            // Returnerar den uppdaterade övningen istället för den gamla
            { new: true } 
        );

        // Skickar respons med den uppdaterade övningen i JSON-format
        res.json(updatedExercise);

    } catch (error) {
        // Loggar error och skickar respons
        console.error('Fel vid uppdatering av övning:', error);
        res.status(500).send({ message: 'Ett fel uppstod vid uppdatering av övning' });
    }
}

// Funktion för att radera en övning utifrån ID
const deleteExercise = async (req, res) => {
    try {
        // Raderar övning från databasen baserat på ID
        const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);

        // Skickar respons om övningen inte existerar
        if (!deletedExercise) {
            return res.status(404).send({ message: 'Övningen kunde inte hittas' });
        }

        // Skickar respons med den raderade övningen i JSON-format
        res.json(deletedExercise);

    } catch (error) {
        // Loggar error och skickar respons
        console.error('Fel vid radering av övning:', error);
        res.status(500).send({ message: 'Ett fel uppstod vid radering av övning' });
    }
}

// Exporterar funktioner
module.exports = { getExercises, getExerciseById, addExercise, updateExercise, deleteExercise }