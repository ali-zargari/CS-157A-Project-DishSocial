// populate.js
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

// Function to generate a realistic recipe title
function generateRecipeTitle() {
    const dishTypes = ['Chicken', 'Beef', 'Pork', 'Fish', 'Vegan', 'Vegetarian'];
    const cookingStyles = ['Fried', 'Baked', 'Grilled', 'Steamed', 'Roasted'];
    const dishes = ['Rice', 'Pasta', 'Salad', 'Soup', 'Stew', 'Casserole'];

    const dishType = faker.helpers.arrayElement(dishTypes);
    const cookingStyle = faker.helpers.arrayElement(cookingStyles);
    const dish = faker.helpers.arrayElement(dishes);

    return `${dishType} ${cookingStyle} ${dish}`;
}

// Function to generate steps
function generateSteps(title) {
    return [
        `Start by gathering all ingredients for ${title}.`,
        'Preheat your oven or stove to the appropriate temperature.',
        `Cook the main ingredient (${title.split(' ')[0].toLowerCase()}) as per your preference.`,
        'Mix all the ingredients thoroughly in a large bowl or pan.',
        `Serve the ${title} warm and enjoy!`
    ].join(' ');
}

// Function to generate ingredients
function generateIngredients(title) {
    const ingredientsList = {
        Chicken: ['Chicken breast', 'Soy sauce', 'Ginger', 'Garlic', 'Onion', 'Rice'],
        Beef: ['Ground beef', 'Tomato sauce', 'Garlic', 'Onion', 'Pasta'],
        Pork: ['Pork chops', 'Barbecue sauce', 'Garlic', 'Potatoes'],
        Fish: ['Salmon fillets', 'Lemon juice', 'Dill', 'Garlic', 'Olive oil'],
        Vegan: ['Tofu', 'Soy sauce', 'Broccoli', 'Garlic', 'Brown rice'],
        Vegetarian: ['Eggplant', 'Tomato', 'Basil', 'Mozzarella', 'Olive oil']
    };

    const mainIngredient = title.split(' ')[0];
    const ingredients = ingredientsList[mainIngredient] || ['Ingredient1', 'Ingredient2', 'Ingredient3'];

    return ingredients.join(', ');
}

// Generate a calorie count that's a multiple of 5
function generateTotalCalories() {
    const minCalories = 100;
    const maxCalories = 1000;
    const randomCalories = faker.number.int({ min: minCalories, max: maxCalories });
    return Math.ceil(randomCalories / 5) * 5;
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

// Delete old data
async function deleteExistingData(connection) {
    try {
        const deleteQuery = 'TRUNCATE TABLE Recipe';
        await connection.query(deleteQuery);
        console.log('Existing data deleted successfully');
    } catch (err) {
        console.error('Error deleting existing data:', err.message);
    }
}

// Generate fake data
async function generateFakeRecipes() {
    const connection = await createConnection();

    try {
        // First, delete existing data
        await deleteExistingData(connection);

        // Now, insert new fake data
        const tableName = 'Recipe'; // Target table
        const numRows = 1000; // Number of rows to generate
        const recipes = [];

        for (let i = 0; i < numRows; i++) {
            const title = generateRecipeTitle();
            const steps = generateSteps(title);
            const totalCalories = generateTotalCalories();
            const ingredients = generateIngredients(title);

            recipes.push([title, steps, totalCalories, ingredients]);
        }

        // Insert query
        const query = `INSERT INTO ${tableName} (Title, Steps, TotalCalories, Ingredients) VALUES ?`;

        await connection.query(query, [recipes]);
        console.log(`${numRows} rows inserted into ${tableName}`);
    } catch (err) {
        console.error('Error populating data:', err.message);
    } finally {
        await connection.end();
    }
}

generateFakeRecipes();