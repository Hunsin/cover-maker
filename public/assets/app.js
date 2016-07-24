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

	// initialize so that #search-list will hide
	app.searchText = "";

	app._isHome = function(page) {
		return (page)? "arrow-back" : "lightbulb-outline";
	};

	app._firebaseLoaded = function() {
		document.querySelector("#firebase-list").empty = (this.speakersData.length == 0);
	};

	app._searchResponse = function() {
		document.querySelector("#search-list").empty = (this.searchResponse.length == 0);
	};

	app.newCover = function() {
		var key = document.querySelector("firebase-collection").add(schema).key();

		// navigate to edit page
		this.set("route.path", "edit/" + key);

		// update the newst speaker's id
		this.set("speaker.id", key);
	};
})();