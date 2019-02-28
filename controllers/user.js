/* 3d party libraries */
var jwt = require('jsonwebtoken');
var http = require('http');

/* Dependencies in project */
var User = require('../models/User');
var USER_CONSTANTS = require('../constants/user');
var userRequired = require('../decorators/user').userRequired;
var adminRequired = require('../decorators/user').adminRequired;

/**
 * POST Method for creating a new user
 * @function
 * @param {Object} req
 * @param {Object} res
 */
exports.signUp = signUp;
function signUp (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    /* Username and Password shouldn't be empty */
    if (!username || !password) {
        res.json({
            success: false,
            error: "Parameters shouldn't be empty"
        });
        return;
    }

    let newUser = new User({
        username: username,
        passwordHash: password,
        permissionType: USER_CONSTANTS.ROLE.user /** Every user role by default */
    });

    newUser.save(function (err, saved) {
        if (saved) {
            res.json({
                success: true,
                id: newUser._id
            });
            return;
        }

        res.json({
            success: false,
            error: "Can't create user"
        })
    });
}

/**
 * POST Method for login user
 * @function
 * @param {Object} req
 * @param {Object} res
 */
exports.login = login;
function login (req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        res.json({
            success: false,
            error: "Parameters shouldn't be empty"
        });
        return;
    }

    User.findOne({username: username}).then(function (user, err) {
        if (err) {
            res.json({
                success: false,
                error: "Database error"
            });
            return;
        }

        if (!user) {
            res.json({
                success: false,
                error: "User not found"
            });
            return;
        }

        user.comparePassword(password, function (correct) {
            if (!correct) {
                res.json({
                    success: false,
                    error: "Authentication failed. Wrong password"
                });
                return;
            }

            let token = jwt.sign(
                    { id: user._id, username: user.username },
                    process.env.JWT_SECRET,
                    { expiresIn: '12h' }
                );

            res.json({
                success: true,
                userId: user._id,
                token: token
            });
        });
    });
}

/**
 * GET Method for listing user data
 * @function
 * @param {Object} req
 * @param {Object} res
 */
exports.getUserData = getUserData;
function getUserData (req, res) {

    /* Request options */
    let options = {
        host : 'www.mocky.io',
        port : 80,
        path : '/v2/5808862710000087232b75ac',
        method : 'GET'
    };

    /* API Call */
    http.request(options, function(response) {
        response.setEncoding('utf8');

        let userData = '';

        response.on('data', function(data) {
            userData += data;
        });

        response.on('end', function () {
            if(userData) {
                treatData(JSON.parse(userData));
                return;
            }

            treatData({});
        });
    }).end();

    /* Function called for getting data, */
    /* once API Call successfully worked */
    var treatData = function(data) {
        console.log(data);
        res.json(data);
    };
}