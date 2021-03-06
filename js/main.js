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
	var input = "[//]: # (Made with JSON-CL. JSON-CL.github.io)\n\n\n"
	input += `# ${title}\n${description}`;

	releases.forEach(e => {
		var date = new Date(e.release_time * 1000);
		var day = prettyPrintDateNr(date.getDate());
		var month = prettyPrintDateNr(date.getMonth() + 1);
		var year = date.getFullYear();
		var hours = prettyPrintDateNr(date.getHours());
		var minutes = prettyPrintDateNr(date.getMinutes());
		var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		var dateString = `${day}.${month}.${year} ${hours}:${minutes} (${timezone})`;
		input += `\n## [${e.version}](${e.url}) - ${dateString}`;
		
		if(e.title) {
			input += "\n\n### " + e.title;
		}
		
		if(e.added.length > 0) {
			input += "\n\n### Added";
			e.added.forEach(e => input += "\n- " + e);
			input += "\n";
		}

		if(e.changed.length > 0) {
			input += "\n### Changed";
			e.changed.forEach(e => input += "\n- " + e);
			input += "\n";
		}

		if(e.removed.length > 0) {
			input += "\n### Removed";
			e.removed.forEach(e => input += "\n- " + e);
		}
		
	});
	
	out.value = input;
}

function parseJSON(force) {
	var json = document.getElementById("codeEditor").value;
	//Only parse when different
	if(rawJSON == json && !force)
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
			try {
				o.added.forEach(e => r.insertAdded(e));
			} catch(err) { }
			
			try {
				o.changed.forEach(e => r.insertChanged(e));
			} catch(err) { }
			
			try {
				o.removed.forEach(e => r.insertRemoved(e));
			} catch(err) { }
			
			releases.push(r);
		}
		createMarkdown();
		printLog("Parsing complete!");
	} catch(err) {
		printLog(err);
	}
}

var logCache = "";
function printLog(x) {
	if(x == undefined) return;
	var date = new Date(Date.now());
	var hours = prettyPrintDateNr(date.getHours());
	var minutes = prettyPrintDateNr(date.getMinutes());
	var seconds = prettyPrintDateNr(date.getSeconds());
	var time = `${hours}:${minutes}:${seconds}`;
	logCache += "<label>" + time + ": " + x + "</label>";
	document.getElementById("log").innerHTML = logCache;
}

function clearLog() {
	logCache = "";
	document.getElementById("log").innerHTML = logCache;
}

function copyMarkdown() {
	var markdown = document.getElementById("markdownTextField");
	navigator.clipboard.writeText(markdown.value).then(function() {
		printLog("Copied markdown to clipboard!");
	}, function(err) {
		printLog(err);
	});
}

function selectMarkdown() {
	var markdown = document.getElementById("markdownTextField");
	markdown.focus();
	markdown.select();
	printLog("Selected markdown");
}

window.onload = function() {
	loadEditor();
	var textfield = document.getElementById("codeEditor");
	var textfieldListener = function() {
		parseJSON(false);
	};
	textfield.onkeyup = textfieldListener;
	textfield.onblur = textfieldListener;
}