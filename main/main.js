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
    for(let i = 0; i < (arr.length - 1); i++){  
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
    let fullMatches = [];
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

  getData(arr, location){ // Gets stats fpr each player in array as drawn from the inputted location
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
  }
}
// Create new instance of StatMap
let PlayerMap = new StatMap(); 

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

grabNames(formattedStatsObjectJSON); 

//Hash all first and last names
PlayerMap.setHashAll(firstNames);
PlayerMap.setHashAll(lastNames);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    chrome.storage.sync.get("options", function(options) {
        let run = checkOptions(sender, options);
        if(run){
          console.log({response: (PlayerMap.playerSearch(request[0], formattedStatsObjectJSON))});
          sendResponse({response: (PlayerMap.playerSearch(request[0], formattedStatsObjectJSON)), options});
    };
  })
    updateDataCheck(request[1]);
    return true  //Lets content script know that the response will by asynchronous
    
  }); 

//check options object for whether to run and what parameters to use
function checkOptions(sender, userOptions) {
  console.log(userOptions.options.extensionOn)
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


