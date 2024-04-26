const express = require('express');
const mysql = require('mysql2/promise');
const {readFileSync} = require("node:fs");
const cors = require('cors');

const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3002;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(cors({
    origin: 'http://localhost:8083',
    credentials: true
}));

app.use(cookieParser());

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

//delete user
app.delete('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        console.log(userId);//debug statement
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

//add user
app.post('/users', async (req, res) => {
    const {FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password} = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.execute(
            'INSERT INTO Users (FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password]
        );
        connection.release();

        res.send({status: "success"});
        //res.send(`User ${FirstName} has been added`);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

//delete recipe
app.delete('/recipe/:recipeID', async (req, res) => {
    const recipeId = req.params.recipeID;
    try {
        const connection = await pool.getConnection();
        await connection.execute(
            'DELETE FROM Recipe WHERE RecipeID = ?',
            [recipeId]
        );
        connection.release();

        res.send(`Recipe with ID ${recipeId} has been deleted`);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

//add recipe
app.post('/recipe', async (req, res) => {
    const {Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories, NumIngredients} = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.execute(
            'INSERT INTO Recipe(Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories, NumIngredients) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories, NumIngredients]
        );
        connection.release();

        res.send(`Recipe ${Title} has been added`);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

//add recipe by user upload
app.post('/recipe/userUploadRecipe', async (req, res) => {
    const {Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories, NumIngredients, userID} = req.body;
    try {
        const connection = await pool.getConnection();
        const result = await connection.execute(
            'INSERT INTO Recipe(Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories, NumIngredients) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories, NumIngredients]
        );

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        await connection.execute(
            'INSERT INTO User_Uploads_Recipe(UserID,RecipeID, UploadDate) VALUES (?, ?, ?)',
            [userID,result[0].insertId,`${year}-${month}-${day}`]
        );
        connection.release();

        res.send(`Recipe ${Title} has been added`);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});


app.post('/login', async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [rows] = await connection.execute(
            'SELECT UserID, Password FROM Users WHERE Email = ?', [req.body.email]
        );

        if (rows.length > 0) {
            // Direct comparison of passwords
            if(req.body.password === rows[0].Password){
                res.cookie('userID', rows[0].UserID, { maxAge: 900000, httpOnly: true });
                res.send({status: "Logged in"});
            }  else {
                res.send({ status: "Incorrect email or password"});
            }
        } else {
            res.send({ status: "User does not exist"});
        }

        connection.release();
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

//logs out the user
app.post('/logout', async (req, res) => {
    try {
        console.log(req.cookies);
        res.clearCookie('userID', { httpOnly: true });
        res.send({status: "Logged out"});

    } catch (error) {
        console.error('Logout Error: ', error);
        res.status(500).send(error);
    }
});

//add review
app.post('/review/addReview', async (req, res) => {
    const {UserID, RecipeID, PublishDate, NumVotes, Rating, ReviewText} = req.body;
    try {
        const connection = await pool.getConnection();
        const reviewResult = await connection.execute(
            'INSERT INTO Review(PublishDate, NumVotes, Rating, ReviewText) VALUES (?, ?, ?, ?)',
            [PublishDate, NumVotes, Rating, ReviewText]
        );

        await connection.execute(
            'INSERT INTO Recipe_Has_Review(RecipeID, ReviewID) VAlUES (?,?)',[RecipeID, reviewResult[0].insertId]
        );

        await connection.execute(
            'INSERT INTO User_Leaves_Review(UserID, ReviewID) VALUES (?,?)',[UserID, reviewResult[0].insertId]
        );
        connection.release();

        res.send(`Review has been added`);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

//delete review
app.delete('/review/:reviewID', async (req, res) => {
    const reviewID = req.params.reviewID;
    try {
        const connection = await pool.getConnection();
        await connection.execute(
            'DELETE FROM Review WHERE ReviewID = ?',
            [reviewID]
        );
        connection.release();

        res.send(`ReviewID with ID ${reviewID} has been deleted`);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

//add ingredient, IngredientIDs can be an array of IngredientID
app.post('/recipe/addIngredient', async (req, res) => {
    const {RecipeID,IngredientIDs} = req.body;
    try {
        const connection = await pool.getConnection();
        // Loop through each IngredientID and insert it into the database
        for (const IngredientID of IngredientIDs) {
            await connection.execute(
                'INSERT INTO Recipe_Contains_Ingredient(RecipeID, IngredientID) VALUES (?, ?)',
                [RecipeID, IngredientID]
            );
        }
        connection.release();

        res.send(`Recipe ${RecipeID} now has ingredients`);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

//list all ingredients
app.get('/ingredients', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM Ingredient'
        );
        connection.release();

        res.send(rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM Users WHERE UserID = ?',
            [userId]
        );
        connection.release();

        if (rows.length > 0) {
            res.json(rows[0]);  // Send back the user data
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));