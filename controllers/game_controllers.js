const Game = require("../models/gameGrid");
const { checkout } = require("../route/game_routes");

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

// POST make a move only if the cell is empty
exports.makeMove = async (req, res) => {
    const { row, col } = req.body;

    try {
        let game = await Game.findOne();
        if (!game) {
            return res.status(404).json({ message: "No active game found" });
        }

        // to check if cell is occupied
        if (game.gameState[row][col] !== "") {
            return res.status(400).json({ message: `Cell at row ${row}, col ${col} is already occupied!` });
        }

        // make the move
        game.gameState[row][col] = game.currentPlayer;


        //check if the new move has lead to any winners or not\

        const gameStatus = checkGameStatus (game.gameState)
        if(gameStatus.winner){
            await game.deleteOne(); // deletes the game in case a winner is found 
            return res.json({
                 
                message: gameStatus.winner === "TIE" ? "Game is a tie!" : ` ${gameStatus.winner} won!!!`,
                gameState: game.gameState,
                winner: gameStatus.winner
            })
        }
        // switch from x to o or o to x 
        game.currentPlayer = game.currentPlayer === "X" ? "O" : "X";

        // save the state of the game
        await game.save();

        res.json({
            message: "Move made successfully!",
            gameState: game.gameState,
            currentPlayer: game.currentPlayer
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/*
// PUT to update any existing move
exports.updateMove = async (req, res) => {
    const { row, col, newSymbol } = req.body; // could be x or o

    try {
        let game = await Game.findOne();
        if (!game) {
            return res.status(404).json({ message: "No active game found" });
        }

        // check if we're inserting only x or o
        if (!["X", "O"].includes(newSymbol)) {
            return res.status(400).json({ message: "Invalid symbol. Use 'X' or 'O'." });
        }

        // to check if the cell already has a move or not
        if (game.gameState[row][col] === "") {
            return res.status(400).json({ message: `Cell at row ${row}, col ${col} is empty. Use POST to make a move.` });
        }

        // update/edit the move
        game.gameState[row][col] = newSymbol;

        // save game state
        await game.save();

        res.json({
            message: "Move updated successfully!",
            gameState: game.gameState
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};*/

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

const checkGameStatus = (gameState) => {
    // check rows and columns
    for (let i = 0; i < 3; i++) {
        if (gameState[i][0] !== "" && gameState[i][0] === gameState[i][1] && gameState[i][1] === gameState[i][2]) {
            return { winner: gameState[i][0] };
        }
        if (gameState[0][i] !== "" && gameState[0][i] === gameState[1][i] && gameState[1][i] === gameState[2][i]) {
            return { winner: gameState[0][i] };
        }
    }

    // check diagonals
    if (gameState[0][0] !== "" && gameState[0][0] === gameState[1][1] && gameState[1][1] === gameState[2][2]) {
        return { winner: gameState[0][0] };
    }
    if (gameState[0][2] !== "" && gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0]) {
        return { winner: gameState[0][2] };
    }

    // check for a tie (if the board is fully filled AND there is no winner)
    if (gameState.flat().every(cell => cell !== "")) {
        return { winner: "TIE" };
    }

    return { winner: null };
}
