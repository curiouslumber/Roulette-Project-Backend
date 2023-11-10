const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'roulette_game'
});

// Body parser middleware to parse POST request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes for CRUD operations

// Create
app.post('/users', (req, res) => {
  const { email, role } = req.body;
  const query = 'INSERT INTO Users (email, role) VALUES (?, ?)';

  connection.query(query, [email, role], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json({ id: result.insertId, email, role });
  });
});

// Read all
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM Users';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json(results);
  });
});

// Read one
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM Users WHERE user_id = ?';

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('User not found');
    } else {
      res.json(results[0]);
    }
  });
});

// Delete
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM Users WHERE user_id = ?';

  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('User not found');
    } else {
      res.status(204).send(); // No content
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});