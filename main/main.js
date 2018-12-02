// Object to hash and store player names with their stats key in [key]value: hash->index
class StatMap {
    constructor() {
    this.list = [];
  }

  get(x) { 
    let j = x.toLowerCase();
    let result = this.list[j];
    if(typeof j === "function" || typeof result === "function"){ //checks if string is also the name of a function, which results in an error when you run .reduce 
        return;
      }

    else if(!result){
        return -1;  
    }
    else {
        return result.reduce(function(all, item, index){
            all.push(item[1]);
            return all;
        }, []);
    };
  };

  set(x, y) {
    if(!this.list[x]) {
        this.list[x] = [];
    }

    this.list[x].push([x, y]);
  }

  setHashAll(arr){  
    for(let i = 0; i < (arr.length); i++){  
        let x = arr[i].toLowerCase();

        if(!this.list[x]){
            this.list[x] = [];
        }

        this.list[x].push([x, i]); 
    }
  }

  searchErrorHandler(str1, str2) { //look into implementing cleaner version of this
    if(!str1) {
      return false
    }
    else if (str1 === -1) {
      return false
    } 
    else if(!str2) {
      return false
    }
    else if (str2 === -1) {
      return false
    }
    else {
      return true;
    }
  };

  playerSearch(arr, location){ //added location so script can run getData(arr, location) in a file that does not contain the stats file.
    let fullMatches = []; // potential improvement: Skip all already matched names.
    let searchedHash;
    let secondHash;

     for(let i = 0; i < (arr.length - 1); i++){
        searchedHash = this.get(arr[i]);
        secondHash = this.get(arr[(i + 1)]); 
        if(this.searchErrorHandler(searchedHash, secondHash)) {
            fullMatches.push(searchedHash.filter(element => secondHash.includes(element)));
        }
    }
    return this.getData(fullMatches.filter(element => element.length >= 1), location); 
  }

  getData(arr, location){ // Gets stats for each player in array as drawn from the inputted location
         let statArr = [];
         arr.forEach(element => {
          if(!statArr.includes(location[element])) {
          statArr.push(location[element])
       }
     });
         return statArr;
    }

  clearHash(){
    this.list = [];
    console.log("hash was cleared")
  }
}
// Create new instance of StatMap
let PlayerMap = new StatMap(); 

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    chrome.storage.local.get(null, function(quickStats) {
        updateDataCheck(request[1], quickStats.quickStatsDate); //check if app should update stats
        let run = checkOptions(sender, quickStats);
        const options = quickStats.options; //for some reason this needs to be defined before being passed to the response or else it doesn't work
        if(run){
          if(Object.keys(PlayerMap.list).length === 0) {
             console.log("playermap is empty for some reason")
             handleDataUpdate(quickStats.formattedStatsObjectJSON);
          }
         console.log(request);
         console.log({response: (PlayerMap.playerSearch(request[0], quickStats.formattedStatsObjectJSON))});
         sendResponse({response: (checkForBadValues(PlayerMap.playerSearch(request[0], quickStats.formattedStatsObjectJSON))), options});         
    };
  })
    return true  //Lets content script know that the response will by asynchronous
  }); 

//check options object for whether to run and what parameters to use
function checkOptions(sender, userOptions) {
  let shouldExtRun = userOptions.options.extensionOn;
  if(shouldExtRun) {
    shouldExtRun = checkIsBlacklisted(sender, userOptions)
      if(shouldExtRun && userOptions.options.nbaOnlyURLs) {
        shouldExtRun = checkNBAURLs(userOptions.options.nbaOnlyURLs, sender);
      };
  }
  return shouldExtRun;
};

function checkNBAURLs(bool, sender) {
  if(bool) {
    return (sender.url.toLowerCase().includes("nba"))
  }
  else {
    return true; //indicating it should run regardless.
  };
};

function checkIsBlacklisted(sender, userOptions) {
  return userOptions.options.blacklist.reduce(function(all, item, index) {
      if(sender.url.toLowerCase().includes(item)) { 
        all = false;
      }  
      return all;
  }, true);
};

//Remove false values from return array - mostly for edge cases (e.g. Paul George. George)
function checkForBadValues(arr) {
    return arr.filter(item => item)
};


