const express = require("express");
const { getGame, resetGame, makeMove, deleteGame } = require("../controllers/game_controllers");

const router = express.Router();

router.get("/game", getGame);
router.post("/game/reset", resetGame);
router.put("/game/move", makeMove);
router.delete("/game/delete", deleteGame);

module.exports = router;

