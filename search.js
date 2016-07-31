"use strict";
var express = require("express"),
	router = express.Router(),
	firebase = require("firebase"),
	dbListener = firebase.database().ref("speakers");

var elasticsearch = require('elasticsearch'),
	client = new elasticsearch.Client({
		host: "localhost:9200",
		log: {
			type: 'stdio',
			levels: ['error', 'warning']
		}
	});

dbListener.on("child_added", (data) => {
	let speaker = data.val();
	client.create({
		index: "speakers",
		type: "cover",
		id: speaker.id,
		body: {
			__firebaseKey__: speaker.id,
			avatar: { URL: speaker.avatar.URL },
			name: speaker.name,
			experience: [ speaker.experience[speaker.experienceFocus] ]
		}
	}, (err, response) => {
		if (err) console.log(err);
	});
});

dbListener.on("child_changed", (data) => {
	let speaker = data.val();
	client.update({
		index: "speakers",
		type: "cover",
		id: speaker.id,
		body: {
			doc: {
				avatar: { URL: speaker.avatar.URL },
				name: speaker.name,
				experience: [ speaker.experience[speaker.experienceFocus] ]
			}
		}
	}, (err, response) => {
		if (err) console.log(err);
	});
});

dbListener.on("child_removed", (data) => {
	client.delete({
		index: "speakers",
		type: "cover",
		id: data.key
	}, (err, response) => {
		if (err) console.log(err);
	});
});

router.get("/search", (req, res) => {
	if (!req.query.text) res.end();
	client.search({
		index: "speakers",
		type: "cover",
		q: req.query.text + "*",
		fields: ["name", "experience"],
		_source: true,
		size: 100
	}).then((result) => {
		let list = result.hits.hits.map((item) => {
			return item._source;
		});
		res.send(list);
	}, (err) => {
		console.log(err);
	});
});

module.exports = router;