module.exports = {
    processLogout: async (req, res) => {
        req.session.user_id = null;
        req.flash("success", "Logged out!");
        res.redirect("/");
    }
};