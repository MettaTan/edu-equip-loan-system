const EquipmentModel = require("../../models/Equipment.model"),
  HotoModel = require("../../models/Hoto.model"),
  ItemModel = require("../../models/Item.model"),
  RecordModel = require("../../models/Record.model"),
  UserModel = require("../../models/User.model");

module.exports = {
  renderHoto: async (req, res) => {
    const partialHoto = await HotoModel.findOne({ takeover: null })
      .populate({
        path: "items",
        populate: { path: "equipment_type" },
      })
      .populate("users");

    let items = {},
      type;

    if (partialHoto) {
      type = "Takeover";
      for (const [index, item] of partialHoto.items.entries()) {
        if (item.equipment_type.equipment_name in items) {
          items[item.equipment_type.equipment_name].push({
            item_description: item.item_description,
            fullName: partialHoto.users[index].fullName,
            reason: partialHoto.reasons[index],
          });
        } else {
          items[item.equipment_type.equipment_name] = [
            {
              item_description: item.item_description,
              fullName: partialHoto.users[index].fullName,
              reason: partialHoto.reasons[index],
            },
          ];
        }
      }
    } else {
      type = "Handover";
      const loanedItems = await ItemModel.find({
        status: { $ne: null },
        deletedAt: { $exists: false },
      })
        .populate("equipment_type")
        .populate("status");

      for (const item of loanedItems) {
        const itemRecord = await RecordModel.findOne({
          item: item._id,
          returnAt: null,
        });

        if (item.equipment_type.equipment_name in items) {
          items[item.equipment_type.equipment_name].push({
            item_description: item.item_description,
            fullName: item.status.fullName,
            reason: itemRecord.reason,
          });
        } else {
          items[item.equipment_type.equipment_name] = [
            {
              item_description: item.item_description,
              fullName: item.status.fullName,
              reason: itemRecord.reason,
            },
          ];
        }
      }
    }

    req.session.data = { type };

    res.render("admin/hoto", {
      header: "View Handover & Takeover Records",
      type,
      items,
    });
  },
  getHotoData: async (req, res) => {
    const entries = await HotoModel.find()
      .populate("handover")
      .populate("takeover")
      .populate({
        path: "items",
        populate: { path: "equipment_type" },
      })
      .populate("users");

    let data = [],
      count = 1;

    for (const entry of entries) {
      let items = [];

      for (const [index, item] of entry.items.entries())
        items.push(
          `${item.item_description} (${item.equipment_type.equipment_name}) - ${entry.users[index].fullName} (${entry.reasons[index]})`
        );

      data.push({
        count,
        items,
        handover: entry.handover.fullName,
        handover_signature: entry.handover_signature,
        takeover: entry.takeover ? entry.takeover.fullName : "-",
        takeover_signature: entry.takeover_signature
          ? entry.takeover_signature
          : "-",
        handoverAt: entry.handoverAt,
        takeoverAt: entry.takeoverAt ? entry.takeoverAt : "-",
      });

      count++;
    }

    res.send({ data });
  },
  processHoto: async (req, res) => {
    const { nric, signature } = req.body.data,
      { type } = req.session.data;

    req.session.data = null;

    const partialHoto = await HotoModel.findOne({ takeover: null });

    const { _id } = await UserModel.findOne({
      nric: nric.toUpperCase(),
      deletedAt: { $exists: false },
    });

    if (partialHoto && type === "Takeover") {
      await HotoModel.findByIdAndUpdate(partialHoto._id, {
        takeover: _id,
        takeover_signature: signature,
        takeoverAt: Date.now(),
      });
      res.redirect("/admin/hoto");
    } else if (!partialHoto && type === "Handover") {
      let items_id = [],
        users_id = [],
        reasons = [];

      const items = await ItemModel.find({
        status: { $ne: null },
        deletedAt: { $exists: false },
      });

      for (const item of items) {
        items_id.push(item._id);
        users_id.push(item.status);

        const itemRecord = await RecordModel.findOne({
          item: item._id,
          returnAt: null,
        });
        reasons.push(itemRecord.reason);
      }

      const newHoto = await HotoModel.create({
        handover: _id,
        handover_signature: signature,
        items: items_id,
        users: users_id,
        reasons,
      });
      await newHoto.save();

      res.redirect("/admin/hoto");
    } else {
      req.flash("error", "Session expired!");
      res.redirect("/admin");
    }
  },
};
