"use strict";
var express = require("express"),
	router = express.Router(),
	fs = require("fs"),
	gm = require("gm");

var firebase = require("firebase"),
	db = firebase.database(),
	dbListener = db.ref("speakers");

var multer = require("multer"),
	upload = multer({
		storage: multer.memoryStorage(),
		limits: {fileSize: 8388608} // 8MB
	});

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
});

// handle upload files
router.post("/upload/:userId/:imgName", upload.single("img"), (req, res) => {
	let userId = req.params.userId,
		imgName = req.params.imgName, // avatar or background
		type = req.file.mimetype.replace("image/", "."), // .png or .jpeg
		filename = imgName + "_" + Date.now() + type,
		ref = db.ref(`speakers/${userId}/${imgName}/URL`);

	// prevent bad request
	if (imgName != "avatar" && imgName != "background") res.status(400).end();
	
	// rotate image if necessary and save the file
	gm(req.file.buffer).autoOrient().write(`./public/uploads/${filename}`, (err) => {
		if (err) {
			console.log(err);
			res.status(503);
		} else {
			
			// set new image url and remove the old one
			ref.once("value", (data) => {
				ref.set(`/uploads/${filename}`);
				removeImg(data.val());
			});
		}
	});

	res.end();
});

module.exports = router;