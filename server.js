const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Import Routes
const getGameRoute = require("./routes/get_route");
const resetGameRoute = require("./routes/post_route");
const moveGameRoute = require("./routes/put_route");
const deleteGameRoute = require("./routes/delete_route");

dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use("/api", get_route);
app.use("/api", post_route);
app.use("/api", put_route);
app.use("/api", delete_route);


app.get("/", (req, res) => {
    res.status(200).send("made by ishita");
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
