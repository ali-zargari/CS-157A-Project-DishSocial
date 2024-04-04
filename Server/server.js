const express = require('express');
const mysql = require('mysql2/promise'); // import mysql2


const app = express();
const port = process.env.PORT || 3000; // It's important to use process.env.PORT for deployment.


const pool = mysql.createPool({
    host: 'mysql-206af299-sjsu-b628.a.aivencloud.com',
    user: 'avnadmin',
    // Specify the database (schema) name here
    database: 'CS_157A_Project',
    password: 'AVNS_KPqKJ44iZGhPb5xCUgA',
    port: 19243,
    ssl: {
        rejectUnauthorized: false // Set to false only if necessary and you understand the implications
    }
});



app.get('/', (req, res) => res.send('Hello World!'));
app.use(express.json());

app.post('/test', async (req, res) => { // You can now use async function
    console.log(req.body);



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

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
