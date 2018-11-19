let serializedPageText; 
let playersFoundNames; //populated with sendMessage response callback
let nodeArray = []; //Array of all nodes that contain players names
let responseMap; //To be an object of arrays where the player name is the key for fast lookup while creating tooltip. May want to change main.js response format to render this unecessary. 
const acceptedTagNames = ["A", "P", "H1", "H2", "H3", "H4", "H5", "H6", "LI"]
const teamColors = {"ATL": "#E03A3E", "BOS": "#007A33", "BRK": "#000000", "CHI": "#CE1141", "CHO": "#1D1160", "CLE": "#6F263D", "DAL": "#00538C", "DEN": "#0E2240", "DET": "#C8102E", "GSW": "#006BB6", "HOU": "#CE1141", "IND": "#002D62", "LAC": "#C8102E", "LAL": "#552583", "MEM": "#5D76A9", "MIA": "#98002E", "MIL": "#00471B", "MIN": "#0C2340", "NOP": "#0C2340", "NYK": "#F58426", "OKC": "#007AC1", "ORL": "#0077C0", "PHI": "#006BB6", "PHO": "#1D1160", "POR": "#E03A3E", "SAC": "#5A2D81", "SAS": "#000000", "TOR": " #CE1141", "UTA": "#002B5C", "WAS": "#002B5C"};


//pushes all non-blank elements to an array and returns that array 
 function cleanArray(arr){
    let arrayOne = [];
    for(let i = 0; i < arr.length; i++){
        if(arr[i]) {
            arrayOne.push(arr[i]);
        };
    };
    return arrayOne;
};

/* serialize the body text of a webpage and remove special characters*/
function getSerializedPageText(element){
    serializedPageText = cleanArray(document.body.innerText.replace(/[^A-Za-z0-9_-]/g, ' ').toLowerCase().split(" ")) 
};

//Extract just the found names into an array to be converted to a regExp 
function extractNames(arr){
    let newArr = [];
    for(i = 0; i < (arr.length); i++){
        if(!newArr.includes(arr[i].Player.toLowerCase())) {
            newArr.push(arr[i].Player.toLowerCase());
            };  
        };
    return newArr;
};

// Search and Wrap with Element Tag  
function findAllNodesWithPlayerNames(arr, element){
	nodeArray = [];
	let htmlCollection = element.querySelectorAll("p, a, span, h1, h2, h3, h4, h5, h6, li");
	htmlCollection.forEach(element => {
		if(new RegExp(arr.join("|"), "i").test(element.textContent)) {
		    nodeArray.push(element);
		};
	});
}

//used by replaceText to fill in match portion 
function insertStatsAndName(match, options){ 
	if(this.highlighting){
		return `<span class='stat-box' data-highlight-${this.colorChoice}='true' data-player='${match}'>${match}</span>`;
	}
	else {
		return `<span class='stat-box' data-player='${match}'>${match}</span>`;
	}
}

//Creates map of names for tippy intialization function
function prepareStatsAndNames(obj){ 
	let key;
	let map = {};
	for(i = 0; i < obj.length; i++){
		key = obj[i].Player.toLowerCase();
		map[key] = obj[i];
	}
	console.log(map);
	return map;
}


//Loop through text nodes with players names and wrap with span
function replaceText(arr1, arr2, options) {
    for(i = 0; i < arr1.length; i++){
        for(j = 0; j < arr2.length; j++){
            const regex = new RegExp(arr2[j], 'ig');
            arr1[i].innerHTML = arr1[i].innerHTML.replace(regex, insertStatsAndName.bind(options));  
        };
    };
};

function createAndPopulateTooltips(element) {
	const nodeCollectionForTippy = element.querySelectorAll(".stat-box");
	let counter = 0;
	tippy(nodeCollectionForTippy, {
			allowHTML: true,
			content: function() { 
			const stat = responseMap[nodeCollectionForTippy[counter].dataset.player.toLowerCase()]; //gets individual stats for current player
			counter++;
			let playerName = stat.Player.toLowerCase().split(" ");
				return `<h4 id="stat-box-header-${counter}" style="background-color: ${teamColors[stat.Tm]};"><a target="_blank" href="https://www.basketball-reference.com${stat['URL']}">${stat.Player}</a> | ${stat.Pos} ${stat.Tm}</h4>
				<table id="stat-box-table-${counter}">
					<tr>
						<th>G</th>
						<th>MPG</th>
						<th>FG%</th>
						<th>3P%</th>
					</tr>
					<tr>
						<td>${stat.G}</td>
						<td>${stat.MP}</td>
						<td>${stat["FG%"]}</td>
						<td>${stat["3P%"]}</td>
					</tr>
					<tr>
						<th>PPG</th>
						<th>RPG</th>
						<th>APG</th>
						<th>PER</th>
					</tr>
					<tr>
						<td>${stat["PS\/G"]}</td>
						<td>${stat.TRB}</td>
						<td>${stat.AST}</td>
						<td>${stat.PER}</td>
					</tr>
				</table>`}, 
			placement: "top", 
			zIndex: 9999999, 
			interactive: true,
			arrow: true,
			arrowType: "sharp",
			// trigger: "click" /*for inspecting html/css*/
		});
};


//On page ready, do all the things
$( document ).ready(init); 

//all the things 
function init() {
	const t1 = performance.now();
	const currentDate = +new Date();
	getSerializedPageText(); 
	chrome.runtime.sendMessage([serializedPageText, (JSON.stringify(currentDate))], function(response) {
	    if (response.response.length === 0) { 
	    	return false;
	    }
	    else {
	    	console.log(response);
		    playersFoundNames = extractNames(response.response); 
		    responseMap = prepareStatsAndNames(response.response);
		    findAllNodesWithPlayerNames(playersFoundNames, document);
			replaceText(nodeArray, playersFoundNames, response.options); 
			createAndPopulateTooltips(document)
		}
	}); 
	console.log(nodeArray); // DEBUGGING ONLY
	const t2 = performance.now();
	console.log(t2 - t1);
};

//Adapt to Never-ending Reddit Scroll
$(window).bind( 'neverEndingLoad', function(e) { 
	const redditContainers = document.querySelectorAll("#siteTable")
	const element = redditContainers[(redditContainers.length - 1)]
	console.log(element);
	const currentDate = +new Date();
	serializedPageText = cleanArray(element.innerText.replace(/[^A-Za-z0-9_-]/g, ' ').toLowerCase().split(" "))  
	chrome.runtime.sendMessage([serializedPageText, (JSON.stringify(currentDate))], function(response) {
	    if (response.response.length === 0) { 
	    	return false;
	    }
	    else {
	    	console.log(response);
		    playersFoundNames = extractNames(response.response); 
		    responseMap = prepareStatsAndNames(response.response);
		    findAllNodesWithPlayerNames(playersFoundNames, element);
			replaceText(nodeArray, playersFoundNames, response.options); 
			createAndPopulateTooltips(element)
		}
	}); 
});


//ESPN SPA Detection Attempts w/ resources used (work in progress)
/*
let url = location.href //https://stackoverflow.com/questions/37676526/how-to-detect-url-changes-in-spa
window.addEventListener("click", function(e) {
		requestAnimationFrame(() => {
			url!==location.href&&console.log('url changed');
      		url = location.href;
      		init();
		})
	}, true)
*/

/*window.addEventListener('hashchange', function(e) { LOOK INTO THIS ANSWER: https://stackoverflow.com/questions/2844565/is-there-a-javascript-jquery-dom-change-listener/39508954#39508954
    console.log('URL hash changed', e);
    doSomething();
});
window.addEventListener('popstate', function(e) {
    console.log('State changed', e);
    doSomething();
});

*/