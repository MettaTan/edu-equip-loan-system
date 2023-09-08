module.exports = async (req, res, next) => {
    if (!req.session.user_id) {
        req.flash("error", "Please log in first!");
        return res.redirect("/user");
    }
    next();
};