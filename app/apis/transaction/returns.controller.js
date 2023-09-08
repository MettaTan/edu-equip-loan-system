const ItemModel = require("../../models/Item.model"),
  EquipmentModel = require("../../models/Equipment.model"),
  UserModel = require("../../models/User.model"),
  RecordModel = require("../../models/Record.model");

module.exports = {
  renderReturns: (req, res) => {
    res.render("transaction/returns", { header: "Equipment Return" });
  },
  checkReturnNric: async (req, res) => {
    const { nric } = req.body;

    const user = await UserModel.findOne({
      nric: nric.toUpperCase(),
      deletedAt: { $exists: false },
    });

    if (!!user) {
      const record = await RecordModel.findOne({
        borrower: user._id,
        returnAt: null,
        deletedAt: { $exists: false },
      });

      res.send(record ? user : false);
    } else res.send(false);
  },
  getLoanedItems: async (req, res) => {
    const { nric } = req.body;

    const { _id } = await UserModel.findOne({
      nric: nric.toUpperCase(),
      deletedAt: { $exists: false },
    });
    const loanedItems = await ItemModel.find({
      status: _id,
      deletedAt: { $exists: false },
    }).populate("equipment_type");

    res.send(loanedItems ? loanedItems : false);
  },
  processReturn: async (req, res) => {
    const { nric, items, signature } = req.body.data;

    const { _id } = await UserModel.findOne({
      nric: nric.toUpperCase(),
      deletedAt: { $exists: false },
    });

    req.session.data = {
      type: "Return",
      borrower: _id,
      items,
      returner_signature: signature,
    };

    res.redirect(`/transaction/verify?_id=${_id}`);
  },
};
