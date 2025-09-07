const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const routes = require('./routes/routes'); // routes will receive db instance

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Open SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database');
        // Create table if it doesn't exist
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                target TEXT,
                userTyped TEXT,
                correctWords INTEGER,
                totalWords INTEGER,
                accuracy REAL,
                wpm REAL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) console.error('Error creating table', err.message);
        });
    }
});

// Pass the db instance to routes
app.use('/results', routes(db));

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
