const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema({
    item_description: {
        type: String,
        required: true,
    },
    equipment_type: {
        type: Schema.Types.ObjectId,
        ref: "Equipment",
        required: true,
    },
    serial_no: {
        type: String,
        default: "-",
    },
    user_assignment: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    status: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    activeRecord: {
        type: Schema.Types.ObjectId,
        ref: "Record",
        default: null,
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

itemSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Item", itemSchema);