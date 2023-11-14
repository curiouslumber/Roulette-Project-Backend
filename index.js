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


// Get all active users
app.get('/users/active/active', (req, res) => {
  const query = `SELECT user_id, DATE_FORMAT(last_active_date, '%d-%m-%Y') AS last_active_date , last_active_time FROM \`ActiveUsers\``;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json(results);
  });
});

// Get all user dashboards
app.get('/users/dashboard/dashboard', (req, res) => {
  const query = 'SELECT * FROM UserDashboard';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json(results);
  });
});

// Get user dashboard with user_id
app.get('/users/dashboard/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM UserDashboard WHERE user_id = ?';

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('User dashboard not found');
    } else {
      res.json(results[0]);
    }
  });
});


// Create User Dashboard
app.post('/users/dashboard', (req, res) => {
  const { user_id } = req.body;
  const query = 'INSERT INTO UserDashboard (user_id, current_balance, number_of_games_played, number_of_wins, number_of_lossess, total_amount_won, total_amount_lost, current_demo_balance, number_of_demo_games_played, number_of_demo_wins, number_of_demo_lossess, total_demo_amount_won, total_demo_amount_lost) VALUES (?, 0, 0, 0, 0, 0, 0, 1500, 0, 0, 0, 0, 0)';

  connection.query(query, [user_id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(201).send('User dashboard created');
  });
});


// Create
app.post('/users/active', (req, res) => {
  const { user_id, last_active_date, last_active_time } = req.body;
  const query = 'INSERT INTO  ActiveUsers(user_id, last_active_date, last_active_time) VALUES (?, ?, ?)';

  connection.query(query, [user_id,  last_active_date, last_active_time], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(201).send('User added to active users');
  });
});

// Delete Active User with user_id
app.delete('/users/active/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM ActiveUsers WHERE user_id = ?';

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

// Delete User Dashboard with user_id
app.delete('/users/dashboard/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM UserDashboard WHERE user_id = ?';

  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('User dashboard not found');
    } else {
      res.status(204).send(); // No content
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
app.listen(PORT, '192.168.1.35' );