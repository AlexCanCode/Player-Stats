'use strict'

const stats = require('./format.js'); // this will eventually import a non-clean stats file and index.js will import the formatter to apply changes. 
//const format = require('./format.js') //import formatting rules - needs to be written, perhaps as an object as there will be several rules that need to be applied

const PlayerMap = require('./StatMap.js');

let firstNames = [];
let lastNames = [];

function grabNames(arr){
    arr.map((item, index) => {
        let tempArr = item.Player.split(" ");
        firstNames.push(tempArr[0]);
        lastNames.push(tempArr[1]);
    });
};

grabNames(stats); 


//Hash all first and last names
PlayerMap.setHashAll(firstNames);
PlayerMap.setHashAll(lastNames);

const finalStatObject = [];

finalStatObject.push(stats);
finalStatObject.push(PlayerMap);

const searchArray = ["jayson", "tatum"];

console.log((finalStatObject[1].playerSearch(searchArray, finalStatObject[0]))); //Need to define a place for this to be sent - 2 ovbious choices (both depend on feasibility)

//1. (Preferred choice) - synced on the client side (to indexedDB or localStorage) - unsure if this is possible to do with each client

//2. Hosted externally in the optimally fastest place to be called on each page load. - Makes things messier but might be only option. 


