const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/MMA")
.then(() => console.log("MongoDB connected"));

app.use("/api/auth", authRoutes);
app.use("/api/request", requestRoutes); // FIX

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
