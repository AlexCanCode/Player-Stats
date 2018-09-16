// Object to hash and store player names and corresponding stats[key] value 
class StatMap {
    constructor() {
    this.list = [];
  }

  hash(str) {
    let hash = 0;
    if (str.length == 0){
        return hash;
    }
    for (let i = 0; i < str.length; i++) { // consider declaring i as a variable accessible to the whole object, may be better practice, research
        let char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return hash;
  }

  get(x) { 
    let j = this.hash(x.toLowerCase());
    let result = this.list[j];
    
    if(!result){
        return -1;  
    }
    else { //puts all outputs into an array for simpler processing in playerSearch, doubles performance time on a MDN page from .29 ms to .50ms, 
          //a seemingly negligable difference to my beginner eyes. removes need to check typeof in playerSearch 
        return result.reduce(function(all, item, index){
            all.push(item[1]);
            return all;
        }, [])
    }   //No need to deal with duplicates here as this is expected due to common names 
  }

  set(x, y) {
    let i = this.hash(x);

    if(!this.list[i]) {
        this.list[i] = [];
    }

    this.list[i].push([x, y]);
  }

  setHashAll(arr){  
    for(let i = 0; i < arr.length; i++){  //is arr.legnth fine? Or does it need to be length-1? Try with small sample array see if you are adding garbage values 
        let x = this.hash(arr[i].toLowerCase())

        if(!this.list[x]){
            this.list[x] = [];
        }

        this.list[x].push([x, i]); 
    }
  }

  playerSearch(arr){    
    let fullMatches = [];
    let searchedHash;
    let secondHash;

     for(let i = 0; i < (arr.length - 1); i++){
        searchedHash = PlayerMap.get(arr[i]);
        secondHash = PlayerMap.get(arr[(i + 1)]); 

        if(searchedHash != -1 && secondHash != -1){
             fullMatches.push(searchedHash.filter(element => secondHash.includes(element)));
        }
    }
    return PlayerMap.getData(fullMatches.filter(element => element.length >= 1)); 
  }

  getData(arr){ // Get data from (clean)stats. Need to determine format. this function will need to be rewritten to access local storage later on in development 
       let statArr = [];

       arr.forEach(element => statArr.push(stats[element]));
       return statArr;
  }
}

// Create new instance of hash table
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

grabNames(cleanStats); //clean stats is now an externally linked file 


//Hash all first and last names
PlayerMap.setHashAll(firstNames);
PlayerMap.setHashAll(lastNames);

 //Enables console on basketball reference (previously disabled) 
/*
 javascript: (function() { //restores console.log to basketball reference 
    var i = document.createElement('iframe');
    i.style.display='none';
    document.body.appendChild(i);
    window.console=i.contentWindow.console;
}())  */

//pushes all non-blank elements to an array and returns that array

 function cleanArray(arr){
    let arrayOne = [];
    for(var i = 0; i < arr.length; i++){
        if(arr[i]) {
            arrayOne.push(arr[i]);
        }
    }
    return arrayOne;
}

/* serialize the body text of a webpage and remove special characters*/

let pageText; 

function getPageText(){
    pageText = cleanArray(document.body.innerText.replace(/[^A-Za-z0-9_-]/g, ' ').toLowerCase().split(" "))
};

getPageText(); 


/* Deals with diplicate players, creates new stat array with no duplicates, store all duplicates in dupStatArr in case needed for later versions -- Move to data formatting file upon file organization */

let duplicate = false;
let compare;
let spliceArr = [];
let dupStatsArr = [];

stats.map(function(item, index) {
     if(item.Tm === "TOT"){
      duplicate = true;
      compare = item.Player;
        }
    else if(duplicate) {
        if(item.Player === compare){
         spliceArr.push(index); 
        }
        else {
         duplicate = false;
         compare = ""; 
        }
    }
});

const cleanStats = stats.filter(function(item, index) {
    if(spliceArr.indexOf(index) == -1){
     return true; 
    }
    else {
      dupStatsArr.push(item);
      return false
    }
});




/*
Stats order of operation:

1. playerData --> formatted as JSON but nothing removed 

2. stats = --> removed all unwanted fields but retains duplicates

3. cleanStats --> no duplicates, ready to be hashed and searched (requires team names to be added back in for "tot" players)


                           */

const playersFound = PlayerMap.playerSearch(pageText);

function extractNames(arr){
    let newArr = [];
    for(i = 0; i < (arr.length); i++){
        if(!newArr.includes(arr[i].Player.toLowerCase())) {
            newArr.push(arr[i].Player.toLowerCase());
            }   
        }
    return newArr;
}


playersFoundNames = extractNames(playersFound);

// Search and Wrap with Element Tag Logic 

//recursive function that iterates through all nodes
function walkTheDOM(node, func) {
    func(node);
    node = node.firstChild;
    while(node) {
        walkTheDOM(node, func);
        node= node.nextSibling;
    }
}

//Array of all nodes that contain players names
const nodeArray = []

//Walk the DOM and return all nodes with text that matches a name in players
walkTheDOM(document.body, function(node) {
    if(node.children){
        if(node.children.length === 0){
            if(new RegExp(playersFoundNames.join("|"), "i").test(node.textContent)) {
                    nodeArray.push(node);
            }
        }
    }
});


//Loop through text nodes with players names and wrap with span
function replaceText(arr1, arr2) { 
    for(i = 0; i < (arr1.length - 1); i++){
        for(j = 0; j < (arr2.length - 1); j++){
            const regex = new RegExp(arr2[j], 'ig');
            arr1[i].innerHTML = arr1[i].innerHTML.replace(regex, "<span>$&</span>"); 

            //replace span with the tag name you end up using
        }
    }
}

replaceText(nodeArray, playersFoundNames);

