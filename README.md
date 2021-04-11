# GameSite

GameSite is a community website where you can keep track of your game
collection. You can use it to keep track of which games you have completed, 
rate your games, and share your collection with others, all in one place.


## Installation

GameSite requires `nodejs` for the backend APIs, and `nginx` to serve the
frontend website files. A database server, such as `MariaDB` or `MySQL` is
required. 


1. Install the required dependencies

    `npm install`

2. Create an `.env` file using the example located at `.env-example`.

3. Create the database on mysql or mariadb, and configure the connection
parameters in `.env`.

3. Run migrations

    `npx .....`

4. Add nginx configuration

5. Start the backend API

    `node src/index.js`

6. Create yourself a user account, and follow the instructions below.

**Note:** In order to perform some actions, such as deleting users, games, and
devices, you will need to have an admin user configured. There is no provision
to do this at this time, so it must be done manually.

To add an administrator account, use the mysql CLI or a GUI such as Sequel Ace
(macOS) and set **admin** to **1** on your desired admin user.

A script will be created to automate this task soon.
