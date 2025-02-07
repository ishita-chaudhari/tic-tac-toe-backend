const express = require("express");
const { deleteGame } = require("../controllers/delete_controller");

const router = express.Router();
router.delete("/game/delete", deleteGame);

module.exports = router;
