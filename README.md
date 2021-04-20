# Gamecache

Gamecache is a web service that keeps track of your video game collection. You
can use Gamecache to rate your games, mark them as played or unplayed and more.

This Git repository is for the backend APIs for Gamecache.

## API Documentation

The API documentation is available in the **doc/** folder.

## Installation

**This is a work in progress**

Software requirements:

* Node.js ^15.x
* Nginx
* Database server (MariaDB or MySQL)


1.  Install the required dependencies

    `npm install`

2. Create an `.env` file using the example located at `.env-example`.

3. Create a `config.json` file in the `config/` directory using the example
file, `config.json.example`.

4. Create the database table on mysql or mariadb, and configure the connection
parameters in `.env` and `config/config.json`

5. Run migrations

    `npx sequelize-cli db:migrate`

6. Start the backend API

    `node src/index.js`

    The server will listen on http://localhost:3000 by default.

7. Create a user account with the `/api/auth/register` endpoint.

8. Assign your user account as an administrator by changing `admin` to **1**
in the database table `Users`.
