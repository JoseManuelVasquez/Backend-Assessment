var express = require('express');
var router = express.Router();
var user = require('../controllers/user');

router.post('/signup', user.signUp); /** POST Create new user. */
router.post('/login', user.login); /** POST Login user. */
router.get('/get-data', user.getUserData); /** GET User data. */
router.get('/get-policies', user.getPoliciesUser); /** GET Policies of specific user. */
router.get('/get-user-policy', user.getUserByPolicy); /** GET User by Policy. */

module.exports = router;
