const express = require("express");
const { makeMove } = require("../controllers/put_controller");

const router = express.Router();
router.put("/game/move", makeMove);

module.exports = router;
