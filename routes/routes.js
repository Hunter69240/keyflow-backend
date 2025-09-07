const express = require("express");

module.exports = (db) => {
  const router = express.Router();

  // POST /results → save typing result
  router.post("/", async (req, res) => {
    const { target, userTyped, correctWords, totalWords, accuracy, wpm } = req.body;
    console.log("Received body:", req.body);

    const sql = `
      INSERT INTO users (target, userTyped, correctWords, totalWords, accuracy, wpm)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    try {
      const result = await db.query(sql, [target, userTyped, correctWords, totalWords, accuracy, wpm]);
      res.status(201).json({ success: true, id: result.rows[0].id });
    } catch (err) {
      console.error("Error inserting data", err.message);
      res.status(500).json({ error: "Database error" });
    }
  });

  // GET /results → fetch all typing results
  router.get("/", async (req, res) => {
    try {
      const result = await db.query("SELECT * FROM users ORDER BY created_at DESC");
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching data", err.message);
      res.status(500).json({ error: "Database error" });
    }
  });

  return router;
};
