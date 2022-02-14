var rawJSON;
var releases = [];

var title;
var description;

class Release {
	constructor(release_time, version, title, url) {
		this.release_time = release_time;
		this.version = version;
		this.url = url;
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

function prettyPrintDateNr(d) {
	if(d < 10)
		return "0" + d;
	return d;
}

function createMarkdown() {
	var out = document.getElementById("markdownTextField");
	var input = `# ${title}\n${description}`;

	releases.forEach(e => {
		var date = new Date(e.release_time * 1000);
		var day = prettyPrintDateNr(date.getDate());
		var month = prettyPrintDateNr(date.getMonth() + 1);
		var year = date.getFullYear();
		var hours = prettyPrintDateNr(date.getHours());
		var minutes = prettyPrintDateNr(date.getMinutes());
		var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		var dateString = `${day}.${month}.${year} ${hours}:${minutes} (${timezone})`;
		input += `\n## [${e.version}] (${e.url}) - ${dateString}`;
	});
	
	out.value = input;
}

function parseJSON(json) {
	//Only parse when different
	if(rawJSON == json)
		return;
	
	rawJSON = json;
	releases = [];
	
	try {
		var jsonOBJ = JSON.parse(rawJSON);
		title = jsonOBJ.title;
		description = jsonOBJ.description;
		for(var i = 0; i < jsonOBJ.releases.length; i++) {
			var o = jsonOBJ.releases[i];
			var r = new Release(o.release_time, o.version, o.title, o.url);
			o.added.forEach(e => r.insertAdded(e));
			o.changed.forEach(e => r.insertChanged(e));
			o.removed.forEach(e => r.insertRemoved(e));
			
			releases.push(r);
		}
		createMarkdown();
	} catch(err) {
		console.log(err);
	}
}

window.onload = function() {
	var textfield = document.getElementById("jsonTextField");
	var textfieldListener = function() {
		parseJSON(document.getElementById("jsonTextField").value);
	};
	textfield.onkeyup = textfieldListener;
	textfield.onblur = textfieldListener;
}