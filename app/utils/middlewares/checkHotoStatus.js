const HotoModel = require("../../models/Hoto.model");

module.exports = async (req, res, next) => {
  const partialHoto = await HotoModel.findOne({ takeover: null });

  if (partialHoto) {
    req.flash(
      "error",
      "Please contact an administrator or staff member to complete HOTO!"
    );
    return res.redirect("/");
  }
  next();
};
