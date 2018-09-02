 const t1 = performance.now();
 /* Hash Function */

 function hashCode(str) {
    let hash = 0;
    if (str.length == 0){
        return hash;
    }
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash;
    }
    return hash;
}

/* Object to hash and store player names and corresponding stats[key] value */



class statMap {
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

    

    else{ //puts all outputs into an array for simpler processing in playerSearch, doubles performance time on a MDN page from .29 ms to .50ms, 
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
        searchedHash = playerMap.get(arr[i]);
        secondHash = playerMap.get(arr[(i + 1)]); 

        if(searchedHash != -1 && secondHash != -1){
             fullMatches.push(searchedHash.filter(element => secondHash.includes(element)));
        }
    }
    return playerMap.getData(fullMatches.filter(element => element.length >= 1)); 
  }

  getData(arr){ // Get data from cleanStats. Need to determine fomrat. this function will need to be rewritten to access local storage later on in development 
       let statArr = [];

       arr.forEach(element => statArr.push(cleanStats[element]));
       return statArr;

  }
  
}



let playerMap = new statMap(); 

/* Grab all first and last names from stats and put them, respectively, into first and last name arrays */

let firstNames = [];
let lastNames = [];

function grabNames(arr){
    arr.map((item, index) => {
        let tempArr = item.Player.split(" ");
        firstNames.push(tempArr[0]);
        lastNames.push(tempArr[1]);
    });
};


/* Enables console on basketball reference (previously disabled) 

 javascript: (function() { //restores console.log to basketball reference 
    var i = document.createElement('iframe');
    i.style.display='none';
    document.body.appendChild(i);
    window.console=i.contentWindow.console;
}());d

*/

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


/* Deals with diplicate players, creates new stat array with no duplicates, store all duplicates in dupStatArr in case needed for later versions */

/* COMMENTED OUT TO TEST CODE ON WEBPAGES

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

*/

 


// Search page for matched players and return the node they are located in



//create tree walker and search if inputted string exists, return all nodes with no children where it exists
// PROBLEM: Takes wayyyy too long, scans dom for each name, untenable. Took over 4 minutes on backetball reference page. 
//solution needs to iterate through the dom only once
function textNodesUnder(el, str){
    let n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT, 
        {acceptNode: function(node){ 
            if((node.innerHTML.toLowerCase().indexOf(str) >= 0))
                if(node.children.length > 0){
                    return NodeFilter.FILTER_SKIP;
                }
                else {
                return NodeFilter.FILTER_ACCEPT;
            }
            } 
        }
        , false);
    while(n=walk.nextNode()) a.push(n);
    return a;
}

const body = document.querySelector("body");

const foundNodes = []; 

function runWalker(arr){
    for(i = 0; i < (arr.length - 1); i++){
        foundNodes.push(textNodesUnder(body, arr[i]));
    }
};


/*
Stats order of operation:

1. playerData --> formatted as JSON but nothing removed 

2. stats = --> removed all unwanted fields but retains duplicates

3. cleanStats --> no duplicates, ready to be hashed and searched (requires team names to be added back in for "tot" players)


                           */


let cleanStats = [
  {
    "Player": "Alex Abrines",
    "Pos": "SG",
    "Age": 24,
    "Tm": "OKC",
    "G": 75,
    "MP": 15.1,
    "FG%": ".395",
    "TRB": 1.5,
    "AST": 0.4,
    "PS/G": 4.7
  },
  {
    "Player": "Quincy Acy",
    "Pos": "PF",
    "Age": 27,
    "Tm": "BRK",
    "G": 70,
    "MP": 19.4,
    "FG%": ".356",
    "TRB": 3.7,
    "AST": 0.8,
    "PS/G": 5.9
  },
  {
    "Player": "Steven Adams",
    "Pos": "C",
    "Age": 24,
    "Tm": "OKC",
    "G": 76,
    "MP": 32.7,
    "FG%": ".629",
    "TRB": 9,
    "AST": 1.2,
    "PS/G": 13.9
  },
  {
    "Player": "Bam Adebayo",
    "Pos": "C",
    "Age": 20,
    "Tm": "MIA",
    "G": 69,
    "MP": 19.8,
    "FG%": ".512",
    "TRB": 5.5,
    "AST": 1.5,
    "PS/G": 6.9
  },
  {
    "Player": "Arron Afflalo",
    "Pos": "SG",
    "Age": 32,
    "Tm": "ORL",
    "G": 53,
    "MP": 12.9,
    "FG%": ".401",
    "TRB": 1.2,
    "AST": 0.6,
    "PS/G": 3.4
  },
  {
    "Player": "Cole Aldrich",
    "Pos": "C",
    "Age": 29,
    "Tm": "MIN",
    "G": 21,
    "MP": 2.3,
    "FG%": ".333",
    "TRB": 0.7,
    "AST": 0.1,
    "PS/G": 0.6
  },
  {
    "Player": "LaMarcus Aldridge",
    "Pos": "C",
    "Age": 32,
    "Tm": "SAS",
    "G": 75,
    "MP": 33.5,
    "FG%": ".510",
    "TRB": 8.5,
    "AST": 2,
    "PS/G": 23.1
  },
  {
    "Player": "Jarrett Allen",
    "Pos": "C",
    "Age": 19,
    "Tm": "BRK",
    "G": 72,
    "MP": 20,
    "FG%": ".589",
    "TRB": 5.4,
    "AST": 0.7,
    "PS/G": 8.2
  },
  {
    "Player": "Kadeem Allen",
    "Pos": "PG",
    "Age": 25,
    "Tm": "BOS",
    "G": 18,
    "MP": 5.9,
    "FG%": ".273",
    "TRB": 0.6,
    "AST": 0.7,
    "PS/G": 1.1
  },
  {
    "Player": "Tony Allen",
    "Pos": "SF",
    "Age": 36,
    "Tm": "NOP",
    "G": 22,
    "MP": 12.4,
    "FG%": ".484",
    "TRB": 2.1,
    "AST": 0.4,
    "PS/G": 4.7
  },
  {
    "Player": "Al-Farouq Aminu",
    "Pos": "PF",
    "Age": 27,
    "Tm": "POR",
    "G": 69,
    "MP": 30,
    "FG%": ".395",
    "TRB": 7.6,
    "AST": 1.2,
    "PS/G": 9.3
  },
  {
    "Player": "Justin Anderson",
    "Pos": "SF",
    "Age": 24,
    "Tm": "PHI",
    "G": 38,
    "MP": 13.7,
    "FG%": ".431",
    "TRB": 2.4,
    "AST": 0.7,
    "PS/G": 6.2
  },
  {
    "Player": "Kyle Anderson",
    "Pos": "SF",
    "Age": 24,
    "Tm": "SAS",
    "G": 74,
    "MP": 26.7,
    "FG%": ".527",
    "TRB": 5.4,
    "AST": 2.7,
    "PS/G": 7.9
  },
  {
    "Player": "Ryan Anderson",
    "Pos": "PF",
    "Age": 29,
    "Tm": "HOU",
    "G": 66,
    "MP": 26.1,
    "FG%": ".431",
    "TRB": 5,
    "AST": 0.9,
    "PS/G": 9.3
  },
  {
    "Player": "Ike Anigbogu",
    "Pos": "C",
    "Age": 19,
    "Tm": "IND",
    "G": 11,
    "MP": 2.7,
    "FG%": ".444",
    "TRB": 0.8,
    "AST": 0,
    "PS/G": 1.2
  },
  {
    "Player": "Giannis Antetokounmpo",
    "Pos": "PF",
    "Age": 23,
    "Tm": "MIL",
    "G": 75,
    "MP": 36.7,
    "FG%": ".529",
    "TRB": 10,
    "AST": 4.8,
    "PS/G": 26.9
  },
  {
    "Player": "Carmelo Anthony",
    "Pos": "PF",
    "Age": 33,
    "Tm": "OKC",
    "G": 78,
    "MP": 32.1,
    "FG%": ".404",
    "TRB": 5.8,
    "AST": 1.3,
    "PS/G": 16.2
  },
  {
    "Player": "OG Anunoby",
    "Pos": "SF",
    "Age": 20,
    "Tm": "TOR",
    "G": 74,
    "MP": 20,
    "FG%": ".471",
    "TRB": 2.5,
    "AST": 0.7,
    "PS/G": 5.9
  },
  {
    "Player": "Ryan Arcidiacono",
    "Pos": "PG",
    "Age": 23,
    "Tm": "CHI",
    "G": 24,
    "MP": 12.7,
    "FG%": ".415",
    "TRB": 1,
    "AST": 1.5,
    "PS/G": 2
  },
  {
    "Player": "Trevor Ariza",
    "Pos": "SF",
    "Age": 32,
    "Tm": "HOU",
    "G": 67,
    "MP": 33.9,
    "FG%": ".412",
    "TRB": 4.4,
    "AST": 1.6,
    "PS/G": 11.7
  },
  {
    "Player": "Darrell Arthur",
    "Pos": "PF",
    "Age": 29,
    "Tm": "DEN",
    "G": 19,
    "MP": 7.4,
    "FG%": ".468",
    "TRB": 0.8,
    "AST": 0.5,
    "PS/G": 2.8
  },
  {
    "Player": "Jamel Artis",
    "Pos": "SG",
    "Age": 25,
    "Tm": "ORL",
    "G": 15,
    "MP": 18.6,
    "FG%": ".392",
    "TRB": 2.5,
    "AST": 1.2,
    "PS/G": 5.1
  },
  {
    "Player": "Omer Asik",
    "Pos": "C",
    "Age": 31,
    "Tm": "TOT",
    "G": 18,
    "MP": 10.1,
    "FG%": ".409",
    "TRB": 2.6,
    "AST": 0.2,
    "PS/G": 1.2
  },
  {
    "Player": "D.J. Augustin",
    "Pos": "PG",
    "Age": 30,
    "Tm": "ORL",
    "G": 75,
    "MP": 23.5,
    "FG%": ".452",
    "TRB": 2.1,
    "AST": 3.8,
    "PS/G": 10.2
  },
  {
    "Player": "Luke Babbitt",
    "Pos": "SF",
    "Age": 28,
    "Tm": "TOT",
    "G": 50,
    "MP": 14.3,
    "FG%": ".423",
    "TRB": 1.9,
    "AST": 0.6,
    "PS/G": 5.2
  },
  {
    "Player": "Dwayne Bacon",
    "Pos": "SG",
    "Age": 22,
    "Tm": "CHO",
    "G": 53,
    "MP": 13.5,
    "FG%": ".375",
    "TRB": 2.3,
    "AST": 0.7,
    "PS/G": 3.3
  },
  {
    "Player": "Ron Baker",
    "Pos": "SG",
    "Age": 24,
    "Tm": "NYK",
    "G": 29,
    "MP": 13.3,
    "FG%": ".339",
    "TRB": 1,
    "AST": 1.6,
    "PS/G": 2.4
  },
  {
    "Player": "Wade Baldwin",
    "Pos": "PG",
    "Age": 21,
    "Tm": "POR",
    "G": 7,
    "MP": 11.4,
    "FG%": ".667",
    "TRB": 1.1,
    "AST": 0.7,
    "PS/G": 5.4
  },
  {
    "Player": "Lonzo Ball",
    "Pos": "PG",
    "Age": 20,
    "Tm": "LAL",
    "G": 52,
    "MP": 34.2,
    "FG%": ".360",
    "TRB": 6.9,
    "AST": 7.2,
    "PS/G": 10.2
  },
  {
    "Player": "J.J. Barea",
    "Pos": "PG",
    "Age": 33,
    "Tm": "DAL",
    "G": 69,
    "MP": 23.2,
    "FG%": ".439",
    "TRB": 2.9,
    "AST": 6.3,
    "PS/G": 11.6
  },
  {
    "Player": "Harrison Barnes",
    "Pos": "PF",
    "Age": 25,
    "Tm": "DAL",
    "G": 77,
    "MP": 34.2,
    "FG%": ".445",
    "TRB": 6.1,
    "AST": 2,
    "PS/G": 18.9
  },
  {
    "Player": "Will Barton",
    "Pos": "SG",
    "Age": 27,
    "Tm": "DEN",
    "G": 81,
    "MP": 33.1,
    "FG%": ".452",
    "TRB": 5,
    "AST": 4.1,
    "PS/G": 15.7
  },
  {
    "Player": "Nicolas Batum",
    "Pos": "SG",
    "Age": 29,
    "Tm": "CHO",
    "G": 64,
    "MP": 31,
    "FG%": ".415",
    "TRB": 4.8,
    "AST": 5.5,
    "PS/G": 11.6
  },
  {
    "Player": "Jerryd Bayless",
    "Pos": "SG",
    "Age": 29,
    "Tm": "PHI",
    "G": 39,
    "MP": 23.7,
    "FG%": ".416",
    "TRB": 2.1,
    "AST": 1.4,
    "PS/G": 7.9
  },
  {
    "Player": "Aron Baynes",
    "Pos": "C",
    "Age": 31,
    "Tm": "BOS",
    "G": 81,
    "MP": 18.3,
    "FG%": ".471",
    "TRB": 5.4,
    "AST": 1.1,
    "PS/G": 6
  },
  {
    "Player": "Kent Bazemore",
    "Pos": "SG",
    "Age": 28,
    "Tm": "ATL",
    "G": 65,
    "MP": 27.5,
    "FG%": ".420",
    "TRB": 3.8,
    "AST": 3.5,
    "PS/G": 12.9
  },
  {
    "Player": "Bradley Beal",
    "Pos": "SG",
    "Age": 24,
    "Tm": "WAS",
    "G": 82,
    "MP": 36.3,
    "FG%": ".460",
    "TRB": 4.4,
    "AST": 4.5,
    "PS/G": 22.6
  },
  {
    "Player": "Malik Beasley",
    "Pos": "SG",
    "Age": 21,
    "Tm": "DEN",
    "G": 62,
    "MP": 9.4,
    "FG%": ".410",
    "TRB": 1.1,
    "AST": 0.5,
    "PS/G": 3.2
  },
  {
    "Player": "Michael Beasley",
    "Pos": "PF",
    "Age": 29,
    "Tm": "NYK",
    "G": 74,
    "MP": 22.3,
    "FG%": ".507",
    "TRB": 5.6,
    "AST": 1.7,
    "PS/G": 13.2
  },
  {
    "Player": "Marco Belinelli",
    "Pos": "SG",
    "Age": 31,
    "Tm": "TOT",
    "G": 80,
    "MP": 24.3,
    "FG%": ".442",
    "TRB": 1.9,
    "AST": 1.9,
    "PS/G": 12.1
  },
  {
    "Player": "Jordan Bell",
    "Pos": "C",
    "Age": 23,
    "Tm": "GSW",
    "G": 57,
    "MP": 14.2,
    "FG%": ".627",
    "TRB": 3.6,
    "AST": 1.8,
    "PS/G": 4.6
  },
  {
    "Player": "DeAndre' Bembry",
    "Pos": "SF",
    "Age": 23,
    "Tm": "ATL",
    "G": 26,
    "MP": 17.5,
    "FG%": ".414",
    "TRB": 2.8,
    "AST": 1.9,
    "PS/G": 5.2
  },
  {
    "Player": "Dragan Bender",
    "Pos": "PF",
    "Age": 20,
    "Tm": "PHO",
    "G": 82,
    "MP": 25.2,
    "FG%": ".386",
    "TRB": 4.4,
    "AST": 1.6,
    "PS/G": 6.5
  },
  {
    "Player": "Davis Bertans",
    "Pos": "PF",
    "Age": 25,
    "Tm": "SAS",
    "G": 77,
    "MP": 14.1,
    "FG%": ".440",
    "TRB": 2,
    "AST": 1,
    "PS/G": 5.9
  },
  {
    "Player": "Patrick Beverley",
    "Pos": "SG",
    "Age": 29,
    "Tm": "LAC",
    "G": 11,
    "MP": 30.4,
    "FG%": ".403",
    "TRB": 4.1,
    "AST": 2.9,
    "PS/G": 12.2
  },
  {
    "Player": "Khem Birch",
    "Pos": "C",
    "Age": 25,
    "Tm": "ORL",
    "G": 42,
    "MP": 13.8,
    "FG%": ".540",
    "TRB": 4.3,
    "AST": 0.8,
    "PS/G": 4.2
  },
  {
    "Player": "Jabari Bird",
    "Pos": "SG",
    "Age": 23,
    "Tm": "BOS",
    "G": 13,
    "MP": 8.8,
    "FG%": ".577",
    "TRB": 1.5,
    "AST": 0.6,
    "PS/G": 3
  },
  {
    "Player": "Bismack Biyombo",
    "Pos": "C",
    "Age": 25,
    "Tm": "ORL",
    "G": 82,
    "MP": 18.2,
    "FG%": ".520",
    "TRB": 5.7,
    "AST": 0.8,
    "PS/G": 5.7
  },
  {
    "Player": "Nemanja Bjelica",
    "Pos": "PF",
    "Age": 29,
    "Tm": "MIN",
    "G": 67,
    "MP": 20.5,
    "FG%": ".461",
    "TRB": 4.1,
    "AST": 1.3,
    "PS/G": 6.8
  },
  {
    "Player": "Tarik Black",
    "Pos": "C",
    "Age": 26,
    "Tm": "HOU",
    "G": 51,
    "MP": 10.5,
    "FG%": ".591",
    "TRB": 3.2,
    "AST": 0.3,
    "PS/G": 3.5
  },
  {
    "Player": "Antonio Blakeney",
    "Pos": "SG",
    "Age": 21,
    "Tm": "CHI",
    "G": 19,
    "MP": 16.5,
    "FG%": ".371",
    "TRB": 1.7,
    "AST": 1.1,
    "PS/G": 7.9
  },
  {
    "Player": "Eric Bledsoe",
    "Pos": "PG",
    "Age": 28,
    "Tm": "TOT",
    "G": 74,
    "MP": 31.4,
    "FG%": ".473",
    "TRB": 3.8,
    "AST": 5,
    "PS/G": 17.7
  },
  {
    "Player": "Vander Blue",
    "Pos": "SG",
    "Age": 25,
    "Tm": "LAL",
    "G": 5,
    "MP": 9,
    "FG%": ".200",
    "TRB": 0.2,
    "AST": 0.6,
    "PS/G": 0.6
  },
  {
    "Player": "Bogdan Bogdanovic",
    "Pos": "SG",
    "Age": 25,
    "Tm": "SAC",
    "G": 78,
    "MP": 27.9,
    "FG%": ".446",
    "TRB": 2.9,
    "AST": 3.3,
    "PS/G": 11.8
  },
  {
    "Player": "Bojan Bogdanovic",
    "Pos": "SF",
    "Age": 28,
    "Tm": "IND",
    "G": 80,
    "MP": 30.8,
    "FG%": ".474",
    "TRB": 3.4,
    "AST": 1.5,
    "PS/G": 14.3
  },
  {
    "Player": "Andrew Bogut",
    "Pos": "C",
    "Age": 33,
    "Tm": "LAL",
    "G": 23,
    "MP": 9.4,
    "FG%": ".680",
    "TRB": 3.4,
    "AST": 0.7,
    "PS/G": 1.6
  },
  {
    "Player": "Joel Bolomboy",
    "Pos": "PF",
    "Age": 24,
    "Tm": "MIL",
    "G": 6,
    "MP": 6.3,
    "FG%": ".500",
    "TRB": 1.7,
    "AST": 0,
    "PS/G": 1.5
  },
  {
    "Player": "Devin Booker",
    "Pos": "SG",
    "Age": 21,
    "Tm": "PHO",
    "G": 54,
    "MP": 34.5,
    "FG%": ".432",
    "TRB": 4.5,
    "AST": 4.7,
    "PS/G": 24.9
  },
  {
    "Player": "Trevor Booker",
    "Pos": "PF",
    "Age": 30,
    "Tm": "TOT",
    "G": 68,
    "MP": 17,
    "FG%": ".516",
    "TRB": 4.7,
    "AST": 1.2,
    "PS/G": 6.3
  },
  {
    "Player": "Chris Boucher",
    "Pos": "PF",
    "Age": 25,
    "Tm": "GSW",
    "G": 1,
    "MP": 1,
    "FG%": ".000",
    "TRB": 1,
    "AST": 0,
    "PS/G": 0
  },
  {
    "Player": "Avery Bradley",
    "Pos": "SG",
    "Age": 27,
    "Tm": "TOT",
    "G": 46,
    "MP": 31.2,
    "FG%": ".414",
    "TRB": 2.5,
    "AST": 2,
    "PS/G": 14.3
  },
  {
    "Player": "Tony Bradley",
    "Pos": "C",
    "Age": 20,
    "Tm": "UTA",
    "G": 9,
    "MP": 3.2,
    "FG%": ".273",
    "TRB": 1.2,
    "AST": 0.1,
    "PS/G": 0.9
  },
  {
    "Player": "Corey Brewer",
    "Pos": "SF-SG",
    "Age": 31,
    "Tm": "TOT",
    "G": 72,
    "MP": 16.8,
    "FG%": ".449",
    "TRB": 2.1,
    "AST": 0.9,
    "PS/G": 5.3
  },
  {
    "Player": "Malcolm Brogdon",
    "Pos": "PG",
    "Age": 25,
    "Tm": "MIL",
    "G": 48,
    "MP": 29.9,
    "FG%": ".485",
    "TRB": 3.3,
    "AST": 3.2,
    "PS/G": 13
  },
  {
    "Player": "Aaron Brooks",
    "Pos": "PG",
    "Age": 33,
    "Tm": "MIN",
    "G": 32,
    "MP": 5.9,
    "FG%": ".406",
    "TRB": 0.5,
    "AST": 0.6,
    "PS/G": 2.3
  },
  {
    "Player": "Dillon Brooks",
    "Pos": "SF",
    "Age": 22,
    "Tm": "MEM",
    "G": 82,
    "MP": 28.7,
    "FG%": ".440",
    "TRB": 3.1,
    "AST": 1.6,
    "PS/G": 11
  },
  {
    "Player": "MarShon Brooks",
    "Pos": "SG",
    "Age": 29,
    "Tm": "MEM",
    "G": 7,
    "MP": 27.6,
    "FG%": ".500",
    "TRB": 3,
    "AST": 3.6,
    "PS/G": 20.1
  },
  {
    "Player": "Anthony Brown",
    "Pos": "SF",
    "Age": 25,
    "Tm": "MIN",
    "G": 1,
    "MP": 4,
    "FG%": 1,
    "TRB": 0,
    "AST": 1,
    "PS/G": 3
  },
  {
    "Player": "Bobby Brown",
    "Pos": "PG",
    "Age": 33,
    "Tm": "HOU",
    "G": 20,
    "MP": 5.8,
    "FG%": ".328",
    "TRB": 0.4,
    "AST": 0.6,
    "PS/G": 2.5
  },
  {
    "Player": "Jaylen Brown",
    "Pos": "SG",
    "Age": 21,
    "Tm": "BOS",
    "G": 70,
    "MP": 30.7,
    "FG%": ".465",
    "TRB": 4.9,
    "AST": 1.6,
    "PS/G": 14.5
  },
  {
    "Player": "Lorenzo Brown",
    "Pos": "PG",
    "Age": 27,
    "Tm": "TOR",
    "G": 14,
    "MP": 9.9,
    "FG%": ".412",
    "TRB": 1.1,
    "AST": 0.9,
    "PS/G": 2.3
  },
  {
    "Player": "Markel Brown",
    "Pos": "SG",
    "Age": 26,
    "Tm": "HOU",
    "G": 4,
    "MP": 7.8,
    "FG%": ".286",
    "TRB": 1.3,
    "AST": 0.5,
    "PS/G": 1.3
  },
  {
    "Player": "Sterling Brown",
    "Pos": "SG",
    "Age": 22,
    "Tm": "MIL",
    "G": 54,
    "MP": 14.4,
    "FG%": ".400",
    "TRB": 2.6,
    "AST": 0.5,
    "PS/G": 4
  },
  {
    "Player": "Nicolas Brussino",
    "Pos": "SF",
    "Age": 24,
    "Tm": "ATL",
    "G": 4,
    "MP": 2.5,
    "FG%": ".000",
    "TRB": 0.8,
    "AST": 0,
    "PS/G": 0
  },
  {
    "Player": "Thomas Bryant",
    "Pos": "C",
    "Age": 20,
    "Tm": "LAL",
    "G": 15,
    "MP": 4.8,
    "FG%": ".381",
    "TRB": 1.1,
    "AST": 0.4,
    "PS/G": 1.5
  },
  {
    "Player": "Reggie Bullock",
    "Pos": "SF",
    "Age": 26,
    "Tm": "DET",
    "G": 62,
    "MP": 27.9,
    "FG%": ".489",
    "TRB": 2.5,
    "AST": 1.5,
    "PS/G": 11.3
  },
  {
    "Player": "Trey Burke",
    "Pos": "PG",
    "Age": 25,
    "Tm": "NYK",
    "G": 36,
    "MP": 21.8,
    "FG%": ".503",
    "TRB": 2,
    "AST": 4.7,
    "PS/G": 12.8
  },
  {
    "Player": "Alec Burks",
    "Pos": "SG",
    "Age": 26,
    "Tm": "UTA",
    "G": 64,
    "MP": 16.5,
    "FG%": ".411",
    "TRB": 3,
    "AST": 1,
    "PS/G": 7.7
  },
  {
    "Player": "Jimmy Butler",
    "Pos": "SG",
    "Age": 28,
    "Tm": "MIN",
    "G": 59,
    "MP": 36.7,
    "FG%": ".474",
    "TRB": 5.3,
    "AST": 4.9,
    "PS/G": 22.2
  },
  {
    "Player": "Dwight Buycks",
    "Pos": "PG",
    "Age": 28,
    "Tm": "DET",
    "G": 29,
    "MP": 14.7,
    "FG%": ".414",
    "TRB": 1.4,
    "AST": 2,
    "PS/G": 7.4
  },
  {
    "Player": "Bruno Caboclo",
    "Pos": "SF",
    "Age": 22,
    "Tm": "TOT",
    "G": 12,
    "MP": 8.9,
    "FG%": ".290",
    "TRB": 1.8,
    "AST": 0.4,
    "PS/G": 2.2
  },
  {
    "Player": "Jose Calderon",
    "Pos": "PG",
    "Age": 36,
    "Tm": "CLE",
    "G": 57,
    "MP": 16,
    "FG%": ".503",
    "TRB": 1.5,
    "AST": 2.1,
    "PS/G": 4.5
  },
  {
    "Player": "Kentavious Caldwell-Pope",
    "Pos": "SG",
    "Age": 24,
    "Tm": "LAL",
    "G": 74,
    "MP": 33.2,
    "FG%": ".426",
    "TRB": 5.2,
    "AST": 2.2,
    "PS/G": 13.4
  },
  {
    "Player": "Isaiah Canaan",
    "Pos": "PG-SG",
    "Age": 26,
    "Tm": "TOT",
    "G": 20,
    "MP": 21.1,
    "FG%": ".380",
    "TRB": 2.3,
    "AST": 3.8,
    "PS/G": 8.6
  },
  {
    "Player": "Clint Capela",
    "Pos": "C",
    "Age": 23,
    "Tm": "HOU",
    "G": 74,
    "MP": 27.5,
    "FG%": ".652",
    "TRB": 10.8,
    "AST": 0.9,
    "PS/G": 13.9
  },
  {
    "Player": "DeMarre Carroll",
    "Pos": "SF",
    "Age": 31,
    "Tm": "BRK",
    "G": 73,
    "MP": 29.9,
    "FG%": ".414",
    "TRB": 6.6,
    "AST": 2,
    "PS/G": 13.5
  },
  {
    "Player": "Vince Carter",
    "Pos": "SF",
    "Age": 41,
    "Tm": "SAC",
    "G": 58,
    "MP": 17.7,
    "FG%": ".403",
    "TRB": 2.6,
    "AST": 1.2,
    "PS/G": 5.4
  },
  {
    "Player": "Michael Carter-Williams",
    "Pos": "PG",
    "Age": 26,
    "Tm": "CHO",
    "G": 52,
    "MP": 16.1,
    "FG%": ".332",
    "TRB": 2.7,
    "AST": 2.2,
    "PS/G": 4.6
  },
  {
    "Player": "Alex Caruso",
    "Pos": "PG",
    "Age": 23,
    "Tm": "LAL",
    "G": 37,
    "MP": 15.2,
    "FG%": ".431",
    "TRB": 1.8,
    "AST": 2,
    "PS/G": 3.6
  },
  {
    "Player": "Omri Casspi",
    "Pos": "SF",
    "Age": 29,
    "Tm": "GSW",
    "G": 53,
    "MP": 14,
    "FG%": ".580",
    "TRB": 3.8,
    "AST": 1,
    "PS/G": 5.7
  },
  {
    "Player": "Willie Cauley-Stein",
    "Pos": "C",
    "Age": 24,
    "Tm": "SAC",
    "G": 73,
    "MP": 28,
    "FG%": ".502",
    "TRB": 7,
    "AST": 2.4,
    "PS/G": 12.8
  },
  {
    "Player": "Tyler Cavanaugh",
    "Pos": "PF",
    "Age": 23,
    "Tm": "ATL",
    "G": 39,
    "MP": 13.3,
    "FG%": ".441",
    "TRB": 3.3,
    "AST": 0.7,
    "PS/G": 4.7
  },
  {
    "Player": "Mario Chalmers",
    "Pos": "PG",
    "Age": 31,
    "Tm": "MEM",
    "G": 66,
    "MP": 21.5,
    "FG%": ".379",
    "TRB": 2.4,
    "AST": 3,
    "PS/G": 7.7
  },
  {
    "Player": "Tyson Chandler",
    "Pos": "C",
    "Age": 35,
    "Tm": "PHO",
    "G": 46,
    "MP": 25,
    "FG%": ".647",
    "TRB": 9.1,
    "AST": 1.2,
    "PS/G": 6.5
  },
  {
    "Player": "Wilson Chandler",
    "Pos": "SF",
    "Age": 30,
    "Tm": "DEN",
    "G": 74,
    "MP": 31.7,
    "FG%": ".445",
    "TRB": 5.4,
    "AST": 2.2,
    "PS/G": 10
  },
  {
    "Player": "Marquese Chriss",
    "Pos": "PF",
    "Age": 20,
    "Tm": "PHO",
    "G": 72,
    "MP": 21.2,
    "FG%": ".423",
    "TRB": 5.5,
    "AST": 1.2,
    "PS/G": 7.7
  },
  {
    "Player": "Ian Clark",
    "Pos": "SG",
    "Age": 26,
    "Tm": "NOP",
    "G": 74,
    "MP": 19.7,
    "FG%": ".448",
    "TRB": 1.7,
    "AST": 1.5,
    "PS/G": 7.4
  },
  {
    "Player": "Jordan Clarkson",
    "Pos": "SG",
    "Age": 25,
    "Tm": "TOT",
    "G": 81,
    "MP": 23.3,
    "FG%": ".451",
    "TRB": 2.7,
    "AST": 2.7,
    "PS/G": 13.9
  },
  {
    "Player": "Gian Clavell",
    "Pos": "SG",
    "Age": 24,
    "Tm": "DAL",
    "G": 7,
    "MP": 9.1,
    "FG%": ".333",
    "TRB": 1,
    "AST": 0.4,
    "PS/G": 2.9
  },
  {
    "Player": "Antonius Cleveland",
    "Pos": "SG",
    "Age": 23,
    "Tm": "TOT",
    "G": 17,
    "MP": 7.2,
    "FG%": ".381",
    "TRB": 0.8,
    "AST": 0.1,
    "PS/G": 1.4
  },
  {
    "Player": "John Collins",
    "Pos": "PF",
    "Age": 20,
    "Tm": "ATL",
    "G": 74,
    "MP": 24.1,
    "FG%": ".576",
    "TRB": 7.3,
    "AST": 1.3,
    "PS/G": 10.5
  },
  {
    "Player": "Zach Collins",
    "Pos": "C",
    "Age": 20,
    "Tm": "POR",
    "G": 66,
    "MP": 15.8,
    "FG%": ".398",
    "TRB": 3.3,
    "AST": 0.8,
    "PS/G": 4.4
  },
  {
    "Player": "Kyle Collinsworth",
    "Pos": "SF",
    "Age": 26,
    "Tm": "DAL",
    "G": 32,
    "MP": 15,
    "FG%": ".384",
    "TRB": 3.3,
    "AST": 1.8,
    "PS/G": 3.2
  },
  {
    "Player": "Darren Collison",
    "Pos": "PG",
    "Age": 30,
    "Tm": "IND",
    "G": 69,
    "MP": 29.2,
    "FG%": ".495",
    "TRB": 2.6,
    "AST": 5.3,
    "PS/G": 12.4
  },
  {
    "Player": "Nick Collison",
    "Pos": "PF",
    "Age": 37,
    "Tm": "OKC",
    "G": 15,
    "MP": 5,
    "FG%": ".684",
    "TRB": 1.3,
    "AST": 0.3,
    "PS/G": 2.1
  },
  {
    "Player": "Mike Conley",
    "Pos": "PG",
    "Age": 30,
    "Tm": "MEM",
    "G": 12,
    "MP": 31.1,
    "FG%": ".381",
    "TRB": 2.3,
    "AST": 4.1,
    "PS/G": 17.1
  },
  {
    "Player": "Pat Connaughton",
    "Pos": "SG",
    "Age": 25,
    "Tm": "POR",
    "G": 82,
    "MP": 18.1,
    "FG%": ".423",
    "TRB": 2,
    "AST": 1.1,
    "PS/G": 5.4
  },
  {
    "Player": "Quinn Cook",
    "Pos": "PG",
    "Age": 24,
    "Tm": "GSW",
    "G": 33,
    "MP": 22.4,
    "FG%": ".484",
    "TRB": 2.5,
    "AST": 2.7,
    "PS/G": 9.5
  },
  {
    "Player": "Charles Cooke",
    "Pos": "SG",
    "Age": 23,
    "Tm": "NOP",
    "G": 13,
    "MP": 2.9,
    "FG%": ".143",
    "TRB": 0.2,
    "AST": 0.1,
    "PS/G": 0.5
  },
  {
    "Player": "Jack Cooley",
    "Pos": "PF",
    "Age": 26,
    "Tm": "SAC",
    "G": 7,
    "MP": 12.4,
    "FG%": ".481",
    "TRB": 4.3,
    "AST": 0.9,
    "PS/G": 5.7
  },
  {
    "Player": "Matt Costello",
    "Pos": "C",
    "Age": 24,
    "Tm": "SAS",
    "G": 4,
    "MP": 8,
    "FG%": ".500",
    "TRB": 2.3,
    "AST": 0.5,
    "PS/G": 1
  },
  {
    "Player": "DeMarcus Cousins",
    "Pos": "C",
    "Age": 27,
    "Tm": "NOP",
    "G": 48,
    "MP": 36.2,
    "FG%": ".470",
    "TRB": 12.9,
    "AST": 5.4,
    "PS/G": 25.2
  },
  {
    "Player": "Robert Covington",
    "Pos": "SF",
    "Age": 27,
    "Tm": "PHI",
    "G": 80,
    "MP": 31.7,
    "FG%": ".413",
    "TRB": 5.4,
    "AST": 2,
    "PS/G": 12.6
  },
  {
    "Player": "Allen Crabbe",
    "Pos": "SG",
    "Age": 25,
    "Tm": "BRK",
    "G": 75,
    "MP": 29.3,
    "FG%": ".407",
    "TRB": 4.3,
    "AST": 1.6,
    "PS/G": 13.2
  },
  {
    "Player": "Torrey Craig",
    "Pos": "SF",
    "Age": 27,
    "Tm": "DEN",
    "G": 39,
    "MP": 16.1,
    "FG%": ".453",
    "TRB": 3.3,
    "AST": 0.6,
    "PS/G": 4.2
  },
  {
    "Player": "Jamal Crawford",
    "Pos": "SG",
    "Age": 37,
    "Tm": "MIN",
    "G": 80,
    "MP": 20.7,
    "FG%": ".415",
    "TRB": 1.2,
    "AST": 2.3,
    "PS/G": 10.3
  },
  {
    "Player": "Jordan Crawford",
    "Pos": "SG",
    "Age": 29,
    "Tm": "NOP",
    "G": 5,
    "MP": 10.6,
    "FG%": ".444",
    "TRB": 0.8,
    "AST": 2.6,
    "PS/G": 6.6
  },
  {
    "Player": "Jae Crowder",
    "Pos": "SF",
    "Age": 27,
    "Tm": "TOT",
    "G": 80,
    "MP": 26.1,
    "FG%": ".404",
    "TRB": 3.4,
    "AST": 1.2,
    "PS/G": 9.7
  },
  {
    "Player": "Dante Cunningham",
    "Pos": "SF",
    "Age": 30,
    "Tm": "TOT",
    "G": 73,
    "MP": 21.4,
    "FG%": ".451",
    "TRB": 4.1,
    "AST": 0.7,
    "PS/G": 5.7
  },
  {
    "Player": "Stephen Curry",
    "Pos": "PG",
    "Age": 29,
    "Tm": "GSW",
    "G": 51,
    "MP": 32,
    "FG%": ".495",
    "TRB": 5.1,
    "AST": 6.1,
    "PS/G": 26.4
  },
  {
    "Player": "Troy Daniels",
    "Pos": "SG",
    "Age": 26,
    "Tm": "PHO",
    "G": 79,
    "MP": 20.5,
    "FG%": ".403",
    "TRB": 1.6,
    "AST": 0.6,
    "PS/G": 8.9
  },
  {
    "Player": "Anthony Davis",
    "Pos": "PF",
    "Age": 24,
    "Tm": "NOP",
    "G": 75,
    "MP": 36.4,
    "FG%": ".534",
    "TRB": 11.1,
    "AST": 2.3,
    "PS/G": 28.1
  },
  {
    "Player": "Deyonta Davis",
    "Pos": "C",
    "Age": 21,
    "Tm": "MEM",
    "G": 62,
    "MP": 15.2,
    "FG%": ".608",
    "TRB": 4,
    "AST": 0.6,
    "PS/G": 5.8
  },
  {
    "Player": "Ed Davis",
    "Pos": "C",
    "Age": 28,
    "Tm": "POR",
    "G": 78,
    "MP": 18.9,
    "FG%": ".582",
    "TRB": 7.4,
    "AST": 0.5,
    "PS/G": 5.3
  },
  {
    "Player": "Dewayne Dedmon",
    "Pos": "C",
    "Age": 28,
    "Tm": "ATL",
    "G": 62,
    "MP": 24.9,
    "FG%": ".524",
    "TRB": 7.9,
    "AST": 1.5,
    "PS/G": 10
  },
  {
    "Player": "Sam Dekker",
    "Pos": "PF",
    "Age": 23,
    "Tm": "LAC",
    "G": 73,
    "MP": 12.1,
    "FG%": ".494",
    "TRB": 2.4,
    "AST": 0.5,
    "PS/G": 4.2
  },
  {
    "Player": "Malcolm Delaney",
    "Pos": "PG",
    "Age": 28,
    "Tm": "ATL",
    "G": 54,
    "MP": 18.8,
    "FG%": ".382",
    "TRB": 1.9,
    "AST": 3,
    "PS/G": 6.3
  },
  {
    "Player": "Matthew Dellavedova",
    "Pos": "PG",
    "Age": 27,
    "Tm": "MIL",
    "G": 38,
    "MP": 18.7,
    "FG%": ".362",
    "TRB": 1.7,
    "AST": 3.8,
    "PS/G": 4.3
  },
  {
    "Player": "Luol Deng",
    "Pos": "SF",
    "Age": 32,
    "Tm": "LAL",
    "G": 1,
    "MP": 13,
    "FG%": ".500",
    "TRB": 0,
    "AST": 1,
    "PS/G": 2
  },
  {
    "Player": "DeMar DeRozan",
    "Pos": "SG",
    "Age": 28,
    "Tm": "TOR",
    "G": 80,
    "MP": 33.9,
    "FG%": ".456",
    "TRB": 3.9,
    "AST": 5.2,
    "PS/G": 23
  },
  {
    "Player": "Cheick Diallo",
    "Pos": "PF",
    "Age": 21,
    "Tm": "NOP",
    "G": 52,
    "MP": 11.2,
    "FG%": ".580",
    "TRB": 4.1,
    "AST": 0.4,
    "PS/G": 4.9
  },
  {
    "Player": "Gorgui Dieng",
    "Pos": "C",
    "Age": 28,
    "Tm": "MIN",
    "G": 79,
    "MP": 16.9,
    "FG%": ".479",
    "TRB": 4.6,
    "AST": 0.9,
    "PS/G": 5.9
  },
  {
    "Player": "Spencer Dinwiddie",
    "Pos": "PG",
    "Age": 24,
    "Tm": "BRK",
    "G": 80,
    "MP": 28.8,
    "FG%": ".387",
    "TRB": 3.2,
    "AST": 6.6,
    "PS/G": 12.6
  },
  {
    "Player": "Tyler Dorsey",
    "Pos": "SG",
    "Age": 21,
    "Tm": "ATL",
    "G": 56,
    "MP": 17.4,
    "FG%": ".377",
    "TRB": 2.3,
    "AST": 1.4,
    "PS/G": 7.2
  },
  {
    "Player": "Damyean Dotson",
    "Pos": "SG",
    "Age": 23,
    "Tm": "NYK",
    "G": 44,
    "MP": 10.8,
    "FG%": ".447",
    "TRB": 1.9,
    "AST": 0.7,
    "PS/G": 4.1
  },
  {
    "Player": "Milton Doyle",
    "Pos": "SG",
    "Age": 24,
    "Tm": "BRK",
    "G": 10,
    "MP": 12.5,
    "FG%": ".277",
    "TRB": 1.8,
    "AST": 1,
    "PS/G": 3.4
  },
  {
    "Player": "PJ Dozier",
    "Pos": "PG",
    "Age": 21,
    "Tm": "OKC",
    "G": 2,
    "MP": 1.5,
    "FG%": ".500",
    "TRB": 0.5,
    "AST": 0,
    "PS/G": 1
  },
  {
    "Player": "Goran Dragic",
    "Pos": "PG",
    "Age": 31,
    "Tm": "MIA",
    "G": 75,
    "MP": 31.7,
    "FG%": ".450",
    "TRB": 4.1,
    "AST": 4.8,
    "PS/G": 17.3
  },
  {
    "Player": "Larry Drew",
    "Pos": "PG",
    "Age": 27,
    "Tm": "TOT",
    "G": 10,
    "MP": 7,
    "FG%": ".292",
    "TRB": 0.3,
    "AST": 1,
    "PS/G": 1.7
  },
  {
    "Player": "Andre Drummond",
    "Pos": "C",
    "Age": 24,
    "Tm": "DET",
    "G": 78,
    "MP": 33.7,
    "FG%": ".529",
    "TRB": 16,
    "AST": 3,
    "PS/G": 15
  },
  {
    "Player": "Jared Dudley",
    "Pos": "PF",
    "Age": 32,
    "Tm": "PHO",
    "G": 48,
    "MP": 14.3,
    "FG%": ".393",
    "TRB": 2,
    "AST": 1.6,
    "PS/G": 3.2
  },
  {
    "Player": "Kris Dunn",
    "Pos": "PG",
    "Age": 23,
    "Tm": "CHI",
    "G": 52,
    "MP": 29.3,
    "FG%": ".429",
    "TRB": 4.3,
    "AST": 6,
    "PS/G": 13.4
  },
  {
    "Player": "Kevin Durant",
    "Pos": "PF",
    "Age": 29,
    "Tm": "GSW",
    "G": 68,
    "MP": 34.2,
    "FG%": ".516",
    "TRB": 6.8,
    "AST": 5.4,
    "PS/G": 26.4
  },
  {
    "Player": "Jarell Eddie",
    "Pos": "SF",
    "Age": 26,
    "Tm": "TOT",
    "G": 3,
    "MP": 3,
    "FG%": ".000",
    "TRB": 0.3,
    "AST": 0,
    "PS/G": 0
  },
  {
    "Player": "Henry Ellenson",
    "Pos": "PF",
    "Age": 21,
    "Tm": "DET",
    "G": 38,
    "MP": 8.7,
    "FG%": ".363",
    "TRB": 2.1,
    "AST": 0.5,
    "PS/G": 4
  },
  {
    "Player": "Wayne Ellington",
    "Pos": "SG",
    "Age": 30,
    "Tm": "MIA",
    "G": 77,
    "MP": 26.5,
    "FG%": ".407",
    "TRB": 2.8,
    "AST": 1,
    "PS/G": 11.2
  },
  {
    "Player": "Joel Embiid",
    "Pos": "C",
    "Age": 23,
    "Tm": "PHI",
    "G": 63,
    "MP": 30.3,
    "FG%": ".483",
    "TRB": 11,
    "AST": 3.2,
    "PS/G": 22.9
  },
  {
    "Player": "James Ennis",
    "Pos": "SF",
    "Age": 27,
    "Tm": "TOT",
    "G": 72,
    "MP": 22.3,
    "FG%": ".474",
    "TRB": 3.1,
    "AST": 1,
    "PS/G": 7.1
  },
  {
    "Player": "Tyler Ennis",
    "Pos": "PG",
    "Age": 23,
    "Tm": "LAL",
    "G": 54,
    "MP": 12.6,
    "FG%": ".420",
    "TRB": 1.8,
    "AST": 1.9,
    "PS/G": 4.1
  },
  {
    "Player": "Jawun Evans",
    "Pos": "PG",
    "Age": 21,
    "Tm": "LAC",
    "G": 48,
    "MP": 16.2,
    "FG%": ".352",
    "TRB": 1.8,
    "AST": 2.1,
    "PS/G": 4.8
  },
  {
    "Player": "Jeremy Evans",
    "Pos": "SF",
    "Age": 30,
    "Tm": "ATL",
    "G": 1,
    "MP": 5,
    "FG%": 1,
    "TRB": 1,
    "AST": 0,
    "PS/G": 2
  },
  {
    "Player": "Tyreke Evans",
    "Pos": "PG",
    "Age": 28,
    "Tm": "MEM",
    "G": 52,
    "MP": 30.9,
    "FG%": ".452",
    "TRB": 5.1,
    "AST": 5.2,
    "PS/G": 19.4
  },
  {
    "Player": "Dante Exum",
    "Pos": "PG",
    "Age": 22,
    "Tm": "UTA",
    "G": 14,
    "MP": 16.8,
    "FG%": ".483",
    "TRB": 1.9,
    "AST": 3.1,
    "PS/G": 8.1
  },
  {
    "Player": "Kenneth Faried",
    "Pos": "PF",
    "Age": 28,
    "Tm": "DEN",
    "G": 32,
    "MP": 14.4,
    "FG%": ".514",
    "TRB": 4.8,
    "AST": 0.6,
    "PS/G": 5.9
  },
  {
    "Player": "Derrick Favors",
    "Pos": "C",
    "Age": 26,
    "Tm": "UTA",
    "G": 77,
    "MP": 28,
    "FG%": ".563",
    "TRB": 7.2,
    "AST": 1.3,
    "PS/G": 12.3
  },
  {
    "Player": "Kay Felder",
    "Pos": "PG",
    "Age": 22,
    "Tm": "TOT",
    "G": 16,
    "MP": 8.8,
    "FG%": ".300",
    "TRB": 1.1,
    "AST": 1.3,
    "PS/G": 3.6
  },
  {
    "Player": "Cristiano Felicio",
    "Pos": "C",
    "Age": 25,
    "Tm": "CHI",
    "G": 55,
    "MP": 17.8,
    "FG%": ".591",
    "TRB": 4.2,
    "AST": 1,
    "PS/G": 5.6
  },
  {
    "Player": "Raymond Felton",
    "Pos": "PG",
    "Age": 33,
    "Tm": "OKC",
    "G": 82,
    "MP": 16.6,
    "FG%": ".406",
    "TRB": 1.9,
    "AST": 2.5,
    "PS/G": 6.9
  },
  {
    "Player": "Terrance Ferguson",
    "Pos": "SG",
    "Age": 19,
    "Tm": "OKC",
    "G": 61,
    "MP": 12.5,
    "FG%": ".414",
    "TRB": 0.8,
    "AST": 0.3,
    "PS/G": 3.1
  },
  {
    "Player": "Yogi Ferrell",
    "Pos": "SG",
    "Age": 24,
    "Tm": "DAL",
    "G": 82,
    "MP": 27.8,
    "FG%": ".426",
    "TRB": 3,
    "AST": 2.5,
    "PS/G": 10.2
  },
  {
    "Player": "Dorian Finney-Smith",
    "Pos": "PF",
    "Age": 24,
    "Tm": "DAL",
    "G": 21,
    "MP": 21.3,
    "FG%": ".380",
    "TRB": 3.6,
    "AST": 1.2,
    "PS/G": 5.9
  },
  {
    "Player": "Bryn Forbes",
    "Pos": "SG",
    "Age": 24,
    "Tm": "SAS",
    "G": 80,
    "MP": 19,
    "FG%": ".421",
    "TRB": 1.4,
    "AST": 1,
    "PS/G": 6.9
  },
  {
    "Player": "Evan Fournier",
    "Pos": "SF",
    "Age": 25,
    "Tm": "ORL",
    "G": 57,
    "MP": 32.2,
    "FG%": ".459",
    "TRB": 3.2,
    "AST": 2.9,
    "PS/G": 17.8
  },
  {
    "Player": "De'Aaron Fox",
    "Pos": "PG",
    "Age": 20,
    "Tm": "SAC",
    "G": 73,
    "MP": 27.8,
    "FG%": ".412",
    "TRB": 2.8,
    "AST": 4.4,
    "PS/G": 11.6
  },
  {
    "Player": "Tim Frazier",
    "Pos": "PG",
    "Age": 27,
    "Tm": "WAS",
    "G": 59,
    "MP": 14.2,
    "FG%": ".395",
    "TRB": 1.9,
    "AST": 3.3,
    "PS/G": 3
  },
  {
    "Player": "Channing Frye",
    "Pos": "C",
    "Age": 34,
    "Tm": "TOT",
    "G": 53,
    "MP": 13.1,
    "FG%": ".491",
    "TRB": 2.5,
    "AST": 0.7,
    "PS/G": 5
  },
  {
    "Player": "Markelle Fultz",
    "Pos": "SG",
    "Age": 19,
    "Tm": "PHI",
    "G": 14,
    "MP": 18.1,
    "FG%": ".405",
    "TRB": 3.1,
    "AST": 3.8,
    "PS/G": 7.1
  },
  {
    "Player": "Danilo Gallinari",
    "Pos": "SF",
    "Age": 29,
    "Tm": "LAC",
    "G": 21,
    "MP": 32,
    "FG%": ".398",
    "TRB": 4.8,
    "AST": 2,
    "PS/G": 15.3
  },
  {
    "Player": "Langston Galloway",
    "Pos": "SG",
    "Age": 26,
    "Tm": "DET",
    "G": 58,
    "MP": 14.9,
    "FG%": ".371",
    "TRB": 1.6,
    "AST": 1,
    "PS/G": 6.2
  },
  {
    "Player": "Marc Gasol",
    "Pos": "C",
    "Age": 33,
    "Tm": "MEM",
    "G": 73,
    "MP": 33,
    "FG%": ".420",
    "TRB": 8.1,
    "AST": 4.2,
    "PS/G": 17.2
  },
  {
    "Player": "Pau Gasol",
    "Pos": "C",
    "Age": 37,
    "Tm": "SAS",
    "G": 77,
    "MP": 23.5,
    "FG%": ".458",
    "TRB": 8,
    "AST": 3.1,
    "PS/G": 10.1
  },
  {
    "Player": "Rudy Gay",
    "Pos": "PF",
    "Age": 31,
    "Tm": "SAS",
    "G": 57,
    "MP": 21.6,
    "FG%": ".471",
    "TRB": 5.1,
    "AST": 1.3,
    "PS/G": 11.5
  },
  {
    "Player": "Paul George",
    "Pos": "SF",
    "Age": 27,
    "Tm": "OKC",
    "G": 79,
    "MP": 36.6,
    "FG%": ".430",
    "TRB": 5.7,
    "AST": 3.3,
    "PS/G": 21.9
  },
  {
    "Player": "Marcus Georges-Hunt",
    "Pos": "SG",
    "Age": 23,
    "Tm": "MIN",
    "G": 42,
    "MP": 5.3,
    "FG%": ".438",
    "TRB": 0.4,
    "AST": 0.2,
    "PS/G": 1.4
  },
  {
    "Player": "Jonathan Gibson",
    "Pos": "PG",
    "Age": 30,
    "Tm": "BOS",
    "G": 4,
    "MP": 10,
    "FG%": ".609",
    "TRB": 0.8,
    "AST": 1,
    "PS/G": 8.5
  },
  {
    "Player": "Taj Gibson",
    "Pos": "PF",
    "Age": 32,
    "Tm": "MIN",
    "G": 82,
    "MP": 33.2,
    "FG%": ".577",
    "TRB": 7.1,
    "AST": 1.2,
    "PS/G": 12.2
  },
  {
    "Player": "Manu Ginobili",
    "Pos": "SG",
    "Age": 40,
    "Tm": "SAS",
    "G": 65,
    "MP": 20,
    "FG%": ".434",
    "TRB": 2.2,
    "AST": 2.5,
    "PS/G": 8.9
  },
  {
    "Player": "Rudy Gobert",
    "Pos": "C",
    "Age": 25,
    "Tm": "UTA",
    "G": 56,
    "MP": 32.4,
    "FG%": ".622",
    "TRB": 10.7,
    "AST": 1.4,
    "PS/G": 13.5
  },
  {
    "Player": "Aaron Gordon",
    "Pos": "PF",
    "Age": 22,
    "Tm": "ORL",
    "G": 58,
    "MP": 32.9,
    "FG%": ".434",
    "TRB": 7.9,
    "AST": 2.3,
    "PS/G": 17.6
  },
  {
    "Player": "Eric Gordon",
    "Pos": "SG",
    "Age": 29,
    "Tm": "HOU",
    "G": 69,
    "MP": 31.2,
    "FG%": ".428",
    "TRB": 2.5,
    "AST": 2.2,
    "PS/G": 18
  },
  {
    "Player": "Marcin Gortat",
    "Pos": "C",
    "Age": 33,
    "Tm": "WAS",
    "G": 82,
    "MP": 25.3,
    "FG%": ".518",
    "TRB": 7.6,
    "AST": 1.8,
    "PS/G": 8.4
  },
  {
    "Player": "Treveon Graham",
    "Pos": "SG",
    "Age": 24,
    "Tm": "CHO",
    "G": 63,
    "MP": 16.7,
    "FG%": ".434",
    "TRB": 1.9,
    "AST": 0.9,
    "PS/G": 4.3
  },
  {
    "Player": "Jerami Grant",
    "Pos": "PF",
    "Age": 23,
    "Tm": "OKC",
    "G": 81,
    "MP": 20.3,
    "FG%": ".535",
    "TRB": 3.9,
    "AST": 0.7,
    "PS/G": 8.4
  },
  {
    "Player": "Jerian Grant",
    "Pos": "PG",
    "Age": 25,
    "Tm": "CHI",
    "G": 74,
    "MP": 22.8,
    "FG%": ".415",
    "TRB": 2.3,
    "AST": 4.6,
    "PS/G": 8.4
  },
  {
    "Player": "Josh Gray",
    "Pos": "PG",
    "Age": 24,
    "Tm": "PHO",
    "G": 5,
    "MP": 17.2,
    "FG%": ".268",
    "TRB": 2,
    "AST": 2.4,
    "PS/G": 6.4
  },
  {
    "Player": "Danny Green",
    "Pos": "SG",
    "Age": 30,
    "Tm": "SAS",
    "G": 70,
    "MP": 25.6,
    "FG%": ".387",
    "TRB": 3.6,
    "AST": 1.6,
    "PS/G": 8.6
  },
  {
    "Player": "Draymond Green",
    "Pos": "PF",
    "Age": 27,
    "Tm": "GSW",
    "G": 70,
    "MP": 32.7,
    "FG%": ".454",
    "TRB": 7.6,
    "AST": 7.3,
    "PS/G": 11
  },
  {
    "Player": "Gerald Green",
    "Pos": "SG",
    "Age": 32,
    "Tm": "HOU",
    "G": 41,
    "MP": 22.7,
    "FG%": ".407",
    "TRB": 3.2,
    "AST": 0.6,
    "PS/G": 12.1
  },
  {
    "Player": "JaMychal Green",
    "Pos": "PF",
    "Age": 27,
    "Tm": "MEM",
    "G": 55,
    "MP": 28,
    "FG%": ".457",
    "TRB": 8.4,
    "AST": 1.4,
    "PS/G": 10.3
  },
  {
    "Player": "Jeff Green",
    "Pos": "PF",
    "Age": 31,
    "Tm": "CLE",
    "G": 78,
    "MP": 23.4,
    "FG%": ".477",
    "TRB": 3.2,
    "AST": 1.3,
    "PS/G": 10.8
  },
  {
    "Player": "Blake Griffin",
    "Pos": "PF",
    "Age": 28,
    "Tm": "TOT",
    "G": 58,
    "MP": 34,
    "FG%": ".438",
    "TRB": 7.4,
    "AST": 5.8,
    "PS/G": 21.4
  },
  {
    "Player": "Daniel Hamilton",
    "Pos": "SG",
    "Age": 22,
    "Tm": "OKC",
    "G": 6,
    "MP": 4.7,
    "FG%": ".455",
    "TRB": 0.8,
    "AST": 1.3,
    "PS/G": 2
  },
  {
    "Player": "Tim Hardaway",
    "Pos": "SG",
    "Age": 25,
    "Tm": "NYK",
    "G": 57,
    "MP": 33.1,
    "FG%": ".421",
    "TRB": 3.9,
    "AST": 2.7,
    "PS/G": 17.5
  },
  {
    "Player": "James Harden",
    "Pos": "SG",
    "Age": 28,
    "Tm": "HOU",
    "G": 72,
    "MP": 35.4,
    "FG%": ".449",
    "TRB": 5.4,
    "AST": 8.8,
    "PS/G": 30.4
  },
  {
    "Player": "Maurice Harkless",
    "Pos": "SF",
    "Age": 24,
    "Tm": "POR",
    "G": 59,
    "MP": 21.4,
    "FG%": ".495",
    "TRB": 2.7,
    "AST": 0.9,
    "PS/G": 6.5
  },
  {
    "Player": "Montrezl Harrell",
    "Pos": "C",
    "Age": 24,
    "Tm": "LAC",
    "G": 76,
    "MP": 17,
    "FG%": ".635",
    "TRB": 4,
    "AST": 1,
    "PS/G": 11
  },
  {
    "Player": "Devin Harris",
    "Pos": "PG",
    "Age": 34,
    "Tm": "TOT",
    "G": 71,
    "MP": 18.9,
    "FG%": ".412",
    "TRB": 1.8,
    "AST": 2.1,
    "PS/G": 8.4
  },
  {
    "Player": "Gary Harris",
    "Pos": "SG",
    "Age": 23,
    "Tm": "DEN",
    "G": 67,
    "MP": 34.4,
    "FG%": ".485",
    "TRB": 2.6,
    "AST": 2.9,
    "PS/G": 17.5
  },
  {
    "Player": "Joe Harris",
    "Pos": "SG",
    "Age": 26,
    "Tm": "BRK",
    "G": 78,
    "MP": 25.3,
    "FG%": ".491",
    "TRB": 3.3,
    "AST": 1.6,
    "PS/G": 10.8
  },
  {
    "Player": "Tobias Harris",
    "Pos": "PF",
    "Age": 25,
    "Tm": "TOT",
    "G": 80,
    "MP": 33.4,
    "FG%": ".460",
    "TRB": 5.5,
    "AST": 2.4,
    "PS/G": 18.6
  },
  {
    "Player": "Aaron Harrison",
    "Pos": "SG",
    "Age": 23,
    "Tm": "DAL",
    "G": 9,
    "MP": 25.9,
    "FG%": ".275",
    "TRB": 2.7,
    "AST": 1.2,
    "PS/G": 6.7
  },
  {
    "Player": "Andrew Harrison",
    "Pos": "PG",
    "Age": 23,
    "Tm": "MEM",
    "G": 56,
    "MP": 23.7,
    "FG%": ".422",
    "TRB": 2.3,
    "AST": 3.2,
    "PS/G": 9.5
  },
  {
    "Player": "Shaquille Harrison",
    "Pos": "PG",
    "Age": 24,
    "Tm": "PHO",
    "G": 23,
    "MP": 16.7,
    "FG%": ".476",
    "TRB": 2.7,
    "AST": 2.4,
    "PS/G": 6.6
  },
  {
    "Player": "Josh Hart",
    "Pos": "SG",
    "Age": 22,
    "Tm": "LAL",
    "G": 63,
    "MP": 23.2,
    "FG%": ".469",
    "TRB": 4.2,
    "AST": 1.3,
    "PS/G": 7.9
  },
  {
    "Player": "Udonis Haslem",
    "Pos": "C",
    "Age": 37,
    "Tm": "MIA",
    "G": 14,
    "MP": 5.1,
    "FG%": ".200",
    "TRB": 0.7,
    "AST": 0.4,
    "PS/G": 0.6
  },
  {
    "Player": "Nigel Hayes",
    "Pos": "SF",
    "Age": 23,
    "Tm": "TOT",
    "G": 9,
    "MP": 13.6,
    "FG%": ".333",
    "TRB": 2.4,
    "AST": 0.7,
    "PS/G": 3
  },
  {
    "Player": "Gordon Hayward",
    "Pos": "SF",
    "Age": 27,
    "Tm": "BOS",
    "G": 1,
    "MP": 5,
    "FG%": ".500",
    "TRB": 1,
    "AST": 0,
    "PS/G": 2
  },
  {
    "Player": "Reggie Hearn",
    "Pos": "SG",
    "Age": 26,
    "Tm": "DET",
    "G": 3,
    "MP": 2.3,
    "FG%": ".500",
    "TRB": 0,
    "AST": 0,
    "PS/G": 1
  },
  {
    "Player": "Myke Henry",
    "Pos": "SF",
    "Age": 25,
    "Tm": "MEM",
    "G": 20,
    "MP": 18.9,
    "FG%": ".376",
    "TRB": 1.9,
    "AST": 1.1,
    "PS/G": 5.4
  },
  {
    "Player": "John Henson",
    "Pos": "C",
    "Age": 27,
    "Tm": "MIL",
    "G": 76,
    "MP": 25.9,
    "FG%": ".572",
    "TRB": 6.8,
    "AST": 1.5,
    "PS/G": 8.8
  },
  {
    "Player": "Juan Hernangomez",
    "Pos": "PF",
    "Age": 22,
    "Tm": "DEN",
    "G": 25,
    "MP": 11.1,
    "FG%": ".387",
    "TRB": 2.2,
    "AST": 0.5,
    "PS/G": 3.3
  },
  {
    "Player": "Willy Hernangomez",
    "Pos": "C",
    "Age": 23,
    "Tm": "TOT",
    "G": 48,
    "MP": 10.3,
    "FG%": ".555",
    "TRB": 3.8,
    "AST": 0.7,
    "PS/G": 5.1
  },
  {
    "Player": "Mario Hezonja",
    "Pos": "SF",
    "Age": 22,
    "Tm": "ORL",
    "G": 75,
    "MP": 22.1,
    "FG%": ".442",
    "TRB": 3.7,
    "AST": 1.4,
    "PS/G": 9.6
  },
  {
    "Player": "Isaiah Hicks",
    "Pos": "PF",
    "Age": 23,
    "Tm": "NYK",
    "G": 18,
    "MP": 13.3,
    "FG%": ".458",
    "TRB": 2.3,
    "AST": 0.9,
    "PS/G": 4.4
  },
  {
    "Player": "Buddy Hield",
    "Pos": "SG",
    "Age": 24,
    "Tm": "SAC",
    "G": 80,
    "MP": 25.3,
    "FG%": ".446",
    "TRB": 3.8,
    "AST": 1.9,
    "PS/G": 13.5
  },
  {
    "Player": "Nene Hilario",
    "Pos": "C",
    "Age": 35,
    "Tm": "HOU",
    "G": 52,
    "MP": 14.6,
    "FG%": ".569",
    "TRB": 3.4,
    "AST": 0.9,
    "PS/G": 6.5
  },
  {
    "Player": "George Hill",
    "Pos": "PG",
    "Age": 31,
    "Tm": "TOT",
    "G": 67,
    "MP": 27,
    "FG%": ".460",
    "TRB": 2.7,
    "AST": 2.8,
    "PS/G": 10
  },
  {
    "Player": "Solomon Hill",
    "Pos": "SF",
    "Age": 26,
    "Tm": "NOP",
    "G": 12,
    "MP": 15.6,
    "FG%": ".268",
    "TRB": 3,
    "AST": 1.8,
    "PS/G": 2.4
  },
  {
    "Player": "Darrun Hilliard",
    "Pos": "SG",
    "Age": 24,
    "Tm": "SAS",
    "G": 14,
    "MP": 6.8,
    "FG%": ".263",
    "TRB": 0.5,
    "AST": 0.8,
    "PS/G": 1.1
  },
  {
    "Player": "Jrue Holiday",
    "Pos": "SG",
    "Age": 27,
    "Tm": "NOP",
    "G": 81,
    "MP": 36.1,
    "FG%": ".494",
    "TRB": 4.5,
    "AST": 6,
    "PS/G": 19
  },
  {
    "Player": "Justin Holiday",
    "Pos": "SG",
    "Age": 28,
    "Tm": "CHI",
    "G": 72,
    "MP": 31.5,
    "FG%": ".371",
    "TRB": 4,
    "AST": 2.1,
    "PS/G": 12.2
  },
  {
    "Player": "John Holland",
    "Pos": "SF",
    "Age": 29,
    "Tm": "CLE",
    "G": 24,
    "MP": 7.3,
    "FG%": ".288",
    "TRB": 1,
    "AST": 0.2,
    "PS/G": 2.3
  },
  {
    "Player": "Rondae Hollis-Jefferson",
    "Pos": "SF",
    "Age": 23,
    "Tm": "BRK",
    "G": 68,
    "MP": 28.2,
    "FG%": ".472",
    "TRB": 6.8,
    "AST": 2.5,
    "PS/G": 13.9
  },
  {
    "Player": "Richaun Holmes",
    "Pos": "C",
    "Age": 24,
    "Tm": "PHI",
    "G": 48,
    "MP": 15.5,
    "FG%": ".560",
    "TRB": 4.4,
    "AST": 1.3,
    "PS/G": 6.5
  },
  {
    "Player": "Rodney Hood",
    "Pos": "SG",
    "Age": 25,
    "Tm": "TOT",
    "G": 60,
    "MP": 26.9,
    "FG%": ".429",
    "TRB": 2.8,
    "AST": 1.6,
    "PS/G": 14.7
  },
  {
    "Player": "Scotty Hopson",
    "Pos": "SG",
    "Age": 28,
    "Tm": "DAL",
    "G": 1,
    "MP": 8,
    "FG%": ".000",
    "TRB": 0,
    "AST": 1,
    "PS/G": 1
  },
  {
    "Player": "Al Horford",
    "Pos": "C",
    "Age": 31,
    "Tm": "BOS",
    "G": 72,
    "MP": 31.6,
    "FG%": ".489",
    "TRB": 7.4,
    "AST": 4.7,
    "PS/G": 12.9
  },
  {
    "Player": "Danuel House",
    "Pos": "SG",
    "Age": 24,
    "Tm": "PHO",
    "G": 23,
    "MP": 17.5,
    "FG%": ".434",
    "TRB": 3.3,
    "AST": 1.1,
    "PS/G": 6.6
  },
  {
    "Player": "Dwight Howard",
    "Pos": "C",
    "Age": 32,
    "Tm": "CHO",
    "G": 81,
    "MP": 30.4,
    "FG%": ".555",
    "TRB": 12.5,
    "AST": 1.3,
    "PS/G": 16.6
  },
  {
    "Player": "Josh Huestis",
    "Pos": "PF",
    "Age": 26,
    "Tm": "OKC",
    "G": 69,
    "MP": 14.2,
    "FG%": ".330",
    "TRB": 2.3,
    "AST": 0.3,
    "PS/G": 2.3
  },
  {
    "Player": "R.J. Hunter",
    "Pos": "SG",
    "Age": 24,
    "Tm": "HOU",
    "G": 5,
    "MP": 9,
    "FG%": ".350",
    "TRB": 1,
    "AST": 0.6,
    "PS/G": 3.8
  },
  {
    "Player": "Vince Hunter",
    "Pos": "PF",
    "Age": 23,
    "Tm": "MEM",
    "G": 4,
    "MP": 1.8,
    "FG%": ".600",
    "TRB": 0.8,
    "AST": 0,
    "PS/G": 1.5
  },
  {
    "Player": "Serge Ibaka",
    "Pos": "PF",
    "Age": 28,
    "Tm": "TOR",
    "G": 76,
    "MP": 27.5,
    "FG%": ".483",
    "TRB": 6.3,
    "AST": 0.8,
    "PS/G": 12.6
  },
  {
    "Player": "Andre Iguodala",
    "Pos": "SF",
    "Age": 34,
    "Tm": "GSW",
    "G": 64,
    "MP": 25.3,
    "FG%": ".463",
    "TRB": 3.8,
    "AST": 3.3,
    "PS/G": 6
  },
  {
    "Player": "Ersan Ilyasova",
    "Pos": "PF",
    "Age": 30,
    "Tm": "TOT",
    "G": 69,
    "MP": 25.1,
    "FG%": ".452",
    "TRB": 5.9,
    "AST": 1.3,
    "PS/G": 10.9
  },
  {
    "Player": "Joe Ingles",
    "Pos": "SF",
    "Age": 30,
    "Tm": "UTA",
    "G": 82,
    "MP": 31.4,
    "FG%": ".467",
    "TRB": 4.2,
    "AST": 4.8,
    "PS/G": 11.5
  },
  {
    "Player": "Andre Ingram",
    "Pos": "SG",
    "Age": 32,
    "Tm": "LAL",
    "G": 2,
    "MP": 32,
    "FG%": ".471",
    "TRB": 3,
    "AST": 3.5,
    "PS/G": 12
  },
  {
    "Player": "Brandon Ingram",
    "Pos": "SF",
    "Age": 20,
    "Tm": "LAL",
    "G": 59,
    "MP": 33.5,
    "FG%": ".470",
    "TRB": 5.3,
    "AST": 3.9,
    "PS/G": 16.1
  },
  {
    "Player": "Kyrie Irving",
    "Pos": "PG",
    "Age": 25,
    "Tm": "BOS",
    "G": 60,
    "MP": 32.2,
    "FG%": ".491",
    "TRB": 3.8,
    "AST": 5.1,
    "PS/G": 24.4
  },
  {
    "Player": "Jonathan Isaac",
    "Pos": "PF",
    "Age": 20,
    "Tm": "ORL",
    "G": 27,
    "MP": 19.9,
    "FG%": ".379",
    "TRB": 3.7,
    "AST": 0.7,
    "PS/G": 5.4
  },
  {
    "Player": "Wesley Iwundu",
    "Pos": "SF",
    "Age": 23,
    "Tm": "ORL",
    "G": 62,
    "MP": 16.5,
    "FG%": ".427",
    "TRB": 2.2,
    "AST": 0.9,
    "PS/G": 3.7
  },
  {
    "Player": "Jarrett Jack",
    "Pos": "PG",
    "Age": 34,
    "Tm": "NYK",
    "G": 62,
    "MP": 25,
    "FG%": ".427",
    "TRB": 3.1,
    "AST": 5.6,
    "PS/G": 7.5
  },
  {
    "Player": "Aaron Jackson",
    "Pos": "PG",
    "Age": 31,
    "Tm": "HOU",
    "G": 1,
    "MP": 35,
    "FG%": ".333",
    "TRB": 3,
    "AST": 1,
    "PS/G": 8
  },
  {
    "Player": "Demetrius Jackson",
    "Pos": "PG",
    "Age": 23,
    "Tm": "TOT",
    "G": 15,
    "MP": 5.3,
    "FG%": ".389",
    "TRB": 0.8,
    "AST": 0.6,
    "PS/G": 1.1
  },
  {
    "Player": "Josh Jackson",
    "Pos": "SF",
    "Age": 20,
    "Tm": "PHO",
    "G": 77,
    "MP": 25.4,
    "FG%": ".417",
    "TRB": 4.6,
    "AST": 1.5,
    "PS/G": 13.1
  },
  {
    "Player": "Justin Jackson",
    "Pos": "SF",
    "Age": 22,
    "Tm": "SAC",
    "G": 68,
    "MP": 22.1,
    "FG%": ".442",
    "TRB": 2.8,
    "AST": 1.1,
    "PS/G": 6.7
  },
  {
    "Player": "Reggie Jackson",
    "Pos": "PG",
    "Age": 27,
    "Tm": "DET",
    "G": 45,
    "MP": 26.7,
    "FG%": ".426",
    "TRB": 2.8,
    "AST": 5.3,
    "PS/G": 14.6
  },
  {
    "Player": "LeBron James",
    "Pos": "PF",
    "Age": 33,
    "Tm": "CLE",
    "G": 82,
    "MP": 36.9,
    "FG%": ".542",
    "TRB": 8.6,
    "AST": 9.1,
    "PS/G": 27.5
  },
  {
    "Player": "Mike James",
    "Pos": "PG",
    "Age": 27,
    "Tm": "TOT",
    "G": 36,
    "MP": 19.1,
    "FG%": ".383",
    "TRB": 2.5,
    "AST": 3.5,
    "PS/G": 9.3
  },
  {
    "Player": "Al Jefferson",
    "Pos": "C",
    "Age": 33,
    "Tm": "IND",
    "G": 36,
    "MP": 13.4,
    "FG%": ".534",
    "TRB": 4,
    "AST": 0.8,
    "PS/G": 7
  },
  {
    "Player": "Richard Jefferson",
    "Pos": "SF",
    "Age": 37,
    "Tm": "DEN",
    "G": 20,
    "MP": 8.2,
    "FG%": ".444",
    "TRB": 0.9,
    "AST": 0.8,
    "PS/G": 1.5
  },
  {
    "Player": "Brandon Jennings",
    "Pos": "PG",
    "Age": 28,
    "Tm": "MIL",
    "G": 14,
    "MP": 14.6,
    "FG%": ".375",
    "TRB": 2.2,
    "AST": 3.1,
    "PS/G": 5.2
  },
  {
    "Player": "Jonas Jerebko",
    "Pos": "PF",
    "Age": 30,
    "Tm": "UTA",
    "G": 74,
    "MP": 15.3,
    "FG%": ".466",
    "TRB": 3.3,
    "AST": 0.6,
    "PS/G": 5.8
  },
  {
    "Player": "Amir Johnson",
    "Pos": "C",
    "Age": 30,
    "Tm": "PHI",
    "G": 74,
    "MP": 15.8,
    "FG%": ".538",
    "TRB": 4.5,
    "AST": 1.6,
    "PS/G": 4.6
  },
  {
    "Player": "Brice Johnson",
    "Pos": "PF",
    "Age": 23,
    "Tm": "TOT",
    "G": 18,
    "MP": 5.4,
    "FG%": ".476",
    "TRB": 1.7,
    "AST": 0.1,
    "PS/G": 2.4
  },
  {
    "Player": "Dakari Johnson",
    "Pos": "C",
    "Age": 22,
    "Tm": "OKC",
    "G": 31,
    "MP": 5.2,
    "FG%": ".564",
    "TRB": 1.1,
    "AST": 0.3,
    "PS/G": 1.8
  },
  {
    "Player": "James Johnson",
    "Pos": "PF",
    "Age": 30,
    "Tm": "MIA",
    "G": 73,
    "MP": 26.6,
    "FG%": ".503",
    "TRB": 4.9,
    "AST": 3.8,
    "PS/G": 10.8
  },
  {
    "Player": "Joe Johnson",
    "Pos": "SF",
    "Age": 36,
    "Tm": "TOT",
    "G": 55,
    "MP": 21.9,
    "FG%": ".406",
    "TRB": 3.1,
    "AST": 1.5,
    "PS/G": 6.8
  },
  {
    "Player": "Omari Johnson",
    "Pos": "PF",
    "Age": 28,
    "Tm": "MEM",
    "G": 4,
    "MP": 18.8,
    "FG%": ".429",
    "TRB": 2.8,
    "AST": 1.8,
    "PS/G": 5.5
  },
  {
    "Player": "Stanley Johnson",
    "Pos": "SF",
    "Age": 21,
    "Tm": "DET",
    "G": 69,
    "MP": 27.4,
    "FG%": ".375",
    "TRB": 3.7,
    "AST": 1.6,
    "PS/G": 8.7
  },
  {
    "Player": "Tyler Johnson",
    "Pos": "PG",
    "Age": 25,
    "Tm": "MIA",
    "G": 72,
    "MP": 28.5,
    "FG%": ".435",
    "TRB": 3.4,
    "AST": 2.3,
    "PS/G": 11.7
  },
  {
    "Player": "Wesley Johnson",
    "Pos": "SF",
    "Age": 30,
    "Tm": "LAC",
    "G": 74,
    "MP": 20.1,
    "FG%": ".408",
    "TRB": 2.9,
    "AST": 0.8,
    "PS/G": 5.4
  },
  {
    "Player": "Nikola Jokic",
    "Pos": "C",
    "Age": 22,
    "Tm": "DEN",
    "G": 75,
    "MP": 32.6,
    "FG%": ".499",
    "TRB": 10.7,
    "AST": 6.1,
    "PS/G": 18.5
  },
  {
    "Player": "Damian Jones",
    "Pos": "C",
    "Age": 22,
    "Tm": "GSW",
    "G": 15,
    "MP": 5.9,
    "FG%": ".500",
    "TRB": 0.9,
    "AST": 0.1,
    "PS/G": 1.7
  },
  {
    "Player": "Derrick Jones",
    "Pos": "SF",
    "Age": 20,
    "Tm": "TOT",
    "G": 20,
    "MP": 12.3,
    "FG%": ".396",
    "TRB": 1.9,
    "AST": 0.5,
    "PS/G": 3.1
  },
  {
    "Player": "Jalen Jones",
    "Pos": "SF",
    "Age": 24,
    "Tm": "TOT",
    "G": 16,
    "MP": 11.3,
    "FG%": ".382",
    "TRB": 2.4,
    "AST": 0.3,
    "PS/G": 4.6
  },
  {
    "Player": "Tyus Jones",
    "Pos": "PG",
    "Age": 21,
    "Tm": "MIN",
    "G": 82,
    "MP": 17.9,
    "FG%": ".457",
    "TRB": 1.6,
    "AST": 2.8,
    "PS/G": 5.1
  },
  {
    "Player": "DeAndre Jordan",
    "Pos": "C",
    "Age": 29,
    "Tm": "LAC",
    "G": 77,
    "MP": 31.5,
    "FG%": ".645",
    "TRB": 15.2,
    "AST": 1.5,
    "PS/G": 12
  },
  {
    "Player": "Cory Joseph",
    "Pos": "PG",
    "Age": 26,
    "Tm": "IND",
    "G": 82,
    "MP": 27,
    "FG%": ".424",
    "TRB": 3.2,
    "AST": 3.2,
    "PS/G": 7.9
  },
  {
    "Player": "Frank Kaminsky",
    "Pos": "PF",
    "Age": 24,
    "Tm": "CHO",
    "G": 79,
    "MP": 23.2,
    "FG%": ".429",
    "TRB": 3.6,
    "AST": 1.6,
    "PS/G": 11.1
  },
  {
    "Player": "Enes Kanter",
    "Pos": "C",
    "Age": 25,
    "Tm": "NYK",
    "G": 71,
    "MP": 25.8,
    "FG%": ".592",
    "TRB": 11,
    "AST": 1.5,
    "PS/G": 14.1
  },
  {
    "Player": "Luke Kennard",
    "Pos": "SG",
    "Age": 21,
    "Tm": "DET",
    "G": 73,
    "MP": 20,
    "FG%": ".443",
    "TRB": 2.4,
    "AST": 1.7,
    "PS/G": 7.6
  },
  {
    "Player": "Michael Kidd-Gilchrist",
    "Pos": "SF",
    "Age": 24,
    "Tm": "CHO",
    "G": 74,
    "MP": 25,
    "FG%": ".504",
    "TRB": 4.1,
    "AST": 1,
    "PS/G": 9.2
  },
  {
    "Player": "Sean Kilpatrick",
    "Pos": "SG",
    "Age": 28,
    "Tm": "TOT",
    "G": 52,
    "MP": 12.3,
    "FG%": ".374",
    "TRB": 1.7,
    "AST": 0.9,
    "PS/G": 6.3
  },
  {
    "Player": "Maxi Kleber",
    "Pos": "PF",
    "Age": 26,
    "Tm": "DAL",
    "G": 72,
    "MP": 16.8,
    "FG%": ".489",
    "TRB": 3.3,
    "AST": 0.7,
    "PS/G": 5.4
  },
  {
    "Player": "Furkan Korkmaz",
    "Pos": "SG",
    "Age": 20,
    "Tm": "PHI",
    "G": 14,
    "MP": 5.7,
    "FG%": ".286",
    "TRB": 0.8,
    "AST": 0.3,
    "PS/G": 1.6
  },
  {
    "Player": "Luke Kornet",
    "Pos": "PF",
    "Age": 22,
    "Tm": "NYK",
    "G": 20,
    "MP": 16.3,
    "FG%": ".392",
    "TRB": 3.2,
    "AST": 1.3,
    "PS/G": 6.7
  },
  {
    "Player": "Kyle Korver",
    "Pos": "SG",
    "Age": 36,
    "Tm": "CLE",
    "G": 73,
    "MP": 21.6,
    "FG%": ".459",
    "TRB": 2.3,
    "AST": 1.2,
    "PS/G": 9.2
  },
  {
    "Player": "Kosta Koufos",
    "Pos": "C",
    "Age": 28,
    "Tm": "SAC",
    "G": 71,
    "MP": 19.6,
    "FG%": ".571",
    "TRB": 6.6,
    "AST": 1.2,
    "PS/G": 6.7
  },
  {
    "Player": "Kyle Kuzma",
    "Pos": "PF",
    "Age": 22,
    "Tm": "LAL",
    "G": 77,
    "MP": 31.2,
    "FG%": ".450",
    "TRB": 6.3,
    "AST": 1.8,
    "PS/G": 16.1
  },
  {
    "Player": "Mindaugas Kuzminskas",
    "Pos": "SF",
    "Age": 28,
    "Tm": "NYK",
    "G": 1,
    "MP": 2,
    "FG%": ".000",
    "TRB": 0,
    "AST": 0,
    "PS/G": 0
  },
  {
    "Player": "Skal Labissiere",
    "Pos": "PF",
    "Age": 21,
    "Tm": "SAC",
    "G": 60,
    "MP": 20.7,
    "FG%": ".448",
    "TRB": 4.8,
    "AST": 1.2,
    "PS/G": 8.7
  },
  {
    "Player": "Jeremy Lamb",
    "Pos": "SG",
    "Age": 25,
    "Tm": "CHO",
    "G": 80,
    "MP": 24.6,
    "FG%": ".457",
    "TRB": 4.1,
    "AST": 2.3,
    "PS/G": 12.9
  },
  {
    "Player": "Shane Larkin",
    "Pos": "PG",
    "Age": 25,
    "Tm": "BOS",
    "G": 54,
    "MP": 14.4,
    "FG%": ".384",
    "TRB": 1.7,
    "AST": 1.8,
    "PS/G": 4.3
  },
  {
    "Player": "Joffrey Lauvergne",
    "Pos": "C",
    "Age": 26,
    "Tm": "SAS",
    "G": 55,
    "MP": 9.7,
    "FG%": ".516",
    "TRB": 3.1,
    "AST": 0.7,
    "PS/G": 4.1
  },
  {
    "Player": "Zach LaVine",
    "Pos": "SG",
    "Age": 22,
    "Tm": "CHI",
    "G": 24,
    "MP": 27.3,
    "FG%": ".383",
    "TRB": 3.9,
    "AST": 3,
    "PS/G": 16.7
  },
  {
    "Player": "Jake Layman",
    "Pos": "SF",
    "Age": 23,
    "Tm": "POR",
    "G": 35,
    "MP": 4.6,
    "FG%": ".298",
    "TRB": 0.5,
    "AST": 0.3,
    "PS/G": 1
  },
  {
    "Player": "T.J. Leaf",
    "Pos": "PF",
    "Age": 20,
    "Tm": "IND",
    "G": 53,
    "MP": 8.7,
    "FG%": ".471",
    "TRB": 1.5,
    "AST": 0.2,
    "PS/G": 2.9
  },
  {
    "Player": "Courtney Lee",
    "Pos": "SG",
    "Age": 32,
    "Tm": "NYK",
    "G": 76,
    "MP": 30.4,
    "FG%": ".454",
    "TRB": 2.9,
    "AST": 2.4,
    "PS/G": 12
  },
  {
    "Player": "Damion Lee",
    "Pos": "SG",
    "Age": 25,
    "Tm": "ATL",
    "G": 15,
    "MP": 26.9,
    "FG%": ".408",
    "TRB": 4.7,
    "AST": 1.9,
    "PS/G": 10.7
  },
  {
    "Player": "Walt Lemon, Jr.",
    "Pos": "PG",
    "Age": 25,
    "Tm": "NOP",
    "G": 5,
    "MP": 7,
    "FG%": ".438",
    "TRB": 0.4,
    "AST": 1,
    "PS/G": 3.4
  },
  {
    "Player": "Alex Len",
    "Pos": "C",
    "Age": 24,
    "Tm": "PHO",
    "G": 69,
    "MP": 20.2,
    "FG%": ".566",
    "TRB": 7.5,
    "AST": 1.2,
    "PS/G": 8.5
  },
  {
    "Player": "Kawhi Leonard",
    "Pos": "SF",
    "Age": 26,
    "Tm": "SAS",
    "G": 9,
    "MP": 23.3,
    "FG%": ".468",
    "TRB": 4.7,
    "AST": 2.3,
    "PS/G": 16.2
  },
  {
    "Player": "Meyers Leonard",
    "Pos": "C",
    "Age": 25,
    "Tm": "POR",
    "G": 33,
    "MP": 7.7,
    "FG%": ".590",
    "TRB": 2.1,
    "AST": 0.5,
    "PS/G": 3.4
  },
  {
    "Player": "Jon Leuer",
    "Pos": "PF",
    "Age": 28,
    "Tm": "DET",
    "G": 8,
    "MP": 17,
    "FG%": ".417",
    "TRB": 4,
    "AST": 0.6,
    "PS/G": 5.4
  },
  {
    "Player": "Caris LeVert",
    "Pos": "SF",
    "Age": 23,
    "Tm": "BRK",
    "G": 71,
    "MP": 26.3,
    "FG%": ".435",
    "TRB": 3.7,
    "AST": 4.2,
    "PS/G": 12.1
  },
  {
    "Player": "DeAndre Liggins",
    "Pos": "SG",
    "Age": 29,
    "Tm": "TOT",
    "G": 58,
    "MP": 12.5,
    "FG%": ".377",
    "TRB": 1.3,
    "AST": 0.8,
    "PS/G": 1.7
  },
  {
    "Player": "Damian Lillard",
    "Pos": "PG",
    "Age": 27,
    "Tm": "POR",
    "G": 73,
    "MP": 36.6,
    "FG%": ".439",
    "TRB": 4.5,
    "AST": 6.6,
    "PS/G": 26.9
  },
  {
    "Player": "Jeremy Lin",
    "Pos": "PG",
    "Age": 29,
    "Tm": "BRK",
    "G": 1,
    "MP": 25,
    "FG%": ".417",
    "TRB": 0,
    "AST": 4,
    "PS/G": 18
  },
  {
    "Player": "Shaun Livingston",
    "Pos": "PG",
    "Age": 32,
    "Tm": "GSW",
    "G": 71,
    "MP": 15.9,
    "FG%": ".501",
    "TRB": 1.8,
    "AST": 2,
    "PS/G": 5.5
  },
  {
    "Player": "Kevon Looney",
    "Pos": "C",
    "Age": 21,
    "Tm": "GSW",
    "G": 66,
    "MP": 13.8,
    "FG%": ".580",
    "TRB": 3.3,
    "AST": 0.6,
    "PS/G": 4
  },
  {
    "Player": "Brook Lopez",
    "Pos": "C",
    "Age": 29,
    "Tm": "LAL",
    "G": 74,
    "MP": 23.4,
    "FG%": ".465",
    "TRB": 4,
    "AST": 1.7,
    "PS/G": 13
  },
  {
    "Player": "Robin Lopez",
    "Pos": "C",
    "Age": 29,
    "Tm": "CHI",
    "G": 64,
    "MP": 26.4,
    "FG%": ".530",
    "TRB": 4.5,
    "AST": 1.9,
    "PS/G": 11.8
  },
  {
    "Player": "Kevin Love",
    "Pos": "C",
    "Age": 29,
    "Tm": "CLE",
    "G": 59,
    "MP": 28,
    "FG%": ".458",
    "TRB": 9.3,
    "AST": 1.7,
    "PS/G": 17.6
  },
  {
    "Player": "Kyle Lowry",
    "Pos": "PG",
    "Age": 31,
    "Tm": "TOR",
    "G": 78,
    "MP": 32.2,
    "FG%": ".427",
    "TRB": 5.6,
    "AST": 6.9,
    "PS/G": 16.2
  },
  {
    "Player": "Timothe Luwawu-Cabarrot",
    "Pos": "SF",
    "Age": 22,
    "Tm": "PHI",
    "G": 52,
    "MP": 15.5,
    "FG%": ".375",
    "TRB": 1.4,
    "AST": 1,
    "PS/G": 5.8
  },
  {
    "Player": "Tyler Lydon",
    "Pos": "PF",
    "Age": 21,
    "Tm": "DEN",
    "G": 1,
    "MP": 2,
    "FG%": "",
    "TRB": 0,
    "AST": 0,
    "PS/G": 0
  },
  {
    "Player": "Trey Lyles",
    "Pos": "PF",
    "Age": 22,
    "Tm": "DEN",
    "G": 73,
    "MP": 19.1,
    "FG%": ".491",
    "TRB": 4.8,
    "AST": 1.2,
    "PS/G": 9.9
  },
  {
    "Player": "Shelvin Mack",
    "Pos": "PG",
    "Age": 27,
    "Tm": "ORL",
    "G": 69,
    "MP": 19.8,
    "FG%": ".430",
    "TRB": 2.4,
    "AST": 3.9,
    "PS/G": 6.9
  },
  {
    "Player": "Josh Magette",
    "Pos": "PG",
    "Age": 28,
    "Tm": "ATL",
    "G": 18,
    "MP": 12,
    "FG%": ".326",
    "TRB": 1.1,
    "AST": 3.2,
    "PS/G": 2.6
  },
  {
    "Player": "Ian Mahinmi",
    "Pos": "C",
    "Age": 31,
    "Tm": "WAS",
    "G": 77,
    "MP": 14.9,
    "FG%": ".556",
    "TRB": 4.1,
    "AST": 0.7,
    "PS/G": 4.8
  },
  {
    "Player": "Thon Maker",
    "Pos": "C",
    "Age": 20,
    "Tm": "MIL",
    "G": 74,
    "MP": 16.7,
    "FG%": ".411",
    "TRB": 3,
    "AST": 0.6,
    "PS/G": 4.8
  },
  {
    "Player": "Boban Marjanovic",
    "Pos": "C",
    "Age": 29,
    "Tm": "TOT",
    "G": 39,
    "MP": 8.6,
    "FG%": ".534",
    "TRB": 3.7,
    "AST": 0.6,
    "PS/G": 6
  },
  {
    "Player": "Lauri Markkanen",
    "Pos": "PF",
    "Age": 20,
    "Tm": "CHI",
    "G": 68,
    "MP": 29.7,
    "FG%": ".434",
    "TRB": 7.5,
    "AST": 1.2,
    "PS/G": 15.2
  },
  {
    "Player": "Jarell Martin",
    "Pos": "PF",
    "Age": 23,
    "Tm": "MEM",
    "G": 73,
    "MP": 22.8,
    "FG%": ".446",
    "TRB": 4.4,
    "AST": 1,
    "PS/G": 7.7
  },
  {
    "Player": "Frank Mason",
    "Pos": "PG",
    "Age": 23,
    "Tm": "SAC",
    "G": 52,
    "MP": 18.9,
    "FG%": ".379",
    "TRB": 2.5,
    "AST": 2.8,
    "PS/G": 7.9
  },
  {
    "Player": "Mangok Mathiang",
    "Pos": "C",
    "Age": 25,
    "Tm": "CHO",
    "G": 4,
    "MP": 5,
    "FG%": ".571",
    "TRB": 2.5,
    "AST": 0,
    "PS/G": 2
  },
  {
    "Player": "Wesley Matthews",
    "Pos": "SF",
    "Age": 31,
    "Tm": "DAL",
    "G": 63,
    "MP": 33.8,
    "FG%": ".406",
    "TRB": 3.1,
    "AST": 2.7,
    "PS/G": 12.7
  },
  {
    "Player": "Luc Mbah a Moute",
    "Pos": "PF",
    "Age": 31,
    "Tm": "HOU",
    "G": 61,
    "MP": 25.6,
    "FG%": ".481",
    "TRB": 3,
    "AST": 0.9,
    "PS/G": 7.5
  },
  {
    "Player": "James Michael McAdoo",
    "Pos": "PF",
    "Age": 25,
    "Tm": "PHI",
    "G": 3,
    "MP": 6,
    "FG%": ".286",
    "TRB": 0.7,
    "AST": 0,
    "PS/G": 2.7
  },
  {
    "Player": "Patrick McCaw",
    "Pos": "SG",
    "Age": 22,
    "Tm": "GSW",
    "G": 57,
    "MP": 16.9,
    "FG%": ".409",
    "TRB": 1.4,
    "AST": 1.4,
    "PS/G": 4
  },
  {
    "Player": "CJ McCollum",
    "Pos": "SG",
    "Age": 26,
    "Tm": "POR",
    "G": 81,
    "MP": 36.1,
    "FG%": ".443",
    "TRB": 4,
    "AST": 3.4,
    "PS/G": 21.4
  },
  {
    "Player": "T.J. McConnell",
    "Pos": "PG",
    "Age": 25,
    "Tm": "PHI",
    "G": 76,
    "MP": 22.4,
    "FG%": ".499",
    "TRB": 3,
    "AST": 4,
    "PS/G": 6.3
  },
  {
    "Player": "Erik McCree",
    "Pos": "SF",
    "Age": 24,
    "Tm": "UTA",
    "G": 4,
    "MP": 2,
    "FG%": ".000",
    "TRB": 0.3,
    "AST": 0,
    "PS/G": 0
  },
  {
    "Player": "Chris McCullough",
    "Pos": "PF",
    "Age": 22,
    "Tm": "WAS",
    "G": 19,
    "MP": 4.7,
    "FG%": ".429",
    "TRB": 1.3,
    "AST": 0.2,
    "PS/G": 2.4
  },
  {
    "Player": "Doug McDermott",
    "Pos": "SF",
    "Age": 26,
    "Tm": "TOT",
    "G": 81,
    "MP": 21.8,
    "FG%": ".467",
    "TRB": 2.5,
    "AST": 1,
    "PS/G": 7.8
  },
  {
    "Player": "JaVale McGee",
    "Pos": "C",
    "Age": 30,
    "Tm": "GSW",
    "G": 65,
    "MP": 9.5,
    "FG%": ".621",
    "TRB": 2.6,
    "AST": 0.5,
    "PS/G": 4.8
  },
  {
    "Player": "Rodney McGruder",
    "Pos": "SG",
    "Age": 26,
    "Tm": "MIA",
    "G": 18,
    "MP": 16.6,
    "FG%": ".493",
    "TRB": 1.8,
    "AST": 0.9,
    "PS/G": 5.1
  },
  {
    "Player": "Trey McKinney-Jones",
    "Pos": "SG",
    "Age": 27,
    "Tm": "IND",
    "G": 1,
    "MP": 1,
    "FG%": "",
    "TRB": 0,
    "AST": 0,
    "PS/G": 0
  },
  {
    "Player": "Alfonzo McKinnie",
    "Pos": "SF",
    "Age": 25,
    "Tm": "TOR",
    "G": 14,
    "MP": 3.8,
    "FG%": ".533",
    "TRB": 0.5,
    "AST": 0.1,
    "PS/G": 1.5
  },
  {
    "Player": "Ben McLemore",
    "Pos": "SG",
    "Age": 24,
    "Tm": "MEM",
    "G": 56,
    "MP": 19.5,
    "FG%": ".421",
    "TRB": 2.5,
    "AST": 0.9,
    "PS/G": 7.5
  },
  {
    "Player": "Josh McRoberts",
    "Pos": "PF",
    "Age": 30,
    "Tm": "DAL",
    "G": 2,
    "MP": 3,
    "FG%": ".000",
    "TRB": 0,
    "AST": 0,
    "PS/G": 0
  },
  {
    "Player": "Jodie Meeks",
    "Pos": "SG",
    "Age": 30,
    "Tm": "WAS",
    "G": 77,
    "MP": 14.5,
    "FG%": ".399",
    "TRB": 1.6,
    "AST": 0.9,
    "PS/G": 6.3
  },
  {
    "Player": "Salah Mejri",
    "Pos": "C",
    "Age": 31,
    "Tm": "DAL",
    "G": 61,
    "MP": 12,
    "FG%": ".642",
    "TRB": 4,
    "AST": 0.6,
    "PS/G": 3.5
  },
  {
    "Player": "Jordan Mickey",
    "Pos": "PF",
    "Age": 23,
    "Tm": "MIA",
    "G": 23,
    "MP": 12.3,
    "FG%": ".476",
    "TRB": 3.6,
    "AST": 0.4,
    "PS/G": 4
  },
  {
    "Player": "Khris Middleton",
    "Pos": "SF",
    "Age": 26,
    "Tm": "MIL",
    "G": 82,
    "MP": 36.4,
    "FG%": ".466",
    "TRB": 5.2,
    "AST": 4,
    "PS/G": 20.1
  },
  {
    "Player": "C.J. Miles",
    "Pos": "SF",
    "Age": 30,
    "Tm": "TOR",
    "G": 70,
    "MP": 19.1,
    "FG%": ".379",
    "TRB": 2.2,
    "AST": 0.8,
    "PS/G": 10
  },
  {
    "Player": "Darius Miller",
    "Pos": "SF",
    "Age": 27,
    "Tm": "NOP",
    "G": 82,
    "MP": 23.7,
    "FG%": ".444",
    "TRB": 2,
    "AST": 1.4,
    "PS/G": 7.8
  },
  {
    "Player": "Malcolm Miller",
    "Pos": "SF",
    "Age": 24,
    "Tm": "TOR",
    "G": 15,
    "MP": 8.4,
    "FG%": ".464",
    "TRB": 1,
    "AST": 0.2,
    "PS/G": 2.5
  },
  {
    "Player": "Patty Mills",
    "Pos": "PG",
    "Age": 29,
    "Tm": "SAS",
    "G": 82,
    "MP": 25.7,
    "FG%": ".411",
    "TRB": 1.9,
    "AST": 2.8,
    "PS/G": 10
  },
  {
    "Player": "Paul Millsap",
    "Pos": "PF",
    "Age": 32,
    "Tm": "DEN",
    "G": 38,
    "MP": 30.1,
    "FG%": ".464",
    "TRB": 6.4,
    "AST": 2.7,
    "PS/G": 14.6
  },
  {
    "Player": "Nikola Mirotic",
    "Pos": "PF",
    "Age": 26,
    "Tm": "TOT",
    "G": 55,
    "MP": 27.2,
    "FG%": ".447",
    "TRB": 7.4,
    "AST": 1.5,
    "PS/G": 15.6
  },
  {
    "Player": "Donovan Mitchell",
    "Pos": "SG",
    "Age": 21,
    "Tm": "UTA",
    "G": 79,
    "MP": 33.4,
    "FG%": ".437",
    "TRB": 3.7,
    "AST": 3.7,
    "PS/G": 20.5
  },
  {
    "Player": "Naz Mitrou-Long",
    "Pos": "SG",
    "Age": 24,
    "Tm": "UTA",
    "G": 1,
    "MP": 1,
    "FG%": 1,
    "TRB": 0,
    "AST": 0,
    "PS/G": 3
  },
  {
    "Player": "Malik Monk",
    "Pos": "SG",
    "Age": 19,
    "Tm": "CHO",
    "G": 63,
    "MP": 13.6,
    "FG%": ".360",
    "TRB": 1,
    "AST": 1.4,
    "PS/G": 6.7
  },
  {
    "Player": "Greg Monroe",
    "Pos": "C",
    "Age": 27,
    "Tm": "TOT",
    "G": 51,
    "MP": 20.4,
    "FG%": ".565",
    "TRB": 6.9,
    "AST": 2.2,
    "PS/G": 10.3
  },
  {
    "Player": "Luis Montero",
    "Pos": "SG",
    "Age": 24,
    "Tm": "DET",
    "G": 2,
    "MP": 4,
    "FG%": ".000",
    "TRB": 1,
    "AST": 0,
    "PS/G": 0
  },
  {
    "Player": "Ben Moore",
    "Pos": "PF",
    "Age": 22,
    "Tm": "IND",
    "G": 2,
    "MP": 4.5,
    "FG%": "",
    "TRB": 0.5,
    "AST": 0.5,
    "PS/G": 0
  },
  {
    "Player": "E'Twaun Moore",
    "Pos": "SG",
    "Age": 28,
    "Tm": "NOP",
    "G": 82,
    "MP": 31.5,
    "FG%": ".508",
    "TRB": 2.9,
    "AST": 2.3,
    "PS/G": 12.5
  },
  {
    "Player": "Eric Moreland",
    "Pos": "PF",
    "Age": 26,
    "Tm": "DET",
    "G": 67,
    "MP": 12,
    "FG%": ".541",
    "TRB": 4.1,
    "AST": 1.2,
    "PS/G": 2.1
  },
  {
    "Player": "Jaylen Morris",
    "Pos": "SG",
    "Age": 22,
    "Tm": "ATL",
    "G": 6,
    "MP": 16.3,
    "FG%": ".406",
    "TRB": 2.7,
    "AST": 1.2,
    "PS/G": 4.7
  },
  {
    "Player": "Marcus Morris",
    "Pos": "PF",
    "Age": 28,
    "Tm": "BOS",
    "G": 54,
    "MP": 26.8,
    "FG%": ".429",
    "TRB": 5.4,
    "AST": 1.3,
    "PS/G": 13.6
  },
  {
    "Player": "Markieff Morris",
    "Pos": "PF",
    "Age": 28,
    "Tm": "WAS",
    "G": 73,
    "MP": 27,
    "FG%": ".480",
    "TRB": 5.6,
    "AST": 1.9,
    "PS/G": 11.5
  },
  {
    "Player": "Monte Morris",
    "Pos": "PG",
    "Age": 22,
    "Tm": "DEN",
    "G": 3,
    "MP": 8.3,
    "FG%": ".667",
    "TRB": 0.7,
    "AST": 2.3,
    "PS/G": 3.3
  },
  {
    "Player": "Johnathan Motley",
    "Pos": "PF",
    "Age": 22,
    "Tm": "DAL",
    "G": 11,
    "MP": 16,
    "FG%": ".533",
    "TRB": 4.5,
    "AST": 0.6,
    "PS/G": 8.7
  },
  {
    "Player": "Timofey Mozgov",
    "Pos": "C",
    "Age": 31,
    "Tm": "BRK",
    "G": 31,
    "MP": 11.6,
    "FG%": ".559",
    "TRB": 3.2,
    "AST": 0.4,
    "PS/G": 4.2
  },
  {
    "Player": "Emmanuel Mudiay",
    "Pos": "PG",
    "Age": 21,
    "Tm": "TOT",
    "G": 64,
    "MP": 19.5,
    "FG%": ".388",
    "TRB": 2.4,
    "AST": 3.2,
    "PS/G": 8.6
  },
  {
    "Player": "Shabazz Muhammad",
    "Pos": "SF-SG",
    "Age": 25,
    "Tm": "TOT",
    "G": 43,
    "MP": 9.7,
    "FG%": ".447",
    "TRB": 1.8,
    "AST": 0.3,
    "PS/G": 5
  },
  {
    "Player": "Xavier Munford",
    "Pos": "SG",
    "Age": 25,
    "Tm": "MIL",
    "G": 6,
    "MP": 3.5,
    "FG%": ".167",
    "TRB": 0.2,
    "AST": 0.7,
    "PS/G": 0.5
  },
  {
    "Player": "Dejounte Murray",
    "Pos": "PG",
    "Age": 21,
    "Tm": "SAS",
    "G": 81,
    "MP": 21.5,
    "FG%": ".443",
    "TRB": 5.7,
    "AST": 2.9,
    "PS/G": 8.1
  },
  {
    "Player": "Jamal Murray",
    "Pos": "PG",
    "Age": 20,
    "Tm": "DEN",
    "G": 81,
    "MP": 31.7,
    "FG%": ".451",
    "TRB": 3.7,
    "AST": 3.4,
    "PS/G": 16.7
  },
  {
    "Player": "Mike Muscala",
    "Pos": "C",
    "Age": 26,
    "Tm": "ATL",
    "G": 53,
    "MP": 20,
    "FG%": ".458",
    "TRB": 4.3,
    "AST": 1,
    "PS/G": 7.6
  },
  {
    "Player": "Abdel Nader",
    "Pos": "SF",
    "Age": 24,
    "Tm": "BOS",
    "G": 48,
    "MP": 10.9,
    "FG%": ".336",
    "TRB": 1.5,
    "AST": 0.5,
    "PS/G": 3
  },
  {
    "Player": "Larry Nance",
    "Pos": "C",
    "Age": 25,
    "Tm": "TOT",
    "G": 66,
    "MP": 21.5,
    "FG%": ".581",
    "TRB": 6.8,
    "AST": 1.2,
    "PS/G": 8.7
  },
  {
    "Player": "Shabazz Napier",
    "Pos": "PG",
    "Age": 26,
    "Tm": "POR",
    "G": 74,
    "MP": 20.7,
    "FG%": ".420",
    "TRB": 2.3,
    "AST": 2,
    "PS/G": 8.7
  },
  {
    "Player": "Jameer Nelson",
    "Pos": "PG",
    "Age": 35,
    "Tm": "TOT",
    "G": 50,
    "MP": 20.3,
    "FG%": ".389",
    "TRB": 2.1,
    "AST": 3.6,
    "PS/G": 4.9
  },
  {
    "Player": "Raul Neto",
    "Pos": "PG",
    "Age": 25,
    "Tm": "UTA",
    "G": 41,
    "MP": 12.1,
    "FG%": ".457",
    "TRB": 1.2,
    "AST": 1.8,
    "PS/G": 4.5
  },
  {
    "Player": "Georges Niang",
    "Pos": "PF",
    "Age": 24,
    "Tm": "UTA",
    "G": 9,
    "MP": 3.6,
    "FG%": ".364",
    "TRB": 1,
    "AST": 0.3,
    "PS/G": 1
  },
  {
    "Player": "Joakim Noah",
    "Pos": "C",
    "Age": 32,
    "Tm": "NYK",
    "G": 7,
    "MP": 5.7,
    "FG%": ".500",
    "TRB": 2,
    "AST": 0.6,
    "PS/G": 1.7
  },
  {
    "Player": "Nerlens Noel",
    "Pos": "C",
    "Age": 23,
    "Tm": "DAL",
    "G": 30,
    "MP": 15.7,
    "FG%": ".524",
    "TRB": 5.6,
    "AST": 0.7,
    "PS/G": 4.4
  },
  {
    "Player": "Lucas Nogueira",
    "Pos": "C",
    "Age": 25,
    "Tm": "TOR",
    "G": 49,
    "MP": 8.5,
    "FG%": ".613",
    "TRB": 1.8,
    "AST": 0.4,
    "PS/G": 2.5
  },
  {
    "Player": "Dirk Nowitzki",
    "Pos": "C",
    "Age": 39,
    "Tm": "DAL",
    "G": 77,
    "MP": 24.7,
    "FG%": ".456",
    "TRB": 5.7,
    "AST": 1.6,
    "PS/G": 12
  },
  {
    "Player": "Frank Ntilikina",
    "Pos": "PG",
    "Age": 19,
    "Tm": "NYK",
    "G": 78,
    "MP": 21.9,
    "FG%": ".364",
    "TRB": 2.3,
    "AST": 3.2,
    "PS/G": 5.9
  },
  {
    "Player": "Jusuf Nurkic",
    "Pos": "C",
    "Age": 23,
    "Tm": "POR",
    "G": 79,
    "MP": 26.4,
    "FG%": ".505",
    "TRB": 9,
    "AST": 1.8,
    "PS/G": 14.3
  },
  {
    "Player": "David Nwaba",
    "Pos": "SG",
    "Age": 25,
    "Tm": "CHI",
    "G": 70,
    "MP": 23.5,
    "FG%": ".478",
    "TRB": 4.7,
    "AST": 1.5,
    "PS/G": 7.9
  },
  {
    "Player": "Johnny O'Bryant",
    "Pos": "PF",
    "Age": 24,
    "Tm": "CHO",
    "G": 36,
    "MP": 10.5,
    "FG%": ".398",
    "TRB": 2.6,
    "AST": 0.4,
    "PS/G": 4.8
  },
  {
    "Player": "Royce O'Neale",
    "Pos": "SF",
    "Age": 24,
    "Tm": "UTA",
    "G": 69,
    "MP": 16.7,
    "FG%": ".423",
    "TRB": 3.4,
    "AST": 1.4,
    "PS/G": 5
  },
  {
    "Player": "Kyle O'Quinn",
    "Pos": "C",
    "Age": 27,
    "Tm": "NYK",
    "G": 77,
    "MP": 18,
    "FG%": ".582",
    "TRB": 6.1,
    "AST": 2.1,
    "PS/G": 7.1
  },
  {
    "Player": "Semi Ojeleye",
    "Pos": "PF",
    "Age": 23,
    "Tm": "BOS",
    "G": 73,
    "MP": 15.8,
    "FG%": ".346",
    "TRB": 2.2,
    "AST": 0.3,
    "PS/G": 2.7
  },
  {
    "Player": "Emeka Okafor",
    "Pos": "C",
    "Age": 35,
    "Tm": "NOP",
    "G": 26,
    "MP": 13.6,
    "FG%": ".505",
    "TRB": 4.6,
    "AST": 0.3,
    "PS/G": 4.4
  },
  {
    "Player": "Jahlil Okafor",
    "Pos": "C",
    "Age": 22,
    "Tm": "TOT",
    "G": 28,
    "MP": 12.6,
    "FG%": ".558",
    "TRB": 3,
    "AST": 0.4,
    "PS/G": 6.3
  },
  {
    "Player": "Victor Oladipo",
    "Pos": "SG",
    "Age": 25,
    "Tm": "IND",
    "G": 75,
    "MP": 34,
    "FG%": ".477",
    "TRB": 5.2,
    "AST": 4.3,
    "PS/G": 23.1
  },
  {
    "Player": "Kelly Olynyk",
    "Pos": "PF",
    "Age": 26,
    "Tm": "MIA",
    "G": 76,
    "MP": 23.4,
    "FG%": ".497",
    "TRB": 5.7,
    "AST": 2.7,
    "PS/G": 11.5
  },
  {
    "Player": "Chinanu Onuaku",
    "Pos": "C",
    "Age": 21,
    "Tm": "HOU",
    "G": 1,
    "MP": 22,
    "FG%": ".400",
    "TRB": 4,
    "AST": 1,
    "PS/G": 4
  },
  {
    "Player": "Cedi Osman",
    "Pos": "SF",
    "Age": 22,
    "Tm": "CLE",
    "G": 61,
    "MP": 11,
    "FG%": ".484",
    "TRB": 2,
    "AST": 0.7,
    "PS/G": 3.9
  },
  {
    "Player": "Kelly Oubre",
    "Pos": "SF",
    "Age": 22,
    "Tm": "WAS",
    "G": 81,
    "MP": 27.5,
    "FG%": ".403",
    "TRB": 4.5,
    "AST": 1.2,
    "PS/G": 11.8
  },
  {
    "Player": "Zaza Pachulia",
    "Pos": "C",
    "Age": 33,
    "Tm": "GSW",
    "G": 69,
    "MP": 14.1,
    "FG%": ".564",
    "TRB": 4.7,
    "AST": 1.6,
    "PS/G": 5.4
  },
  {
    "Player": "Marcus Paige",
    "Pos": "PG",
    "Age": 24,
    "Tm": "CHO",
    "G": 5,
    "MP": 5.6,
    "FG%": ".286",
    "TRB": 0.8,
    "AST": 0.6,
    "PS/G": 2.4
  },
  {
    "Player": "Georgios Papagiannis",
    "Pos": "C",
    "Age": 20,
    "Tm": "TOT",
    "G": 17,
    "MP": 7.2,
    "FG%": ".429",
    "TRB": 2.2,
    "AST": 0.5,
    "PS/G": 2.1
  },
  {
    "Player": "Jabari Parker",
    "Pos": "PF",
    "Age": 22,
    "Tm": "MIL",
    "G": 31,
    "MP": 24,
    "FG%": ".482",
    "TRB": 4.9,
    "AST": 1.9,
    "PS/G": 12.6
  },
  {
    "Player": "Tony Parker",
    "Pos": "PG",
    "Age": 35,
    "Tm": "SAS",
    "G": 55,
    "MP": 19.5,
    "FG%": ".459",
    "TRB": 1.7,
    "AST": 3.5,
    "PS/G": 7.7
  },
  {
    "Player": "Chandler Parsons",
    "Pos": "SF",
    "Age": 29,
    "Tm": "MEM",
    "G": 36,
    "MP": 19.2,
    "FG%": ".462",
    "TRB": 2.5,
    "AST": 1.9,
    "PS/G": 7.9
  },
  {
    "Player": "Patrick Patterson",
    "Pos": "PF",
    "Age": 28,
    "Tm": "OKC",
    "G": 82,
    "MP": 15.5,
    "FG%": ".398",
    "TRB": 2.4,
    "AST": 0.7,
    "PS/G": 3.9
  },
  {
    "Player": "Justin Patton",
    "Pos": "C",
    "Age": 20,
    "Tm": "MIN",
    "G": 1,
    "MP": 4,
    "FG%": ".500",
    "TRB": 0,
    "AST": 0,
    "PS/G": 2
  },
  {
    "Player": "Brandon Paul",
    "Pos": "SG",
    "Age": 26,
    "Tm": "SAS",
    "G": 64,
    "MP": 9,
    "FG%": ".433",
    "TRB": 1.1,
    "AST": 0.6,
    "PS/G": 2.3
  },
  {
    "Player": "Chris Paul",
    "Pos": "PG",
    "Age": 32,
    "Tm": "HOU",
    "G": 58,
    "MP": 31.8,
    "FG%": ".460",
    "TRB": 5.4,
    "AST": 7.9,
    "PS/G": 18.6
  },
  {
    "Player": "Adreian Payne",
    "Pos": "PF",
    "Age": 26,
    "Tm": "ORL",
    "G": 5,
    "MP": 8.6,
    "FG%": ".700",
    "TRB": 1.8,
    "AST": 0,
    "PS/G": 4.2
  },
  {
    "Player": "Cameron Payne",
    "Pos": "PG",
    "Age": 23,
    "Tm": "CHI",
    "G": 25,
    "MP": 23.3,
    "FG%": ".405",
    "TRB": 2.8,
    "AST": 4.5,
    "PS/G": 8.8
  },
  {
    "Player": "Elfrid Payton",
    "Pos": "PG",
    "Age": 23,
    "Tm": "TOT",
    "G": 63,
    "MP": 28.7,
    "FG%": ".493",
    "TRB": 4.3,
    "AST": 6.2,
    "PS/G": 12.7
  },
  {
    "Player": "Gary Payton",
    "Pos": "PG",
    "Age": 25,
    "Tm": "TOT",
    "G": 23,
    "MP": 9.6,
    "FG%": ".405",
    "TRB": 1.9,
    "AST": 0.9,
    "PS/G": 3
  },
  {
    "Player": "Kendrick Perkins",
    "Pos": "C",
    "Age": 33,
    "Tm": "CLE",
    "G": 1,
    "MP": 15,
    "FG%": ".500",
    "TRB": 1,
    "AST": 2,
    "PS/G": 3
  },
  {
    "Player": "London Perrantes",
    "Pos": "PG",
    "Age": 23,
    "Tm": "CLE",
    "G": 14,
    "MP": 4.7,
    "FG%": ".154",
    "TRB": 0.3,
    "AST": 0.4,
    "PS/G": 0.5
  },
  {
    "Player": "Alec Peters",
    "Pos": "PF",
    "Age": 22,
    "Tm": "PHO",
    "G": 20,
    "MP": 11.3,
    "FG%": ".378",
    "TRB": 1.9,
    "AST": 0.6,
    "PS/G": 4.1
  },
  {
    "Player": "Marshall Plumlee",
    "Pos": "C",
    "Age": 25,
    "Tm": "MIL",
    "G": 8,
    "MP": 6.5,
    "FG%": ".333",
    "TRB": 2.1,
    "AST": 0.3,
    "PS/G": 1.8
  },
  {
    "Player": "Mason Plumlee",
    "Pos": "C",
    "Age": 27,
    "Tm": "DEN",
    "G": 74,
    "MP": 19.4,
    "FG%": ".601",
    "TRB": 5.4,
    "AST": 1.9,
    "PS/G": 7.1
  },
  {
    "Player": "Miles Plumlee",
    "Pos": "C",
    "Age": 29,
    "Tm": "ATL",
    "G": 55,
    "MP": 16.7,
    "FG%": ".583",
    "TRB": 4.1,
    "AST": 0.8,
    "PS/G": 4.3
  },
  {
    "Player": "Jakob Poeltl",
    "Pos": "C",
    "Age": 22,
    "Tm": "TOR",
    "G": 82,
    "MP": 18.6,
    "FG%": ".659",
    "TRB": 4.8,
    "AST": 0.7,
    "PS/G": 6.9
  },
  {
    "Player": "Quincy Pondexter",
    "Pos": "SF",
    "Age": 29,
    "Tm": "CHI",
    "G": 23,
    "MP": 8.5,
    "FG%": ".286",
    "TRB": 1.2,
    "AST": 0.4,
    "PS/G": 2
  },
  {
    "Player": "Otto Porter",
    "Pos": "SF",
    "Age": 24,
    "Tm": "WAS",
    "G": 77,
    "MP": 31.6,
    "FG%": ".503",
    "TRB": 6.4,
    "AST": 2,
    "PS/G": 14.7
  },
  {
    "Player": "Bobby Portis",
    "Pos": "PF",
    "Age": 22,
    "Tm": "CHI",
    "G": 73,
    "MP": 22.5,
    "FG%": ".471",
    "TRB": 6.8,
    "AST": 1.7,
    "PS/G": 13.2
  },
  {
    "Player": "Kristaps Porzingis",
    "Pos": "PF",
    "Age": 22,
    "Tm": "NYK",
    "G": 48,
    "MP": 32.4,
    "FG%": ".439",
    "TRB": 6.6,
    "AST": 1.2,
    "PS/G": 22.7
  },
  {
    "Player": "Dwight Powell",
    "Pos": "C",
    "Age": 26,
    "Tm": "DAL",
    "G": 79,
    "MP": 21.2,
    "FG%": ".593",
    "TRB": 5.6,
    "AST": 1.2,
    "PS/G": 8.5
  },
  {
    "Player": "Norman Powell",
    "Pos": "SG",
    "Age": 24,
    "Tm": "TOR",
    "G": 70,
    "MP": 15.2,
    "FG%": ".401",
    "TRB": 1.7,
    "AST": 1.3,
    "PS/G": 5.5
  },
  {
    "Player": "Alex Poythress",
    "Pos": "PF",
    "Age": 24,
    "Tm": "IND",
    "G": 25,
    "MP": 4.2,
    "FG%": ".423",
    "TRB": 0.7,
    "AST": 0.1,
    "PS/G": 1
  },
  {
    "Player": "Jacob Pullen",
    "Pos": "PG",
    "Age": 28,
    "Tm": "PHI",
    "G": 3,
    "MP": 2,
    "FG%": ".500",
    "TRB": 0,
    "AST": 0,
    "PS/G": 0.7
  },
  {
    "Player": "Rodney Purvis",
    "Pos": "SG",
    "Age": 23,
    "Tm": "ORL",
    "G": 16,
    "MP": 18.1,
    "FG%": ".327",
    "TRB": 1.7,
    "AST": 1.1,
    "PS/G": 6
  },
  {
    "Player": "Zhou Qi",
    "Pos": "C",
    "Age": 22,
    "Tm": "HOU",
    "G": 18,
    "MP": 6.9,
    "FG%": ".188",
    "TRB": 1.2,
    "AST": 0.1,
    "PS/G": 1.2
  },
  {
    "Player": "Tim Quarterman",
    "Pos": "SG",
    "Age": 23,
    "Tm": "HOU",
    "G": 3,
    "MP": 4.3,
    "FG%": ".333",
    "TRB": 1,
    "AST": 0.3,
    "PS/G": 1.3
  },
  {
    "Player": "Ivan Rabb",
    "Pos": "PF",
    "Age": 20,
    "Tm": "MEM",
    "G": 36,
    "MP": 14.3,
    "FG%": ".566",
    "TRB": 4.4,
    "AST": 0.9,
    "PS/G": 5.6
  },
  {
    "Player": "Julius Randle",
    "Pos": "C",
    "Age": 23,
    "Tm": "LAL",
    "G": 82,
    "MP": 26.7,
    "FG%": ".558",
    "TRB": 8,
    "AST": 2.6,
    "PS/G": 16.1
  },
  {
    "Player": "Zach Randolph",
    "Pos": "PF",
    "Age": 36,
    "Tm": "SAC",
    "G": 59,
    "MP": 25.6,
    "FG%": ".473",
    "TRB": 6.7,
    "AST": 2.2,
    "PS/G": 14.5
  },
  {
    "Player": "Xavier Rathan-Mayes",
    "Pos": "SG",
    "Age": 23,
    "Tm": "MEM",
    "G": 5,
    "MP": 23.6,
    "FG%": ".286",
    "TRB": 1,
    "AST": 3.6,
    "PS/G": 5.8
  },
  {
    "Player": "J.J. Redick",
    "Pos": "SG",
    "Age": 33,
    "Tm": "PHI",
    "G": 70,
    "MP": 30.2,
    "FG%": ".460",
    "TRB": 2.5,
    "AST": 3,
    "PS/G": 17.1
  },
  {
    "Player": "Davon Reed",
    "Pos": "SG",
    "Age": 22,
    "Tm": "PHO",
    "G": 21,
    "MP": 11.5,
    "FG%": ".289",
    "TRB": 1.9,
    "AST": 0.6,
    "PS/G": 3
  },
  {
    "Player": "Willie Reed",
    "Pos": "C",
    "Age": 27,
    "Tm": "TOT",
    "G": 42,
    "MP": 10.2,
    "FG%": ".669",
    "TRB": 2.9,
    "AST": 0.2,
    "PS/G": 4.6
  },
  {
    "Player": "Josh Richardson",
    "Pos": "SF",
    "Age": 24,
    "Tm": "MIA",
    "G": 81,
    "MP": 33.2,
    "FG%": ".451",
    "TRB": 3.5,
    "AST": 2.9,
    "PS/G": 12.9
  },
  {
    "Player": "Malachi Richardson",
    "Pos": "SG",
    "Age": 22,
    "Tm": "TOT",
    "G": 26,
    "MP": 12.5,
    "FG%": ".333",
    "TRB": 1.3,
    "AST": 0.5,
    "PS/G": 3.4
  },
  {
    "Player": "Austin Rivers",
    "Pos": "SG",
    "Age": 25,
    "Tm": "LAC",
    "G": 61,
    "MP": 33.7,
    "FG%": ".424",
    "TRB": 2.4,
    "AST": 4,
    "PS/G": 15.1
  },
  {
    "Player": "Andre Roberson",
    "Pos": "SG",
    "Age": 26,
    "Tm": "OKC",
    "G": 39,
    "MP": 26.6,
    "FG%": ".537",
    "TRB": 4.7,
    "AST": 1.2,
    "PS/G": 5
  },
  {
    "Player": "Devin Robinson",
    "Pos": "SF",
    "Age": 22,
    "Tm": "WAS",
    "G": 1,
    "MP": 13,
    "FG%": ".333",
    "TRB": 5,
    "AST": 0,
    "PS/G": 2
  },
  {
    "Player": "Glenn Robinson",
    "Pos": "SF",
    "Age": 24,
    "Tm": "IND",
    "G": 23,
    "MP": 14.7,
    "FG%": ".424",
    "TRB": 1.6,
    "AST": 0.7,
    "PS/G": 4.1
  },
  {
    "Player": "Rajon Rondo",
    "Pos": "PG",
    "Age": 31,
    "Tm": "NOP",
    "G": 65,
    "MP": 26.2,
    "FG%": ".468",
    "TRB": 4,
    "AST": 8.2,
    "PS/G": 8.3
  },
  {
    "Player": "Derrick Rose",
    "Pos": "PG",
    "Age": 29,
    "Tm": "TOT",
    "G": 25,
    "MP": 16.8,
    "FG%": ".435",
    "TRB": 1.4,
    "AST": 1.5,
    "PS/G": 8.4
  },
  {
    "Player": "Terrence Ross",
    "Pos": "SG",
    "Age": 26,
    "Tm": "ORL",
    "G": 24,
    "MP": 25,
    "FG%": ".398",
    "TRB": 3,
    "AST": 1.6,
    "PS/G": 8.7
  },
  {
    "Player": "Terry Rozier",
    "Pos": "PG",
    "Age": 23,
    "Tm": "BOS",
    "G": 80,
    "MP": 25.9,
    "FG%": ".395",
    "TRB": 4.7,
    "AST": 2.9,
    "PS/G": 11.3
  },
  {
    "Player": "Ricky Rubio",
    "Pos": "PG",
    "Age": 27,
    "Tm": "UTA",
    "G": 77,
    "MP": 29.3,
    "FG%": ".418",
    "TRB": 4.6,
    "AST": 5.3,
    "PS/G": 13.1
  },
  {
    "Player": "D'Angelo Russell",
    "Pos": "PG",
    "Age": 21,
    "Tm": "BRK",
    "G": 48,
    "MP": 25.7,
    "FG%": ".414",
    "TRB": 3.9,
    "AST": 5.2,
    "PS/G": 15.5
  },
  {
    "Player": "Domantas Sabonis",
    "Pos": "C",
    "Age": 21,
    "Tm": "IND",
    "G": 74,
    "MP": 24.5,
    "FG%": ".514",
    "TRB": 7.7,
    "AST": 2,
    "PS/G": 11.6
  },
  {
    "Player": "JaKarr Sampson",
    "Pos": "SF",
    "Age": 24,
    "Tm": "SAC",
    "G": 22,
    "MP": 15.6,
    "FG%": ".543",
    "TRB": 3.5,
    "AST": 0.4,
    "PS/G": 4.7
  },
  {
    "Player": "Dario Saric",
    "Pos": "PF",
    "Age": 23,
    "Tm": "PHI",
    "G": 78,
    "MP": 29.6,
    "FG%": ".453",
    "TRB": 6.7,
    "AST": 2.6,
    "PS/G": 14.6
  },
  {
    "Player": "Tomas Satoransky",
    "Pos": "SG",
    "Age": 26,
    "Tm": "WAS",
    "G": 73,
    "MP": 22.5,
    "FG%": ".523",
    "TRB": 3.2,
    "AST": 3.9,
    "PS/G": 7.2
  },
  {
    "Player": "Dennis Schroder",
    "Pos": "PG",
    "Age": 24,
    "Tm": "ATL",
    "G": 67,
    "MP": 31,
    "FG%": ".436",
    "TRB": 3.1,
    "AST": 6.2,
    "PS/G": 19.4
  },
  {
    "Player": "Mike Scott",
    "Pos": "PF",
    "Age": 29,
    "Tm": "WAS",
    "G": 76,
    "MP": 18.5,
    "FG%": ".527",
    "TRB": 3.3,
    "AST": 1.1,
    "PS/G": 8.8
  },
  {
    "Player": "Thabo Sefolosha",
    "Pos": "SF",
    "Age": 33,
    "Tm": "UTA",
    "G": 38,
    "MP": 21.2,
    "FG%": ".492",
    "TRB": 4.2,
    "AST": 0.9,
    "PS/G": 8.2
  },
  {
    "Player": "Wayne Selden",
    "Pos": "SG",
    "Age": 23,
    "Tm": "MEM",
    "G": 35,
    "MP": 19.8,
    "FG%": ".431",
    "TRB": 1.6,
    "AST": 1.9,
    "PS/G": 9.3
  },
  {
    "Player": "Ramon Sessions",
    "Pos": "PG",
    "Age": 31,
    "Tm": "TOT",
    "G": 28,
    "MP": 14,
    "FG%": ".359",
    "TRB": 1.4,
    "AST": 2.8,
    "PS/G": 4.9
  },
  {
    "Player": "Iman Shumpert",
    "Pos": "SG",
    "Age": 27,
    "Tm": "CLE",
    "G": 14,
    "MP": 19.7,
    "FG%": ".379",
    "TRB": 2.9,
    "AST": 1.2,
    "PS/G": 4.4
  },
  {
    "Player": "Pascal Siakam",
    "Pos": "PF",
    "Age": 23,
    "Tm": "TOR",
    "G": 81,
    "MP": 20.7,
    "FG%": ".508",
    "TRB": 4.5,
    "AST": 2,
    "PS/G": 7.3
  },
  {
    "Player": "Xavier Silas",
    "Pos": "SG",
    "Age": 30,
    "Tm": "BOS",
    "G": 2,
    "MP": 3.5,
    "FG%": ".000",
    "TRB": 1,
    "AST": 0,
    "PS/G": 0
  },
  {
    "Player": "Ben Simmons",
    "Pos": "PG",
    "Age": 21,
    "Tm": "PHI",
    "G": 81,
    "MP": 33.7,
    "FG%": ".545",
    "TRB": 8.1,
    "AST": 8.2,
    "PS/G": 15.8
  },
  {
    "Player": "Jonathon Simmons",
    "Pos": "SG",
    "Age": 28,
    "Tm": "ORL",
    "G": 69,
    "MP": 29.4,
    "FG%": ".465",
    "TRB": 3.5,
    "AST": 2.5,
    "PS/G": 13.9
  },
  {
    "Player": "Kobi Simmons",
    "Pos": "PG",
    "Age": 20,
    "Tm": "MEM",
    "G": 32,
    "MP": 20.1,
    "FG%": ".423",
    "TRB": 1.6,
    "AST": 2.1,
    "PS/G": 6.1
  },
  {
    "Player": "Kyle Singler",
    "Pos": "SF",
    "Age": 29,
    "Tm": "OKC",
    "G": 12,
    "MP": 4.9,
    "FG%": ".333",
    "TRB": 0.8,
    "AST": 0.2,
    "PS/G": 1.9
  },
  {
    "Player": "Marcus Smart",
    "Pos": "SG",
    "Age": 23,
    "Tm": "BOS",
    "G": 54,
    "MP": 29.9,
    "FG%": ".367",
    "TRB": 3.5,
    "AST": 4.8,
    "PS/G": 10.2
  },
  {
    "Player": "Dennis Smith",
    "Pos": "PG",
    "Age": 20,
    "Tm": "DAL",
    "G": 69,
    "MP": 29.7,
    "FG%": ".395",
    "TRB": 3.8,
    "AST": 5.2,
    "PS/G": 15.2
  },
  {
    "Player": "Ish Smith",
    "Pos": "PG",
    "Age": 29,
    "Tm": "DET",
    "G": 82,
    "MP": 24.9,
    "FG%": ".486",
    "TRB": 2.7,
    "AST": 4.4,
    "PS/G": 10.9
  },
  {
    "Player": "J.R. Smith",
    "Pos": "SG",
    "Age": 32,
    "Tm": "CLE",
    "G": 80,
    "MP": 28.1,
    "FG%": ".403",
    "TRB": 2.9,
    "AST": 1.8,
    "PS/G": 8.3
  },
  {
    "Player": "Jason Smith",
    "Pos": "C",
    "Age": 31,
    "Tm": "WAS",
    "G": 33,
    "MP": 8.6,
    "FG%": ".391",
    "TRB": 1.6,
    "AST": 0.4,
    "PS/G": 3.4
  },
  {
    "Player": "Josh Smith",
    "Pos": "PF",
    "Age": 32,
    "Tm": "NOP",
    "G": 3,
    "MP": 4,
    "FG%": ".250",
    "TRB": 1.3,
    "AST": 0,
    "PS/G": 0.7
  },
  {
    "Player": "Tony Snell",
    "Pos": "SG",
    "Age": 26,
    "Tm": "MIL",
    "G": 75,
    "MP": 27.4,
    "FG%": ".435",
    "TRB": 1.9,
    "AST": 1.3,
    "PS/G": 6.9
  },
  {
    "Player": "Marreese Speights",
    "Pos": "C",
    "Age": 30,
    "Tm": "ORL",
    "G": 52,
    "MP": 13,
    "FG%": ".395",
    "TRB": 2.6,
    "AST": 0.8,
    "PS/G": 7.7
  },
  {
    "Player": "Nik Stauskas",
    "Pos": "SG",
    "Age": 24,
    "Tm": "TOT",
    "G": 41,
    "MP": 12.8,
    "FG%": ".390",
    "TRB": 1.6,
    "AST": 1,
    "PS/G": 4.4
  },
  {
    "Player": "Lance Stephenson",
    "Pos": "SG",
    "Age": 27,
    "Tm": "IND",
    "G": 82,
    "MP": 22.6,
    "FG%": ".427",
    "TRB": 5.2,
    "AST": 2.9,
    "PS/G": 9.2
  },
  {
    "Player": "David Stockton",
    "Pos": "PG",
    "Age": 26,
    "Tm": "UTA",
    "G": 3,
    "MP": 3,
    "FG%": ".667",
    "TRB": 0,
    "AST": 0,
    "PS/G": 3.3
  },
  {
    "Player": "Julyan Stone",
    "Pos": "SG",
    "Age": 29,
    "Tm": "CHO",
    "G": 23,
    "MP": 7.6,
    "FG%": ".462",
    "TRB": 1.3,
    "AST": 1.1,
    "PS/G": 0.8
  },
  {
    "Player": "Edmond Sumner",
    "Pos": "PG",
    "Age": 22,
    "Tm": "IND",
    "G": 1,
    "MP": 2,
    "FG%": 1,
    "TRB": 1,
    "AST": 0,
    "PS/G": 2
  },
  {
    "Player": "Caleb Swanigan",
    "Pos": "PF",
    "Age": 20,
    "Tm": "POR",
    "G": 27,
    "MP": 7,
    "FG%": ".400",
    "TRB": 2,
    "AST": 0.5,
    "PS/G": 2.3
  },
  {
    "Player": "Jayson Tatum",
    "Pos": "SF",
    "Age": 19,
    "Tm": "BOS",
    "G": 80,
    "MP": 30.5,
    "FG%": ".475",
    "TRB": 5,
    "AST": 1.6,
    "PS/G": 13.9
  },
  {
    "Player": "Isaiah Taylor",
    "Pos": "PG",
    "Age": 23,
    "Tm": "ATL",
    "G": 67,
    "MP": 17.4,
    "FG%": ".418",
    "TRB": 1.4,
    "AST": 3.1,
    "PS/G": 6.6
  },
  {
    "Player": "Jeff Teague",
    "Pos": "PG",
    "Age": 29,
    "Tm": "MIN",
    "G": 70,
    "MP": 33,
    "FG%": ".446",
    "TRB": 3,
    "AST": 7,
    "PS/G": 14.2
  },
  {
    "Player": "Marquis Teague",
    "Pos": "PG",
    "Age": 24,
    "Tm": "MEM",
    "G": 3,
    "MP": 24.7,
    "FG%": ".250",
    "TRB": 2,
    "AST": 4.3,
    "PS/G": 3.7
  },
  {
    "Player": "Mirza Teletovic",
    "Pos": "PF",
    "Age": 32,
    "Tm": "MIL",
    "G": 10,
    "MP": 15.9,
    "FG%": ".439",
    "TRB": 2.3,
    "AST": 1,
    "PS/G": 7.1
  },
  {
    "Player": "Garrett Temple",
    "Pos": "SG",
    "Age": 31,
    "Tm": "SAC",
    "G": 65,
    "MP": 24.8,
    "FG%": ".418",
    "TRB": 2.3,
    "AST": 1.9,
    "PS/G": 8.4
  },
  {
    "Player": "Milos Teodosic",
    "Pos": "PG",
    "Age": 30,
    "Tm": "LAC",
    "G": 45,
    "MP": 25.2,
    "FG%": ".419",
    "TRB": 2.8,
    "AST": 4.6,
    "PS/G": 9.5
  },
  {
    "Player": "Jason Terry",
    "Pos": "SG",
    "Age": 40,
    "Tm": "MIL",
    "G": 51,
    "MP": 16,
    "FG%": ".383",
    "TRB": 0.9,
    "AST": 1.2,
    "PS/G": 3.3
  },
  {
    "Player": "Daniel Theis",
    "Pos": "C",
    "Age": 25,
    "Tm": "BOS",
    "G": 63,
    "MP": 14.9,
    "FG%": ".541",
    "TRB": 4.3,
    "AST": 0.9,
    "PS/G": 5.3
  },
  {
    "Player": "Isaiah Thomas",
    "Pos": "PG",
    "Age": 28,
    "Tm": "TOT",
    "G": 32,
    "MP": 26.9,
    "FG%": ".373",
    "TRB": 2.1,
    "AST": 4.8,
    "PS/G": 15.2
  },
  {
    "Player": "Lance Thomas",
    "Pos": "PF",
    "Age": 29,
    "Tm": "NYK",
    "G": 73,
    "MP": 18.5,
    "FG%": ".382",
    "TRB": 2.4,
    "AST": 0.6,
    "PS/G": 4.1
  },
  {
    "Player": "Klay Thompson",
    "Pos": "SG",
    "Age": 27,
    "Tm": "GSW",
    "G": 73,
    "MP": 34.3,
    "FG%": ".488",
    "TRB": 3.8,
    "AST": 2.5,
    "PS/G": 20
  },
  {
    "Player": "Tristan Thompson",
    "Pos": "C",
    "Age": 26,
    "Tm": "CLE",
    "G": 53,
    "MP": 20.2,
    "FG%": ".562",
    "TRB": 6.6,
    "AST": 0.6,
    "PS/G": 5.8
  },
  {
    "Player": "Sindarius Thornwell",
    "Pos": "SG",
    "Age": 23,
    "Tm": "LAC",
    "G": 73,
    "MP": 15.8,
    "FG%": ".429",
    "TRB": 1.9,
    "AST": 0.9,
    "PS/G": 3.9
  },
  {
    "Player": "Anthony Tolliver",
    "Pos": "PF",
    "Age": 32,
    "Tm": "DET",
    "G": 79,
    "MP": 22.2,
    "FG%": ".464",
    "TRB": 3.1,
    "AST": 1.1,
    "PS/G": 8.9
  },
  {
    "Player": "Karl-Anthony Towns",
    "Pos": "C",
    "Age": 22,
    "Tm": "MIN",
    "G": 82,
    "MP": 35.6,
    "FG%": ".545",
    "TRB": 12.3,
    "AST": 2.4,
    "PS/G": 21.3
  },
  {
    "Player": "P.J. Tucker",
    "Pos": "PF",
    "Age": 32,
    "Tm": "HOU",
    "G": 82,
    "MP": 27.8,
    "FG%": ".390",
    "TRB": 5.6,
    "AST": 0.9,
    "PS/G": 6.1
  },
  {
    "Player": "Evan Turner",
    "Pos": "SF",
    "Age": 29,
    "Tm": "POR",
    "G": 79,
    "MP": 25.7,
    "FG%": ".447",
    "TRB": 3.1,
    "AST": 2.2,
    "PS/G": 8.2
  },
  {
    "Player": "Myles Turner",
    "Pos": "C",
    "Age": 21,
    "Tm": "IND",
    "G": 65,
    "MP": 28.2,
    "FG%": ".479",
    "TRB": 6.4,
    "AST": 1.3,
    "PS/G": 12.7
  },
  {
    "Player": "Ekpe Udoh",
    "Pos": "C",
    "Age": 30,
    "Tm": "UTA",
    "G": 63,
    "MP": 12.9,
    "FG%": ".500",
    "TRB": 2.4,
    "AST": 0.8,
    "PS/G": 2.6
  },
  {
    "Player": "Tyler Ulis",
    "Pos": "PG",
    "Age": 22,
    "Tm": "PHO",
    "G": 71,
    "MP": 23.4,
    "FG%": ".388",
    "TRB": 1.8,
    "AST": 4.4,
    "PS/G": 7.8
  },
  {
    "Player": "Jonas Valanciunas",
    "Pos": "C",
    "Age": 25,
    "Tm": "TOR",
    "G": 77,
    "MP": 22.4,
    "FG%": ".568",
    "TRB": 8.6,
    "AST": 1.1,
    "PS/G": 12.7
  },
  {
    "Player": "Denzel Valentine",
    "Pos": "SG",
    "Age": 24,
    "Tm": "CHI",
    "G": 77,
    "MP": 27.2,
    "FG%": ".417",
    "TRB": 5.1,
    "AST": 3.2,
    "PS/G": 10.2
  },
  {
    "Player": "Fred VanVleet",
    "Pos": "PG",
    "Age": 23,
    "Tm": "TOR",
    "G": 76,
    "MP": 20,
    "FG%": ".426",
    "TRB": 2.4,
    "AST": 3.2,
    "PS/G": 8.6
  },
  {
    "Player": "Rashad Vaughn",
    "Pos": "SG",
    "Age": 21,
    "Tm": "TOT",
    "G": 28,
    "MP": 7.6,
    "FG%": ".411",
    "TRB": 0.8,
    "AST": 0.5,
    "PS/G": 2.3
  },
  {
    "Player": "Noah Vonleh",
    "Pos": "PF",
    "Age": 22,
    "Tm": "TOT",
    "G": 54,
    "MP": 16.2,
    "FG%": ".444",
    "TRB": 5.8,
    "AST": 0.6,
    "PS/G": 4.9
  },
  {
    "Player": "Nikola Vucevic",
    "Pos": "C",
    "Age": 27,
    "Tm": "ORL",
    "G": 57,
    "MP": 29.5,
    "FG%": ".475",
    "TRB": 9.2,
    "AST": 3.4,
    "PS/G": 16.5
  },
  {
    "Player": "Dwyane Wade",
    "Pos": "SG",
    "Age": 36,
    "Tm": "TOT",
    "G": 67,
    "MP": 22.9,
    "FG%": ".438",
    "TRB": 3.8,
    "AST": 3.4,
    "PS/G": 11.4
  },
  {
    "Player": "Dion Waiters",
    "Pos": "SG",
    "Age": 26,
    "Tm": "MIA",
    "G": 30,
    "MP": 30.6,
    "FG%": ".398",
    "TRB": 2.6,
    "AST": 3.8,
    "PS/G": 14.3
  },
  {
    "Player": "Kemba Walker",
    "Pos": "PG",
    "Age": 27,
    "Tm": "CHO",
    "G": 80,
    "MP": 34.2,
    "FG%": ".431",
    "TRB": 3.1,
    "AST": 5.6,
    "PS/G": 22.1
  },
  {
    "Player": "John Wall",
    "Pos": "PG",
    "Age": 27,
    "Tm": "WAS",
    "G": 41,
    "MP": 34.4,
    "FG%": ".420",
    "TRB": 3.7,
    "AST": 9.6,
    "PS/G": 19.4
  },
  {
    "Player": "Tyrone Wallace",
    "Pos": "PG",
    "Age": 23,
    "Tm": "LAC",
    "G": 30,
    "MP": 28.4,
    "FG%": ".445",
    "TRB": 3.5,
    "AST": 2.4,
    "PS/G": 9.7
  },
  {
    "Player": "Taurean Waller-Prince",
    "Pos": "SF",
    "Age": 23,
    "Tm": "ATL",
    "G": 82,
    "MP": 30,
    "FG%": ".426",
    "TRB": 4.7,
    "AST": 2.6,
    "PS/G": 14.1
  },
  {
    "Player": "Derrick Walton",
    "Pos": "PG",
    "Age": 22,
    "Tm": "MIA",
    "G": 16,
    "MP": 9.2,
    "FG%": ".320",
    "TRB": 1,
    "AST": 1,
    "PS/G": 1.8
  },
  {
    "Player": "Jameel Warney",
    "Pos": "PF",
    "Age": 24,
    "Tm": "DAL",
    "G": 3,
    "MP": 9,
    "FG%": ".583",
    "TRB": 3,
    "AST": 0,
    "PS/G": 5.7
  },
  {
    "Player": "T.J. Warren",
    "Pos": "SF",
    "Age": 24,
    "Tm": "PHO",
    "G": 65,
    "MP": 33,
    "FG%": ".498",
    "TRB": 5.1,
    "AST": 1.3,
    "PS/G": 19.6
  },
  {
    "Player": "Travis Wear",
    "Pos": "SF",
    "Age": 27,
    "Tm": "LAL",
    "G": 17,
    "MP": 13.4,
    "FG%": ".347",
    "TRB": 2.2,
    "AST": 0.4,
    "PS/G": 4.4
  },
  {
    "Player": "James Webb",
    "Pos": "SF",
    "Age": 24,
    "Tm": "BRK",
    "G": 10,
    "MP": 12,
    "FG%": ".250",
    "TRB": 2.4,
    "AST": 0.4,
    "PS/G": 1.6
  },
  {
    "Player": "Briante Weber",
    "Pos": "PG",
    "Age": 25,
    "Tm": "TOT",
    "G": 18,
    "MP": 13.2,
    "FG%": ".442",
    "TRB": 1.9,
    "AST": 1.2,
    "PS/G": 2.8
  },
  {
    "Player": "David West",
    "Pos": "C",
    "Age": 37,
    "Tm": "GSW",
    "G": 73,
    "MP": 13.7,
    "FG%": ".571",
    "TRB": 3.3,
    "AST": 1.9,
    "PS/G": 6.8
  },
  {
    "Player": "Russell Westbrook",
    "Pos": "PG",
    "Age": 29,
    "Tm": "OKC",
    "G": 80,
    "MP": 36.4,
    "FG%": ".449",
    "TRB": 10.1,
    "AST": 10.3,
    "PS/G": 25.4
  },
  {
    "Player": "Andrew White",
    "Pos": "SF",
    "Age": 24,
    "Tm": "ATL",
    "G": 15,
    "MP": 13.9,
    "FG%": ".342",
    "TRB": 2.3,
    "AST": 0.4,
    "PS/G": 4.6
  },
  {
    "Player": "Derrick White",
    "Pos": "PG",
    "Age": 23,
    "Tm": "SAS",
    "G": 17,
    "MP": 8.2,
    "FG%": ".485",
    "TRB": 1.5,
    "AST": 0.5,
    "PS/G": 3.2
  },
  {
    "Player": "Okaro White",
    "Pos": "PF",
    "Age": 25,
    "Tm": "MIA",
    "G": 6,
    "MP": 13.3,
    "FG%": ".438",
    "TRB": 1.8,
    "AST": 0.3,
    "PS/G": 3.3
  },
  {
    "Player": "Isaiah Whitehead",
    "Pos": "PG",
    "Age": 22,
    "Tm": "BRK",
    "G": 16,
    "MP": 11.3,
    "FG%": ".465",
    "TRB": 1.6,
    "AST": 1.3,
    "PS/G": 6.3
  },
  {
    "Player": "Hassan Whiteside",
    "Pos": "C",
    "Age": 28,
    "Tm": "MIA",
    "G": 54,
    "MP": 25.3,
    "FG%": ".540",
    "TRB": 11.4,
    "AST": 1,
    "PS/G": 14
  },
  {
    "Player": "Andrew Wiggins",
    "Pos": "SF",
    "Age": 22,
    "Tm": "MIN",
    "G": 82,
    "MP": 36.3,
    "FG%": ".438",
    "TRB": 4.4,
    "AST": 2,
    "PS/G": 17.7
  },
  {
    "Player": "Jacob Wiley",
    "Pos": "PF",
    "Age": 23,
    "Tm": "BRK",
    "G": 5,
    "MP": 6.6,
    "FG%": ".250",
    "TRB": 2.2,
    "AST": 0.4,
    "PS/G": 0.8
  },
  {
    "Player": "Damien Wilkins",
    "Pos": "SF",
    "Age": 38,
    "Tm": "IND",
    "G": 19,
    "MP": 8,
    "FG%": ".333",
    "TRB": 0.8,
    "AST": 0.5,
    "PS/G": 1.7
  },
  {
    "Player": "Alan Williams",
    "Pos": "PF",
    "Age": 25,
    "Tm": "PHO",
    "G": 5,
    "MP": 14,
    "FG%": ".389",
    "TRB": 4.4,
    "AST": 1.6,
    "PS/G": 4
  },
  {
    "Player": "C.J. Williams",
    "Pos": "SG",
    "Age": 27,
    "Tm": "LAC",
    "G": 38,
    "MP": 18.6,
    "FG%": ".442",
    "TRB": 1.5,
    "AST": 1.1,
    "PS/G": 5.5
  },
  {
    "Player": "Derrick Williams",
    "Pos": "PF",
    "Age": 26,
    "Tm": "LAL",
    "G": 2,
    "MP": 4.5,
    "FG%": ".250",
    "TRB": 0.5,
    "AST": 0,
    "PS/G": 1
  },
  {
    "Player": "Lou Williams",
    "Pos": "SG",
    "Age": 31,
    "Tm": "LAC",
    "G": 79,
    "MP": 32.8,
    "FG%": ".435",
    "TRB": 2.5,
    "AST": 5.3,
    "PS/G": 22.6
  },
  {
    "Player": "Marvin Williams",
    "Pos": "PF",
    "Age": 31,
    "Tm": "CHO",
    "G": 78,
    "MP": 25.7,
    "FG%": ".458",
    "TRB": 4.7,
    "AST": 1.2,
    "PS/G": 9.5
  },
  {
    "Player": "Matt Williams",
    "Pos": "SG",
    "Age": 24,
    "Tm": "MIA",
    "G": 3,
    "MP": 3.7,
    "FG%": ".333",
    "TRB": 0.3,
    "AST": 0,
    "PS/G": 1.7
  },
  {
    "Player": "Troy Williams",
    "Pos": "SF",
    "Age": 23,
    "Tm": "TOT",
    "G": 21,
    "MP": 14.6,
    "FG%": ".468",
    "TRB": 3,
    "AST": 0.8,
    "PS/G": 6.3
  },
  {
    "Player": "D.J. Wilson",
    "Pos": "PF",
    "Age": 21,
    "Tm": "MIL",
    "G": 22,
    "MP": 3.2,
    "FG%": ".563",
    "TRB": 0.5,
    "AST": 0.1,
    "PS/G": 1
  },
  {
    "Player": "Jamil Wilson",
    "Pos": "SF",
    "Age": 27,
    "Tm": "LAC",
    "G": 15,
    "MP": 18.3,
    "FG%": ".469",
    "TRB": 2.1,
    "AST": 0.7,
    "PS/G": 7
  },
  {
    "Player": "Justise Winslow",
    "Pos": "PF",
    "Age": 21,
    "Tm": "MIA",
    "G": 68,
    "MP": 24.7,
    "FG%": ".424",
    "TRB": 5.4,
    "AST": 2.2,
    "PS/G": 7.8
  },
  {
    "Player": "Jeff Withey",
    "Pos": "C",
    "Age": 27,
    "Tm": "DAL",
    "G": 9,
    "MP": 4.3,
    "FG%": ".375",
    "TRB": 1.1,
    "AST": 0,
    "PS/G": 1.7
  },
  {
    "Player": "Nate Wolters",
    "Pos": "PG",
    "Age": 26,
    "Tm": "UTA",
    "G": 5,
    "MP": 3.8,
    "FG%": ".167",
    "TRB": 0.4,
    "AST": 0.2,
    "PS/G": 0.4
  },
  {
    "Player": "Brandan Wright",
    "Pos": "PF",
    "Age": 30,
    "Tm": "TOT",
    "G": 28,
    "MP": 13.6,
    "FG%": ".578",
    "TRB": 3.4,
    "AST": 0.5,
    "PS/G": 5
  },
  {
    "Player": "Delon Wright",
    "Pos": "PG",
    "Age": 25,
    "Tm": "TOR",
    "G": 69,
    "MP": 20.8,
    "FG%": ".465",
    "TRB": 2.9,
    "AST": 2.9,
    "PS/G": 8
  },
  {
    "Player": "Guerschon Yabusele",
    "Pos": "PF",
    "Age": 22,
    "Tm": "BOS",
    "G": 33,
    "MP": 7.1,
    "FG%": ".426",
    "TRB": 1.6,
    "AST": 0.5,
    "PS/G": 2.4
  },
  {
    "Player": "James Young",
    "Pos": "SG",
    "Age": 22,
    "Tm": "PHI",
    "G": 6,
    "MP": 10.2,
    "FG%": ".357",
    "TRB": 0.3,
    "AST": 0.3,
    "PS/G": 2.8
  },
  {
    "Player": "Joe Young",
    "Pos": "PG",
    "Age": 25,
    "Tm": "IND",
    "G": 53,
    "MP": 10.5,
    "FG%": ".430",
    "TRB": 1.2,
    "AST": 0.7,
    "PS/G": 3.9
  },
  {
    "Player": "Nick Young",
    "Pos": "SG",
    "Age": 32,
    "Tm": "GSW",
    "G": 80,
    "MP": 17.4,
    "FG%": ".412",
    "TRB": 1.6,
    "AST": 0.5,
    "PS/G": 7.3
  },
  {
    "Player": "Thaddeus Young",
    "Pos": "PF",
    "Age": 29,
    "Tm": "IND",
    "G": 81,
    "MP": 32.2,
    "FG%": ".487",
    "TRB": 6.3,
    "AST": 1.9,
    "PS/G": 11.8
  },
  {
    "Player": "Cody Zeller",
    "Pos": "C",
    "Age": 25,
    "Tm": "CHO",
    "G": 33,
    "MP": 19,
    "FG%": ".545",
    "TRB": 5.4,
    "AST": 0.9,
    "PS/G": 7.1
  },
  {
    "Player": "Tyler Zeller",
    "Pos": "C",
    "Age": 28,
    "Tm": "TOT",
    "G": 66,
    "MP": 16.8,
    "FG%": ".560",
    "TRB": 4.6,
    "AST": 0.7,
    "PS/G": 6.7
  },
  {
    "Player": "Paul Zipser",
    "Pos": "SF",
    "Age": 23,
    "Tm": "CHI",
    "G": 54,
    "MP": 15.3,
    "FG%": ".346",
    "TRB": 2.4,
    "AST": 0.9,
    "PS/G": 4
  },
  {
    "Player": "Ante Zizic",
    "Pos": "C",
    "Age": 21,
    "Tm": "CLE",
    "G": 32,
    "MP": 6.7,
    "FG%": ".731",
    "TRB": 1.9,
    "AST": 0.2,
    "PS/G": 3.7
  },
  {
    "Player": "Ivica Zubac",
    "Pos": "C",
    "Age": 20,
    "Tm": "LAL",
    "G": 43,
    "MP": 9.5,
    "FG%": ".500",
    "TRB": 2.9,
    "AST": 0.6,
    "PS/G": 3.7
  }
]



grabNames(cleanStats);

playerMap.setHashAll(firstNames);
playerMap.setHashAll(lastNames);

const playersFound = playerMap.playerSearch(pageText);

function extractNames(arr){
    let newArr = [];
    for(i = 0; i < (arr.length); i++){
        newArr.push(arr[0].Player.toLowerCase());
    }
    return newArr;
}

const playersFoundNames = extractNames(playersFound);


runWalker(playersFoundNames);

const t2 = performance.now();

console.log(t2 - t1);

console.log(foundNodes);

