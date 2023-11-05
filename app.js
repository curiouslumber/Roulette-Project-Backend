const express = require('express');
const mysql = require('mysql2');
const app = express();
const http = require('http');

const hostname = 'localhost';
const port = 3000;


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

const db = mysql.createConnection({
  host: 'mysql', // This is the name of the MySQL service in Docker
  user: 'root',
  password: 'password', // Change this to your MySQL root password
  database: 'mydatabase' // Change this to your desired database name
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});


server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
