const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');

// Database connection
const connectionConfig = {
    host: 'mysql-206af299-sjsu-b628.a.aivencloud.com',
    port: 19243,
    user: 'avnadmin', // Replace with your MySQL username
    password: 'AVNS_KPqKJ44iZGhPb5xCUgA', // Replace with your MySQL password
    database: 'CS_157A_Project', // Replace with your MySQL database name
};


// Generate realistic user data
function generateUser() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const gender = faker.helpers.arrayElement(['Male', 'Female']);
    const email = faker.internet.email({ firstName, lastName });
    const birthplace = faker.location.city();
    const dateOfBirth = faker.date.between({ from: '1960-01-01', to: '2003-12-31' }).toISOString().split('T')[0];
    const password = faker.internet.password(12);

    return [firstName, lastName, gender, email, birthplace, dateOfBirth, password];
}

// Establish connection
async function createConnection() {
    try {
        const connection = await mysql.createConnection(connectionConfig);
        return connection;
    } catch (err) {
        console.error('Error establishing connection:', err.message);
        process.exit(1);
    }
}

// Generate fake data
async function generateFakeUsers() {
    const connection = await createConnection();

    try {
        const tableName = 'Users'; // Target table
        const numRows = 200; // Number of rows to generate
        const users = [];

        for (let i = 0; i < numRows; i++) {
            const user = generateUser();
            users.push(user);
        }

        // Insert query
        const query = `INSERT INTO ${tableName} (FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password) VALUES ?`;

        await connection.query(query, [users]);
        console.log(`${numRows} rows inserted into ${tableName}`);
    } catch (err) {
        console.error('Error populating data:', err.message);
    } finally {
        await connection.end();
    }
}

generateFakeUsers();