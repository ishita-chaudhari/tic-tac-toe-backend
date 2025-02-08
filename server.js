const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const game_routes = require("./route/game_routes");

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/api", game_routes);

// Root Route
app.get("/", (req, res) => {
    res.status(200).send("made by ishita");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
