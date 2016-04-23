"use strict";
var express = require("express"),
	router = express.Router(),
	multer = require("multer"),
	storage = multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, "./public/uploads/");
		},
		filename: function(req, file, cb) {
			cb(null, req.body.filename);
		}
	}),
	upload = multer({storage: storage});

// handle upload files
router.post("/upload", upload.single("img"), function (req, res) {
	res.send("/uploads/" + req.body.filename);
});

module.exports = router;
