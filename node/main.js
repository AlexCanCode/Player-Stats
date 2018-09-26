'use strict' //I anticipate this file will do more, such as control the flow of the back-end - if not it becomes redundent and should be removed. RIght now it just takes the formatted stats and exports them in the same format they came in as. 

const fs = require('fs');
const finalFormattedStats = require('./format.js'); //need to import the written JSON file from the formatter.

const finalStatObjectJSON = JSON.stringify(finalFormattedStats);

console.log(finalFormattedStats);

fs.writeFile("finalStatObject.js", `let finalStatObject = ${finalStatObjectJSON}`, function(err, data) {
	if(err) {
		console.log(err);
	};
}); //Send to client-side with daily update request 


