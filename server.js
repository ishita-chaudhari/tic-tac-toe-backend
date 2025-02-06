const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json()); // for express to read json file

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(" MongoDB connection error:", err));

// 2-D array for game grid
const gameSchema = new mongoose.Schema({
    gameState: { type: [[String]], default: [["", "", ""],
                                             ["", "", ""],
                                             ["", "", ""]] },
    currentPlayer: { type: String, default: "X" }
});

const Game = mongoose.model("Game", gameSchema);

// GET Request
app.get("/api/game", async (req, res) => {
    try {
        let game = await Game.findOne();
        if (!game) {
            game = await Game.create({});
        }
        res.json({ gameState: game.gameState, currentPlayer: game.currentPlayer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST Request
app.post("/api/game/reset", async (req, res) => {
    try {
        // new blank grid
        const newGameState = [["", "", ""], ["", "", ""], ["", "", ""]];

        let game = await Game.findOne();
        if (game) {
            // to reset game
            game.gameState = newGameState;
            game.currentPlayer = "X";
            await game.save();
        } else {
            // in case there is no current game, create a new one
            game = await Game.create({ gameState: newGameState, currentPlayer: "X" });
        }

        res.json({ message: "New game started!", gameState: game.gameState, currentPlayer: game.currentPlayer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/api/game/move", async (req, res) => {
    const { moves } = req.body; // puts a new move inside the body of the array

    try {
        let game = await Game.findOne();
        if (!game) {
            return res.status(404).json({ message: "No active game found" });
        }

        
        for (let { row, col } of moves) {
            // see if the move is valid
            if (game.gameState[row][col] !== "") {
                return res.status(400).json({ message: `Cell at row ${row}, col ${col} is already occupied!` });
            }

            // update the move on grid
            game.gameState[row][col] = game.currentPlayer;

            // switch from x to o or o to x
            game.currentPlayer = game.currentPlayer === "X" ? "O" : "X";
        }

        // save the new grid positions
        await game.save();

        res.json({ message: "Moves made successfully!", gameState: game.gameState, currentPlayer: game.currentPlayer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//DELETE
app.delete("/api/game/delete", async (req, res) => {
    try {
        const result = await Game.deleteOne({});
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No game found to delete!" });
        }

        res.json({ message: "Game deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.status(200).send('made by ishita');
  });
// starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
