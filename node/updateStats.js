const fs = require('fs');
const {PythonShell} = require('python-shell');
const scriptPath = "../scraper/webScraper.py";
const pyshell = new PythonShell(scriptPath);

pyshell.on('message', function(message) {
	console.log(message);
});

pyshell.end(function (err) {
	if(err){
		throw err;
	}
	const finalFormattedStats = require('./format.js'); //need to import the written JSON file from the formatter.
	const finalStatObjectJSON = JSON.stringify(finalFormattedStats);

	console.log("finished");
})
