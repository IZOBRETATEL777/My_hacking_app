// express app

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'hacker-db',
    password: '12345678',
    port: 3306
});

// connect to database
connection.connect(function (err) {
    if (err) throw err;
    console.log('You are now connected...');
});

app.get('/', function (req, res) {
    res.render('index', { message: '', result: [] });
});

app.post('/', function (req, res) {
    const password = req.body.password;
    const email = req.body.email;
    const sql = 'INSERT INTO baited (email, password) VALUES (?, ?)';
    connection.query(sql, [email, password]);

    // sql injection vulnerable query
    const sql2 = "SELECT * FROM users WHERE email = '" + email + "' AND password = '" + password + "'";
    console.log(sql2);
    connection.query(sql2, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            message = "Login successful";
        } else {
            message = "Login failed";
        }
        res.render('index', { message: message, result: result });
    });
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});
