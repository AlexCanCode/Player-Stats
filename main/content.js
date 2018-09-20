let serializedPageText; 
let playersFoundNames; //populated in sendMessage response callback
let nodeArray = []; //Array of all nodes that contain players names

//pushes all non-blank elements to an array and returns that array - need to set to run on load, perhaps? Otherwise might not get everything
 function cleanArray(arr){
    let arrayOne = [];
    for(var i = 0; i < arr.length; i++){
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

//Loop through text nodes with players names and wrap with span
function replaceText(arr1, arr2) { 
    for(i = 0; i < (arr1.length - 1); i++){
        for(j = 0; j < (arr2.length - 1); j++){
            const regex = new RegExp(arr2[j], 'ig');
            arr1[i].innerHTML = arr1[i].innerHTML.replace(regex, "<span class='stat-box' title='$&'>$&</span>"); 
            //replace span with the tag name you end up using
        };
    };
};

$( document ).ready(init); 

function init() {
	const t1 = performance.now();
	getSerializedPageText(); 

	chrome.runtime.sendMessage(serializedPageText, function(response) {
	    if(response.response.length === 0) {
	    	return false;
	    }
	    else {
		    console.log(response.response); //DEBUGGING ONLY
		    playersFoundNames = extractNames(response.response); 
		    //Walk the DOM and return all nodes with text that matches a name in players
			walkTheDOM(document.body, function(node) {
			    if(node.children){
			        if(node.children.length === 0 || node.tagName === "P"){ //all non-parent nodes and paragraphs. Will need to teak for performance and accuracy
			            if(new RegExp(playersFoundNames.join("|"), "i").test(node.textContent)) {
			                    nodeArray.push(node);
			            };
			        };
			    };
			});
			replaceText(nodeArray, playersFoundNames);
		}
	}); 
	$(".stat-box").tooltipster();
	console.log(nodeArray); // DEBUGGING ONLY
	const t2 = performance.now();
	console.log(t2 - t1);
};

//ADD AND POPULATE TOOLTIPS

/* next steps

1. inject stat-box template into page in the appropriate flow to 
	a. be utilized by tooltipster BUT also
	b. not be instiated if it is not needed.

2. Follow tooltipster "5. Use HTML inside your tooltips" */
