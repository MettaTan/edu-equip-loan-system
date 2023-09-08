const ItemModel = require("../../models/Item.model"),
  EquipmentModel = require("../../models/Equipment.model"),
  UserModel = require("../../models/User.model"),
  RecordModel = require("../../models/Record.model");

module.exports = {
  renderVerify: async (req, res) => {
    const { _id } = req.query,
      { data } = req.session;

    if (data && data.borrower === _id) {
      let items = [];

      for (const item_id of data.items) {
        const {
          item_description,
          equipment_type: { equipment_name },
        } = await ItemModel.findById(item_id).populate("equipment_type");
        items.push({ item_description, equipment_name });
      }

      const { fullName } = await UserModel.findById(data.borrower);

      res.render("transaction/verify", {
        header: `Verify ${data.type}`,
        fullName,
        items,
        reason: data.reason,
      });
    } else {
      req.flash("error", "Session expired!");
      res.redirect("/");
    }
  },
  checkAdminNric: async (req, res) => {
    const { nric } = req.body;

    const user = await UserModel.findOne({
      nric: nric.toUpperCase(),
      admin: true,
      deletedAt: { $exists: false },
    });

    res.send(user ? user : false);
  },
  processVerify: async (req, res) => {
    const verifier = req.body.data,
      { type, items, ...data } = req.session.data;

    req.session.data = null;

    if (type && items && data && verifier) {
      const { _id } = await UserModel.findOne({
        nric: verifier.nric.toUpperCase(),
        deletedAt: { $exists: false },
      });

      if (type === "Loan") {
        let entry = {
          ...data,
          ...{
            loan_verifier: _id,
            loan_verifier_signature: verifier.signature,
          },
        };

        for (const item_id of items) {
          const itemEntry = await ItemModel.findById(item_id);

          if (!itemEntry.status) {
            const newRecord = await RecordModel.create({
              ...entry,
              ...{ item: item_id },
            });
            await newRecord.save();

            await ItemModel.findByIdAndUpdate(item_id, {
              status: data.borrower,
              activeRecord: newRecord._id,
            });
          }
        }

        req.flash("success", "Equipment loaned!");
      } else if (type === "Return") {
        const { borrower, returner_signature } = data;

        for (const item_id of items) {
          const itemEntry = await ItemModel.findById(item_id);

          if (itemEntry.status && itemEntry.activeRecord) {
            await RecordModel.findByIdAndUpdate(itemEntry.activeRecord, {
              "borrower_signature.1": returner_signature,
              return_verifier: _id,
              return_verifier_signature: verifier.signature,
              returnAt: Date.now(),
            });
          } else {
            // Guard for if itemEntry is somehow empty
            const missingRecordDoc = await RecordModel.findOne({
              borrower,
              item: item_id,
              returnAt: null,
            });

            if (missingRecordDoc) {
              missingRecordDoc.borrower_signature[1] = returner_signature;
              missingRecordDoc.return_verifier = _id;
              missingRecordDoc.return_verifier_signature = verifier.signature;
              missingRecordDoc.returnAt = Date.now();

              missingRecordDoc.save();
            }
          }

          await ItemModel.findByIdAndUpdate(item_id, {
            status: null,
            activeRecord: null,
          });
        }

        req.flash("success", "Equipment returned!");
      }

      res.redirect("/");
    } else {
      req.flash("error", "Return failed! Please try again!");
      res.redirect("/transaction/returns");
    }
  },
};
