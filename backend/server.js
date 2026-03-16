require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/requests", require("./routes/request.routes"));
app.use("/api/services", require("./routes/service.routes")); 
app.use("/api/users", require("./routes/user.routes"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
