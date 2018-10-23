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
function updateDataCheck (date, savedDate){ 
  const currentDate = new Date(JSON.parse(date));
  const storedDate = new Date(JSON.parse(savedDate));
/*  chrome.storage.local.get("quickStatsDate", function(items) {
    const storedDate = new Date(items.quickStatsDate);*/
    if(currentDate.getDate() === storedDate.getDate()) {
      if(currentDate.getMonth() === storedDate.getMonth()) {
      	console.log("no update needed");
      	return;
      }
    }
    else {
    	makeXHRRequest();
    }; 
/*  });*/
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
		    	setDateAndStore(); //TODO: Prevent the date updating until the stats have been verified
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
