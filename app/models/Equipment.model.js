const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
    equipment_name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    },
    deletedAt: {
        type: Date,
    },
});

equipmentSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Equipment", equipmentSchema);