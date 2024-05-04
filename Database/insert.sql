-- Inserting dummy data into Users
-- Assuming a trigger exists to automatically create a Wall entry for each new User
INSERT INTO Users (FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password)
VALUES
('John', 'Doe', 'Male', 'john.doe@example.com', 'San Francisco', '1990-05-15', 'johnsPassword123'),
('Jane', 'Smith', 'Female', 'jane.smith@example.com', 'Los Angeles', '1988-08-23', 'janesPassword123'),
('Alice', 'Wong', 'Female', 'alice.wong@example.com', 'Seattle', '1992-11-08', 'alicesPassword456'),
('Ethan', 'Hunt', 'Male', 'ethan.hunt@example.com', 'Chicago', '1987-04-12', 'ethansPassword789'),
('Nora', 'Jones', 'Female', 'nora.jones@example.com', 'Austin', '1993-02-24', 'norasPassword012'),
('Robert', 'Johnson', 'Male', 'robert.johnson@example.com', 'Dallas', '1981-06-09', 'robertPassword673'),
('David', 'Rodriguez', 'Male', 'david.rodriguez@example.com', 'San Diego', '2002-03-10', 'davidPassword012'),
('John', 'Johnson', 'Male', 'john.johnson@example.com', 'Dallas', '1967-11-28', 'johnPassword015'),
('Emily', 'Rodriguez', 'Female', 'emily.rodriguez@example.com', 'San Antonio', '1992-07-28', 'emilyPassword892'),
('Sarah', 'Brown', 'Female', 'sarah.brown@example.com', 'Philadelphia', '1977-12-07', 'SarahPassword098');

-- Inserting dummy data into Review
INSERT INTO Review (PublishDate, NumVotes, Rating, ReviewText) VALUES
('2023-12-01', 15, 4, 'Really enjoyed this recipe! Easy to follow.'),
('2023-12-05', 23, 5, 'Delicious! Will make again.'),
('2023-11-15', 34, 5, 'This is now a family favorite. Highly recommend.'),
('2023-11-20', 12, 3, 'Good, but a bit time-consuming.'),
('2023-12-03', 18, 2, 'Not what I expected, needs more flavor.'),
('2024-05-04', 41, 2, 'Exceeded my expectations, great job!'),
('2024-05-04', 11, 3, 'Not bad, but could use a little improvement on service.'),
('2024-05-04', 19, 2, 'Just okay, not memorable.'),
('2024-05-04', 49, 2, 'Absolutely loved it, will definitely come back!'),
('2024-05-04', 46, 1, 'Horrendous in every way, a complete disaster from start to finish. Absolutely disgusting!');

-- Inserting dummy data into Recipe
INSERT INTO Recipe (Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories, NumIngredients)
VALUES
('Spaghetti Bolognese', '30 min', '15 min', 'Medium', '1. Boil pasta...\n2. Cook sauce...', 850, 10),
('Classic Cheeseburger', '10 min', '5 min', 'High', '1. Grill patties...\n2. Assemble burger...', 650, 7),
('Vegetarian Pizza', '20 min', '10 min', 'High', '1. Prepare dough...\n2. Add toppings...', 750, 8),
('Chicken Caesar Salad', '15 min', '10 min', 'None', '1. Grill chicken...\n2. Toss salad...', 550, 7),
('Beef Stroganoff', '40 min', '15 min', 'Medium', '1. Sauté beef...\n2. Prepare sauce...', 900, 12),
('Quinoa Salad', '25 min', '5 min', 'None', '1. Cook quinoa...\n2. Mix ingredients...', 400, 5),
('Chocolate Chip Cookies', '10 min', '15 min', 'High', '1. Mix dough...\n2. Bake cookies...', 300, 6);
('Traditional Lasagna', '30 minutes', '15 minutes', '200°C', 'Start with boiling lasagna noodles until al dente.\nIn a separate pan, cook ground beef with onions and garlic.\nLayer with ricotta cheese and marinara sauce in a baking dish.\nTop with mozzarella and bake.', 700, 9),
('Vegetarian Chili', '45 minutes', '20 minutes', '180°C', 'Soak kidney beans overnight.\nSauté onions, garlic, bell peppers in olive oil.\nAdd chili powder and tomatoes, then simmer.\nAdd beans and cook until flavors meld.\nServe with cornbread.', 550, 10),
('Chocolate Chip Cookies', '15 minutes', '10 minutes', '175°C', 'Combine softened butter with sugar.\nAdd eggs and vanilla extract.\nMix in flour, baking soda, and salt.\nStir in chocolate chips.\nDrop spoonfuls on baking sheet and bake at 175°C for 10-12 minutes.', 200, 7),
('Perfect Roast Chicken', '1 hour 20 minutes', '15 minutes', '220°C', 'Rub chicken with olive oil and season with salt, pepper, and herbs.\nPlace in a roasting pan.\nRoast in preheated oven at 220°C.\nBaste periodically until the skin is crisp.\nRest before carving.', 1200, 6),
('Mushroom Risotto', '25 minutes', '10 minutes', '175°C', 'Sauté chopped onions and mushrooms in butter.\nAdd arborio rice and toast slightly.\nGradually add chicken broth, stirring constantly.\nFinish with parmesan cheese and a knob of butter for creaminess.', 450, 8),
('Apple Pie', '1 hour', '30 minutes', '200°C', 'Prepare pie dough, roll out and fit into pie dish.\nPeel and slice apples, toss with sugar, cinnamon, and nutmeg.\nFill pie shell, top with lattice crust.\nBake until the crust is golden brown.', 650, 5),
('Pancakes', '10 minutes', '5 minutes', 'None', 'Mix flour, baking powder, sugar, and salt.\nIn another bowl, beat eggs with milk and melted butter.\nCombine wet and dry ingredients.\nPour batter onto hot griddle and cook until bubbles form, flip once.', 300, 4),
('Fish Tacos', '20 minutes', '10 minutes', 'None', 'Marinate fish fillets in lime juice, chili powder, and salt.\nGrill until cooked.\nServe on corn tortillas with cabbage slaw, avocado slices, and a squeeze of fresh lime juice.', 500, 8),
('Beef Stew', '2 hours', '20 minutes', '175°C', 'Season beef chunks with salt and pepper, brown in hot oil.\nAdd chopped onions, carrots, and potatoes.\nPour in beef stock, bring to boil, then simmer covered until meat is tender.\nThicken with flour if desired.', 850, 12),
('Vegan Curry', '40 minutes', '15 minutes', '180°C', 'Sauté onions and garlic in oil.\nAdd chopped bell peppers and carrots.\nStir in curry powder, add coconut milk and chickpeas.\nSimmer until vegetables are tender.\nServe over cooked basmati rice.', 400, 9);


-- Inserting dummy data into Ingredient
INSERT INTO Ingredient (Name, Type, Calories)
VALUES
('Spaghetti', 'Pasta', 300),
('Ground Beef', 'Meat', 250),
('Carrots', 'Vegetable', 41),
('Eggs', 'Protein', 70),
('Chicken Breast', 'Protein', 165),
('Quinoa', 'Grain', 120),
('Beef', 'Protein', 250),
('Mozzarella Cheese', 'Dairy', 280),
('Chocolate Chips', 'Confectionery', 50),
('Lettuce', 'Vegetable', 5),
('Tomato Sauce', 'Condiment', 20),
('All-purpose Flour', 'Baking', 364);


-- Inserting dummy data into Vote and its subtypes
-- Note: Inserting a vote and then classifying it into Tasty or Not Tasty
INSERT INTO Vote (UserID)
VALUES
(1),
(2),
(3),

(4),
(5);

INSERT INTO Useful_Vote (VoteID)
VALUES
(1),
(3),
(5);

INSERT INTO Not_Useful_Vote (VoteID)
VALUES
(2),
(4);

-- Inserting dummy data into relationship tables
-- Note: For relationship tables, data is inserted based on existing entries in the referenced tables

-- Friends_With
INSERT INTO Friends_With (UserID1, UserID2)
VALUES
(1, 2),
(2, 1),
(1, 3),
(3, 1),
(2, 4),
(4, 2),
(3, 5),
(5, 3),
(4, 1),
(1, 4),
(5, 2),
(2, 5);

-- User_Uploads_Recipe
INSERT INTO User_Uploads_Recipe (UserID, RecipeID, UploadDate)
VALUES
(1, 1, '2023-12-10'),
(2, 2, '2023-12-15'),
(3, 3, '2023-12-12'),
(4, 4, '2023-12-14'),
(5, 5, '2023-12-16');

-- User_Likes_Recipe
INSERT INTO User_Likes_Recipe (UserID, RecipeID) VALUES
(1, 5),
(2, 4),
(3, 3),
(4, 2),
(5, 1),
(1, 2),
(2, 3),
(3, 4),
(4, 5);

-- User_Leaves_Review
INSERT INTO User_Leaves_Review (UserID, ReviewID)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- User_Gives_Vote
INSERT INTO User_Gives_Vote (UserID, VoteID)
VALUES
(1, 1),
(2, 2),
(1, 3),
(2, 4),
(3, 5);

-- Wall_Displays_Review, Recipe_Has_Review, Recipe_Contains_Ingredient
-- Assuming these don't have triggers and need manual insertion
-- Using a trigger for this.

INSERT INTO Recipe_Has_Review (RecipeID, ReviewID)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

INSERT INTO Recipe_Contains_Ingredient (RecipeID, IngredientID) VALUES
(3, 6),
(3, 9),
(4, 3),
(4, 8),
(5, 5),
(5, 1),
(6, 4),
(6, 8),
(7, 10),
(7, 7);

-- Recipes added to list by user.
INSERT INTO Custom_List_Recipes (UserID, RecipeID) VALUES
(1, 3),
(2, 4),
(3, 5),
(4, 1),
(5, 2);



-- USING TRIGGER FOR THIS.
-- INSERT INTO Liked_By_Friends_Recipes (RecipeID, FriendID)
-- VALUES
-- (2, 1),
-- (1, 2);

-- USING TRIGGER FOR THIS.
-- INSERT INTO Uploaded_By_Friends_Recipes (RecipeID, FriendID)
-- VALUES
-- (1, 2),
-- (2, 1);

-- USING TRIGGER FOR THIS.
-- INSERT INTO Reviewed_By_Friends_Recipes (RecipeID, ReviewID, FriendID)
-- VALUES
-- (1, 2, 1),
-- (2, 1, 2);
