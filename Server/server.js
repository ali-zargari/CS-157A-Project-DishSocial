const express = require('express');
const mysql = require('mysql2/promise');
const {readFileSync} = require("node:fs");

const app = express();
const port = process.env.PORT || 3002;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const pool = mysql.createPool({
    host: 'mysql-206af299-sjsu-b628.a.aivencloud.com',
    user: 'avnadmin',
    // Specify the database (schema) name here
    database: 'CS_157A_Project',
    password: 'AVNS_KPqKJ44iZGhPb5xCUgA',
    port: 19243,
    ssl: {
        // Do not reject when not authorized, set to true in production
        rejectUnauthorized: true,
        // The path to your CA certificate
        ca: readFileSync('./ca.crt'),
    }
});



app.get('/', (req, res) => res.send('Hello World!'));
app.use(express.json());

app.get('/test', async (req, res) => { // You can now use async function
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM Users'
        );
        connection.release();

        res.send(rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});


app.get('/users', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM Users'
        );
        connection.release();

        res.send(rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}, (req, res) => {
    console.log('This is the second callback');
});

app.delete('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        console.log(userId);
        const connection = await pool.getConnection();
        await connection.execute(
            'DELETE FROM Users WHERE UserID = ?',
            [userId]
        );
        connection.release();

        res.send(`User with ID ${userId} has been deleted`);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
