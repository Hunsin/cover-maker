"use strict";
var express = require("express"),
	router = express.Router(),
	firebase = require("firebase"),
	fireListener = new firebase("https://ioh-cover-maker.firebaseio.com/speakers/"),
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

function removeImg(url) {
	if (url != "/assets/avatar.png" && url != "/assets/instruction.png") {
		fs.unlink(`public${url}`, function(err) {
			if (err) console.log(`Remove Image ERROR: location: ${url}`);
		});
	}
}

// handle removed speaker images
fireListener.on("child_removed", function(snapshot) {
	let speaker = snapshot.val();

	removeImg(speaker.avatar.URL);
	removeImg(speaker.background.URL);
});

// handle upload files
router.post("/upload/:userId/:imgName", upload.single("img"), function (req, res) {
	let userId = req.params.userId,
		imgName = req.params.imgName,
		ref = new firebase(`https://ioh-cover-maker.firebaseio.com/speakers/${userId}/${imgName}/URL`);
	
	// prevent bad request
	if (imgName != "avatar" && imgName != "background") res.status(400).end();

	ref.once("value", function(data) {
		ref.set(`/uploads/${req.file.filename}`);
		removeImg(data.val());
	});
	res.end();
});

module.exports = router;