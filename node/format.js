/*Stats order of operation:

1. CSV to JSON

2. add in PER

3. removed all unwanted fields but retains duplicates

4. Remove duplicates

5. Add in team names for duplicate players (UNFINISHED)

6. formattedStatsJSON --> no duplicates, ready to be hashed and searched (requires team names to be added back in for "tot" players)*/

//Convert stats file from csv to JSON 
const fs = require("fs");
const csvFilePath = './players.csv';
const advCsvFilePath = './Advplayers.csv';
const csv = require('csvtojson');

csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        csv()
        .fromFile(advCsvFilePath)
        .then((advJsonObj) => {
            const formattedStatsJSON = JSON.stringify(format(jsonObj, advJsonObj));
            fs.writeFile("formattedStatsObject.json", `let formattedStatsObjectJSON = ${formattedStatsJSON}`, function(err) {
                if(err){
                    console.log(err);
                }
            })
        })

    });


//remove unwanted stats, add in PER stat
function format(arr, advArr) {  
    arr.forEach((x, i) => {
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
        if(x.Player = advArr[i].Player) { //add PER stat to each record
            x.PER = advArr[i].PER;
        }
    });
    return removeDuplicateNames(arr);
};

//remove duplicate names created by traded teams, retains full year stats
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
};