const Game = require("../models/gameGrid");

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
