const EquipmentModel = require("../../models/Equipment.model"),
  ItemModel = require("../../models/Item.model"),
  UserModel = require("../../models/User.model");

module.exports = {
  renderViewItems: async (req, res) => {
    const equipments = await EquipmentModel.find({
        deletedAt: { $exists: false },
      }),
      users = await UserModel.find({ deletedAt: { $exists: false } });

    let equipmentsData = [],
      usersData = [];

    for (const equipment of equipments) {
      equipmentsData.push({
        _id: equipment._id,
        equipment_name: equipment.equipment_name,
      });
    }

    for (const user of users) {
      usersData.push({
        _id: user._id,
        fullName: user.fullName,
      });
    }

    res.render("admin/viewItems", {
      header: "View Item Status & Assignments",
      equipmentsData,
      usersData,
    });
  },
  getItemData: async (req, res) => {
    const items = await ItemModel.find({ deletedAt: { $exists: false } })
      .populate("equipment_type")
      .populate("user_assignment")
      .populate("status");

    let data = [];

    for (const item of items) {
      data.push({
        _id: item._id,
        item_description: item.item_description,
        equipment_name: item.equipment_type.equipment_name,
        serial_no: item.serial_no,
        assigned_userfullName: item.user_assignment
          ? item.user_assignment.fullName
          : "Not Assigned",
        status: item.status ? item.status.fullName : "-",
      });
    }

    res.send({ data });
  },
  addEquipment: async (req, res) => {
    const { equipment_name } = req.body.data;

    const newEquipment = await EquipmentModel.create({ equipment_name });
    await newEquipment.save();
    res.redirect("/admin/viewItems");
  },
  addItem: async (req, res) => {
    const { item_description, equipment_type, serial_no, user_assignment } =
      req.body.data;

    const newItem = await ItemModel.create({
      item_description,
      equipment_type,
      serial_no,
      user_assignment:
        user_assignment === "Not Assigned" ? null : user_assignment,
    });
    await newItem.save();
    res.redirect("/admin/viewItems");
  },
  editItem: async (req, res) => {
    const {
      _id,
      item_description,
      serial_no,
      equipment_type,
      user_assignment,
    } = req.body.data;

    await ItemModel.findByIdAndUpdate(_id, {
      item_description,
      serial_no,
      equipment_type,
      user_assignment: user_assignment === "" ? null : user_assignment,
    });
  },
  deleteItem: async (req, res) => {
    const { _id } = req.body;

    await ItemModel.findByIdAndUpdate(_id, { deletedAt: Date.now() });
  },
};
