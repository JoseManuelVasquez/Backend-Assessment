/* 3d party libraries */
var jwt = require('jsonwebtoken');
var http = require('http');

/* Dependencies in project */
var User = require('../models/User');
var USER_CONSTANTS = require('../constants/user');
var loginRequired = require('../decorators/user').loginRequired;
var adminRequired = require('../decorators/user').adminRequired;

/**
 * POST Method for creating a new user
 * @function
 * @param {Object} req
 * @param {Object} res
 */
exports.signUp = signUp;
function signUp(req, res) {
    let id = req.body.id;
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let role = req.body.role; /** We can set user role due to exercise */

    /* Username and Password shouldn't be empty */
    if (!id || !name || !email || !password || !role) {
        res.json({
            success: false,
            error: "Parameters shouldn't be empty"
        });
        return;
    }

    let newUser = new User({
        id: id,
        name: name,
        email: email,
        passwordHash: password, /** At first, we got plain password, then we encrypt before saving */
        role: role
    });

    newUser.save(function (err, saved) {
        if (saved) {
            res.json({
                success: true,
                userId: newUser._id
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
function login(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        res.json({
            success: false,
            error: "Parameters shouldn't be empty"
        });
        return;
    }

    User.findOne({email: email}).then(function (user, err) {
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

            /* If password is correct, response with a token */
            let token = jwt.sign(
                {id: user._id, username: user.username},
                process.env.JWT_SECRET,
                {expiresIn: '12h'}
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
exports.getUserData = function (req, res) {
    /* Decorator */
    loginRequired(getUserData, req, res);
};
function getUserData(req, res) {

    /* GET Argument */
    let userId = req.query.id;
    let userName = req.query.name;

    if (!userId && !userName) {
        res.json({
            success: false,
            error: "Parameters shouldn't be empty"
        });
        return;
    }

    /* Request options */
    let options = {
        host: USER_CONSTANTS.EXTERNAL_API.host,
        port: USER_CONSTANTS.EXTERNAL_API.port,
        path: '/v2/5808862710000087232b75ac',
        method: 'GET'
    };

    /* API Call */
    http.request(options, function (response) {
        response.setEncoding('utf8');

        let userData = '';

        response.on('data', function (data) {
            userData += data;
        });

        response.on('end', function () {
            if (userData) {
                treatData(JSON.parse(userData));
                return;
            }

            treatData({});
        });
    }).end();

    /* Function called for getting data, */
    /* once API Call successfully worked */
    var treatData = function (data) {
        let client = {};
        if (userId) {
            client = findElement(data['clients'], 'id', userId);
        }
        else {
            client = findElement(data['clients'], 'name', userName);
        }
        res.json({
            success: true,
            client: client
        });
    };
}

/**
 * GET Method for listing user data
 * @function
 * @param {Object} req
 * @param {Object} res
 */
exports.getPoliciesUser = function (req, res) {
    /* Decorators */
    loginRequired(adminRequired(getPoliciesUser, req, res), req, res);
};
function getPoliciesUser(req, res) {

    /* GET Argument */
    let userName = req.query.name;

    if (!userName) {
        res.json({
            success: false,
            error: "Parameters shouldn't be empty"
        });
        return;
    }

    /* Request options for finding User */
    let optionsUser = {
        host: USER_CONSTANTS.EXTERNAL_API.host,
        port: USER_CONSTANTS.EXTERNAL_API.port,
        path: '/v2/5808862710000087232b75ac',
        method: 'GET'
    };

    /* Request options for finding Policies */
    let optionsPolicy = {
        host: USER_CONSTANTS.EXTERNAL_API.host,
        port: USER_CONSTANTS.EXTERNAL_API.port,
        path: '/v2/580891a4100000e8242b75c5',
        method: 'GET'
    };

    /* API Call */
    http.request(optionsUser, function (response) {
        response.setEncoding('utf8');

        let userData = '';

        response.on('data', function (data) {
            userData += data;
        });

        response.on('end', function () {
            if (userData) {
                treatData(JSON.parse(userData));
                return;
            }

            treatData({});
        });
    }).end();

    /* Function called for getting data, */
    /* once API Call successfully worked */
    var treatData = function (data) {

        let clientId = findElement(data['clients'], 'name', userName).id;

        /* API Call for policy */
        http.request(optionsPolicy, function (response) {
            response.setEncoding('utf8');

            let policyData = '';

            response.on('data', function (data) {
                policyData += data;
            });

            response.on('end', function () {
                if (policyData) {
                    let policies = JSON.parse(policyData);
                    let policiesUser = findElements(policies['policies'], 'clientId', clientId);

                    res.json({
                        success: true,
                        policies: policiesUser
                    });
                    return;
                }

                res.json([]);
            });
        }).end();
    };
}

/**
 * Auxiliar function for finding an element
 * @param {Array} arrayJSON
 * @param {String} key
 * @param {String} value
 * @returns {Object}
 */
function findElement(arrayJSON, key, value) {
    for (let i=0; i < arrayJSON.length; i++)
        if (arrayJSON[i][key] === value)
            return arrayJSON[i];

    return {};
}

/**
 * Auxiliar function for finding various elements
 * @param {Array} arrayJSON
 * @param {String} key
 * @param {String} value
 * @returns {Array}
 */
function findElements(arrayJSON, key, value) {

    let elements = [];

    for (let i=0; i < arrayJSON.length; i++) {
        if (arrayJSON[i][key] === value) {
            elements.push(arrayJSON[i]);
        }
    }

    return elements;
}