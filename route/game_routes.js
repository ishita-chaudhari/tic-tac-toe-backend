const express = require("express");
const { getGame, /*updateGame,*/makeMove, deleteGame } = require("../controllers/game_controllers");

const router = express.Router();

router.get("/game", getGame);
router.post("/game/move", makeMove);
//router.put("/game/move", updateMove);
router.delete("/game/delete", deleteGame);

module.exports = router;

