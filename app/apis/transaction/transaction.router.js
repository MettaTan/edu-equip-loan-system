const router = require("express").Router(),
  loan = require("./loan.controller"),
  returns = require("./returns.controller"),
  verify = require("./verify.controller");

const checkHotoStatus = require("../../utils/middlewares/checkHotoStatus"),
  catchAsync = require("../../utils/errors/catchAsync");

// Normal Transactions
router
  .route("/loan")
  .get(checkHotoStatus, catchAsync(loan.renderLoan))
  .post(catchAsync(loan.processLoan));

router.route("/checkNric").post(catchAsync(loan.checkNric));

router.route("/checkPin").post(catchAsync(loan.checkPin));

router.route("/getAssignedItems").post(catchAsync(loan.getAssignedItems));

router
  .route("/returns")
  .get(checkHotoStatus, catchAsync(returns.renderReturns))
  .post(catchAsync(returns.processReturn));

router.route("/checkReturnNric").post(catchAsync(returns.checkReturnNric));

router.route("/getLoanedItems").post(catchAsync(returns.getLoanedItems));

router
  .route("/verify")
  .get(checkHotoStatus, catchAsync(verify.renderVerify))
  .post(catchAsync(verify.processVerify));

router.route("/checkAdminNric").post(catchAsync(verify.checkAdminNric));

module.exports = router;
