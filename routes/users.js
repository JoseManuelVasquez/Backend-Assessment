var express = require('express');
var router = express.Router();
var user = require('../controllers/user');

router.post('/signup', user.signUp); /** POST Create new user. */
router.post('/login', user.login); /** POST Login user. */
router.get('/get-data', user.getUserData); /** GET User data. */

module.exports = router;
