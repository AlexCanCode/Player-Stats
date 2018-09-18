
//Convert stats file from csv to JSON - having trouble returning promise, come back to
/* const csvFilePath = './players.csv';
const csv = require('csvtojson');

csv()
	.fromFile(csvFilePath)
	.then((jsonObj) => {
		 console.log(jsonObj)
	});

//Do i need nested structure? I don't think so but leaving comment in to double check prior to deployment
*/

const scrapedData = require('./scrapedStats.js'); //replace with csv to json output once problem is solved.

const formattedStats = format(scrapedData);

function format(arr) {  
    arr.forEach(x => {
        delete x["2P"];
        delete x["2PA"];
        delete x["2P%"];
        delete x["3P"];
        delete x["3PA"];
        delete x["3P%"];
        delete x["BLK"];
        delete x["DRB"];
        delete x["FG"];
        delete x["FGA"];
        delete x["GS"];
        delete x["eFG"];
        delete x["FT"];
        delete x["FTA"];
        delete x["FT%"];
        delete x["ORB"];
        delete x["STL"];
        delete x["TOV"];
        delete x["PF"];
        delete x["eFG%"];
    });

    return removeDuplicateNames(arr);
};

function removeDuplicateNames(arr) {
let duplicate = false;
let compare;
let spliceIndexArr = [];
let cleanStats;

arr.map(function(item, index) {
     if(item.Tm === "TOT"){
      duplicate = true;
      compare = item.Player;
        }
    else if(duplicate) {
        if(item.Player === compare){
         spliceIndexArr.push(index); 
        }
        else {
         duplicate = false;
         compare = ""; 
        }
    }
});

 cleanStats = arr.filter(function(item, index) {
    if(spliceIndexArr.indexOf(index) == -1){
     return true; 
    }
    else {
      return false
    }
});

return cleanStats;
}

module.exports = formattedStats;


/*Stats order of operation:

1. CSV to JSON

2. add in PER

3. removed all unwanted fields but retains duplicates

4. Remove duplicates

5. Add in team names for duplicate players (not done)

6. formattedStats --> no duplicates, ready to be hashed and searched (requires team names to be added back in for "tot" players)*/


