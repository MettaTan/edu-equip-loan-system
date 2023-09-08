const router = require("express").Router();

const admin = require("./admin.controller"),
  clearing = require("./clearing.controller.js"),
  hoto = require("./hoto.controller"),
  items = require("./items.controller"),
  records = require("./records.controller"),
  users = require("./users.controller");

const checkLogin = require("../../utils/middlewares/checkLogin"),
  catchAsync = require("../../utils/errors/catchAsync");

// Admin Menu
router.route("/").get(checkLogin, catchAsync(admin.renderAdmin));

// Clearing Menus
router
  .route("/clear")
  .get(checkLogin, catchAsync(clearing.renderClearing))
  .post(catchAsync(clearing.processClearItems));

// View Item Records

router.route("/viewRecords").get(checkLogin, catchAsync(records.renderRecords));

router
  .route("/getRecordData")
  .get(checkLogin, catchAsync(records.getRecordData));

// Handover/Takeover

router
  .route("/hoto")
  .get(checkLogin, catchAsync(hoto.renderHoto))
  .post(catchAsync(hoto.processHoto));

router.route("/getHotoData").get(checkLogin, catchAsync(hoto.getHotoData));

// View Item Status & Assignments

router.route("/viewItems").get(checkLogin, catchAsync(items.renderViewItems));

router.route("/getItemData").get(checkLogin, catchAsync(items.getItemData));

router.route("/addEquipment").post(catchAsync(items.addEquipment));

router.route("/addItem").post(catchAsync(items.addItem));

router.route("/editItem").post(catchAsync(items.editItem));

router.route("/deleteItem").post(catchAsync(items.deleteItem));

// View User Details

router.route("/viewUsers").get(checkLogin, catchAsync(users.renderViewUsers));

router.route("/getUserData").get(checkLogin, catchAsync(users.getUserData));

router.route("/editUser").post(catchAsync(users.editUser));

router.route("/deleteUser").post(catchAsync(users.deleteUser));

module.exports = router;
