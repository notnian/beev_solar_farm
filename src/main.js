const express = require("express");
const path = require("node:path");
const sqlite3 = require("sqlite3").verbose();

// Connect to the SQLite database
const db = new sqlite3.Database(
  path.join(__dirname, "/../database/database.db")
);

const app = express();

const queries = {
  subset: `SELECT * FROM luminosity`,
  latest: `SELECT * FROM luminosity WHERE timestamp > ?;`,
  all: `SELECT * FROM luminosity;`,
};

const findHighestSubset = (measures) => {
  // If there is less than 5 measures we highlight all
  if (measures.length < 5) {
    return measures;
  }

  let highestSubset;
  let tempHighestSubsetSum = 0;

  // We iterate over the array 5 by 5 with a offset of 1 each and we compute sum of subset values each time
  // e.g [1, 2, 3, 4, 19, 5, 14]
  // i=0 -> subset = [1, 2, 3, 4, 19]; tempHighestSubsetSum = 29
  // i=1 -> subset = [2, 3, 4, 19, 5]; tempHighestSubsetSum = 33 -> so we set this subset as "highest"
  for (let i = 0; i <= measures.length - 5; i++) {
    const subset = measures.slice(i, i + 5);

    const total = subset.reduce(
      (previous, current) => (previous += current.value),
      0
    );

    if (total > tempHighestSubsetSum) {
      tempHighestSubsetSum = total;
      highestSubset = subset;
    }
  }

  return highestSubset;
};

/**
 * GET - analyze sensor values and return the "highest value subset of 5 consecutive values"
 */
app.get("/luminosity/analyze", (req, res) => {
  db.all(queries.subset, (error, measures) => {
    if (error) {
      res.status(500).json(error);
    } else {
      res.json(findHighestSubset(measures));
    }
  });
});

/**
 * GET - Retrieve the most recent values since the last timestamp saved by the client.
 */
app.get("/luminosity/latest", (req, res) => {
  const timestamp = req.query.timestamp;

  try {
    new Date(timestamp);
  } catch (error) {
    res.status(400).json(error);
  }

  db.all(queries.latest, [timestamp], (error, measures) => {
    if (error) {
      res.status(500).json(error);
    } else {
      res.json(measures);
    }
  });
});

/**
 * GET - to find all values from database
 * Please note that we never make this type of request available because of the potentially
 * large number of lines involved, so it's for demonstration purposes only.
 * In real world we paginate result, with pages or virtually with an infinite scroll.
 */
app.get("/luminosity/all", (req, res) => {
  db.all(queries.all, (error, measures) => {
    if (error) {
      res.status(500).json(error);
    } else {
      res.json(measures);
    }
  });
});

// Serve static assets from public directory
app.use(express.static("public"));

app.listen(3000);
