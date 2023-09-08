const EquipmentModel = require("../../models/Equipment.model"),
  HotoModel = require("../../models/Hoto.model"),
  ItemModel = require("../../models/Item.model"),
  RecordModel = require("../../models/Record.model"),
  UserModel = require("../../models/User.model");

module.exports = {
  renderRecords: async (req, res) => {
    res.render("admin/viewRecords", { header: "View Item Records" });
  },
  getRecordData: async (req, res) => {
    const records = await RecordModel.find()
      .populate({
        path: "item",
        populate: { path: "equipment_type" },
      })
      .populate("borrower")
      .populate("loan_verifier")
      .populate("return_verifier")
      .populate("clearing_staff");

    let data = [],
      count = 1;

    for (const record of records) {
      data.push({
        count,
        item: `${record.item.item_description} (${record.item.equipment_type.equipment_name})`,
        reason: record.reason,
        borrower: record.borrower.fullName,
        loan_signature: record.borrower_signature[0],
        loan_verifier: record.loan_verifier.fullName,
        loan_verifier_signature: record.loan_verifier_signature,
        return_signature: record.borrower_signature[1]
          ? record.borrower_signature[1]
          : "-",
        return_verifier: record.return_verifier
          ? record.return_verifier.fullName
          : "-",
        return_verifier_signature: record.return_verifier_signature
          ? record.return_verifier_signature
          : "-",
        clearing_staff: record.clearing_staff
          ? record.clearing_staff.fullName
          : "-",
        clearing_staff_signature: record.clearing_staff_signature
          ? record.clearing_staff_signature
          : "-",
        loanAt: record.loanAt,
        returnAt: record.returnAt ? record.returnAt : "-",
        clearAt: record.clearAt ? record.clearAt : "-",
      });

      count++;
    }

    res.send({ data });
  },
};
