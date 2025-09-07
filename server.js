const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const routes = require("./routes/results");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Setup Neon DB connection
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required by Neon
});

db.connect()
  .then(() => console.log("✅ Connected to Neon Postgres"))
  .catch((err) => console.error("❌ Connection error:", err.message));

// Use routes
app.use("/results", routes(db));

// Start server (for local dev)
if (require.main === module) {
  app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
}

// Export app (for Vercel serverless)
module.exports = app;
