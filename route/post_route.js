const express = require("express");
const { resetGame } = require("../controllers/post_controller");

const router = express.Router();
router.post("/game/reset", resetGame);

module.exports = router;
