const Game = require("../models/gameGrid");

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
