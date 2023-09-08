const config = module.exports;
require("dotenv").config();

const assigned_ip = "127.0.0.1";

if (process.env.NODE_ENV === "production") {
	config.express = {
		port: process.env.EXPRESS_PORT,
		ip: process.env.EXPRESS_IP,
	};

	config.mongodb = {
		port: process.env.MONGODB_PORT,
		host: process.env.MONGODB_HOST,
	};
} else {
	config.express = {
		port: process.env.EXPRESS_PORT || 8001,
		ip: "127.0.0.1",
		//ip: "192.168.1.145",
	};

	config.mongodb = {
		port: process.env.MONGODB_PORT || 27017,
		host: process.env.MONGODB_HOST || assigned_ip,
	};
}