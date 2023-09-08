const moment = require("moment");

const EquipmentModel = require("../../models/Equipment.model"),
  HotoModel = require("../../models/Hoto.model"),
  ItemModel = require("../../models/Item.model"),
  RecordModel = require("../../models/Record.model"),
  UserModel = require("../../models/User.model");

const renderClearing = async (req, res) => {
  let equipments = [];

  const equipmentDocs = await EquipmentModel.find();

  for (const equipmentDoc of equipmentDocs) {
    const { _id } = equipmentDoc;

    equipments.push(_id.toString());
  }

  let unclearedItems = [],
    i = 1;

  const allUnclearedItems = await RecordModel.find({ clearAt: null })
    .populate("borrower")
    .populate({
      path: "item",
      populate: { path: "equipment_type" },
    });

  for (const record of allUnclearedItems) {
    const { item, borrower, reason, loanAt, returnAt } = record;

    const { item_description, equipment_type } = item;

    const { fullName } = borrower;

    if (equipments.includes(equipment_type._id.toString())) {
      unclearedItems.push({
        count: i,
        item: `${item_description} (${equipment_type.equipment_name})`,
        borrower: fullName,
        reason,
        loanAt: moment(new Date(loanAt)).format("MMMM Do YYYY, h:mm:ss a"),
        returnAt: returnAt
          ? moment(new Date(returnAt)).format("MMMM Do YYYY, h:mm:ss a")
          : "-",
      });
      i++;
    }
  }

  const allRecords = await RecordModel.find()
    .populate({
      path: "item",
      populate: { path: "equipment_type" },
    })
    .populate("borrower")
    .populate("loan_verifier")
    .populate("return_verifier")
    .populate("clearing_staff");

  let count = 1,
    records = [],
    currentDocs = [],
    current_clearing_staff,
    current_clearing_staff_signature,
    current_clearAt;

  for (const record of allRecords) {
    if (
      record.clearAt &
      equipments.includes(record.item.equipment_type._id.toString())
    ) {
      if (
        current_clearing_staff_signature === record.clearing_staff_signature
      ) {
        currentDocs.push({
          count,
          item: `${record.item.item_description} (${record.item.equipment_type.equipment_name})`,
          reason: record.reason,
          borrower: record.borrower.fullName,
          loan_signature: record.borrower_signature[0],
          loan_verifier: record.loan_verifier.fullName,
          loan_verifier_signature: record.loan_verifier_signature,
          return_signature: record.borrower_signature[1]
            ? `<img src="${record.borrower_signature[1]}" width="100px">`
            : "-",
          return_verifier: record.return_verifier
            ? record.return_verifier.fullName
            : "-",
          return_verifier_signature: record.return_verifier_signature
            ? `<img src="${record.return_verifier_signature}" width="100px">`
            : "-",
          loanAt: moment(new Date(record.loanAt)).format(
            "MMMM Do YYYY, h:mm:ss a"
          ),
          returnAt: record.returnAt
            ? moment(new Date(record.returnAt)).format(
                "MMMM Do YYYY, h:mm:ss a"
              )
            : "-",
        });
      } else {
        if (current_clearing_staff) {
          records.push({
            clearing_staff: current_clearing_staff,
            clearing_staff_signature: current_clearing_staff_signature,
            clearAt: current_clearAt,
            docs: currentDocs,
          });
        }
        currentDocs = [
          {
            count,
            item: `${record.item.item_description} (${record.item.equipment_type.equipment_name})`,
            reason: record.reason,
            borrower: record.borrower.fullName,
            loan_signature: record.borrower_signature[0],
            loan_verifier: record.loan_verifier.fullName,
            loan_verifier_signature: record.loan_verifier_signature,
            return_signature: record.borrower_signature[1]
              ? `<img src="${record.borrower_signature[1]}" width="100px">`
              : "-",
            return_verifier: record.return_verifier
              ? record.return_verifier.fullName
              : "-",
            return_verifier_signature: record.return_verifier_signature
              ? `<img src="${record.return_verifier_signature}" width="100px">`
              : "-",
            loanAt: moment(new Date(record.loanAt)).format(
              "MMMM Do YYYY, h:mm:ss a"
            ),
            returnAt: record.returnAt
              ? moment(new Date(record.returnAt)).format(
                  "MMMM Do YYYY, h:mm:ss a"
                )
              : "-",
          },
        ];
        current_clearing_staff = record.clearing_staff;
        current_clearing_staff_signature = record.clearing_staff_signature;
        current_clearAt = moment(new Date(record.clearAt)).format(
          "MMMM Do YYYY, h:mm:ss a"
        );
      }
      count++;
    }
  }

  if (current_clearing_staff) {
    records.push({
      clearing_staff: current_clearing_staff,
      clearing_staff_signature: current_clearing_staff_signature,
      clearAt: current_clearAt,
      docs: currentDocs,
    });
  }

  res.render("admin/clearing", {
    header: "Clear Equipment Entries",
    unclearedItems,
    records,
  });
};

const processClearItems = async (req, res) => {
  const { nric, signature } = req.body.data;

  const staffDoc = await UserModel.findOne({
    nric: nric.toUpperCase(),
    deletedAt: { $exists: false },
  });

  let equipments = [];

  const equipmentDocs = await EquipmentModel.find();

  for (const equipmentDoc of equipmentDocs) {
    const { _id } = equipmentDoc;

    equipments.push(_id.toString());
  }

  const allUnclearedItems = await RecordModel.find({ clearAt: null }).populate(
    "item"
  );

  for (const record of allUnclearedItems) {
    const { _id, item } = record;

    const { equipment_type } = item;

    if (equipments.includes(equipment_type.toString())) {
      await RecordModel.findByIdAndUpdate(_id, {
        clearing_staff: staffDoc._id,
        clearing_staff_signature: signature,
        clearAt: Date.now(),
      });
    }
  }

  req.flash("success", "Equipment balance entries cleared!");
  res.redirect("/admin");
};

module.exports = { renderClearing, processClearItems };
