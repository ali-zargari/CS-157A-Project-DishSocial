# DishSocial Guide

## IMPORTANT: **_Please read this document very carefully._**
### DishSocial is fully deployed for both front-end, and the back-end
### The Easiest way to explore DishSocial is to visit the URL below:
- #### https://ali-zargari.github.io/CS-157A-Project-DishSocial/



## Table of Contents
### 1. Local Set-up Guide
### 2. Database Connection
### 3. Division of Work

##
##


# 1. Local Set-up Guide
### The following instructions are a guide to run the front-end and the middle-layer of DishSocial locally, as requested by project specs and Dr. Moazeni.

### Summary of Steps:
1. Install Node.js
2. Install the backend
3. Install the frontend
4. Run the backend
5. Run the frontend

## Step 1: Install Node.js

### Steps to Install Node.js

1. **Visit Node.js Official Website**  
   Go to the official Node.js website: [nodejs.org](https://nodejs.org/).

2. **Choose Your Download**  
   The download page offers two options:  
   - **LTS (Long-Term Support):** Stable and recommended for most users.  
   - **Current:** Latest features that may contain experimental updates.

3. **Download Installer**  
   Click the appropriate option to download the installer for your operating system.

4. **Run the Installer**  
   Locate and open the downloaded installer file.  
   - **Windows:** Check "Add to PATH" and follow the wizard.  
   - **macOS:** Drag and drop the Node.js icon into the Applications folder.  
   - **Linux:** Refer to the Node.js installation guide [here](https://nodejs.org/en/download/package-manager/) for platform-specific steps.

5. **Verify Installation**  
   - Open your terminal or command prompt and run:
   ```bash
   node -v
   ```
   - If Node.js is installed, the version will be displayed. 
![img_1.png](readme_images/img_1.png)


## Step 2: Install the back-end

### For Windows:

1. **Open Command Prompt**
   - Press `Win + R`, type `cmd`, and press `Enter`.

2. **Navigate to the Folder**  
   - Use the `cd` (Change Directory) command to navigate to the "Server" folder.
   - If the "Server" folder is located at `C:\...\CS_157A_Project\Server`, type:
   `cd C:\...\CS_157A_Project\Server`

3. **Run the `npm install` Command**  
   - Type the command bellow to install all the dependencies:
   ```bash
   npm install

4. **Verify Installation**  
   - Look for a `node_modules` folder in the "Server" directory to confirm that the dependencies have been installed.

### For macOS:

1. **Open Terminal**  
   - Press `Command + Space`, type `Terminal`, and press `Enter`.

2. **Navigate to the Folder**  
   - Use the `cd` (Change Directory) command to navigate to the "Server" folder.
   - If the "Server" folder is located at `/Users/your-username/Projects/CS_157A_Project/Server`, type:
   `cd /Users/your-username/Projects/CS_157A_Project/Server`

3. **Run the `npm install` Command**  
   - Type the command below to install all the dependencies:
   ```bash
   npm install

4. **Verify Installation**  
   - Look for a `node_modules` folder in the "Server" directory to confirm that the dependencies have been installed.


## Step 3: Install the front-end

#### - this is the same process as step 2, but repeated in the Client folder.

### For Windows:

1. **Open Command Prompt**
   - Press `Win + R`, type `cmd`, and press `Enter`.

2. **Navigate to the Folder**  
   - Use the `cd` (Change Directory) command to navigate to the "Server" folder.
   - If the "Server" folder is located at `C:\...\CS_157A_Project\Client`, type:
   `cd C:\...\CS_157A_Project\Client`

3. **Run the `npm install` Command**  
   - Type the command bellow to install all the dependencies:
   ```bash
   npm install

4. **Verify Installation**  
   - Look for a `node_modules` folder in the "Server" directory to confirm that the dependencies have been installed.

### For macOS:

1. **Open Terminal**  
   - Press `Command + Space`, type `Terminal`, and press `Enter`.

2. **Navigate to the Folder**  
   - Use the `cd` (Change Directory) command to navigate to the "Server" folder.
   - If the "Server" folder is located at `/Users/your-username/Projects/CS_157A_Project/Client`, type:
   `cd /Users/your-username/Projects/CS_157A_Project/Client`

3. **Run the `npm install` Command**  
   - Type the command below to install all the dependencies:
   ```bash
   npm install

4. **Verify Installation**  
   - Look for a `node_modules` folder in the "Server" directory to confirm that the dependencies have been installed.


## Step 4: Run the back-end

- Using the Command Prompt (windows) or Terminal(mac), navigate to the **Server** folder
- Type the following command and press enter:
   ```bash
   npm run start
- This is a custom command that is set in 'package.json'.
- If successful, the following output will be displayed:
![img.png](readme_images/img.png)



## Step 5: Run the front-end
- #### Important: This app is best displayed on Edge, Chrome, or Safari. It has **'NOT'** been tested on other browsers.
- Using the Command Prompt (windows) or Terminal(mac), navigate to the **Server** folder
- Type the following command and press enter:
   ```bash
   npm run start:webpack
- This is a custom command that is set in 'package.json'.
- If successful, the following output will be displayed, and the front-end page should open on the browser:
![img_2.png](readme_images/img_2.png)
- If the app opens on Edge, Chrome, or Safari then it is good to go.
- If the app does not open on one of the 3 mentioned browsers (or at all), copy the URL that was displayed when running 'npm run start:webpack'
- 
![img_3.png](readme_images/img_3.png)npm run start:webpack
- Open either Edge, Chrome, or Safari and visit that URL.

##
##

# 2. Database Connection

## Connecting to the Database
- ### Important: The database for DishSocial is hosted online. 
##
### In order to test the insert commands, there are 2 options:
  1. ### To recreate our database locally and insert.
  2. ### To connect to our online database and insert.
####
##
### Here are steps for both the above scnarions:

### 1. Recreating the database Locally:
  1. Navigate to the Server directory
  2. Open server.js:
     1. go to line 25, and find the following code fragment:
     2. ![img_4.png](readme_images/img_4.png)
     3. Change host, user, database, password, and port numbers accordingly to your own database' credentials. 
        1. If not using SSL, remove the ssl parameter all-together. 
        2. In other words, remove lines 32-37 in the image
        ![img_5.png](readme_images/img_5.png)
  3. **RE-RUN server.js:  Ctrl-C out of it if the server is still running, then retype 'npm run start' in the Server folder**
  4. Dish Social is now connected to your own local database.

### 2. Connecting to our online database using your own IDE:
- The credentials to connect to our online database area as follows:


    host: 'mysql-206af299-sjsu-b628.a.aivencloud.com',
    user: 'avnadmin',
    database: 'CS_157A_Project', //database name
    password: 'AVNS_KPqKJ44iZGhPb5xCUgA',
    port: 19243,
    ssl: {

        rejectUnauthorized: true,

        ca: readFileSync('./ca.crt'),
    }

- There is a chance that you might be required to enable SSL mode, and include a 'ca.crt' certificate file
- In that case, the 'ca.crt' is located in the Database folder.
- Alternatively, here is the content of ca.crt that you can copy:

   ```bash
   -----BEGIN CERTIFICATE-----
   MIIEQTCCAqmgAwIBAgIUfDl1Y1gnJhjJlWIp945z4cY3WHIwDQYJKoZIhvcNAQEM
   BQAwOjE4MDYGA1UEAwwvYzJkZDYzNDktM2YxMi00YWJjLTk3NGEtNzIyZDQ5OGIz
   NmMwIFByb2plY3QgQ0EwHhcNMjQwNDAzMjEyNjMyWhcNMzQwNDAxMjEyNjMyWjA6
   MTgwNgYDVQQDDC9jMmRkNjM0OS0zZjEyLTRhYmMtOTc0YS03MjJkNDk4YjM2YzAg
   UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAJHo3QF0
   RM+syy1Z5zEYThTiR1XzxdoMudkV20hXotlS76F1KKMzSre/uFIaWiXaOTh6KNVa
   vN69RKXPkZ2fWeCjoxJTKquDbobsDSu1qhaoR/PgFRCMhQ8XIKEQOhpP07ON4sRp
   ioZPyqutbwnKyIu+BeQE/bEJgABKYYhcOB+u82P/6EnR6xXbc4vtqpzZ56FUguFQ
   RrQ2oP1jy+frzTjGvTV/L/gfW1z8sHLAMk0RHjAv5U5Db8E6lI+4J7vV/G/dxME6
   WR88OzVcuZJ7me6JLJGtPhkpsKHLFn4CVIehH0krJNN5gXCuPXlo9wUwqaZceARy
   Z2q713k4QaOFrMAe+aETO5b4DwRZOabCfYR65WEOaGRbpkREJ+31bW+SuEVBuUXv
   jnuJbOIYoNt9SRnZDOuLMgNO+ZNt364jSjX42JOKQpNmmuqOS3iGn/6tKqAxeg6h
   k3u3LcGSoTiCBeP2xEWQo72GIGZ0h/0JtqkgS3dKE0lXkgSh3AdG8l3LOQIDAQAB
   oz8wPTAdBgNVHQ4EFgQUbB3Uy1Il4P16ICwJsrTDweL2q9swDwYDVR0TBAgwBgEB
   /wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAFARQK3jtvyBZUUT
   Yt7n5oLqt5ej4qt6O18PPwUi6QnkAX/f818f1GosTTrvfDqTiYcsi+YJvdPm6FDY
   RrCOxbIQqidsvRz5FHXmIcraOdlBEzz+0kBSUr6h3p00h9PNADclYvyn7Gez3pY4
   bYPjmMmx1mqSfZVrDT3XN9dcYVxag7mX+K7SPRjSSYZhxOAQNOfywCTMYfscfHiJ
   CthVR9Fi5+C16j9G0meq83RexlWD01es4hkGa5CLaKBp7zGszlxm7DWpe91PQeOP
   EngdUTixuITgujO9MQ8zZnTkZoKmyt84B2sW60mmyka5a6tpx6CriYR063SEmbz0
   6DEWz8ZWzg+E5nJF/Vo2OBTIJMm4TZKuiGjdhg5JCucmitoKQ6pAskDwtzA5LBYq
   fZ7ghhExFd55jasWKFOQQ5Tb87+yoSLndHLrQLuyavU5Tll2xM0vZaPqw4PkE3lD
   Oh8nB0QeHtluWRsHh4KeQc2CPhwOaI3Xw0ApJn9t2JM76jDKoQ==
   -----END CERTIFICATE-----

#
# 3. Division of Work

## Ali Zargari
- Proposal
- EER Diagram
- Creating and hosting the database
- Set up project environments and divide the different layers.
- Create the client layer infrastructure and prepare for front end development
- Create the middle layer infrastructure and prepare for endpoint development.
- Helped develop end points, queries, and front end functions. 
- Deployment of the different layers
- Writing the report

## Jun Kit Wong
- Proposal
- EER Diagram
- Developed a majority of the core endpoints with their queries 
- Major functions like logging in, loggin out, etc
- Developed controller functions, and a variety of other front-end functions
- Assistance in all the crucial aspects of the project
- Writing the report


## Omar Jamjoum
- Proposal
- EER diagram
- Creating the database
- Generated the data
- Helped fix and create the triggers/constraints for table definitions
- Created the main page and the login page and their components.
- Helped with general front-end functionality
- Writing the report


## Charlie Nguyen
- Proposal 
- EER
- In charge of testing and reporting/fixing bugs
- Helped set up back-end and front-end environments
- Helped with the report


## Nathan Nguyen
- Proposal
- EER
- In charge of testing and reporting/fixing bugs
- Helped set up back-end and front-end environments
- Helped with the report
