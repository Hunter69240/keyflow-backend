const express = require('express');

module.exports = (db) => {
    const router = express.Router();

    // POST /results → save typing result
    router.post('/', (req, res) => {
        const { target, userTyped, correctWords, totalWords, accuracy, wpm } = req.body;
        console.log("Received body:", req.body);

        const sql = `INSERT INTO users (target, userTyped, correctWords, totalWords, accuracy, wpm)
                     VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql, [target, userTyped, correctWords, totalWords, accuracy, wpm], function(err){
            if(err){
                console.error('Error inserting data', err.message);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ success: true, id: this.lastID });
        });
    });

    // GET /results → fetch all typing results
    router.get('/', (req, res) => {
        const sql = `SELECT * FROM users ORDER BY created_at DESC`;
        db.all(sql, [], (err, rows) => {
            if(err){
                console.error('Error fetching data', err.message);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(rows);
        });
    });

    return router;
};
