-- Inserting dummy data into Users
-- Assuming a trigger exists to automatically create a Wall entry for each new User
INSERT INTO Users (FirstName, LastName, Gender, Email, Birthplace, DateOfBirth, Password)
VALUES
('John', 'Doe', 'Male', 'john.doe@example.com', 'San Francisco', '1990-05-15', 'johnsPassword123'),
('Jane', 'Smith', 'Female', 'jane.smith@example.com', 'Los Angeles', '1988-08-23', 'janesPassword123');

-- Inserting dummy data into Review
INSERT INTO Review (PublishDate, NumVotes, Rating, ReviewText)
VALUES
('2023-12-01', 15, 4, 'Really enjoyed this recipe! Easy to follow.'),
('2023-12-05', 23, 5, 'Delicious! Will make again.');

-- Inserting dummy data into Recipe
INSERT INTO Recipe (Title, CookTime, PrepTime, CookTemp, Steps, TotalCalories, NumIngredients)
VALUES
('Spaghetti Bolognese', '30 min', '15 min', 'Medium', '1. Boil pasta...\n2. Cook sauce...', 850, 10),
('Classic Cheeseburger', '10 min', '5 min', 'High', '1. Grill patties...\n2. Assemble burger...', 650, 7);

-- Inserting dummy data into Ingredient
INSERT INTO Ingredient (Name, Type, Calories)
VALUES
('Spaghetti', 'Pasta', 300),
('Ground Beef', 'Meat', 250);

-- Inserting dummy data into Vote and its subtypes
-- Note: Inserting a vote and then classifying it into Tasty or Not Tasty
INSERT INTO Vote (UserID)
VALUES
(1),
(2);

INSERT INTO Useful_Vote (VoteID)
VALUES
(1);

INSERT INTO Not_Useful_Vote (VoteID)
VALUES
(2);

-- Inserting dummy data into relationship tables
-- Note: For relationship tables, data is inserted based on existing entries in the referenced tables

-- Friends_With
INSERT INTO Friends_With (UserID1, UserID2)
VALUES
(1, 2),
(2, 1);

-- User_Uploads_Recipe
INSERT INTO User_Uploads_Recipe (UserID, RecipeID, UploadDate)
VALUES
(1, 1, '2023-12-10'),
(2, 2, '2023-12-15');

-- User_Likes_Recipe
INSERT INTO User_Likes_Recipe (UserID, RecipeID)
VALUES
(1, 2),
(2, 1);

-- User_Leaves_Review
INSERT INTO User_Leaves_Review (UserID, ReviewID)
VALUES
(1, 1),
(2, 2);

-- User_Gives_Vote
INSERT INTO User_Gives_Vote (UserID, VoteID)
VALUES
(1, 1),
(2, 2);

-- Wall_Displays_Review, Recipe_Has_Review, Recipe_Contains_Ingredient
-- Assuming these don't have triggers and need manual insertion
-- Using a trigger for this.

INSERT INTO Recipe_Has_Review (RecipeID, ReviewID)
VALUES
(1, 1),
(2, 2);

INSERT INTO Recipe_Contains_Ingredient (RecipeID, IngredientID)
VALUES
(1, 1),
(2, 2);

-- Custom_List_Recipes, Liked_By_Friends_Recipes, Uploaded_By_Friends_Recipes, Reviewed_By_Friends_Recipes
-- These are more complex relationships and would likely not have triggers, so manual insertion is needed
INSERT INTO Custom_List_Recipes (UserID, RecipeID)
VALUES
(1, 1),
(2, 2);


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

INSERT INTO Reviewed_By_Friends_Recipes (RecipeID, ReviewID, FriendID)
VALUES
(1, 2, 1),
(2, 1, 2);
