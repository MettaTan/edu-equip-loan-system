const UserModel = require("../../models/User.model");

module.exports = {
  renderSignUp: (req, res) => {
    res.render("user/signup", { header: "User Sign Up" });
  },
  processSignUp: async (req, res, next) => {
    const { nric, fullName, pin, admin = "", staff = "" } = req.body.data;

    const user = await UserModel.findOne({ nric });

    if (user) {
      req.flash("error", "User already exists!");
      res.redirect("/admin/viewUsers");
    } else {
      const newUser = await UserModel.create({
        nric,
        fullName,
        pin: pin.toUpperCase(),
        admin: admin === "admin",
        staff: staff === "staff",
      });
      await newUser.save();

      req.flash("success", "New user added!");
      res.redirect("/admin/viewUsers");
    }
  },
};
