chrome.runtime.onInstalled.addListener(function(details) { //https://stackoverflow.com/questions/2399389/detect-chrome-extension-first-run-update
	if(details.reason === "install"){
		makeXHRRequest();

		//Populate initial options here 
		chrome.storage.local.set({
		"options": {
			extensionOn: true,
			nbaOnlyURLs: false,
			highlighting: true,
			colorChoice: "green", 
			blacklist: ["basketball-reference"]
			}
		}, function(data) {
			console.log("options stored")
		})
	}

	else if(details.reason === "update") { //WHAT ELSE NEEDS TO HAPPEN WHEN WE UPDATE?
		makeXHRRequest();
	}

});

//checks to see if it is time to update stats (daily).
function updateDataCheck (date){ 
  const currentDate = new Date(JSON.parse(date));
  chrome.storage.local.get("quickStatsDate", function(items) {
    const storedDate = new Date(items.quickStatsDate);
    if(currentDate.getDate() === storedDate.getDate()) {
      if(currentDate.getMonth() === storedDate.getMonth()) {
      	return;
      }
    }
    else {
    	makeXHRRequest();
    }; 
  });
};

//Clears current data and reloads new data into the hash table.
function handleDataUpdate(arr){ 
   PlayerMap.clearHash();
   firstNames = [];
   lastNames = [];
   grabNames(arr);
   PlayerMap.setHashAll(firstNames);
   PlayerMap.setHashAll(lastNames);
};

//Requests JSON Stat Object from Local Server for updating json object
function makeXHRRequest() {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "https://quickstatsback.herokuapp.com/", true);
	xhr.onreadystatechange = function() {
		xhr.onload = function() {
			const returnedStats = JSON.parse(xhr.response)
		    chrome.storage.local.set({"formattedStatsObjectJSON": returnedStats}, function(data) {
		    	handleDataUpdate(returnedStats);
		   	 	console.log("stats updated");
		    	setDateAndStore(); 
		    })
		    
		  };
		xhr.onerror = function() {
			console.log("an error occured");
		}
	};
	xhr.send();
}

function setDateAndStore() {
	let stampedDate = +new Date();
	chrome.storage.local.set({quickStatsDate: stampedDate});
};
