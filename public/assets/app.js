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

	app.page = "list";
	
	app.backToList = function() {
		this.page = "list";
	};
	app.getSpeakerUrl = function(id) {
		return document.querySelector("firebase-collection").location + "/" + id;
	};
	app._isList = function(page) {
		return (page === "list")? "menu" : "arrow-back";
	};
	app._searchRange = function(search) {
		return search + "\uf8ff";
	};
	app.newCover = function() {
        var key = document.querySelector("firebase-collection").add(schema).key();

        // update the newst speaker's id
        this.speakerId = key;
        this.page = "editor";
        this.set("speaker.id", key);
    };
})();