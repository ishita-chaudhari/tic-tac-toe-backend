const Game = require("../models/gameGrid");

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
