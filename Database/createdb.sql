-- CREATE SCHEMA CS_157A_Project;

USE CS_157A_Project;

-- Entities

CREATE TABLE Users
(
    UserID      INT PRIMARY KEY AUTO_INCREMENT,
    FirstName   VARCHAR(55) NOT NULL,
    LastName    VARCHAR(55) NOT NULL,
    Gender      VARCHAR(55) NOT NULL,
    Email       VARCHAR(55) NOT NULL UNIQUE,
    Birthplace  VARCHAR(55) NOT NULL,
    DateOfBirth DATE        NOT NULL,
    Age         INT         AS (TIMESTAMPDIFF(YEAR, DateOfBirth, '2024-01-01')),
    Password    VARCHAR(55) NOT NULL
);

CREATE TABLE Wall
(
    UserID      INT UNIQUE,
    WallID      INT UNIQUE,
    PRIMARY KEY (UserID, WallID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE
    -- enforces the dependency of Wall on Users
);

CREATE TABLE Review
(
    ReviewID    INT PRIMARY KEY AUTO_INCREMENT,
    PublishDate DATE NOT NULL,
    Rating      INT NOT NULL,
    ReviewText  TEXT NOT NULL

);

CREATE TABLE Recipe
(
    Title       VARCHAR(55) NOT NULL,
    RecipeID    INT PRIMARY KEY AUTO_INCREMENT,
    Steps       TEXT NOT NULL,
    TotalCalories INT NOT NULL,
    Ingredients TEXT NOT NULL
);





-- Relationships


CREATE TABLE Follows
(
    UserID1 INT,
    UserID2 INT,
    PRIMARY KEY (UserID1, UserID2),
    FOREIGN KEY (UserID1) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (UserID2) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- User_Uploads_Recipe
CREATE TABLE User_Uploads_Recipe
(
    UserID INT,
    RecipeID INT,
    UploadDate DATE NOT NULL,
    PRIMARY KEY (UserID, RecipeID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (RecipeID) REFERENCES Recipe(RecipeID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- User_Likes_Recipe
CREATE TABLE User_Likes_Recipe
(
    UserID INT,
    RecipeID INT,
    PRIMARY KEY (UserID, RecipeID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (RecipeID) REFERENCES Recipe(RecipeID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- User_Leaves_Review
CREATE TABLE User_Leaves_Review
(
    UserID INT,
    ReviewID INT,
    PRIMARY KEY (UserID, ReviewID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ReviewID) REFERENCES Review(ReviewID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Wall_Displays_Review
(
    UserID INT,
    ReviewID INT,
    PRIMARY KEY (UserID, ReviewID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ReviewID) REFERENCES Review(ReviewID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Recipe_Has_Review
(
    RecipeID INT,
    ReviewID INT,
    PRIMARY KEY (RecipeID, ReviewID),
    FOREIGN KEY (ReviewID) REFERENCES Review(ReviewID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (RecipeID) REFERENCES Recipe(RecipeID) ON DELETE CASCADE ON UPDATE CASCADE
);




-- SUB TYPES


CREATE TABLE Custom_List_Recipes (
    UserID INT,
    RecipeID INT,
    PRIMARY KEY (UserID, RecipeID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (RecipeID) REFERENCES Recipe(RecipeID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Liked_By_Friends_Recipes
(
    RecipeID INT,
    FriendID INT,
    UploaderID INT,
    PRIMARY KEY (FriendID, RecipeID),
    FOREIGN KEY (FriendID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (UploaderID, RecipeID) REFERENCES User_Likes_Recipe(UserID, RecipeID) ON DELETE CASCADE ON UPDATE CASCADE


);

CREATE TABLE Uploaded_By_Friends_Recipes
(
    RecipeID INT,
    FriendID INT,
    UploaderID INT,
    PRIMARY KEY (FriendID, RecipeID),
    FOREIGN KEY (FriendID) REFERENCES Follows(UserID2) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (UploaderID, RecipeID) REFERENCES User_Uploads_Recipe(UserID, RecipeID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Reviewed_By_Friends_Recipes(
    RecipeID INT,
    ReviewID INT,
    FriendID INT,
    PRIMARY KEY (FriendID, ReviewID, RecipeID),
    FOREIGN KEY (FriendID) REFERENCES User_Leaves_Review(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (FriendID) REFERENCES Follows(UserID2) ON DELETE CASCADE ON UPDATE CASCADE, -- To make sure the friend is actually a friend
    FOREIGN KEY (ReviewID) REFERENCES User_Leaves_Review(ReviewID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (RecipeID) REFERENCES Recipe_Has_Review(RecipeID) ON DELETE CASCADE ON UPDATE CASCADE

);


-- Triggers


-- Trigger to create a wall for a user when a user is created
DELIMITER //

CREATE TRIGGER Create_Wall
    AFTER INSERT ON Users
    FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT * FROM Wall WHERE UserID = NEW.UserID) THEN
        INSERT INTO Wall (UserID, WallID) VALUES (NEW.UserID, NEW.UserID);
    END IF;
END;


-- Trigger to add reviews to a user's wall when a review is added
CREATE TRIGGER After_Review_Added
    AFTER INSERT ON User_Leaves_Review
    FOR EACH ROW
BEGIN
    IF NOT EXISTS (SELECT * FROM Wall_Displays_Review WHERE UserID = NEW.UserID AND ReviewID = NEW.ReviewID) THEN
        INSERT INTO Wall_Displays_Review (UserID, ReviewID)
        VALUES (NEW.UserID, NEW.ReviewID);
    END IF;
END;


-- Trigger to add recipe to Liked_By_Friends_Recipes when a friend likes a recipe
CREATE TRIGGER After_Friend_Likes_Recipe
    AFTER INSERT ON User_Likes_Recipe
    FOR EACH ROW
BEGIN
    DECLARE fwUser INT;
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur CURSOR FOR SELECT DISTINCT UserID2 FROM Follows WHERE UserID1 = NEW.UserID UNION ALL SELECT DISTINCT UserID1 FROM Follows WHERE UserID2 = NEW.UserID;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO fwUser;
        IF done THEN
            LEAVE read_loop;
        END IF;
        IF NOT EXISTS (SELECT * FROM Liked_By_Friends_Recipes WHERE RecipeID = NEW.RecipeID AND FriendID = fwUser) THEN
            INSERT INTO Liked_By_Friends_Recipes (RecipeID, FriendID, UploaderID)
            VALUES (NEW.RecipeID, fwUser, NEW.UserID);
        END IF;
    END LOOP;
    CLOSE cur;
END;


-- Trigger to add uploaded recipes for a new friend (one-way)
CREATE TRIGGER After_Friend_Uploads_Recipe
    AFTER INSERT ON User_Uploads_Recipe
    FOR EACH ROW
BEGIN
    DECLARE fwUser INT;
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur CURSOR FOR SELECT UserID2 FROM Follows WHERE UserID1 = NEW.UserID;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO fwUser;
        IF done THEN
            LEAVE read_loop;
        END IF;
        IF NOT EXISTS (
            SELECT * FROM Uploaded_By_Friends_Recipes
            WHERE RecipeID = NEW.RecipeID AND FriendID = fwUser
        ) THEN
            INSERT INTO Uploaded_By_Friends_Recipes (RecipeID, FriendID)
            VALUES (NEW.RecipeID, fwUser);
        END IF;
    END LOOP;
    CLOSE cur;
END //


-- Trigger to add reviewed recipes when a new friend is followed (one-way)
CREATE TRIGGER After_Friend_Reviews_Recipe
    AFTER INSERT ON User_Leaves_Review
    FOR EACH ROW
BEGIN
    IF NOT EXISTS (
        SELECT * FROM Reviewed_By_Friends_Recipes
        WHERE ReviewID = NEW.ReviewID
    ) THEN
        INSERT INTO Reviewed_By_Friends_Recipes (RecipeID, ReviewID, FriendID)
        SELECT rhr.RecipeID, NEW.ReviewID, fw.UserID2
        FROM Follows fw
        JOIN Recipe_Has_Review rhr ON rhr.ReviewID = NEW.ReviewID
        WHERE fw.UserID1 = NEW.UserID OR fw.UserID2 = NEW.UserID;
    END IF;
END //



-- Trigger to prevent a user from uploading the same recipe twice
CREATE TRIGGER Check_Upload_Duplication
    BEFORE INSERT ON User_Uploads_Recipe
    FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM User_Uploads_Recipe
        WHERE UserID = NEW.UserID AND RecipeID = NEW.RecipeID
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User has already uploaded this recipe';
    END IF;
END;




CREATE TRIGGER Delete_Friends_Recipes
    AFTER DELETE ON Follows
    FOR EACH ROW
BEGIN
    -- Delete only from Liked_By_Friends_Recipes if UserID1 unfollows UserID2
    DELETE FROM Liked_By_Friends_Recipes
    WHERE FriendID = OLD.UserID1 AND RecipeID IN (
        SELECT RecipeID
        FROM User_Likes_Recipe
        WHERE UserID = OLD.UserID2
    );

    -- Delete only from Uploaded_By_Friends_Recipes if UserID1 unfollows UserID2
    DELETE FROM Uploaded_By_Friends_Recipes
    WHERE FriendID = OLD.UserID1 AND RecipeID IN (
        SELECT RecipeID
        FROM User_Uploads_Recipe
        WHERE UserID = OLD.UserID2
    );

    -- Delete only from Reviewed_By_Friends_Recipes if UserID1 unfollows UserID2
    DELETE FROM Reviewed_By_Friends_Recipes
    WHERE FriendID = OLD.UserID1 AND ReviewID IN (
        SELECT ReviewID
        FROM User_Leaves_Review
        WHERE UserID = OLD.UserID2
    );
END //


DELIMITER ;