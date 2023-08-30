const crypt = require('bcrypt')
const saltRounds = 10

/**
 * Hashes a password
 * @param {string} input The string to hash
 * @param {function(error, result)} callback The function to call after the operation is executed (passes an error and the hashed string)
 */
const getHash = async (input, callback) => {
    crypt.hash(input, saltRounds)
    .then(hash => callback(null, hash))
    .catch(err => callback(err, null))
}

/**
 * Validates a raw password against a hashed one
 * @param {string} input The string to test
 * @param {string} password The known hashed password
 * @param {function(error, result)} callback 
 */
const validatePassword = async (input, password, callback) => {
    crypt.compare(input, password)
    .then(res => callback(null, res))
    .catch(err => callback(err, false))
}

module.exports = {
    getHash,
    validatePassword
}