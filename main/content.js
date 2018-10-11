let serializedPageText; 
let playersFoundNames; //populated with sendMessage response callback
let nodeArray = []; //Array of all nodes that contain players names
let responseMap; //To be an object of arrays where the player name is the key for fast lookup while creating tooltip. May want to change main.js response format to render this unecessary. 
const acceptedTagNames = ["A", "P", "H1", "H2", "H3", "H4", "H5", "H6", "LI"]
const teamColors = {"ATL": "#E03A3E", "BOS": "#007A33", "BRK": "#000000", "CHI": "#CE1141", "CHO": "#1D1160", "CLE": "#6F263D", "DAL": "#00538C", "DEN": "#0E2240", "DET": "#C8102E", "GSW": "#006BB6", "HOU": "#CE1141", "IND": "#002D62", "LAC": "#C8102E", "LAL": "#552583", "MEM": "#5D76A9", "MIA": "#98002E", "MIL": "#00471B", "MIN": "#0C2340", "NOP": "#0C2340", "NYK": "#F58426", "OKC": "#007AC1", "ORL": "#0077C0", "PHI": "#006BB6", "PHO": "#1D1160", "POR": "#E03A3E", "SAC": "#5A2D81", "SAS": "#000000", "TOR": " #CE1141", "UTA": "#002B5C", "WAS": "#002B5C"}


//pushes all non-blank elements to an array and returns that array - need to set to run on load, perhaps? Otherwise might not get everything
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
function getSerializedPageText(){
    serializedPageText = cleanArray(document.body.innerText.replace(/[^A-Za-z0-9_-]/g, ' ').toLowerCase().split(" ")) //Assigning a variable in global scope from local seems like bad practice, need to clean-up this code to return a value that THEN gets assigned to serializedPageText.
};

//Extract just the found names into an array to be converted to a regExp for the DomWalker
function extractNames(arr){
    let newArr = [];
    for(i = 0; i < (arr.length); i++){
        if(!newArr.includes(arr[i].Player.toLowerCase())) {
            newArr.push(arr[i].Player.toLowerCase());
            };  
        };
    return newArr;
};

// Search and Wrap with Element Tag Logic 
//recursive function that iterates through all nodes
function walkTheDOM(node, func) {
    func(node);
    node = node.firstChild;
    while(node) {
        walkTheDOM(node, func);
        node = node.nextSibling;
    };
};

function findAllNodesWithPlayerNames(arr){
	let htmlCollection = document.querySelectorAll("p, a, span, h1, h2, h3, h4, h5, h6, li");
	htmlCollection.forEach(element => {
		if(new RegExp(arr.join("|"), "i").test(element.textContent)) {
		    nodeArray.push(element);
		};
	});
}

function insertStatsAndName(match){ //used by replaceText to fill in match portion
	return `<span class='stat-box' data-player='${match}'>${match}</span>`;
}

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
function replaceText(arr1, arr2) {  //Problem of missing players on page likely stems from this function as the node array variable has the right elements but this funciton is failing to put the right class in them. For some reason, on the test page this function works when the test paragraph is frist but not when it is followed by several other paragraphs. 
    for(i = 0; i < arr1.length; i++){
        for(j = 0; j < arr2.length; j++){
            const regex = new RegExp(arr2[j], 'ig');
            arr1[i].innerHTML = arr1[i].innerHTML.replace(regex, insertStatsAndName); 
        };
    };
};

function createAndPopulateTooltips() {
	const nodeCollectionForTippy = document.querySelectorAll(".stat-box");
	let counter = 0;
	tippy(nodeCollectionForTippy, {
			allowHTML: true,
			content: function() { 
			const stat = responseMap[nodeCollectionForTippy[counter].dataset.player.toLowerCase()]; //gets individual stats for current player
			counter++;
			let url = chrome.runtime.getURL("/main/arrow.svg");
			console.log(url)
			let playerName = stat.Player.toLowerCase().split(" ");
				return `<h4 id="stat-box-header-${counter}" style="background-color: ${teamColors[stat.Tm]};"><a target="_blank" href="https://www.basketball-reference.com/players/${playerName[1].charAt()}/${playerName[1]}${playerName[0].charAt()}${playerName[0].charAt(1)}01.html">${stat.Player} <img src=${url} 
    height="auto"
    width="auto"/></a> | ${stat.Pos} ${stat.Tm}</h4>
				<table id="stat-box-table-${counter}">
		<tr>
			<th>G</th>
			<th>MPG</th>
			<th>FG%</th>
			<th>TS%</th>
		</tr>
		<tr>
			<td>${stat.G}</td>
			<td>${stat.MP}</td>
			<td>${stat["FG%"]}</td>
			<td>${stat["TS%"]}</td>
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

function init() {
	const t1 = performance.now();
	getSerializedPageText(); 

	chrome.runtime.sendMessage(serializedPageText, function(response) {
	    if (response.response.length === 0) {
	    	return false;
	    }
	    else {
	    	console.log(response.response);
		    playersFoundNames = extractNames(response.response); 
		    responseMap = prepareStatsAndNames(response.response);
		    //Walk the DOM and return all nodes with text that matches a name in players
		    findAllNodesWithPlayerNames(playersFoundNames);
			/*walkTheDOM(document.body, function(node) {
			    if(node.children){
			        if(acceptedTagNames.includes(node.tagName)){ //This search logic needs work. Does not pick up all instance of names on a page. Need to find a balence between performance and coverage. Will need tweaking and a deep dive into how the funciton works. 
			            if(new RegExp(playersFoundNames.join("|"), "i").test(node.textContent)) {
			                    nodeArray.push(node);
			            };
			        };
			    };
			});*/
			replaceText(nodeArray, playersFoundNames); 
			createAndPopulateTooltips()
		}
	}); 
	console.log(nodeArray); // DEBUGGING ONLY
	const t2 = performance.now();
	console.log(t2 - t1);
};
