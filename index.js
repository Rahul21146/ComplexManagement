const express = require("express");
const cors = require("cors");

const app = express();

require("dotenv").config();

const DBCONNECT = require("./config/db");

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

const route = require("./routes/route");

app.use("/kdcomplex/v1", route);

DBCONNECT();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});