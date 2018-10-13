/*Stats order of operation:

1. CSV to JSON

2. add in PER

3. removed all unwanted fields but retains duplicates

4. Remove duplicates

5. Add in team names for duplicate players (UNFINISHED)

6. formattedStatsJSON --> no duplicates, ready to be hashed and searched (requires team names to be added back in for "tot" players)*/

//Convert stats file from csv to JSON 
const fs = require("fs");
const csvFilePath = './stats/players.csv';
const advCsvFilePath = './stats/Advplayers.csv';
const playerURLs = './stats/URLplayers.csv'
const csv = require('csvtojson');

csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        csv()
        .fromFile(advCsvFilePath)
        .then((advJsonObj) => {
            csv()
            .fromFile(playerURLs)
            .then((playerURLsObj) => {
                const formattedStatsJSON = JSON.stringify(format(jsonObj, advJsonObj, playerURLsObj));
                fs.writeFile("formattedStatsObject.js", `let formattedStatsObjectJSON = ${formattedStatsJSON}\n module.exports = formattedStatsObjectJSON`, function(err) {
                    if(err){
                        console.log(err);
                    };
                });
            });
        });
    });


//remove unwanted stats, add in PER stat
function format(arr, advArr, urlArr) {  
    arr.forEach((player, index) => {
        delete player["2P"];
        delete player["2PA"];
        delete player["2P%"];
        delete player["3P"];
        delete player["3PA"];
        delete player["3P%"];
        delete player["BLK"];
        delete player["DRB"];
        delete player["FG"];
        delete player["FGA"];
        delete player["GS"];
        delete player["eFG"];
        delete player["FT"];
        delete player["FTA"];
        delete player["FT%"];
        delete player["ORB"];
        delete player["STL"];
        delete player["TOV"];
        delete player["PF"];
        delete player["eFG%"];
        player["URL"] = urlArr[index].HREF;
        if(player.Player = advArr[index].Player) { //add PER stat to each record
            player.PER = advArr[index].PER;
            player["TS%"] = advArr[index]["TS%"];
        }
    });
    return removeDuplicateNames(arr);
};

//Populates the teams for all traded players, taking in the formatted Stats Array and an array with the proper team names. 
function populateDuplicatePlayerTeams(arr, dupArr) {
        arr.forEach((player, index) => {
            dupArr.map((item, index) => {
                if(item.Player === player.Player){
                    player.Tm = item.Tm;
                };
            });
        });
        return arr;
   };

//remove duplicate names created by trading, retains full year stats
function removeDuplicateNames(arr) {
    let duplicate = false;
    let compare;
    let spliceIndexArr = [];
    let cleanStats;
    let lastTeam;
    let duplicatePlayerTeams = [];

    arr.map(function(item, index) {
         if(item.Tm === "TOT"){
            if(duplicate) {
                duplicatePlayerTeams.push({Player: compare, Tm: lastTeam});
                compare = item.Player;
            }
            else {
              duplicate = true;
              compare = item.Player;
          }
            }
        else if(duplicate) {
            if(item.Player === compare){
             spliceIndexArr.push(index); 
             lastTeam = item.Tm;
            }
            else { //use last team and compare to create an array to fill in TOT players
             duplicatePlayerTeams.push({Player: compare, Tm: lastTeam});
             duplicate = false;
             compare = ""; 
             lastTeam = "";
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
    return populateDuplicatePlayerTeams(cleanStats, duplicatePlayerTeams); 
};