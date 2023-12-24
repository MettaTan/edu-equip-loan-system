const router = require("express").Router(),
  signup = require("./signup.controller"),
  login = require("./login.controller"),
  logout = require("./logout.controller");

const checkLogin = require("../../utils/middlewares/checkLogin"),
  catchAsync = require("../../utils/errors/catchAsync");

router
  .route("/addUser")
  .get(checkLogin, catchAsync(signup.renderSignUp))
  .post(catchAsync(signup.processSignUp));

router.route("/").get(login.renderLogin).post(catchAsync(login.processLogin));

router.route("/logout").post(catchAsync(logout.processLogout));

module.exports = router;
