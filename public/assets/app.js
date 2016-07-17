(function() {
	var app = document.querySelector("#app"),
		xhr = new XMLHttpRequest(),
		schema;

	// get the newest speakers data schema from server
	xhr.open("GET", "/assets/speaker-schema.json", true);
	xhr.onload = function (e) {
		schema = JSON.parse(this.response);
	};
	xhr.send();

	app._isHome = function(page) {
		return (!page)? "lightbulb-outline" : "arrow-back";
	};

	app._firebaseLoaded = function(e) {
		document.querySelector("speaker-list").empty = (this.speakers.length == 0);
	};

	app._searchRange = function(search) {
		return search + "\uf8ff";
	};
	app.newCover = function() {
		var key = document.querySelector("firebase-collection").add(schema).key();

		// navigate to edit page
		this.set("route.path", "edit/" + key);

		// update the newst speaker's id
		this.set("speaker.id", key);
	};
})();