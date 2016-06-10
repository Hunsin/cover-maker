"use strict";
var express = require("express"),
	firebase = require("firebase"),
	app = express(),
	config = require("./config");

firebase.initializeApp({
        databaseURL: config.databaseURL,
        serviceAccount: config.serviceAccount
});

// middleware
app.use(express.static(__dirname + "/public"));
app.use(require("./upload"));
app.use(require("./export"));

// 404 error handler
app.use(function(req, res, next) {
	res.status(404);
});

// 500 error handler
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500);
});

app.listen(config.port);
