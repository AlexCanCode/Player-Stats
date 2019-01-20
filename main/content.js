let playersFoundNames; //populated with sendMessage response callback
let responseMap; //An object of arrays where the player name is the key for fast lookup while creating tooltip. 
const teamColors = {"ATL": "#E03A3E", "BOS": "#007A33", "BRK": "#000000", "CHI": "#CE1141", "CHO": "#1D1160", "CLE": "#6F263D", "DAL": "#00538C", "DEN": "#0E2240", "DET": "#C8102E", "GSW": "#006BB6", "HOU": "#CE1141", "IND": "#002D62", "LAC": "#C8102E", "LAL": "#552583", "MEM": "#5D76A9", "MIA": "#98002E", "MIL": "#00471B", "MIN": "#0C2340", "NOP": "#0C2340", "NYK": "#F58426", "OKC": "#007AC1", "ORL": "#0077C0", "PHI": "#006BB6", "PHO": "#1D1160", "POR": "#E03A3E", "SAC": "#5A2D81", "SAS": "#000000", "TOR": " #CE1141", "UTA": "#002B5C", "WAS": "#002B5C"};


//pushes all falsy elements (generally "") to an array and returns that array 
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
    return cleanArray(document.body.innerText.replace(/[^A-Za-z0-9_-]/g, ' ').toLowerCase().split(" ")) 
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
	let nodeArray = []; 
	let htmlCollection = element.querySelectorAll("p, a, span, h1, h2, h3, h4, h5, h6, li");
	htmlCollection.forEach(element => {
		if(element.classList.contains("flair") || element.classList.contains("tagline")) {
			return
		}
		else if(new RegExp(arr.join("|"), "i").test(element.textContent)) {
		    nodeArray.push(element);				
		};
	});
	return nodeArray;
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
						<td>${stat["3P%"] ? stat["3P%"] : ".000"}</td>
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

//TODO: Explore creating an Init function that can be called depending on webpage - Will help deal with single page apps and neveredning scrolls that might call for different inits

//On page ready, do all the things
$( document ).ready(init); 

//all the things 
function init() {
	const currentDate = +new Date();
	
	chrome.runtime.sendMessage([getSerializedPageText(), (JSON.stringify(currentDate))], function(response) {
	    if (response.response.length === 0) { 
	    	return false;
	    }
	    else {
		    playersFoundNames = extractNames(response.response); 
		    responseMap = prepareStatsAndNames(response.response);
			replaceText(findAllNodesWithPlayerNames(playersFoundNames, document), playersFoundNames, response.options); 
			createAndPopulateTooltips(document)
		}
	}); 
};

//Adapt to Never-ending Reddit Scroll
$(window).bind( 'neverEndingLoad', function(e) { 
	const redditContainers = document.querySelectorAll("#siteTable")
	const element = redditContainers[(redditContainers.length - 1)]
	const currentDate = +new Date();
	chrome.runtime.sendMessage([getSerializedPageText(), (JSON.stringify(currentDate))], function(response) {
	    if (response.response.length === 0) { 
	    	return false;
	    }
	    else {
		    playersFoundNames = extractNames(response.response); 
		    responseMap = prepareStatsAndNames(response.response);
			replaceText(findAllNodesWithPlayerNames(playersFoundNames, element), playersFoundNames, response.options); 
			createAndPopulateTooltips(element)
		}
	}); 
});




//https://stackoverflow.com/questions/4570093/how-to-get-notified-about-changes-of-the-history-via-history-pushstate

/* Most promising solution thusfar, works in the console but haven't been able to hack it together in the extension. 
(function(history){
    var pushState = history.pushState;
    history.pushState = function(state) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({state: state});
        }
        // whatever else you want to do
        // maybe call onhashchange e.handler
        return pushState.apply(history, arguments);
    }
})(window.history);

window.onpopstate = history.onpushstate = function(e) {
    console.log("we caught a change");
};
*/

