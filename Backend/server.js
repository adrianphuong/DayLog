const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Create a database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'adrian123',
  database: 'entries',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
  }
});

app.get('/api/entries', (req, res) => {
  console.log("Entries loaded!!!")
  db.query('SELECT * FROM diary_entries', (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const entriesWithNumbers = result.map((entry, index) => ({
        entryNumber: index + 1,
        ...entry,
      }));
      res.json(entriesWithNumbers);
    }
  });
});

// Define a route to insert data into the diary_entries table
app.post('/api/insert', (req, res) => {
  const { date, text } = req.body;
  db.query('INSERT INTO diary_entries (date, text) VALUES (?, ?)', [date, text], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Data inserted successfully' });
    }
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
