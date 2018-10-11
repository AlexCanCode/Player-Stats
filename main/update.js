let stampedDate = new Date();

console.log(stampedDate.getDate());


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


