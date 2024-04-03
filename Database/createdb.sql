-- CREATE SCHEMA CS_157A_Project;

USE CS_157A_Project;


-- TODO: Add Constraints


-- Entities

CREATE TABLE Users
(
    UserID      INT PRIMARY KEY AUTO_INCREMENT,
    FirstName   VARCHAR(55) NOT NULL,
    LastName    VARCHAR(55) NOT NULL,
    Gender      VARCHAR(55) NOT NULL,
    Email       VARCHAR(55) NOT NULL,
    Birthplace  VARCHAR(55) NOT NULL,
    DateOfBirth DATE        NOT NULL,
    Age         INT         AS (TIMESTAMPDIFF(YEAR, DateOfBirth, '2024-01-01')),
    Password    VARCHAR(55) NOT NULL
);

CREATE TABLE Wall
(
    UserID      INT UNIQUE,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
    -- enforces the dependency of Wall on Users
);

CREATE TABLE Review
(
    ReviewID    INT PRIMARY KEY AUTO_INCREMENT,
    PublishDate DATE NOT NULL,
    NumVotes    INT NOT NULL,
    Rating      INT NOT NULL,
    ReviewText  TEXT NOT NULL

);

CREATE TABLE Recipe
(
    Title       VARCHAR(55) NOT NULL,
    CookTime    VARCHAR(55) NOT NULL,
    PrepTime    VARCHAR(55) NOT NULL,
    CookTemp    VARCHAR(55) NOT NULL,
    RecipeID    INT PRIMARY KEY AUTO_INCREMENT,
    Steps       TEXT NOT NULL,
    TotalCalories INT NOT NULL,
    NumIngredients INT NOT NULL
);

CREATE TABLE Ingredient
(
    IngredientID INT PRIMARY KEY AUTO_INCREMENT,
    Name         VARCHAR(55) NOT NULL,
    Type         VARCHAR(55) NOT NULL,
    Calories     INT NOT NULL
);

CREATE TABLE Vote
(
    VoteID INT AUTO_INCREMENT,
    UserID INT,
    PRIMARY KEY (VoteID, UserID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Tasty_Vote
(
    VoteID INT PRIMARY KEY,
    FOREIGN KEY (VoteID) REFERENCES Vote(VoteID)
);

CREATE TABLE Not_Tasty_Vote
(
    VoteID INT PRIMARY KEY,
    FOREIGN KEY (VoteID) REFERENCES Vote(VoteID)
);



-- Relationships


CREATE TABLE Friends_With
(
    UserID1 INT,
    UserID2 INT,
    PRIMARY KEY (UserID1, UserID2),
    FOREIGN KEY (UserID1) REFERENCES Users(UserID),
    FOREIGN KEY (UserID2) REFERENCES Users(UserID)
);

-- User_Uploads_Recipe
CREATE TABLE User_Uploads_Recipe
(
    UserID INT,
    RecipeID INT,
    UploadDate DATE NOT NULL,
    PRIMARY KEY (UserID, RecipeID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (RecipeID) REFERENCES Recipe(RecipeID)
);

-- User_Likes_Recipe
CREATE TABLE User_Likes_Recipe
(
    UserID INT,
    RecipeID INT,
    PRIMARY KEY (UserID, RecipeID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (RecipeID) REFERENCES Recipe(RecipeID)
);

-- User_Leaves_Review
CREATE TABLE User_Leaves_Review
(
    UserID INT,
    ReviewID INT,
    PRIMARY KEY (UserID, ReviewID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ReviewID) REFERENCES Review(ReviewID)
);

CREATE TABLE Wall_Displays_Review
(
    UserID INT,
    ReviewID INT,
    PRIMARY KEY (UserID, ReviewID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ReviewID) REFERENCES Review(ReviewID)
);

CREATE TABLE Recipe_Has_Review
(
    RecipeID INT,
    ReviewID INT,
    PRIMARY KEY (RecipeID, ReviewID),
    FOREIGN KEY (ReviewID) REFERENCES Review(ReviewID),
    FOREIGN KEY (RecipeID) REFERENCES Recipe(RecipeID)
);

CREATE TABLE Recipe_Contains_Ingredient
(
    RecipeID INT,
    IngredientID INT,
    PRIMARY KEY (RecipeID, IngredientID),
    FOREIGN KEY (RecipeID) REFERENCES Recipe(RecipeID),
    FOREIGN KEY (IngredientID) REFERENCES Ingredient(IngredientID)
);




-- SUB TYPES


CREATE TABLE Custom_List_Recipes (
    UserID INT,
    RecipeID INT,
    PRIMARY KEY (UserID, RecipeID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (RecipeID) REFERENCES Recipe(RecipeID)
);

CREATE TABLE Liked_By_Friends_Recipes ( -- Junction table for Liked_by_Friend relationship
    RecipeID INT,
    FriendID INT,
    PRIMARY KEY (FriendID, RecipeID),
    FOREIGN KEY (FriendID) REFERENCES User_Likes_Recipe(UserID),
    FOREIGN KEY (FriendID) REFERENCES Friends_With(UserID2),
    FOREIGN KEY (RecipeID) REFERENCES User_Likes_Recipe(RecipeID)
);

CREATE TABLE Uploaded_By_Friends_Recipes (
    RecipeID INT,
    FriendID INT,
    PRIMARY KEY (FriendID, RecipeID),
    FOREIGN KEY (FriendID) REFERENCES User_Uploads_Recipe(UserID),
    FOREIGN KEY (FriendID) REFERENCES Friends_With(UserID2),
    FOREIGN KEY (RecipeID) REFERENCES User_Uploads_Recipe(RecipeID)
);

CREATE TABLE Reviewed_By_Friends_Recipes(
    RecipeID INT,
    ReviewID INT,
    FriendID INT,
    PRIMARY KEY (FriendID, ReviewID, RecipeID),
    FOREIGN KEY (FriendID) REFERENCES User_Leaves_Review(UserID),
    FOREIGN KEY (FriendID) REFERENCES Friends_With(UserID2), -- To make sure the friend is actually a friend
    FOREIGN KEY (ReviewID) REFERENCES User_Leaves_Review(ReviewID),
    FOREIGN KEY (RecipeID) REFERENCES Recipe_Has_Review(RecipeID)

);
