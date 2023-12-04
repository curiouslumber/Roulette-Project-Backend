const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
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

//Get user by id
app.get('/users/active/:id', (req, res) => {
  const userId = req.params.id;
  const query = `SELECT user_id,  DATE_FORMAT(last_active_date, '%d-%m-%Y') AS last_active_date , last_active_time FROM ActiveUsers WHERE user_id = ?`;

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

// Get all games
app.get('/games', (req, res) => {
  const query = 'SELECT * FROM UserGames';

  connection.query(query, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json(results);
    });
});


// Get games with user_id
app.get('/users/:id/game', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM UserGames WHERE userID = ?';

  connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }

      if (results.length === 0) {
        res.status(404).send('No games found');
      } else {
        res.json(results);
      }
    });
});

// Create User Dashboard
app.post('/users/dashboard', (req, res) => {
  const { user_id } = req.body;
  const query = 'INSERT INTO UserDashboard(user_id, deposit_amount, current_balance, number_of_games_played, number_of_wins, number_of_lossess, winning_amount, total_amount_won, total_amount_lost) VALUES (? , 0, 0, 0, 0, 0, 0, 0, 0)';

  connection.query(query, [user_id], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(201).send('User dashboard created');
  });
});

// Start a new game
app.post('/users/:id/game', (req, res) => {
  const userId = req.params.id;
  const { user_id, move_num, game_status, last_bet_amount, last_bet_won_lost} = req.body;
  const query = 'INSERT INTO UserGames( userID, moveNum, gameStatus, last_bet_amount, last_bet_won_lost) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [user_id, move_num, game_status, last_bet_amount, last_bet_won_lost], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.status(201).send('Game started');
    });
});


// Create
app.post('/users/active', (req, res) => {
  const { user_id, last_active_date, last_active_time } = req.body;
  const query = 'INSERT INTO  ActiveUsers(user_id, isActive, last_active_date, last_active_time) VALUES (? , FALSE, ?, ?)';

  connection.query(query, [user_id,  last_active_date, last_active_time], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(201).send('User added to active users');
  });
});

// Update deposit amount with new deposit amount using user_id and update current balance such that current balance.
app.put('/users/dashboard/deposit/:id', (req, res) => {
  const userId = req.params.id;
  const { deposit_amount, current_balance } = req.body;
  const query = 'UPDATE UserDashboard SET deposit_amount = ?, current_balance = ? WHERE user_id = ?';

  connection.query(query, [deposit_amount, current_balance, userId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(204).send();
  });
}
);



// Update Active Userimplements BroadcastReceiver 
app.put('/users/active/:id', (req, res) => {
  const userId = req.params.id;
  const { last_active_date, last_active_time } = req.body;
  const query = 'UPDATE ActiveUsers SET last_active_date = ?, last_active_time = ? WHERE user_id = ?';

  connection.query(query, [last_active_date, last_active_time, userId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.status(204).send();
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
app.listen(PORT, 'localhost' );