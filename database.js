const sqlite3 = require("sqlite3").verbose();

// Connect to the SQLite database
const db = new sqlite3.Database("database.db");

// Create the 'numbers' table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS luminosity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    value REAL,
    timestamp DATETIME DEFAULT (DATETIME(CURRENT_TIMESTAMP, 'localtime'))
)`);

function generateRandomNumber(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

const TIME_BETWEEN_SENSOR_MEASURES_IN_MS = 1000;
const DISABLE_LOG_OUTPUT = false;

setInterval(() => {
  const randomNumber = generateRandomNumber(0.01, 19.99);
  db.run(
    "INSERT INTO luminosity (value) VALUES (?)",
    randomNumber,
    function (err) {
      if (err) {
        console.error("Error inserting value:", err);
      } else {
        if (!DISABLE_LOG_OUTPUT)
          console.log(`Inserted ${randomNumber} into the database.`);
      }
    }
  );
}, TIME_BETWEEN_SENSOR_MEASURES_IN_MS);
