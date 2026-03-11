const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/MMA")
.then(() => console.log("MongoDB connected"));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/requests", require("./routes/request.routes"));
app.use("/api/services", require("./routes/service.routes")); 
app.use("/api/users", require("./routes/user.routes"));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
