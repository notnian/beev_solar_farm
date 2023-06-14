const express = require("express");
const path = require("node:path");
const sqlite3 = require("sqlite3").verbose();

// Connect to the SQLite database
const db = new sqlite3.Database("database.db");

const app = express();

const queries = {
  subset: `SELECT * FROM luminosity`,
  latest: `SELECT * FROM luminosity WHERE timestamp > ?;`,
  all: `SELECT * FROM luminosity;`,
};

app.get("/luminosity/analyze", (req, res) => {
  db.all(queries.subset, (err, rows) => {
    if (err) {
      console.error(err);
      res.json({ error: err.message });
    } else {
      // check if array has 5 value else error
      let highestSubset;
      let tmpSub = 0;

      for (let i = 0; i <= rows.length - 5; i++) {
        const sousTableau = rows.slice(i, i + 5);
        const total = sousTableau.reduce((previous, current) => {
          return (previous += current.value);
        }, 0);
        if (total > tmpSub) {
          tmpSub = total;
          highestSubset = sousTableau;
        }
      }

      res.json(highestSubset);
    }
  });
});

app.get("/luminosity/latest", (req, res) => {
  db.all(queries.latest, [req.query.timestamp], (err, rows) => {
    if (err) {
      console.error(err);
      res.json({ error: err.message });
    } else {
      console.log(rows);
      res.json(rows);
    }
  });
});

app.get("/luminosity/all", (req, res) => {
  db.all(queries.all, (err, rows) => {
    if (err) {
      console.error(err);
      res.json({ error: err.message });
    } else {
      console.log(rows);
      res.json(rows);
    }
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(3000);
