var rawJSON;
var releases = [];

class Release {
	constructor(release_time, version, title) {
		this.release_time = release_time;
		this.version = version;
		this.title = title;
		this.added = [];
		this.changed = [];
		this.removed = [];
	}
	
	insertAdded(x) {
		this.added.push(x);
	}
	
	insertChanged(x) {
		this.changed.push(x);
	}
	
	insertRemoved(x) {
		this.removed.push(x);
	}
}

function createMarkdown() {
	var out = document.getElementById("markdownTextField");
}

function parseJSON(json) {
	//Only parse when different
	if(rawJSON == json)
		return;
	
	rawJSON = json;
	releases = [];
	
	try {
		var jsonOBJ = JSON.parse(rawJSON);
		for(var i = 0; i < jsonOBJ.length; i++) {
			var o = jsonOBJ[i];
			var r = new Release(o.release_time, o.version, o.title);
			o.added.forEach(e => r.insertAdded(e));
			o.changed.forEach(e => r.insertChanged(e));
			o.removed.forEach(e => r.insertRemoved(e));
			
			releases.push(r);
		}
		console.log(releases);
	} catch(err) { }
}

window.onload = function() {
	var textfield = document.getElementById("jsonTextField");
	var textfieldListener = function() {
		parseJSON(document.getElementById("jsonTextField").value);
		createMarkdown();
	};
	textfield.onkeyup = textfieldListener;
	textfield.onblur = textfieldListener;
}