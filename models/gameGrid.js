const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    gameState: { 
        type: [[String]], 
        default: [["", "", ""], ["", "", ""], ["", "", ""]] 
    },
    currentPlayer: { type: String, default: "X" }
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;

