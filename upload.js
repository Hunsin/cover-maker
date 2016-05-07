"use strict";
var express = require("express"),
	router = express.Router(),
	firebase = require("firebase"),
	fs = require("fs");

var multer = require("multer"),
	storage = multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, "./public/uploads/");
		},
		filename: function(req, file, cb) {
			let imgName = req.params.imgName, // avatar or background
				type = file.mimetype.replace("image/", "."); // .png or .jpeg

			cb(null, imgName + "_" + Date.now() + type);
		}
	}),
	upload = multer({storage: storage});

// handle upload files
router.post("/upload/:userId/:imgName", upload.single("img"), function (req, res) {
	let userId = req.params.userId,
		imgName = req.params.imgName,
		ref = new firebase(`https://ioh-cover-maker.firebaseio.com/speakers/${userId}/${imgName}/URL`);
	
	// prevent bad request
	if (imgName != "avatar" && imgName != "background") res.status(400).end();

	ref.once("value", function(data) {
		ref.set(`/uploads/${req.file.filename}`);
		fs.unlink(`public${data.val()}`, function(err) {
			if (err) console.log(`ERROR: userID: ${userId}, img: ${data.val()}`);
		});
	});
	res.end();
});

module.exports = router;