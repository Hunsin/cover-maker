(function() {
	var app = document.querySelector("#app"),
		xhr = new XMLHttpRequest();

    // get the newest speakers data schema from server
    xhr.open("GET", "/assets/speaker-schema.json", true);
    xhr.onload = function (e) {
        app.schema = JSON.parse(this.response);
    };
    xhr.send();

	app.page = "list";
	
	app.backToList = function() {
		app.page = "list";
	};
	app._isList = function(page) {
		return page === "list";
	};
})();