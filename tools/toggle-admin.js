// Import modules
require('dotenv').config();

// Import helper functions
const getUserByName = require('../src/lib/getUserByName.js');

// Import database
var db = require('../src/database/db.js');

async function toggleAdmin(username) {
    // Username is required
    if (username == null) {
        console.log("No username specified.");
        return false;
    }

    // Get user model from the username specified
    const user = await getUserByName(username);

    // Stop the script if the user does not exist
    if (! user) {
        console.log(`${username} is not a valid user`);
    } else {
        // Toggle admin status
        user.admin = user.admin ? false : true;

        // Save changes to the database
        await user.save();

        console.log(`\n${username} admin: ${user.admin}`);
    }
    
    // Close database connection
    await db.sequelize.close();
}

// Run main script
toggleAdmin(process.argv[2]);
