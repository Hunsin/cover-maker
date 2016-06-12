"use strict";
var express = require("express"),
	router = express.Router(),
	firebase = require("firebase"),
	fs = require("fs"),
	db = firebase.database(),
	dbListener = db.ref("speakers");

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

		// check if accessible
		fs.access(`public${url}`, fs.W_OK, (err) => {
			if (!err) {

				// remove file
				fs.unlink(`public${url}`, (err) => {
					if (err) console.log(err);
				});
			}
			else console.log(err);
		});
	}
}

// handle removed speaker images
dbListener.on("child_removed", (snapshot) => {
	let speaker = snapshot.val();

	removeImg(speaker.avatar.URL);
	removeImg(speaker.background.URL);
	removeImg(`/uploads/cover${speaker.id}.jpeg`);
});

// handle upload files
router.post("/upload/:userId/:imgName", upload.single("img"), (req, res) => {
	let userId = req.params.userId,
		imgName = req.params.imgName,
		ref = db.ref(`speakers/${userId}/${imgName}/URL`);
	
	// prevent bad request
	if (imgName != "avatar" && imgName != "background") res.status(400).end();

	// set new image url and remove the old one
	ref.once("value", (data) => {
		ref.set(`/uploads/${req.file.filename}`);
		removeImg(data.val());
	});
	res.end();
});

module.exports = router;