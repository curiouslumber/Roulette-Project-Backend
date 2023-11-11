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
  const {name,   email, password, role } = req.body;
  const query = 'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)';

  connection.query(query, [name, email, password, role], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json({ id: result.insertId, name, email, password, role });
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

app.get('/users/email/:email', (req, res) => {
    const userEmail = req.params.email;
    const query = 'SELECT * FROM Users WHERE email = ?';

    connection.query(query, [userEmail], (err, results) => {
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