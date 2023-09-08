const express = require("express");

const app = express();
require("dotenv").config();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const session = require("express-session");
app.use(
  session({
    secret: "metta is afraid of the dark",
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", "layouts/layout");
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

const flash = require("connect-flash");
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  const ip = (req.session.ip = process.env.EXPRESS_IP);
  const port = (req.session.port = process.env.EXPRESS_PORT);
  res.render("home", {
    header: "Main Menu",
    ip,
    port,
  });
});
app.use("/user", require("./apis/user/user.router"));
app.use("/transaction", require("./apis/transaction/transaction.router"));
app.use("/admin", require("./apis/admin/admin.router"));

const ExpressError = require("./utils/errors/ExpressError");
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message)
    err.message =
      "Something went wrong! Please inform an administrator about the issue that you experienced!";
  res.status(statusCode).render("error", { err });
});

module.exports = app;
