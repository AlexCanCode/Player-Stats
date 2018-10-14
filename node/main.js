'use strict' //I anticipate this file will do more, such as control the flow of the back-end - if not it becomes redundent and should be removed. RIght now it just takes the formatted stats and exports them in the same format they came in as. 
const cron = require('cron');
const http = require('http');
const stats = require('./formattedStatsObject.js');
const port = process.env.PORT || 8080;

http.createServer(function(req, res) {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.write(JSON.stringify(stats));
	res.end()
}).listen(3000, function() {
	console.log("server started");
});





