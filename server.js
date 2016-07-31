"use strict";
var express = require("express"),
	firebase = require("firebase"),
	fs = require("fs"),
	app = express(),
	config = require("./config"),
	page = fs.readFileSync("public/index.html", "utf8").toString().replace(/#FIREBASE_URL#/g, config.databaseURL);

firebase.initializeApp({
	databaseURL: config.databaseURL,
	serviceAccount: config.serviceAccount
});

// routing
app.get("/", (req, res) => res.send(page));
app.get("/index*", (req, res) => res.redirect("/"));
app.get("/edit", (req, res) => res.redirect("/"));
app.get("/edit/:id", (req, res) => res.send(page));

// middleware
app.use(express.static(__dirname + "/public"));
app.use(require("./storage"));
app.use(require("./search"));

// 404 error handler
app.use((req, res, next) => res.status(404));

// 500 error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500);
});

app.listen(config.port);