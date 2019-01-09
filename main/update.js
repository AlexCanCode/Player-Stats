chrome.runtime.onInstalled.addListener(function(details) { //https://stackoverflow.com/questions/2399389/detect-chrome-extension-first-run-update
	if(details.reason === "install"){
		makeInitalXHRRequest(); 

		//Populate initial options here 
		chrome.storage.local.set({
		"options": {
			extensionOn: true,
			nbaOnlyURLs: false,
			highlighting: true,
			colorChoice: "green", 
			blacklist: ["basketball-reference.com", "nbarotations.info"]
			}
		}, function(data) {
			console.log("options stored")
		})
	}
	else if(details.reason === "update") { 
		makeXHRRequest();
	}
});

//checks to see if it is time to update stats (daily).
function updateDataCheck (date, savedDate){ 
  const currentDate = new Date(JSON.parse(date));
  const storedDate = new Date(JSON.parse(savedDate));
    if(currentDate.getDate() === storedDate.getDate()) {
      if(currentDate.getMonth() === storedDate.getMonth()) {
      	console.log("no update needed");
      	return;
      }
    }
    else {
    	makeXHRRequest();
    }; 
};

// Grab all first and last names from stats and put them, respectively, into first and last name arrays 
let firstNames = [];
let lastNames = [];

function grabNames(arr){
    arr.map((item, index) => {
        let tempArr = item.Player.split(" ");
        firstNames.push(tempArr[0]);
        lastNames.push(tempArr[1]);
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
   console.log(arr);
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
	console.log("new date stored");
	let stampedDate = +new Date();
	chrome.storage.local.set({quickStatsDate: stampedDate});
};

//For purposes of installing (and catching errors with initial date install)--> this is the same code as above request except it sets date for yesterday in order to ensure request retry in the event of an error.
function makeInitalXHRRequest() {
	let stampedDate = +new Date(new Date().setDate(new Date().getDate()-1));
	chrome.storage.local.set({quickStatsDate: stampedDate});
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "https://quickstatsback.herokuapp.com/", true);
	xhr.onreadystatechange = function() {
		xhr.onload = function() {
			const returnedStats = JSON.parse(xhr.response)
		    chrome.storage.local.set({"formattedStatsObjectJSON": returnedStats}, function(data) {
		    	handleDataUpdate(returnedStats);
		   	 	console.log("Initial stats downloaded");
		    })
		  };
		xhr.onerror = function() {
			console.log("an error occured");
		}
	};
	xhr.send();
}