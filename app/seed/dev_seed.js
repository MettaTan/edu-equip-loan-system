const config = require("../config");

const mongoose = require("mongoose");

(async () => {
  await mongoose.connect(
    `mongodb://${config.mongodb.host}:${config.mongodb.port}/equipment_loan_system`
  );
})().catch((err) => console.log(err));

const EquipmentModel = require("../models/Equipment.model"),
  ItemModel = require("../models/Item.model"),
  UserModel = require("../models/User.model");

const equipments = require("./equipments"),
  items = require("./items"),
  users = require("./users");

(async () => {
  for (const equipment of equipments) {
    const newEquipment = await EquipmentModel.create({
      equipment_name: equipment,
    });
    await newEquipment.save();
  }
  for (const item of items) {
    for (const equipment of equipments) {
      const { _id } = await EquipmentModel.findOne({
        equipment_name: equipment,
        deletedAt: { $exists: false },
      });
      const newItem = await ItemModel.create({
        item_description: item,
        equipment_type: _id,
      });
      await newItem.save();
    }
  }
  for (const user of users) {
    const newUser = await UserModel.create({
      nric: user.nric,
      fullName: user.fullName,
      pin: user.pin.toUpperCase(),
      admin: user.admin === "admin",
      staff: user.staff === "staff",
    });
    await newUser.save();
  }

  console.log("All data seeded");
})();
