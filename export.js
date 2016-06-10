"use strict";
var express = require("express"),
	router = express.Router(),
	firebase = require("firebase"),
	webshot = require("webshot"),
	fs = require("fs");

var db = firebase.database(),
	options = {
		screenSize: {
			width: 1920,
			height: 1080
		},
		quality: 90,
		siteType: "html"
	},
	template = fs.readFileSync("screenshot.html", "utf8");

router.get("/export/:userId", function(req, res) {
    let ref = db.ref(`speakers/${req.params.userId}`);
    ref.once("value", function(snapshot) {
        let speaker = snapshot.val(),
            infoPos = (speaker.avatarPosition == 768)? "right: 408px;" : "left: 416px;",
            shot = template.replace("[avaLeft]", speaker.avatar.Left * 2)
                           .replace("[avaTop]", speaker.avatar.Top * 2)
                           .replace("[avaUrl]", speaker.avatar.URL)
                           .replace("[avaWidth]", speaker.avatar.Width * 2)
                           .replace(/\[avaPos]/g, speaker.avatarPosition * 2)
                           .replace("[backLeft]", speaker.background.Left * 2)
                           .replace("[backTop]", speaker.background.Top * 2)
                           .replace("[backUrl]", speaker.background.URL)
                           .replace("[backWidth]", speaker.background.Width * 2)
                           .replace("[expI]", speaker.experience[0])
                           .replace("[expII]", speaker.experience[1])
                           .replace("[expIII]", speaker.experience[2])
                           .replace("[expFocus]", ++speaker.experienceFocus)
                           .replace("[infoWidth]", speaker.info.Width * 2)
                           .replace("[infoHeight]", speaker.info.Height * 2)
                           .replace("[infoText]", speaker.info.Text)
                           .replace("[infoPos]", infoPos)
                           .replace("[loc]", speaker.location)
                           .replace("[locColor]", speaker.locationColor)
                           .replace("[name]", speaker.name);

        webshot(shot, `public/uploads/cover${req.params.userId}.jpeg`, options, function(err) {
            if (err) console.log(err);
            res.redirect(`/uploads/cover${req.params.userId}.jpeg`);
        });
    });
});

module.exports = router;
