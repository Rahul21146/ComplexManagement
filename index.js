const express = require("express");
const cors = require("cors");


const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

const app = express();

require("dotenv").config();

const DBCONNECT = require("./config/db");

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
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