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
    origin: 'http://localhost:8080',
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

//get user info
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

//get list of friends user has
app.get('/users/friends', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const userID = req.cookies.userID;

        const [friendResult] = await connection.execute(
            'SELECT UserID2 FROM Friends_With WHERE UserID1 = ?',
                [userID]
        );

        // Extracting user IDs from the friendResult
        const friendIds = friendResult.map(friend => friend.UserID2);

        // Check if there are friend IDs to query
        if (friendIds.length > 0) {
            // Query to get names of friends
            const [rows] = await connection.execute(
                'SELECT FirstName, LastName FROM Users WHERE UserID IN (?)',
                [`(${friendIds.join(',')})`]
            );

            console.log(rows)
            res.send(rows);
            console.log(`(${friendIds.join(',')})`);
        } else {
            res.send([]); // No friends found
        }
        connection.release();
    } catch (error) {
        console.error("Failed to retrieve friends: ", error);
        res.status(500).send(error);
    }
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
    const {Title, CookTime, PrepTime, Steps, TotalCalories, Ingredients} = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.execute(
            'INSERT INTO Recipe(Title, CookTime, PrepTime, Steps, TotalCalories, Ingredients) VALUES (?, ?, ?, ?, ?, ?)',
            [Title, CookTime, PrepTime, Steps, TotalCalories, Ingredients]
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
    const {Title, CookTime, PrepTime, Steps, TotalCalories, Ingredients, userID} = req.body;
    try {
        const connection = await pool.getConnection();
        const result = await connection.execute(
            'INSERT INTO Recipe(Title, CookTime, PrepTime, Steps, TotalCalories, Ingredients) VALUES (?, ?, ?, ?, ?, ?)',
            [Title, CookTime, PrepTime, Steps, TotalCalories, Ingredients]
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

// Get recipe details
app.get('/recipe', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        // Replace 'SELECT * FROM Recipes' with your query
        const [rows] = await connection.execute('SELECT * FROM Recipe');
        connection.release();

        res.send(rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

//get recipe info
app.get('/recipe/:recipeID', async (req, res) => {
    try {
        const { recipeID } = req.params;
        const connection = await pool.getConnection();

        // Use this SQL query to return the recipe details for a given recipeID.
        const [rows] = await connection.execute(
            'SELECT * FROM Recipe WHERE RecipeID = ?',
            [recipeID]
        );

        connection.release();
        res.send(rows[0]); // Assuming each recipeID corresponds to one recipe
    } catch (error) {
        console.error(`Failed to get selected recipe info: ${error}`);
        res.status(500).send(error);
    }
});

// Get friend reviews for a user
app.get('/user/friendReviews/:userID', async (req, res) => {
    try {
        const { userID } = req.params;
        const connection = await pool.getConnection();

        // Modified SQL query based on the schema
        // This selects reviews left by friends of the given user (match with UserID in Friends_With table)
        const [rows] = await connection.execute(
            'SELECT r.* FROM Review AS r INNER JOIN User_Leaves_Review ulr ON r.ReviewID = ulr.ReviewID WHERE ulr.UserID IN (SELECT UserID2 FROM Friends_With WHERE UserID1 = ? UNION SELECT UserID1 FROM Friends_With WHERE UserID2 = ?)',
            [userID, userID]
        );

        connection.release();
        res.send(rows);
    } catch (error) {
        console.error(`Failed to get user friend reviews: ${error}`);
        res.status(500).send(error);
    }
});


// log in user.
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
                res.send({ status: "Logged in", userID: rows[0].UserID }); // Include userID in the response
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




// give me all recipes
app.get('/recipes', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM Recipe'
        );
        connection.release();

        res.send(rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));