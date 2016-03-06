"use strict";
var express = require("express"),
    app = express();

// middleware
app.use(express.static(__dirname + "/public"));
app.use(require("./upload"));

// 404 error handler
app.use(function(req, res, next) {
	res.status(404);
});

// 500 error handler
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500);
});

app.listen(process.env.PORT, process.env.IP);