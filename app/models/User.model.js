const mongoose = require("mongoose"),
  bcrypt = require("bcrypt");

const bcryptSalt = 12;

const userSchema = new mongoose.Schema({
  nric: {
    type: String,
    required: true,
    uppercase: true,
  },
  fullName: {
    type: String,
    required: true,
    uppercase: true,
  },
  pin: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
  },
  staff: {
    type: Boolean,
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

userSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();
  if (this.isModified("pin"))
    this.pin = await bcrypt.hash(this.pin, bcryptSalt);
  next();
});

userSchema.statics.verifyAdmin = async function (nric, pin) {
  const user = await this.findOne({
    nric,
    deletedAt: { $exists: false },
  });
  if (user) {
    const match = await bcrypt.compare(pin, user.pin);
    if (match) return user.admin ? "success" : "not admin";
    else return "wrong password";
  } else return "invalid NRIC";
};

userSchema.statics.verifyPin = async function (nric, pin) {
  const user = await this.findOne({
    nric,
    deletedAt: { $exists: false },
  });
  if (user) return await bcrypt.compare(pin, user.pin);
  else return false;
};

module.exports = mongoose.model("User", userSchema);
