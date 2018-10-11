chrome.runtime.onInstalled.addListener(function(details) {
	if(details.reason === "install"){
		setDateAndStore();
		makeXHRRequest();
	};
});

//checks to see if it is time to update stats (daily).
function updateDataCheck (date){ 
  const currentDate = new Date(JSON.parse(date));
  chrome.storage.local.get("quickStatsDate", function(items) {
    const storedDate = new Date(items.quickStatsDate);
    if(currentDate.getDate() === storedDate.getDate()) {
      if(currentDate.getMonth() === storedDate.getMonth()) {
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
	xhr.open("GET", "http://localhost:3000/", true);
	xhr.onreadystatechange = function() {
	xhr.onload = function() {
	    formattedStatsObjectJSON = JSON.parse(xhr.response);
	    handleDataUpdate(formattedStatsObjectJSON);
	    console.log("stats updated");
	    // setDateAndStore(); TURNED OFF ONLY FOR TESTING PURPOSES
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
