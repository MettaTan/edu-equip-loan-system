const ItemModel = require("../../models/Item.model"),
  EquipmentModel = require("../../models/Equipment.model"),
  UserModel = require("../../models/User.model");

module.exports = {
  renderLoan: async (req, res) => {
    const items = await ItemModel.find({
      user_assignment: null,
      status: null,
      deletedAt: { $exists: false },
    }).populate("equipment_type");

    res.render("transaction/loan", {
      header: "Equipment Loan",
      unassignedItems: items,
    });
  },
  checkNric: async (req, res) => {
    const { nric } = req.body;

    const user = await UserModel.findOne({
      nric: nric.toUpperCase(),
      deletedAt: { $exists: false },
    });

    res.send(user ? user : false);
  },
  checkPin: async (req, res) => {
    const { nric, pin } = req.body;

    const pinLookup = await UserModel.verifyPin(
      nric.toUpperCase(),
      pin.toUpperCase()
    );

    res.send(pinLookup);
  },
  getAssignedItems: async (req, res) => {
    const { nric } = req.body;

    const { _id } = await UserModel.findOne({
      nric: nric.toUpperCase(),
      deletedAt: { $exists: false },
    });
    const assignedItems = await ItemModel.find({
      user_assignment: _id,
      status: null,
      deletedAt: { $exists: false },
    }).populate("equipment_type");

    res.send(assignedItems ? assignedItems : false);
  },
  processLoan: async (req, res) => {
    const { nric, items, reason, signature } = req.body.data;

    const { _id } = await UserModel.findOne({
      nric: nric.toUpperCase(),
      deletedAt: { $exists: false },
    });

    req.session.data = {
      type: "Loan",
      borrower: _id,
      items,
      reason,
      borrower_signature: [signature, null],
    };

    res.redirect(`/transaction/verify?_id=${_id}`);
  },
};
