'use strict' //I anticipate this file will do more, such as control the flow of the back-end - if not it becomes redundent and should be removed. RIght now it just takes the formatted stats and exports them in the same format they came in as. 

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



