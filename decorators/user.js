var User = require('../models/User');
var jwt = require('jsonwebtoken');
var USER_CONSTANTS = require('../constants/user');

/**
 * Login required decorator, using token already created
 * @param wrapped
 * @param req
 * @param res
 */
exports.loginRequired = loginRequired;
function loginRequired (wrapper, req, res) {
    /* If there's not function to call */
    if (!wrapper) {
        return;
    }

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

            /* Call wrapped function */
            wrapper(req, res);
        });
    });
}

/**
 * Admin required decorator, using token already created
 * @param wrapped
 * @param req
 * @param res
 */
exports.adminRequired = adminRequired;
function adminRequired (wrapper, req, res) {
    /* If there's not function to call */
    if (!wrapper) {
        return;
    }

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
                return;
            }

            /* Call wrapped function */
            wrapper(req, res);
        });
    });
}