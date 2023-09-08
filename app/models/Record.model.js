const mongoose = require("mongoose");

const { Schema } = mongoose;

const recordSchema = new Schema({
  item: {
    type: Schema.Types.ObjectId,
    ref: "Item",
  },
  reason: {
    type: String,
    required: true,
  },
  borrower: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  borrower_signature: [
    {
      type: String,
    },
  ],
  loan_verifier: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  loan_verifier_signature: {
    type: String,
    required: true,
  },
  return_verifier: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  return_verifier_signature: {
    type: String,
    default: null,
  },
  clearing_staff: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  clearing_staff_signature: {
    type: String,
    default: null,
  },
  loanAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  returnAt: {
    type: Date,
    default: null,
  },
  clearAt: {
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

recordSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Record", recordSchema);
