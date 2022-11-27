const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'hacker-db',
    password: '12345678',
    port: 3306
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('You are now connected...');
});

app.get('/', function (req, res) {
    res.render('index', { message: '', result: [] });
});

app.post('/',
    check('email').isLength({ min: 1 }).trim().withMessage('Email must be specified.'),
    check('email').isEmail().withMessage('Email must be a valid email address.'),
    check('email').isLength({ max: 255 }).trim().withMessage('Email must not more than 255 characters long.'),
    check('password').isLength({ min: 1 }).trim().withMessage('Password must be specified.'),
    check('password').isLength({ max: 255 }).trim().withMessage('Password must not more than 255 characters long.'),
    function (req, res) {
        if (!validationResult(req).isEmpty()) {
            const errors = validationResult(req).array().map(error => error.msg).join(' ');
            res.render('index', { message: errors, result: [] });
            return;
        }
    const password = req.body.password;
    const email = req.body.email;
    const sql = 'INSERT INTO baited (email, password) VALUES (?, ?)';
    connection.query(sql, [email, password]);
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

app.post('/api/login', function (req, res) {
    const password = req.body.password;
    const email = req.body.email;
    const sql = "SELECT * FROM users WHERE email = '" + email + "' AND password = '" + password + "'";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            res.send(200);
        } else {
            res.send(401);
        }
    });
});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});
