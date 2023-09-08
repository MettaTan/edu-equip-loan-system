const config = require("../config");

const mongoose = require("mongoose");

(async () => {
	await mongoose.connect(`mongodb://${config.mongodb.host}:${config.mongodb.port}/equipment_loan_system`);
})()
	.catch((err) => console.log(err));

const EquipmentModel = require("../models/Equipment.model"),
	HotoModel = require("../models/Hoto.model"),
	ItemModel = require("../models/Item.model"),
	RecordModel = require("../models/Record.model"),
	UserModel = require("../models/User.model");

(async () => {
	const items = await ItemModel.find()

	for (const item of items) {
		const { _id } = item

		await ItemModel.findByIdAndUpdate(_id, {
			user_assignment: null,
			status: null,
		})
	}

	console.log("All data seeded");
})();