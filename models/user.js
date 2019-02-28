var mongoose = require('mongoose');
var crypto = require('crypto');

var UserSchema = new mongoose.Schema({

    id: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    saltHash: {
        type: String
    },
    role: {
        type: String
    }/*,
    policies: [{
        id: String,
        policy: {
            type: ObjectId,
            ref: 'Policy'
        }
    }]*/
});

/**
 * Hashing a password before saving it to the database
 */
UserSchema.pre('save', function (next) {
    let self = this;

    // Only hash the password if it has been modified (or is new)
    if (!self.isModified('passwordHash'))
        return next();

    // Generate derived key and override the cleartext password with the derived one
    let salt = genRandomString(16);
    let hashData = sha512(self.passwordHash, salt);
    self.saltHash = hashData.salt;
    self.passwordHash = hashData.passwordHash;
    next();

});

/**
 * Compare candidate password and password
 * @function
 * @param {string} loginPassword
 * @param {function} callback
 */
UserSchema.methods.comparePassword = function (loginPassword, callback) {
    let self = this;
    let correct = false;

    /* Password shouldn't be empty or undefined */
    if (loginPassword) {
        /* Override password with the hashed one */
        loginPassword = sha512(loginPassword, self.saltHash).passwordHash;

        /* If password does not match, the callback function will return false */
        correct = loginPassword === self.passwordHash;
    }

    callback(correct);
};

/**
 * Hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
function sha512(password, salt){
    if (!password) {
        return null;
    }

    let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    let value = hash.digest('hex');

    return {
        salt: salt,
        passwordHash: value
    };
}

/**
 * Generates random string of characters
 * @function
 * @param {number} length - Length of the random string.
 */
function genRandomString(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
}

module.exports = mongoose.model('User', UserSchema);