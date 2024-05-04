-- Inserting dummy data into Users
-- Assuming a trigger exists to automatically create a Wall entry for each new User
INSERT INTO Users (FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password)
VALUES
('John', 'Doe', 'Male', 'john.doe@example.com', 'San Francisco', '1990-05-15', 'johnsPassword123'),
('Jane', 'Smith', 'Female', 'jane.smith@example.com', 'Los Angeles', '1988-08-23', 'janesPassword123'),
('Alice', 'Wong', 'Female', 'alice.wong@example.com', 'Seattle', '1992-11-08', 'alicesPassword456'),
('Ethan', 'Hunt', 'Male', 'ethan.hunt@example.com', 'Chicago', '1987-04-12', 'ethansPassword789'),
('Nora', 'Jones', 'Female', 'nora.jones@example.com', 'Austin', '1993-02-24', 'norasPassword012');


-- Inserting dummy data into Review
INSERT INTO Review (PublishDate,  Rating, ReviewText) VALUES
('2023-12-01',  4, 'Really enjoyed this recipe! Easy to follow.'),
('2023-12-05',  5, 'Delicious! Will make again.'),
('2023-11-15',  5, 'This is now a family favorite. Highly recommend.'),
('2023-11-20',  3, 'Good, but a bit time-consuming.'),
('2023-12-03',  2, 'Not what I expected, needs more flavor.');

-- Inserting dummy data into Recipe
INSERT INTO Recipe (Title,  Steps, TotalCalories, Ingredients)
VALUES
('Spaghetti Bolognese',   '1. Boil pasta...\n2. Cook sauce...', 850, 10),
('Classic Cheeseburger',  '1. Grill patties...\n2. Assemble burger...', 650, 7),
('Vegetarian Pizza',   '1. Prepare dough...\n2. Add toppings...', 750, 8),
('Chicken Caesar Salad',   '1. Grill chicken...\n2. Toss salad...', 550, 7),
('Beef Stroganoff',   '1. Sauté beef...\n2. Prepare sauce...', 900, 12),
('Quinoa Salad',   '1. Cook quinoa...\n2. Mix ingredients...', 400, 5),
('Chocolate Chip Cookies',   '1. Mix dough...\n2. Bake cookies...', 300, 6);



-- Inserting dummy data into relationship tables
-- Note: For relationship tables, data is inserted based on existing entries in the referenced tables

-- Follows
INSERT INTO Follows (UserID1, UserID2)
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
