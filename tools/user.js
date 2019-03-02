var User = require('../models/User');
var jwt = require('jsonwebtoken');
var USER_CONSTANTS = require('../constants/user');

/**
 * Login required, using token already created
 * @param wrapper
 * @param req
 * @param res
 */
exports.loginRequired = loginRequired;
function loginRequired (req, res) {
    /* Token provided by user */
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.json({
            success: false,
            error: "Token shouldn't be empty"
        });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
        if (err) {
            res.json(err);
            return;
        }

        User.findOne({_id: decodedToken.id}).then(function (user, err) {
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

            return true;
        });
    });
}

/**
 * Admin required, using token already created
 * @param wrapper
 * @param req
 * @param res
 */
exports.adminRequired = adminRequired;
function adminRequired (req, res) {
    /* Token provided by user */
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
        if (err) {
            res.json(err);
            return;
        }

        User.findOne({_id: decodedToken.id}).then(function (user, err) {
            if (err) {
                res.json({
                    success: false,
                    error: "Database error"
                });
                return;
            }

            if (user.role !== USER_CONSTANTS.ROLE.admin) {
                res.json({
                    success: false,
                    error: "You are not granted to modify user permission"
                });

                return true;
            }
        });
    });
}

/**
 * Auxiliar function for finding an element
 * @param {Array} arrayJSON
 * @param {String} key
 * @param {String} value
 * @returns {Object}
 */
exports.findElement = findElement;
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
exports.findElements = findElements;
function findElements(arrayJSON, key, value) {

    let elements = [];

    for (let i=0; i < arrayJSON.length; i++) {
        if (arrayJSON[i][key] === value) {
            elements.push(arrayJSON[i]);
        }
    }

    return elements;
}