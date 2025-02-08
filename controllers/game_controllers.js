const Game = require("../models/gameGrid");

// GET Game State
exports.getGame = async (req, res) => {
    try {
        let game = await Game.findOne();
        if (!game) {
            game = await Game.create({});
        }
        res.json({ gameState: game.gameState, currentPlayer: game.currentPlayer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST Reset Game
exports.resetGame = async (req, res) => {
    try {
        const newGameState = [["", "", ""], ["", "", ""], ["", "", ""]];
        let game = await Game.findOne();

        if (game) {
            game.gameState = newGameState;
            game.currentPlayer = "X";
            await game.save();
        } else {
            game = await Game.create({ gameState: newGameState, currentPlayer: "X" });
        }

        res.json({ message: "New game started!", gameState: game.gameState, currentPlayer: game.currentPlayer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT Make a Move
exports.makeMove = async (req, res) => {
    const { moves } = req.body;

    try {
        let game = await Game.findOne();
        if (!game) {
            return res.status(404).json({ message: "No active game found" });
        }

        for (let { row, col } of moves) {
            if (game.gameState[row][col] !== "") {
                return res.status(400).json({ message: `Cell at row ${row}, col ${col} is already occupied!` });
            }

            game.gameState[row][col] = game.currentPlayer;
            game.currentPlayer = game.currentPlayer === "X" ? "O" : "X";
        }

        await game.save();
        res.json({ message: "Moves made successfully!", gameState: game.gameState, currentPlayer: game.currentPlayer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE Game
exports.deleteGame = async (req, res) => {
    try {
        const result = await Game.deleteOne({});
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No game found to delete!" });
        }

        res.json({ message: "Game deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
