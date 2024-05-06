const mysql = require('mysql2/promise');

// Database connection
const connectionConfig = {
    host: 'mysql-206af299-sjsu-b628.a.aivencloud.com',
    port: 19243,
    user: 'avnadmin', // Replace with your MySQL username
    password: 'AVNS_KPqKJ44iZGhPb5xCUgA', // Replace with your MySQL password
    database: 'CS_157A_Project', // Replace with your MySQL database name
};

// Establish connection and delete rows
async function deleteRecipes() {
    try {
        const connection = await mysql.createConnection(connectionConfig);

        const deleteQuery = 'DELETE FROM Recipe WHERE RecipeID > 3;';
        const [result] = await connection.query(deleteQuery);

        console.log(`${result.affectedRows} rows deleted successfully`);
        await connection.end();
    } catch (err) {
        console.error('Error deleting rows:', err.message);
    }
}

deleteRecipes();
