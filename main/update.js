
let stampedDate = new Date();

console.log(stampedDate.getDate());

chrome.runtime.onInstalled.addListener(function(details) {
	if(details.reason === "install"){
		let stampedDate = +new Date();
		chrome.storage.local.set({quickStatsDate: stampedDate});
	};
});

//LEFT OFF: HOW TO TRIGGER CHECKING OF DATE? Message passing is messy because there is another backgroun script listening for messages. Search for another trigger that could be used (like on chrome startup, if that exists and then pair that with an internval that checks for 24 hours?) or consolodate all the listening into one backgroun script and then have that background script call these functions. 


chrome.storage.local.get("quickStatsDate", function(items) { //NEed to set this function to check if full day as elapsed and if its past a certain time (perhaps 6:00 am local?) and then trigger the update.
	console.log(items);
});


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
<<<<<<< HEAD

/* Next Steps

1. DONE - Have the main funciton rehash the data when it receives it to account for new names (maybe put all logic in one function and rerun when receieving the data back)
2. Determine how to measure a day's passing and make the update at that point
=======
>>>>>>> f4ac1aabd2f16cf930caca5d99d900376aa66338
*/

function handleDataUpdate(){
  PlayerMap.clearHash();
  firstNames = [];
  lastNames = [];
  grabNames(formattedStatsObjectJSON);
  PlayerMap.setHashAll(firstNames);
  PlayerMap.setHashAll(lastNames);
};


