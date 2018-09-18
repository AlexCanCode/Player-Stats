'use strict' //I anticipate this file will do more, such as control the flow of the back-end - if not it becomes redundent and should be removed. 

const fs = require('fs');
const finalFormattedStats = require('./format.js'); // this will eventually import a non-clean stats file and index.js will import the formatter to apply changes. 

const finalStatObjectJSON = JSON.stringify(finalFormattedStats);

fs.writeFile("finalStatObject.js", `let finalStatObject = ${finalStatObjectJSON}`, function(err, data) {
	if(err) {
		console.log(err);
	};
}); //Send to client-side with daily update request. 


