const express = require('express');
const mysql = require('mysql2/promise');
const {readFileSync} = require("node:fs");
const cors = require('cors');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3002;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json())

const pool = mysql.createPool({
    host: 'mysql-206af299-sjsu-b628.a.aivencloud.com',
    user: 'avnadmin',
   
    database: 'CS_157A_Project', //database name
    password: 'AVNS_KPqKJ44iZGhPb5xCUgA',
    port: 19243,
    ssl: {
       
        rejectUnauthorized: true,
       
        ca: readFileSync('./ca.crt'),
    }
});



app.get('/', (req, res) => res.send('Hello World!'));
app.use(express.json());

app.get('/test', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM Users'
        );
        connection.release();

        res.send(rows);
    } catch (error) {
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
        res.status(500).send(error);
    }
});


app.get('/users/friends', async (req, res) => {
   
    const userID = req.query.uid;

    try {
        const connection = await pool.getConnection();

       
        const [friendResult] = await connection.execute(
            'SELECT UserID2 FROM Follows WHERE UserID1 = ?',
            [userID]
        );

       
        const friendIds = friendResult.map(friend => friend.UserID2);

       
        if (friendIds.length > 0) {
           
            const friendIdsPlaceHolders = friendIds.map(() => '?').join(',');

            const [rows] = await connection.execute(
                `SELECT UserID, FirstName, LastName FROM Users WHERE UserID IN (${friendIdsPlaceHolders})`,
                friendIds
            );

           
            res.send(rows);
        } else {
            res.send([]);
        }

       
        connection.release();
    } catch (error) {
        console.error("Failed to retrieve friends: ", error);
        res.status(500).send(error);
    }
});


app.delete('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const connection = await pool.getConnection();
        await connection.execute(
            'DELETE FROM Users WHERE UserID = ?',
            [userId]
        );
        connection.release();

        res.send(`User with ID ${userId} has been deleted`);
    } catch (error) {
        res.status(500).send(error);
    }
});

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
       
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

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
        res.status(500).send(error);
    }
});

app.post('/recipe', async (req, res) => {
    const {Title, CookTime, PrepTime, Steps, TotalCalories, Ingredients} = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.execute(
            'INSERT INTO Recipe(Title, Steps, TotalCalories, Ingredients) VALUES (?, ?, ?, ?)',
            [Title, Steps, TotalCalories, Ingredients]
        );
        connection.release();

        res.send(`Recipe ${Title} has been added`);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.post('/recipe/userUploadRecipe', async (req, res) => {
    const { Title, Steps, TotalCalories, Ingredients, uid } = req.body;
    try {
        const connection = await pool.getConnection();
       
        const [recipeResult] = await connection.execute(
            'INSERT INTO Recipe (Title, Steps, TotalCalories, Ingredients) VALUES (?, ?, ?, ?)',
            [Title, Steps, TotalCalories, Ingredients]
        );
        const newRecipeId = recipeResult.insertId;

        const currentDate = new Date().toISOString().slice(0, 10);
       
        await connection.execute(
            'INSERT INTO User_Uploads_Recipe (UserID, RecipeID, UploadDate) VALUES (?, ?, ?)',
            [uid, newRecipeId, currentDate]
        );

       
        const [fullRecipeDetails] = await connection.execute(
            'SELECT * FROM Recipe WHERE RecipeID = ?',
            [newRecipeId]
        );

        connection.release();

       
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



app.get('/recipe', async (req, res) => {
    try {
        const connection = await pool.getConnection();
       
        const [rows] = await connection.execute('SELECT * FROM Recipe');
        connection.release();

        res.send(rows);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/recipe/:recipeID', async (req, res) => {
    try {
        const { recipeID } = req.params;
        const connection = await pool.getConnection();

       
        const [recipeDetails] = await connection.execute(
            'SELECT * FROM Recipe WHERE RecipeID = ?',
            [recipeID]
        );

       
        const [reviewStats] = await connection.execute(
            `SELECT COUNT(*) AS ReviewCount FROM Recipe_Has_Review
             WHERE RecipeID = ?`,
            [recipeID]
        );

       
        const [ratingStats] = await connection.execute(
            `SELECT COUNT(Rating) AS RatingCount, AVG(Rating) AS AverageRating FROM Review
             JOIN Recipe_Has_Review ON Review.ReviewID = Recipe_Has_Review.ReviewID
             WHERE Recipe_Has_Review.RecipeID = ? AND Rating IS NOT NULL`,
            [recipeID]
        );

        connection.release();
        if (recipeDetails.length > 0) {
            const response = {
                ...recipeDetails[0],
                ReviewCount: reviewStats[0].ReviewCount,
                RatingCount: ratingStats[0].RatingCount,
                AverageRating: ratingStats[0].AverageRating
            };
            res.json(response);
        } else {
            res.status(404).send('Recipe not found');
        }
    } catch (error) {
        console.error(`Failed to get selected recipe info: ${error}`);
        res.status(500).send(error);
    }
});


app.get('/user/friendReviews/:userID', async (req, res) => {
    try {
        const { userID } = req.params;
        const connection = await pool.getConnection();

        const sqlQuery = `
            SELECT
                r.RecipeID, r.Title,  r.Steps, r.TotalCalories, r.Ingredients,
                rv.ReviewID, rv.PublishDate, rv.Rating, rv.ReviewText,
                friendUser.FirstName as FriendName  -- Assuming the Users table has a Name column
            FROM
                Users u
                    JOIN
                Follows fw ON u.UserID = fw.UserID1
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
        res.send(rows);
    } catch (error) {
        console.error(`Failed to get user friend reviews: ${error}`);
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
           
            if(req.body.password === rows[0].Password){
                res.cookie('userID', rows[0].UserID, { maxAge: 900000});
                res.send({ status: "Logged in", userID: rows[0].UserID });
            }  else {
                res.send({ status: "Incorrect email or password"});
            }
        } else {
            res.send({ status: "User does not exist"});
        }

        connection.release();
    } catch (error) {
        res.status(500).send(error);
    }
});


app.post('/logout', async (req, res) => {
    try {
        res.clearCookie('userID');
        res.send({status: "Logged out"});

    } catch (error) {
        console.error('Logout Error: ', error);
        res.status(500).send(error);
    }
});

app.post('/review/addReview', async (req, res) => {
    const {UserID, RecipeID, Rating, ReviewText} = req.body;
    const PublishDate = new Date().toISOString().slice(0, 10);
    try {
        const connection = await pool.getConnection();

       
        const [reviewResult] = await connection.execute(
            'INSERT INTO Review (PublishDate, Rating, ReviewText) VALUES (?, ?, ?)',
            [PublishDate, Rating, ReviewText]
        );

       
        await connection.execute(
            'INSERT INTO User_Leaves_Review (UserID, ReviewID) VALUES (?, ?)',
            [UserID, reviewResult.insertId]
        );

       
        await connection.execute(
            'INSERT INTO Recipe_Has_Review (RecipeID, ReviewID) VALUES (?, ?)',
            [RecipeID, reviewResult.insertId]
        );

        connection.release();

       
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
        res.status(500).send(error);
    }
});


app.get('/reviews/:recipeID', async (req, res) => {
    try {
        const { recipeID } = req.params;
        const connection = await pool.getConnection();

       
        const [reviews] = await connection.execute(`
            SELECT r.ReviewID, r.PublishDate, r.Rating, r.ReviewText,
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
    const { userID } = req.params;

    try {
        const connection = await pool.getConnection();

       
        const [rows] = await connection.execute(
            'SELECT UserID, FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Age FROM Users WHERE UserID = ?',
            [userID]
        );

        connection.release();
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/recipes', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM Recipe'
        );
        connection.release();

        res.send(rows);
    } catch (error) {
        res.status(500).send(error);
    }
});



app.get('/recipes/search', async (req, res) => {
    const { searchTerm, filter, userID, minCalories, maxCalories } = req.query;

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
                   INNER JOIN Follows ON User_Leaves_Review.UserID = Follows.UserID2 OR User_Leaves_Review.UserID = Follows.UserID1`;
            whereConditions.push(`(Follows.UserID1 = ? OR Follows.UserID2 = ?)`);
            parameters.push(userID, userID);
            break;
        case 'likedByFriends':
            baseQuery += `JOIN User_Likes_Recipe ON Recipe.RecipeID = User_Likes_Recipe.RecipeID 
                           JOIN Follows ON User_Likes_Recipe.UserID = Follows.UserID2 `;
            whereConditions.push(`Follows.UserID1 = ?`);
            parameters.push(userID);
            break;
        case 'uploadedByFriends':
            baseQuery += `JOIN User_Uploads_Recipe ON Recipe.RecipeID = User_Uploads_Recipe.RecipeID 
                           JOIN Follows ON User_Uploads_Recipe.UserID = Follows.UserID2 `;
            whereConditions.push(`Follows.UserID1 = ?`);
            parameters.push(userID);
            break;
        case 'myList':
            baseQuery += `JOIN Custom_List_Recipes ON Recipe.RecipeID = Custom_List_Recipes.RecipeID `;
            whereConditions.push(`Custom_List_Recipes.UserID = ?`);
            parameters.push(userID);
            break;
    }

   
    if (minCalories) {
        whereConditions.push('Recipe.TotalCalories >= ?');
        parameters.push(Number(minCalories));
    }
    if (maxCalories) {
        whereConditions.push('Recipe.TotalCalories <= ?');
        parameters.push(Number(maxCalories));
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


app.post('/addToCustomList', async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { userId, recipeId } = req.body;

        if (!userId || !recipeId) {
            return res.status(400).json({
                message: 'userId and recipeId are required',
            });
        }

       
        const [result] = await connection.execute(
            'INSERT INTO Custom_List_Recipes (UserID, RecipeID) VALUES (?, ?)',
            [userId, recipeId]
        );

        if (result.affectedRows === 1) {
            res.sendStatus(201);
        } else {
            throw new Error('Insert operation failed');
        }

    } catch (error) {
        console.error('Failed to insert recipe into custom list:', error);
        res.status(500).json({
            message: 'An error occurred',
        });
    } finally {
        connection.release();
    }
});

app.delete('/removeFromCustomList', async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { userId, recipeId } = req.body;

        if (!userId || !recipeId) {
            return res.status(400).json({
                message: 'userId and recipeId are required',
            });
        }

       
        const [result] = await connection.execute(
            'DELETE FROM Custom_List_Recipes WHERE UserID = ? AND RecipeID = ?',
            [userId, recipeId]
        );

        if (result.affectedRows === 1) {
            res.sendStatus(200);
        } else {
            throw new Error('Delete operation failed');
        }

    } catch (error) {
        console.error('Failed to delete recipe from custom list:', error);
        res.status(500).json({
            message: 'An error occurred',
        });
    } finally {
        connection.release();
    }
});


app.get('/isInCustomList', async (req, res) => {
    const connection = await pool.getConnection();

    try {
        const { userId, recipeId } = req.query;

        if (!userId || !recipeId) {
            return res.status(400).json({
                message: 'userId and recipeId are required',
            });
        }

        const [rows] = await connection.execute(
            'SELECT 1 FROM Custom_List_Recipes WHERE UserID = ? AND RecipeID = ?',
            [userId, recipeId]
        );

        if (rows.length > 0) {
            res.sendStatus(200);
        } else {
            res.sendStatus(204);
        }

    } catch (error) {
        console.error('Failed to check custom list:', error);
        res.status(500).json({
            message: 'An error occurred',
        });
    } finally {
        connection.release();
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

app.put('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const { FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password } = req.body;

    try {
        const connection = await pool.getConnection();

        await connection.execute(
            'UPDATE Users SET FirstName = ?, LastName = ?, Gender = ?, Email = ?, Birthplace = ?, DateOfBirth = ?, Password = ? WHERE UserID = ?',
            [FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password, userId]
        );

        connection.release();

        res.send({status: "success"});
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/users/:userID/recipes', async (req, res) => {
    const { userID } = req.params;
    try {
        const connection = await pool.getConnection();
        const [recipes] = await connection.execute(`
            SELECT r.RecipeID, r.Title, r.Steps, r.TotalCalories, r.Ingredients
            FROM Recipe r
            JOIN User_Uploads_Recipe uur ON r.RecipeID = uur.RecipeID
            WHERE uur.UserID = ?
        `, [userID]);
        connection.release();
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes uploaded by user:', error);
        connection.release();
        res.status(500).send('Internal Server Error');
    }
});

app.get('/users/:userID/reviews', async (req, res) => {
    const { userID } = req.params;
    try {
        const connection = await pool.getConnection();
        const [reviews] = await connection.execute(`
            SELECT r.ReviewID, r.PublishDate, r.Rating, r.ReviewText, rec.Title AS RecipeTitle
            FROM Review r
            JOIN User_Leaves_Review ulr ON r.ReviewID = ulr.ReviewID
            JOIN Recipe_Has_Review rhr ON r.ReviewID = rhr.ReviewID
            JOIN Recipe rec ON rhr.RecipeID = rec.RecipeID
            WHERE ulr.UserID = ?
        `, [userID]);
        connection.release();
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews by user:', error);
        connection.release();
        res.status(500).send('Internal Server Error');
    }
});


app.get('/users/:userID/following', async (req, res) => {
    const { userID } = req.params;
    try {
        const connection = await pool.getConnection();
        const [following] = await connection.execute(
            'SELECT u.UserID, u.FirstName, u.LastName FROM Users u JOIN Follows f ON u.UserID = f.UserID2 WHERE f.UserID1 = ?',
            [userID]
        );
        connection.release();
        res.json(following);
    } catch (error) {
        console.error("Failed to retrieve following users: ", error);
        res.status(500).send(error);
    }
});

app.get('/users/:userID/followers', async (req, res) => {
    const { userID } = req.params;
    try {
        const connection = await pool.getConnection();
        const [followers] = await connection.execute(
            'SELECT u.UserID, u.FirstName, u.LastName FROM Users u JOIN Follows f ON u.UserID = f.UserID1 WHERE f.UserID2 = ?',
            [userID]
        );
        connection.release();
        res.json(followers);
    } catch (error) {
        console.error("Failed to retrieve followers: ", error);
        res.status(500).send(error);
    }
});

app.get('/recipes/liked', async (req, res) => {
    const { userId, recipeId } = req.query;

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(`
            SELECT 1 FROM User_Likes_Recipe WHERE UserID = ? AND RecipeID = ?
        `, [userId, recipeId]);
        connection.release();
        if (result.length > 0) {
            res.sendStatus(200);
        } else {
            res.sendStatus(201);
        }
    } catch (error) {
        console.error("Failed to check if recipe is liked:", error);
        connection.release();
        res.status(500).send('Internal Server Error');
    }
});

app.get('/totalLikes/:recipeId', async (req, res) => {
    const { recipeId } = req.params;

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(`
            SELECT COUNT(UserID) AS totalLikes FROM User_Likes_Recipe WHERE RecipeID = ?
        `, [recipeId]);
        connection.release();

       
        const totalLikes = result[0].totalLikes;

        res.status(200).json({ totalLikes });
    } catch (error) {
        console.error("Failed to retrieve total likes for recipe:", error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/users/customListRecipes/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const connection = await pool.getConnection();

        const query = `
            SELECT r.* FROM Recipe r
            JOIN Custom_List_Recipes clr ON r.RecipeID = clr.RecipeID
            WHERE clr.UserID = ?
        `;

        const [rows] = await connection.execute(query, [userId]);

        connection.release();

        if (rows.length > 0) {
            res.json(rows);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('Error fetching custom list recipes:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.post('/recipes/like', async (req, res) => {
    const { userId, recipeId } = req.body;

    if (!userId || !recipeId) {
        return res.status(400).send('Missing userID or recipeID');
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.execute(`
            INSERT INTO User_Likes_Recipe (UserID, RecipeID) VALUES (?, ?)
        `, [userId, recipeId]);
        res.status(201).send('Recipe liked successfully');
    } catch (error) {
        console.error("Failed to like recipe:", error);
        res.status(500).send('Internal Server Error');
    } finally {
        if (connection) {
            connection.release();
        }
    }
});


app.delete('/recipes/unlike', async (req, res) => {
    const { userId, recipeId } = req.body;

    try {
        const connection = await pool.getConnection();
        await connection.execute(`
            DELETE FROM User_Likes_Recipe WHERE UserID = ? AND RecipeID = ?
        `, [userId, recipeId]);
        connection.release();
        res.send('Like removed successfully');
    } catch (error) {
        console.error("Failed to unlike recipe:", error);
        connection.release();
        res.status(500).send('Internal Server Error');
    }
});

app.get('/followed', async (req, res) => {
    const { userId, friendId } = req.query;

   
    if (!userId || !friendId) {
        res.status(400).send('User ID and Friend ID are required');
        return;
    }

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(`
            SELECT 1 FROM Follows WHERE UserID1 = ? AND UserID2 = ?
        `, [userId, friendId]);
        connection.release();

        if (result.length > 0) {
            res.json({ followed: true });
        } else {
            res.json({ followed: false });
        }
    } catch (error) {
        console.error("Failed to check if user is followed:", error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/users/follow', async (req, res) => {
    const { userId, followedUserId } = req.body;

    try {
        const connection = await pool.getConnection();

       
        const [existingFollow] = await connection.execute(`
            SELECT 1 FROM Follows WHERE UserID1 = ? AND UserID2 = ?
        `, [userId, followedUserId]);

        if (existingFollow.length > 0) {
           
            res.status(400).json({ message: "Already following this user." });
        } else {
           
            await connection.execute(`INSERT INTO Follows (UserID1, UserID2) VALUES (?, ?)`,
                [userId, followedUserId]);

           
            res.status(201).json({ message: "Successfully followed user." });
        }

       
        connection.release();
    } catch (error) {
        console.error("Failed to follow user:", error);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/unfollow', async (req, res) => {
    const { userId, friendId } = req.body;

    try {
        const connection = await pool.getConnection();
        await connection.execute(`
            DELETE FROM Follows WHERE UserID1 = ? AND UserID2 = ?
        `, [userId, friendId]);
        connection.release();

        res.json({ success: true });
    } catch (error) {
        console.error("Failed to unfollow user:", error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

app.get('/userReviews/:userId', async (req, res) => {
    const { userId } = req.params;
    const userReviewsQuery = `SELECT ReviewID FROM User_Leaves_Review WHERE UserID = ?`;
    let result;
    try {
        const connection = await pool.getConnection();
        [result] = await connection.execute(userReviewsQuery, [userId]);
        connection.release();
    } catch (error) {
        console.error("SQL query SELECT ReviewID FROM User_Leaves_Review WHERE UserID = ? execution failed:", error);
        res.sendStatus(500);
        return;
    }
    const reviewIds = result.map((row) => row.ReviewID);
    res.send(reviewIds);
});

app.get('/getRecipeAuthor/:recipeId', async (req, res) => {
    try {
        const recipeID  = req.params.recipeId;
        const connection = await pool.getConnection();
       
        const [rows] = await connection.execute(
            'SELECT UserID FROM User_Uploads_Recipe WHERE RecipeID = ?',
            [recipeID]
        );

        connection.release();
        if(rows.length > 0) {
            res.send(rows[0]);
        }else{
            res.send("0");
        }
    } catch (error) {
        console.error(`Failed to get selected recipe author: ${error}`);
        res.status(500).send(error);
    }
});


app.get('/recipes-with-authors', async (req, res) => {
    try {
       
        const connection = await pool.getConnection();

       
        const query = `
            SELECT 
                r.RecipeID,
                r.Title,
                r.Steps,
                r.TotalCalories,
                r.Ingredients,
                CONCAT(u.FirstName, ' ', u.LastName) AS AuthorName,
                COUNT(re.ReviewID) AS NumReviews,
                COUNT(re.Rating) AS NumRatings,
                AVG(re.Rating) AS AvgRating
            FROM
                Recipe r
            LEFT JOIN
                User_Uploads_Recipe ur ON r.RecipeID = ur.RecipeID
            LEFT JOIN
                Users u ON ur.UserID = u.UserID
            LEFT JOIN
                Recipe_Has_Review rr ON r.RecipeID = rr.RecipeID
            LEFT JOIN
                Review re ON rr.ReviewID = re.ReviewID
            GROUP BY
                r.RecipeID, r.Title, r.Steps, r.TotalCalories, r.Ingredients, u.FirstName, u.LastName
        `;

       
        const [rows] = await connection.execute(query);

       
        connection.release();

       
        res.status(200).json(rows);
    } catch (error) {
        console.error('Failed to fetch recipes with authors:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/recipes-with-authors/search', async (req, res) => {
    const { searchTerm, filter, userID, minCalories, maxCalories } = req.query;

   
    let baseQuery = `
        SELECT 
            r.RecipeID,
            r.Title,
            r.Steps,
            r.TotalCalories,
            r.Ingredients,
            CONCAT(u.FirstName, ' ', u.LastName) AS AuthorName,
            IFNULL(reviewData.NumReviews, 0) AS NumReviews,
            IFNULL(reviewData.NumRatings, 0) AS NumRatings,
            IFNULL(reviewData.AvgRating, 0) AS AvgRating
        FROM
            Recipe r
        LEFT JOIN
            User_Uploads_Recipe ur ON r.RecipeID = ur.RecipeID
        LEFT JOIN
            Users u ON ur.UserID = u.UserID
        LEFT JOIN (
            SELECT 
                rr.RecipeID,
                COUNT(DISTINCT rr.ReviewID) AS NumReviews,
                COUNT(re.Rating) AS NumRatings,
                AVG(re.Rating) AS AvgRating
            FROM
                Recipe_Has_Review rr
            LEFT JOIN
                Review re ON rr.ReviewID = re.ReviewID
            GROUP BY rr.RecipeID
        ) AS reviewData ON r.RecipeID = reviewData.RecipeID
    `;

    let whereConditions = [];
    let parameters = [];

   
    if (searchTerm) {
        whereConditions.push(`(r.Title LIKE CONCAT('%', ?, '%') OR r.Ingredients LIKE CONCAT('%', ?, '%'))`);
        parameters.push(searchTerm, searchTerm);
    }

   
    switch (filter) {
        case 'reviewedByMe':
            baseQuery += `
                INNER JOIN Recipe_Has_Review rr ON r.RecipeID = rr.RecipeID
                INNER JOIN User_Leaves_Review ulr ON rr.ReviewID = ulr.ReviewID
            `;
            whereConditions.push(`ulr.UserID = ?`);
            parameters.push(userID);
            break;
        case 'likedByMe':
            baseQuery += `JOIN User_Likes_Recipe ulr ON r.RecipeID = ulr.RecipeID `;
            whereConditions.push(`ulr.UserID = ?`);
            parameters.push(userID);
            break;
        case 'uploadedByMe':
            whereConditions.push(`ur.UserID = ?`);
            parameters.push(userID);
            break;
        case 'reviewedByFriends':
            baseQuery += `
                INNER JOIN Recipe_Has_Review rr ON r.RecipeID = rr.RecipeID
                INNER JOIN User_Leaves_Review ulr ON rr.ReviewID = ulr.ReviewID
                INNER JOIN Follows f ON ulr.UserID = f.UserID2 OR ulr.UserID = f.UserID1
            `;
            whereConditions.push(`(f.UserID1 = ? OR f.UserID2 = ?)`);
            parameters.push(userID, userID);
            break;
        case 'likedByFriends':
            baseQuery += `
                JOIN User_Likes_Recipe ulr ON r.RecipeID = ulr.RecipeID
                JOIN Follows f ON ulr.UserID = f.UserID2
            `;
            whereConditions.push(`f.UserID1 = ?`);
            parameters.push(userID);
            break;
        case 'uploadedByFriends':
            baseQuery += `
                JOIN Follows f ON ur.UserID = f.UserID2
            `;
            whereConditions.push(`f.UserID1 = ?`);
            parameters.push(userID);
            break;
        case 'myList':
            baseQuery += `JOIN Custom_List_Recipes clr ON r.RecipeID = clr.RecipeID `;
            whereConditions.push(`clr.UserID = ?`);
            parameters.push(userID);
            break;
    }

   
    if (minCalories) {
        whereConditions.push('r.TotalCalories >= ?');
        parameters.push(Number(minCalories));
    }
    if (maxCalories) {
        whereConditions.push('r.TotalCalories <= ?');
        parameters.push(Number(maxCalories));
    }

   
    if (whereConditions.length > 0) {
        baseQuery += ` WHERE ${whereConditions.join(' AND ')}`;
    }

   
    baseQuery += `
        GROUP BY r.RecipeID, r.Title, r.Steps, r.TotalCalories, r.Ingredients, u.FirstName, u.LastName
    `;

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




app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));