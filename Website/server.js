const express = require('express');
const cors = require('cors');
const fs = require('fs/promises'); // Use fs/promises for async file operations
const path = require('path');

const app = express();
const PORT = 3000;


// Middleware
app.use(cors()); // Allows frontend running on a different port/domain to access the API
app.use(express.json()); // Allows the server to read JSON data sent in the request body

// --- Helper Function for File I/O ---

/** Reads the players data from the local JSON file. */
async function readPlayersData(fileName) {
    const filePath = path.join("C:/Users/gmone/OneDrive/Documents/BOTC-Solver/Game", fileName);
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Log a warning if the file doesn't exist, but don't crash
        if (error.code !== 'ENOENT') {
            console.error(`Error reading data file ${fileName}:`, error.message);
        }
        return []; 
    }
}

/** Writes the updated players data back to the local JSON file. */
async function writePlayersData(players, fileName) {
    const filePath = path.join("C:/Users/gmone/OneDrive/Documents/BOTC-Solver/Game", fileName);
    try {
        const data = JSON.stringify(players, null, 2); 
        await fs.writeFile(filePath, data, 'utf8');
    } catch (error) {
        console.error(`Error writing data file ${fileName}:`, error.message);
        throw new Error(`Could not save data to ${fileName}.`);
    }
}

// --- API Endpoints ---

// 1. GET endpoint to fetch a single player's data by ID
app.get('/api/player/:id', async (req, res) => {
    const playerId = req.params.id;
    // ⭐ NEW: Get the file name from the query string
    const fileName = req.query.file; 

    if (!fileName) {
        return res.status(400).json({ message: 'Missing file parameter.' });
    }

    // Pass the file name to the read function
    const players = await readPlayersData(fileName); 
    const player = players.find(p => p.id === playerId);

    if (player) {
        res.json(player);
    } else {
        res.status(404).json({ message: 'Player not found' });
    }
});

// 2. POST endpoint to update a player's data
app.post('/api/player/:id', async (req, res) => {
    const playerId = req.params.id;
    const newPlayerData = req.body;
    
    // Simple validation
    if (!newPlayerData.name || newPlayerData.score === undefined) {
        return res.status(400).json({ message: 'Missing required fields (name or score)' });
    }

    try {
        const players = await readPlayersData();
        const index = players.findIndex(p => p.id === playerId);

        if (index !== -1) {
            // Update the player object, preserving the ID
            players[index] = { ...players[index], ...newPlayerData };
            
            await writePlayersData(players);
            res.json({ message: 'Player updated successfully', player: players[index] });
        } else {
            res.status(404).json({ message: 'Player not found for update' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during update' });
    }
});

app.post('/api/players/create', async (req, res) => {
    const newPlayersArray = req.body;
    // ⭐ NEW: Get the file name from the query string
    const fileName = req.query.file; 
    
    if (!fileName) {
        return res.status(400).json({ message: 'Missing required file parameter in query string.' });
    }
    if (!Array.isArray(newPlayersArray)) {
        return res.status(400).json({ message: 'Request body must be an array of players.' });
    }

    try {
        // Pass the file name to the write function
        await writePlayersData(newPlayersArray, fileName); 
        
        res.status(201).json({ 
            message: `New players created and saved to ${fileName}.`,
            fileName: fileName 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error: Could not write new player data.' });
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // console.log(`Data file location: ${DATA_FILE}`);
});