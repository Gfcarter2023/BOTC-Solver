const express = require('express');
const cors = require('cors');
const fs = require('fs/promises'); // Use fs/promises for async file operations
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = "C:/Users/gmone/OneDrive/Documents/BOTC-Solver/Game/temp.json";

// Middleware
app.use(cors()); // Allows frontend running on a different port/domain to access the API
app.use(express.json()); // Allows the server to read JSON data sent in the request body

// --- Helper Function for File I/O ---

/** Reads the players data from the local JSON file. */
async function readPlayersData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data file:', error.message);
        // Return an empty array if the file is missing or corrupted
        return []; 
    }
}

/** Writes the updated players data back to the local JSON file. */
async function writePlayersData(players) {
    try {
        const data = JSON.stringify(players, null, 2); // 'null, 2' for pretty-printing
        await fs.writeFile(DATA_FILE, data, 'utf8');
    } catch (error) {
        console.error('Error writing data file:', error.message);
        throw new Error('Could not save data.');
    }
}

// --- API Endpoints ---

// 1. GET endpoint to fetch a single player's data by ID
app.get('/api/player/:id', async (req, res) => {
    const playerId = req.params.id;
    const players = await readPlayersData();
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

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Data file location: ${DATA_FILE}`);
});