const express = require("express");
const { getGame } = require("../controllers/get_controller");

const router = express.Router();
router.get("/game", getGame);

module.exports = router;
