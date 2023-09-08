const UserModel = require("../../models/User.model");

module.exports = {
    renderLogin: (req, res) => {
        res.render("user/login", { header: "User Login" });
    },
    processLogin: async (req, res) => {
        const { nric, pin } = req.body.data;
        
        const pinAdminLookup = await UserModel.verifyAdmin(nric.toUpperCase(), pin.toUpperCase());

        switch (pinAdminLookup) {
            case "success":
                const { _id } = await UserModel.findOne({
                    nric: nric.toUpperCase(),
                    deletedAt: { $exists: false },
                });
                req.session.user_id = _id;
                req.flash("success", "Logged in!");
                res.redirect("/admin");
                break;
            case "not admin":
                req.flash("error", "User is not an admin user!");
                res.redirect("/user");
                break;
            case "wrong password":
                req.flash("error", "Wrong password!");
                res.redirect("/user");
                break;
            case "invalid NRIC":
                req.flash("error", "Invalid NRIC! No user account found!");
                res.redirect("/user");
            default:
                break;
        }
    }
};