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
            const friendIdsPlaceHolders = friendIds.map(() => '?').join(',');

            const [rows] = await connection.execute(
                `SELECT FirstName, LastName FROM Users WHERE UserID IN (${friendIdsPlaceHolders})`,
                friendIds
            );

            //console.log(rows)
            res.send(rows);
            //console.log(`(${friendIds.join(',')})`);
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

        console.log(`Recipe ${Title} has been added`);

        res.send(`Recipe ${Title} has been added`);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// add recipe by user upload
app.post('/recipe/userUploadRecipe', async (req, res) => {
    const { Title, CookTime, PrepTime, Steps, TotalCalories, Ingredients } = req.body;
    try {
        const connection = await pool.getConnection();
        // Insert the new recipe and get the insertId
        const [recipeResult] = await connection.execute(
            'INSERT INTO Recipe (Title, CookTime, PrepTime, Steps, TotalCalories, Ingredients) VALUES (?, ?, ?, ?, ?, ?)',
            [Title, CookTime, PrepTime, Steps, TotalCalories, Ingredients]
        );
        const newRecipeId = recipeResult.insertId;

        const currentDate = new Date().toISOString().slice(0, 10); // Format as 'YYYY-MM-DD'
        // Insert into User_Uploads_Recipe table
        await connection.execute(
            'INSERT INTO User_Uploads_Recipe (UserID, RecipeID, UploadDate) VALUES (?, ?, ?)',
            [req.cookies.userID, newRecipeId, currentDate]
        );

        // Retrieve the full information of the newly added recipe
        const [fullRecipeDetails] = await connection.execute(
            'SELECT * FROM Recipe WHERE RecipeID = ?',
            [newRecipeId]
        );

        connection.release();

        // If the array is not empty, send the first element (the recipe data)
        if (fullRecipeDetails.length > 0) {
            res.status(201).json(fullRecipeDetails[0]);
        } else {
            res.status(404).send('Recipe was not found after insertion.');
        }
    } catch (error) {
        console.error(error);
        connection?.release();
        res.status(500).send(error.message);
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

        const sqlQuery = `
            SELECT
                r.RecipeID, r.Title, r.CookTime, r.PrepTime, r.Steps, r.TotalCalories, r.Ingredients,
                rv.ReviewID, rv.PublishDate, rv.NumVotes, rv.Rating, rv.ReviewText,
                friendUser.FirstName as FriendName  -- Assuming the Users table has a Name column
            FROM
                Users u
                    JOIN
                Friends_With fw ON u.UserID = fw.UserID1
                    JOIN
                Users friendUser ON fw.UserID2 = friendUser.UserID  -- Join to get the friend's name
                    JOIN
                User_Leaves_Review ulr ON ulr.UserID = fw.UserID2
                    JOIN
                Review rv ON ulr.ReviewID = rv.ReviewID
                    JOIN
                Recipe_Has_Review rhr ON rhr.ReviewID = rv.ReviewID
                    JOIN
                Recipe r ON r.RecipeID = rhr.RecipeID
            WHERE
                u.UserID = ?;
        `;

        const [rows] = await connection.execute(sqlQuery, [userID]);

        connection.release();
        console.log("Reviews:");
        console.log(rows);
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
                res.cookie('userID', rows[0].UserID, { maxAge: 900000});
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
        res.clearCookie('userID');
        res.send({status: "Logged out"});

    } catch (error) {
        console.error('Logout Error: ', error);
        res.status(500).send(error);
    }
});

//add review
// POST endpoint to submit a review
app.post('/review/addReview', async (req, res) => {
    const {UserID, RecipeID, Rating, ReviewText} = req.body;
    const PublishDate = new Date().toISOString().slice(0, 10); // Format to YYYY-MM-DD
    try {
        const connection = await pool.getConnection();

        // First, insert the review into the Review table
        const [reviewResult] = await connection.execute(
            'INSERT INTO Review (PublishDate, NumVotes, Rating, ReviewText) VALUES (?, ?, ?, ?)',
            [PublishDate, 0, Rating, ReviewText]
        );

        // Then, link the review with the user who left it
        await connection.execute(
            'INSERT INTO User_Leaves_Review (UserID, ReviewID) VALUES (?, ?)',
            [UserID, reviewResult.insertId]
        );

        // Link the review with the recipe
        await connection.execute(
            'INSERT INTO Recipe_Has_Review (RecipeID, ReviewID) VALUES (?, ?)',
            [RecipeID, reviewResult.insertId]
        );

        connection.release();

        // Send back the ID of the new review
        res.status(201).json({
            ReviewID: reviewResult.insertId,
            PublishDate,
            NumVotes: 0,
            Rating,
            ReviewText
        });
    } catch (error) {
        console.error('Error submitting review:', error);
        connection.release();
        res.status(500).send('Internal Server Error');
    }
});


//

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


app.get('/reviews/:recipeID', async (req, res) => {
    try {
        const { recipeID } = req.params;
        const connection = await pool.getConnection();

        // Join the Review, Recipe_Has_Review, and Users tables to get all reviews for a specific recipe
        const [reviews] = await connection.execute(`
            SELECT r.ReviewID, r.PublishDate, r.NumVotes, r.Rating, r.ReviewText,
                   u.UserID, u.FirstName, u.LastName
            FROM Review r
            JOIN Recipe_Has_Review rhr ON r.ReviewID = rhr.ReviewID
            JOIN User_Leaves_Review ulr ON r.ReviewID = ulr.ReviewID
            JOIN Users u ON ulr.UserID = u.UserID
            WHERE rhr.RecipeID = ?
        `, [recipeID]);

        connection.release();
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        if (connection) {
            connection.release();
        }
        res.status(500).send('Internal Server Error');
    }
});


app.get('/users/:userID', async (req, res) => {
    const { userID } = req.params; // Extracting userID from the request URL

    try {
        const connection = await pool.getConnection(); // Assuming 'pool' is your MySQL connection pool

        // SQL query to fetch user data
        const [rows] = await connection.execute(
            'SELECT UserID, FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Age FROM Users WHERE UserID = ?',
            [userID]
        );

        connection.release(); // Release the connection back to the pool

        if (rows.length > 0) {
            res.json(rows[0]); // Send the first row of the results as JSON
        } else {
            res.status(404).send('User not found'); // Send a 404 response if no user is found
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error'); // Send a 500 response on error
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


// Endpoint to search and filter recipes
app.get('/recipes/search', async (req, res) => {
    const { searchTerm, filter, userID } = req.query; // userID should be obtained from session or token

    let baseQuery = `SELECT DISTINCT Recipe.* FROM Recipe `;
    let whereConditions = [];
    let parameters = [];

    if (searchTerm) {
        whereConditions.push(`(Recipe.Title LIKE CONCAT('%', ?, '%') OR Recipe.Ingredients LIKE CONCAT('%', ?, '%'))`);
        parameters.push(searchTerm, searchTerm);
    }

    switch (filter) {
        case 'reviewedByMe':
            baseQuery += `INNER JOIN Recipe_Has_Review ON Recipe.RecipeID = Recipe_Has_Review.RecipeID 
                   INNER JOIN Review ON Recipe_Has_Review.ReviewID = Review.ReviewID
                   INNER JOIN User_Leaves_Review ON Review.ReviewID = User_Leaves_Review.ReviewID `;
            whereConditions.push(`User_Leaves_Review.UserID = ?`);
            parameters.push(userID);
            break;
        case 'likedByMe':
            baseQuery += `JOIN User_Likes_Recipe ON Recipe.RecipeID = User_Likes_Recipe.RecipeID `;
            whereConditions.push(`User_Likes_Recipe.UserID = ?`);
            parameters.push(userID);
            break;
        case 'uploadedByMe':
            baseQuery += `JOIN User_Uploads_Recipe ON Recipe.RecipeID = User_Uploads_Recipe.RecipeID `;
            whereConditions.push(`User_Uploads_Recipe.UserID = ?`);
            parameters.push(userID);
            break;
        case 'reviewedByFriends':
            baseQuery += `INNER JOIN Recipe_Has_Review ON Recipe.RecipeID = Recipe_Has_Review.RecipeID 
                   INNER JOIN Review ON Recipe_Has_Review.ReviewID = Review.ReviewID 
                   INNER JOIN User_Leaves_Review ON Review.ReviewID = User_Leaves_Review.ReviewID 
                   INNER JOIN Friends_With ON User_Leaves_Review.UserID = Friends_With.UserID2 OR User_Leaves_Review.UserID = Friends_With.UserID1`;
            whereConditions.push(`(Friends_With.UserID1 = ? OR Friends_With.UserID2 = ?)`);
            parameters.push(userID, userID);
            break;
        case 'likedByFriends':
            baseQuery += `JOIN User_Likes_Recipe ON Recipe.RecipeID = User_Likes_Recipe.RecipeID 
                           JOIN Friends_With ON User_Likes_Recipe.UserID = Friends_With.UserID2 `;
            whereConditions.push(`Friends_With.UserID1 = ?`);
            parameters.push(userID);
            break;
        case 'uploadedByFriends':
            baseQuery += `JOIN User_Uploads_Recipe ON Recipe.RecipeID = User_Uploads_Recipe.RecipeID 
                           JOIN Friends_With ON User_Uploads_Recipe.UserID = Friends_With.UserID2 `;
            whereConditions.push(`Friends_With.UserID1 = ?`);
            parameters.push(userID);
            break;
        // You can add more cases if needed
    }

    if (whereConditions.length > 0) {
        baseQuery += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(baseQuery, parameters);
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error('Error performing search:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/userRecipes/:userId', async (req, res) => {
    const { userId } = req.params;
    const userUploadsQuery = `SELECT RecipeID FROM User_Uploads_Recipe WHERE UserID = ?`;
    let result;
    try {
        const connection = await pool.getConnection();
        [result] = await connection.execute(userUploadsQuery, [userId]);
        connection.release();
    } catch (error) {
        console.error("SQL query execution failed:", error);
        res.sendStatus(500);
        return;
    }
    const recipeIds = result.map((row) => row.RecipeID);
    res.send(recipeIds);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));