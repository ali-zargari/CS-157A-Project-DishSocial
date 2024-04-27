-- CREATE SCHEMA CS_157A_Project;

USE CS_157A_Project;

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
    WallID      INT UNIQUE,
    PRIMARY KEY (UserID, WallID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE
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
    RecipeID    INT PRIMARY KEY AUTO_INCREMENT,
    Steps       TEXT NOT NULL,
    TotalCalories INT NOT NULL,
    Ingredients TEXT NOT NULL
);



CREATE TABLE Vote
(
    VoteID INT AUTO_INCREMENT,
    UserID INT,
    PRIMARY KEY (VoteID, UserID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Useful_Vote
(
    VoteID INT PRIMARY KEY,
    FOREIGN KEY (VoteID) REFERENCES Vote(VoteID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Not_Useful_Vote
(
    VoteID INT PRIMARY KEY,
    FOREIGN KEY (VoteID) REFERENCES Vote(VoteID) ON DELETE CASCADE ON UPDATE CASCADE
);



-- Relationships


CREATE TABLE Friends_With
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

CREATE TABLE User_Gives_Vote
(
    UserID INT,
    VoteID INT,
    PRIMARY KEY (UserID, VoteID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (VoteID) REFERENCES Vote(VoteID) ON DELETE CASCADE ON UPDATE CASCADE
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
    FOREIGN KEY (FriendID) REFERENCES Friends_With(UserID2) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (UploaderID, RecipeID) REFERENCES User_Likes_Recipe(UserID, RecipeID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Uploaded_By_Friends_Recipes
(
    RecipeID INT,
    FriendID INT,
    UploaderID INT,
    PRIMARY KEY (FriendID, RecipeID),
    FOREIGN KEY (FriendID) REFERENCES Friends_With(UserID2) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (UploaderID, RecipeID) REFERENCES User_Uploads_Recipe(UserID, RecipeID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Reviewed_By_Friends_Recipes(
    RecipeID INT,
    ReviewID INT,
    FriendID INT,
    PRIMARY KEY (FriendID, ReviewID, RecipeID),
    FOREIGN KEY (FriendID) REFERENCES User_Leaves_Review(UserID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (FriendID) REFERENCES Friends_With(UserID2) ON DELETE CASCADE ON UPDATE CASCADE, -- To make sure the friend is actually a friend
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
    INSERT INTO Wall (UserID, WallID) VALUES (NEW.UserID, NEW.UserID);
END;


-- Trigger to add reviews to a user's wall when a review is added
CREATE TRIGGER After_Review_Added
AFTER INSERT ON User_Leaves_Review
FOR EACH ROW
BEGIN
    INSERT INTO Wall_Displays_Review (UserID, ReviewID)
    VALUES (NEW.UserID, NEW.ReviewID);
END;


-- Trigger to add recipe to Liked_By_Friends_Recipes when a friend likes a recipe
CREATE TRIGGER After_Friend_Likes_Recipe
AFTER INSERT ON User_Likes_Recipe
FOR EACH ROW
BEGIN
    DECLARE fwUser INT;
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur CURSOR FOR SELECT DISTINCT UserID2 FROM Friends_With WHERE UserID1 = NEW.UserID UNION ALL SELECT DISTINCT UserID1 FROM Friends_With WHERE UserID2 = NEW.UserID;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO fwUser;
        IF done THEN
            LEAVE read_loop;
        END IF;
        INSERT INTO Liked_By_Friends_Recipes (RecipeID, FriendID, UploaderID)
        SELECT NEW.RecipeID, fwUser, NEW.UserID
        WHERE NOT EXISTS (SELECT * FROM Liked_By_Friends_Recipes WHERE RecipeID = NEW.RecipeID AND FriendID = fwUser);
    END LOOP;
    CLOSE cur;
END;




-- Trigger to add recipe to Uploaded_By_Friends_Recipes when a friend uploads a recipe
CREATE TRIGGER After_Friend_Uploads_Recipe
AFTER INSERT ON User_Uploads_Recipe
FOR EACH ROW
BEGIN
    DECLARE fwUser INT;
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur CURSOR FOR SELECT UserID2 FROM Friends_With WHERE UserID1 = NEW.UserID UNION ALL SELECT UserID1 FROM Friends_With WHERE UserID2 = NEW.UserID;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO fwUser;
        IF done THEN
            LEAVE read_loop;
        END IF;
        INSERT INTO Uploaded_By_Friends_Recipes (RecipeID, FriendID)
        SELECT NEW.RecipeID, fwUser
        WHERE NOT EXISTS (SELECT * FROM Uploaded_By_Friends_Recipes WHERE RecipeID = NEW.RecipeID AND FriendID = fwUser);
    END LOOP;
    CLOSE cur;
END;




-- Trigger to add recipe to Reviewed_By_Friends_Recipes when a friend reviews a recipe
CREATE TRIGGER After_Friend_Reviews_Recipe
AFTER INSERT ON User_Leaves_Review
FOR EACH ROW
BEGIN
    INSERT INTO Reviewed_By_Friends_Recipes (RecipeID, ReviewID, FriendID)
    SELECT rhr.RecipeID, NEW.ReviewID, fw.UserID2
    FROM Friends_With fw
    JOIN Recipe_Has_Review rhr ON rhr.ReviewID = NEW.ReviewID
    WHERE fw.UserID1 = NEW.UserID OR fw.UserID2 = NEW.UserID;
END;





-- Trigger to update the number of votes when a vote is added
CREATE TRIGGER Update_NumVotes
AFTER INSERT ON Vote
FOR EACH ROW
BEGIN
    UPDATE Review
    SET NumVotes = NumVotes + 1
    WHERE ReviewID = NEW.VoteID;
END;






-- Trigger to update the number of votes when a vote is removed
CREATE TRIGGER Update_NumVotes_Remove
AFTER DELETE ON Vote
FOR EACH ROW
BEGIN
    UPDATE Review
    SET NumVotes = NumVotes - 1
    WHERE ReviewID = OLD.VoteID;
END;



-- Trigger to prevent a user from voting on the same review twice
CREATE TRIGGER Check_Vote_Duplication
BEFORE INSERT ON Vote
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM Vote
        WHERE UserID = NEW.UserID AND VoteID = NEW.VoteID
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User has already voted on this review';
    END IF;
END;





-- Trigger to prevent a user from liking the same recipe twice
CREATE TRIGGER Check_Like_Duplication
BEFORE INSERT ON User_Likes_Recipe
FOR EACH ROW
BEGIN
    IF EXISTS (
        SELECT 1 FROM User_Likes_Recipe
        WHERE UserID = NEW.UserID AND RecipeID = NEW.RecipeID
    ) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User has already liked this recipe';
    END IF;
END;





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




-- Trigger to add the new Friends to the Liked_By_Friends_Recipes table when a new friend is added
CREATE TRIGGER Add_Friend_To_Liked_By_Friends
AFTER INSERT ON Friends_With
FOR EACH ROW
BEGIN
    -- Insert new UserID1's liked recipes for UserID2
    INSERT INTO Liked_By_Friends_Recipes (RecipeID, FriendID)
    SELECT ulr.RecipeID, NEW.UserID2 AS FriendID
    FROM User_Likes_Recipe ulr
    WHERE ulr.UserID = NEW.UserID1;

    -- Insert new UserID2's liked recipes for UserID1
    INSERT INTO Liked_By_Friends_Recipes (RecipeID, FriendID)
    SELECT ulr.RecipeID, NEW.UserID1 AS FriendID
    FROM User_Likes_Recipe ulr
    WHERE ulr.UserID = NEW.UserID2;
END;




CREATE TRIGGER Add_Friends_Recipes
AFTER INSERT ON Friends_With
FOR EACH ROW
BEGIN
    INSERT INTO Uploaded_By_Friends_Recipes (RecipeID, FriendID)
    SELECT RecipeID, NEW.UserID1
    FROM User_Uploads_Recipe
    WHERE UserID = NEW.UserID2 AND NOT EXISTS (SELECT * FROM Uploaded_By_Friends_Recipes WHERE RecipeID = RecipeID AND FriendID = NEW.UserID1);

    INSERT INTO Uploaded_By_Friends_Recipes (RecipeID, FriendID)
    SELECT RecipeID, NEW.UserID2
    FROM User_Uploads_Recipe
    WHERE UserID = NEW.UserID1 AND NOT EXISTS (SELECT * FROM Uploaded_By_Friends_Recipes WHERE RecipeID = RecipeID AND FriendID = NEW.UserID2);
END;




-- Trigger to add the new Friends to the Liked_By_Friends_Recipes table when a new friend is added
CREATE TRIGGER Add_Friends_Liked_Recipes
AFTER INSERT ON Friends_With
FOR EACH ROW
BEGIN
    INSERT INTO Liked_By_Friends_Recipes (RecipeID, FriendID)
    SELECT RecipeID, NEW.UserID1 AS FriendID
    FROM User_Likes_Recipe
    WHERE UserID = NEW.UserID2;

    INSERT INTO Liked_By_Friends_Recipes (RecipeID, FriendID)
    SELECT RecipeID, NEW.UserID2 AS FriendID
    FROM User_Likes_Recipe
    WHERE UserID = NEW.UserID1;
END;




-- Trigger to add the new Friends to the Reviewed_By_Friends_Recipes table when a new friend is added
CREATE TRIGGER Add_Friends_Reviewed_Recipes
AFTER INSERT ON Friends_With
FOR EACH ROW
BEGIN
    INSERT INTO Reviewed_By_Friends_Recipes (RecipeID, ReviewID, FriendID)
    SELECT rhr.RecipeID, rhr.ReviewID, NEW.UserID1 AS FriendID
    FROM User_Leaves_Review ulr
    JOIN Recipe_Has_Review rhr ON rhr.ReviewID = ulr.ReviewID
    WHERE ulr.UserID = NEW.UserID2;

    INSERT INTO Reviewed_By_Friends_Recipes (RecipeID, ReviewID, FriendID)
    SELECT rhr.RecipeID, rhr.ReviewID, NEW.UserID2 AS FriendID
    FROM User_Leaves_Review ulr
    JOIN Recipe_Has_Review rhr ON rhr.ReviewID = ulr.ReviewID
    WHERE ulr.UserID = NEW.UserID1;
END;
//
DELIMITER ;
