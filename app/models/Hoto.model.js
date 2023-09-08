const mongoose = require("mongoose");
const { Schema } = mongoose;

const hotoSchema = new Schema({
    handover: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    handover_signature: {
        type: String,
        required: true,
    },
    takeover: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    takeover_signature: {
        type: String,
        default: null,
    },
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: "Item",
        },
    ],
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    reasons: [
        {
            type: String,
        }
    ],
    handoverAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    takeoverAt: {
        type: Date,
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

hotoSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Hoto", hotoSchema);