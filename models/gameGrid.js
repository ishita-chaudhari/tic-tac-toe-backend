const Game = require("../models/gameGrid");

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
