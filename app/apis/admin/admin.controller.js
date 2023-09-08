module.exports = {
    renderAdmin: (req, res) => {
        res.render("admin/index", { header: "Admin Menu" });
    },
};