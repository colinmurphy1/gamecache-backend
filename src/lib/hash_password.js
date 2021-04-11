const argon2 = require('argon2');


async function hashPassword(password) {
    return await argon2.hash(password);
}

module.exports = hashPassword;