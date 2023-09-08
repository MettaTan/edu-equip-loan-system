const router = require("express").Router(),
    signup = require("./signup.controller"),
    login = require("./login.controller"),
    logout = require("./logout.controller");

const catchAsync = require("../../utils/errors/catchAsync");

router
    .route("/addUser")
    .get(signup.renderSignUp)
    .post(catchAsync(signup.processSignUp));

router
    .route("/")
    .get(login.renderLogin)
    .post(catchAsync(login.processLogin));

router
    .route("/logout")
    .post(catchAsync(logout.processLogout));

module.exports = router;