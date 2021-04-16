# GameSite

GameSite is a community website where you can keep track of your game
collection. You can use it to keep track of which games you have completed, 
rate your games, and share your collection with others, all in one place.

## API Endpoints

Documentation of the API will be created soon, however, for now here is a
general overview of the API:

```
/api/auth           User authentication and registration endpoints
/api/device         List, add, and remove devices (consoles)
/api/games          List, add, and remove games
/api/collection     List, add, and remove games to your collection
/api/manufacturer   List, add, and remove device manufacturers
/api/profile        List and view user profiles
```

## Installation

**This is a work in progress*

GameSite requires `nodejs` for the backend APIs, and `nginx` to serve the
frontend website files. A database server, such as `MariaDB` or `MySQL` is
required. 


1. Install the required dependencies

2. Create an `.env` file using the example located at `.env-example`.

3. Create the database on mysql or mariadb, and configure the connection
parameters in `.env`.

3. **TODO:** Run migrations

4. Start the backend API

5. Create yourself a user account, and follow the instructions below.

**Note:** In order to perform some actions, such as deleting users, games, and
devices, you will need to have an admin user configured. There is no provision
to do this at this time, so it must be done manually.

To add an administrator account, use the mysql CLI or a GUI such as Sequel Ace
(macOS) and set **admin** to **1** on your desired admin user.

A script will be created to automate this task soon.
