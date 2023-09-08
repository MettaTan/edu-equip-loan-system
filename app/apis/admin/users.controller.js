const EquipmentModel = require("../../models/Equipment.model"),
  ItemModel = require("../../models/Item.model"),
  UserModel = require("../../models/User.model");

module.exports = {
  renderViewUsers: async (req, res) => {
    res.render("admin/viewUsers", { header: "View Users" });
  },
  getUserData: async (req, res) => {
    const users = await UserModel.find({ deletedAt: { $exists: false } });

    let data = [];
    for (const user of users) {
      const assignedItems = await ItemModel.find({
        user_assignment: user._id,
        deletedAt: { $exists: false },
      }).populate("equipment_type");

      let items = [];
      for (const item of assignedItems)
        items.push(
          `${item.item_description} (${item.equipment_type.equipment_name})`
        );

      data.push({
        _id: user._id,
        nric: user.nric,
        fullName: user.fullName,
        admin: user.admin,
        staff: user.staff,
        items,
      });
    }

    res.send({ data });
  },
  editUser: async (req, res) => {
    const { _id, fullName, nric, admin, staff } = req.body.data;

    await UserModel.findByIdAndUpdate(_id, {
      nric,
      fullName,
      admin,
      staff,
    });
  },
  deleteUser: async (req, res) => {
    const { _id } = req.body;

    await ItemModel.updateMany(
      { user_assignment: _id },
      {
        user_assignment: null,
        status: null,
      }
    );

    await ItemModel.updateMany(
      { status: _id },
      {
        user_assignment: null,
        status: null,
      }
    );

    await UserModel.findByIdAndUpdate(_id, { deletedAt: Date.now() });
  },
};
