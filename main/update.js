chrome.runtime.onInstalled.addListener(function(details) {
	if(details.reason === "install"){
		let stampedDate = +new Date();
		chrome.storage.local.set({quickStatsDate: stampedDate});
	};
});

// LEFT OFF: Need to test if this update check works (try it with time changes, or set a manually different date)

//checks to see if it is time to update stats (daily).
function updateDataCheck (date){ 
  const currentDate = new Date(JSON.parse(date));
  chrome.storage.local.get("quickStatsDate", function(items) { //NEed to set this function to check if full day as elapsed and if its past a certain time (perhaps 6:00 am local?) and then trigger the update.
    const storedDate = new Date(items.quickStatsDate);
    console.log(currentDate, storedDate);
    if(currentDate.getDate() === storedDate.getDate()){
      if(currentDate.getMonth() === storedDate.getMonth()) {
      console.log("no update needed")
      }
    };
    else {
      handleDataUpdate();
    }
  
  });
};




/*//Requests JSON Stat Object from Local Server for updating json object
// let updateToday = {day: 9, updated: true};

let xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:3000/", true);
xhr.onreadystatechange = function() {
  if(xhr.readyState == 4) {
    formattedStatsObjectJSON = JSON.parse(xhr.response);
  };
};

xhr.send();

/* Next Steps

1. DONE - Have the main funciton rehash the data when it receives it to account for new names (maybe put all logic in one function and rerun when receieving the data back)
2. Determine how to measure a day's passing and make the update at that point
*/

function handleDataUpdate(){
  PlayerMap.clearHash();
  firstNames = [];
  lastNames = [];
  grabNames(formattedStatsObjectJSON);
  PlayerMap.setHashAll(firstNames);
  PlayerMap.setHashAll(lastNames);
};


