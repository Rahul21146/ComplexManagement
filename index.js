const express = require("express");
const cors = require("cors");
const dns = require("dns");

require("dotenv").config();

// =====================================================
// DNS
// =====================================================

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

// =====================================================
// APP
// =====================================================

const app = express();

// =====================================================
// PORT
// =====================================================

const port = process.env.PORT || 3000;

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());

// =====================================================
// DATABASE
// =====================================================

const DBCONNECT = require("./config/db");

// =====================================================
// ROUTES
// =====================================================

const route = require("./routes/route");

app.use("/kdcomplex/v1", route);

// =====================================================
// DATABASE CONNECTION + SERVER
// =====================================================

DBCONNECT();

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});