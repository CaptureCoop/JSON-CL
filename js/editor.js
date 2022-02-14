//Credit and thanks to:
//https://medium.com/weekly-webtips/enable-line-numbering-to-any-html-textarea-35e15ea320e2


var codeEditor;
var lineCounter;

window.onload = function() {
	codeEditor = document.getElementById('codeEditor');
	lineCounter = document.getElementById('lineCounter');
	
	codeEditor.addEventListener('scroll', () => {
		lineCounter.scrollTop = codeEditor.scrollTop;
		lineCounter.scrollLeft = codeEditor.scrollLeft;
	});

	codeEditor.addEventListener('keydown', (e) => {
		let {keyCode} = e;
		let {value, selectionStart, selectionEnd} = codeEditor;
		if (keyCode === 9) {  // TAB = 9
			e.preventDefault();
			codeEditor.value = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);
			codeEditor.setSelectionRange(selectionStart+2, selectionStart+2)
		}
	});
	
	codeEditor.addEventListener('input', () => {
	line_counter();
});
}

var lineCountCache = 0;
function line_counter() {
	var lineCount = codeEditor.value.split('\n').length;
	var outarr = new Array();
	if (lineCountCache != lineCount) {
		for (var x = 0; x < lineCount; x++) {
			outarr[x] = (x + 1) + '.';
		}
		lineCounter.value = outarr.join('\n');
	}
	lineCountCache = lineCount;
}