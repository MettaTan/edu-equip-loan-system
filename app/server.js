const app = require("./index"),
  config = require("./config"),
  mongoose = require("mongoose");

(async () => {
  await mongoose.connect(
    `mongodb://${config.mongodb.host}:${config.mongodb.port}/equipment_loan_system`
  );
})().catch((err) => console.log(err));

app.listen(config.express.port, config.express.ip, function (err) {
  if (err) console.log("Unable to listen for connections", err);

  console.log(
    `Express is listening on http://${config.express.ip}:${config.express.port}`
  );
  console.log(
    `MongoDB is listening on http://${config.mongodb.host}:${config.mongodb.port}`
  );
});
