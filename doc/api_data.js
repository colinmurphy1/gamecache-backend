define({ "api": [
  {
    "type": "put",
    "url": "/api/auth/changepassword",
    "title": "Change password",
    "name": "Change_password",
    "group": "Authentication",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Old password</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "new_password",
            "description": "<p>New password</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Password changed successfully</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputValidationError",
            "description": "<p>The data input did not match the requirements.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Incorrect password.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/api/auth/logout",
    "title": "Log out",
    "name": "Log_out",
    "group": "Authentication",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization token</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/api/auth/login",
    "title": "Log in",
    "name": "Login",
    "group": "Authentication",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username for the user account</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Password for the user account.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>A hexidecimal token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token_expires_at",
            "description": "<p>The time in which the token will expire, which is one hour from the time of login.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputVaidationError",
            "description": "<p>The username and password do not meet the required criteria.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Unauthorized",
            "description": "<p>Incorrect username or password specified.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/api/auth/register",
    "title": "Create a user account",
    "name": "Register",
    "group": "Authentication",
    "description": "<p>Create a new user account</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username for the user account</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Email for the user account</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "size": "8+",
            "optional": false,
            "field": "password",
            "description": "<p>Password for the user account. Must be a minimum of 8 characters.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the new user account</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "UserCreationError",
            "description": "<p>Could not create the user account, likely due to the username being claimed.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/auth.js",
    "groupTitle": "Authentication"
  },
  {
    "type": "post",
    "url": "/api/collection",
    "title": "Add a game to your collection",
    "name": "Add_to_collection",
    "group": "Collection",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "gameId",
            "description": "<p>ID of the game to add to your collection (see Games API)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "notes",
            "description": "<p>Specific notes to add to the game</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "allowedValues": [
              "0-5"
            ],
            "optional": true,
            "field": "rating",
            "description": "<p>Rating from 1-5 stars, with 0 being unrated.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the game</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "gameId",
            "description": "<p>New ID number of the game</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputValidationError",
            "description": "<p>The data input did not match the requirements.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AddGameError",
            "description": "<p>The game could not be added because it does not exist, or already exists in the database.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/collection.js",
    "groupTitle": "Collection"
  },
  {
    "type": "put",
    "url": "/api/collection",
    "title": "Change information about a game in your collection",
    "name": "Change_information_about_a_game_in_your_collection",
    "group": "Collection",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "gameId",
            "description": "<p>ID of the game in your collection</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "notes",
            "description": "<p>Specific notes to add to the game</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "allowedValues": [
              "0-5"
            ],
            "optional": true,
            "field": "rating",
            "description": "<p>Rating from 1-5 stars, with 0 being unrated.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Game removed from your collection</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputValidationError",
            "description": "<p>The passed data is incorrect</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "GameNotFound",
            "description": "<p>The game does not exist in your collection</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AccessDenied",
            "description": "<p>The game does not belong to you</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/collection.js",
    "groupTitle": "Collection"
  },
  {
    "type": "delete",
    "url": "/api/collection/:gameId",
    "title": "Remove a game from your collection",
    "name": "Remove_from_collection",
    "group": "Collection",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "gameId",
            "description": "<p>ID of the game to remove from your collection</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "message",
            "description": "<p>Game removed from your collection</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "GameNotFound",
            "description": "<p>The game does not exist in your collection</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AccessDenied",
            "description": "<p>The game does not belong to you</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/collection.js",
    "groupTitle": "Collection"
  },
  {
    "type": "get",
    "url": "/api/collection",
    "title": "View collection",
    "name": "View_Collection",
    "group": "Collection",
    "description": "<p>Returns the game collection of the logged in user.</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization token</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "games",
            "description": "<p>A list of games in your collection.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/collection.js",
    "groupTitle": "Collection"
  },
  {
    "type": "post",
    "url": "/api/device",
    "title": "Add a device",
    "name": "Add_a_device",
    "group": "Device",
    "permission": [
      {
        "name": "admin"
      }
    ],
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization token</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the device</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "allowedValues": [
              "..10"
            ],
            "optional": false,
            "field": "shortname",
            "description": "<p>Short (&lt;10 char) name of the device</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "manufacturer",
            "description": "<p>Manufacturer ID number</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Device name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "shortname",
            "description": "<p>Device shortname</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Device ID</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputValidationError",
            "description": "<p>The passed data is incorrect</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "AddDeviceFailed",
            "description": "<p>Unable to add device to database</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/device.js",
    "groupTitle": "Device"
  },
  {
    "type": "get",
    "url": "/api/device",
    "title": "View all devices",
    "name": "View_all_devices",
    "group": "Device",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "devices",
            "description": "<p>The list of devices, including their ID, name, etc.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/device.js",
    "groupTitle": "Device"
  },
  {
    "type": "get",
    "url": "/api/game",
    "title": "View all games",
    "name": "View_all_game",
    "group": "Game",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "games",
            "description": "<p>The resulting list of games</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "GameLoadError",
            "description": "<p>Could not retrieve the list of games</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/games.js",
    "groupTitle": "Game"
  },
  {
    "type": "post",
    "url": "/api/news",
    "title": "Post news article",
    "name": "New_article",
    "group": "News",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Authorization token</p>"
          }
        ]
      }
    },
    "permission": [
      {
        "name": "admin"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Title of the news article</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "content",
            "description": "<p>Content of the post. Can be in plain text or markdown.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InputValidationError",
            "description": "<p>Incorrect data passed</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "CreationError",
            "description": "<p>Could not create post</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/news.js",
    "groupTitle": "News"
  },
  {
    "type": "get",
    "url": "/api/news",
    "title": "Get news articles",
    "name": "New_article",
    "group": "News",
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "RetrievalError",
            "description": "<p>Could not load any posts</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/api/news.js",
    "groupTitle": "News"
  }
] });
