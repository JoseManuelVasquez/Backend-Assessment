/* 3d party libraries */
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

/* Dependencies in project */
var server = require('../bin/www');
var User = require('../models/User');

/* URL for testing API */
const SIGNUP_URL = '/user/signup';
const LOGIN_URL = '/user/login';
const GET_DATA_URL = '/user/get-data';
const GET_USER_POLICIES_URL = '/user/get-policies';

/* Using chai*/
chai.use(chaiHttp);

describe("\n\nIn the controllers/user.js", () => {

    /* Normal User */
    let newUser = {
        id: '0178914c-548b-4a4c-b218-47d6a391530d',
        name: 'jose',
        email: 'jose@gmail.com',
        password: 'superS3crE7!',
        role: 'user'
    };

    /* Remove user if exists, for testing a new user */
    User.findOne({ id: newUser.id }).then(function(user, err) {
        if (user) {
            user.remove()
        }
    });

    /* Admin */
    let existentUser = {
        id: '2178914c-548b-4a4c-b218-47d6a391530a',
        name: 'existent',
        email: 'existent@gmail.com',
        password: 'superS3crE7!',
        role: 'admin'
    };

    /* Create user if not exists, for testing an existing user */
    User.findOne({ id: existentUser.id }).then(function(user, err) {
        if (!user) {
            let createOldUser = new User(existentUser);
            createOldUser.save();
        }
    });

    /* POST /user/signup TEST */
    describe("POST /user/signup", () => {

        it("non-existent user should return success true", (done) => {
            chai.request(server)
                .post(SIGNUP_URL)
                .send(newUser)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.have.property('success').eql(true);
                    response.body.should.have.property('userId');
                    done();
                });
        });

        it("existent user should return error", (done) => {
            chai.request(server)
                .post(SIGNUP_URL)
                .send(existentUser)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.have.property('success').eql(false);
                    response.body.should.have.property('error');
                    done();
                });
        });
    });

    /* POST /user/login TEST */
    describe("POST /user/login", () => {

        it("should return status code 200", (done) => {
            chai.request(server)
                .post(LOGIN_URL)
                .send(existentUser)
                .end((error, response) => {
                    response.should.have.status(200);
                    done();
                });
        });

        it("existent user should return a valid token", (done) => {
            chai.request(server)
                .post(LOGIN_URL)
                .send(existentUser)
                .end((error, response) => {
                    response.body.success.should.be.eql(true);
                    response.body.should.have.property('userId');
                    response.body.should.have.property('token');
                    done();
                });
        });
    });

    /* GET /user/get-data TEST */
    describe("GET /user/get-data", () => {

        it("should return specific user using ID or Name", (done) => {
            /* First of all we've to login */
            chai.request(server)
                .post(LOGIN_URL)
                .send(existentUser)
                .end((error, response) => {
                    let token = response.body.token;
                    let existingUserID = 'a0ece5db-cd14-4f21-812f-966633e7be86';
                    let existingUserName = 'Manning';

                    /* Call API for user data using ID */
                    chai.request(server)
                        .get(GET_DATA_URL)
                        .query({id: existingUserID, token: token}) /** Params of GET query */
                        .end((error, response) => {
                            response.should.have.status(200);
                            response.body.should.have.property('success').eql(true);
                            response.body.should.have.property('client').id.eql(existingUserID);
                        });

                    /* Call API for user data using name */
                    chai.request(server)
                        .get(GET_DATA_URL)
                        .query({name: existingUserName, token: token}) /** Params of GET query */
                        .end((error, response) => {
                            response.should.have.status(200);
                            response.body.should.have.property('success').eql(true);
                            response.body.should.have.property('client').name.eql(existingUserName);
                        });

                    done();
                });
        });
    });

    /* GET /user/get-policies TEST */
    describe("GET /user/get-policies", () => {

        it("should return user policies, only if admin called API", (done) => {
            /* First of all we've to login */
            chai.request(server)
                .post(LOGIN_URL)
                .send(existentUser)
                .end((error, response) => {
                    let token = response.body.token;
                    let existingUserName = 'Manning';

                    /* Call API for user policies */
                    chai.request(server)
                        .get(GET_USER_POLICIES_URL)
                        .query({name: existingUserName, token: token}) /** Params of GET query */
                        .end((error, response) => {
                            response.should.have.status(200);
                            response.body.should.have.property('success').eql(true);
                            response.body.should.have.property('policies');
                        });

                    done();
                });
        });

        it("should return error if normal user called API", (done) => {
            /* First of all we've to login as normal user */
            chai.request(server)
                .post(LOGIN_URL)
                .send(newUser)
                .end((error, response) => {
                    let token = response.body.token;
                    let existingUserName = 'Manning';

                    /* Call API for user policies */
                    chai.request(server)
                        .get(GET_USER_POLICIES_URL)
                        .query({name: existingUserName, token: token}) /** Params of GET query */
                        .end((error, response) => {
                            response.should.have.status(200);
                            response.body.should.have.property('success').eql(true);
                            response.body.should.have.property('policies');
                        });

                    done();
                });
        });
    });

});