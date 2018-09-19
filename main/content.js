//DOM MANIPULATION SCRIPT


//Accesses finalStatObjectString stored in local storage. May be used to access the data later
 /* chrome.storage.local.get("quickStats", function(value) {
    console.log(value.quickStats);
  }) */


const t1 = performance.now();

//pushes all non-blank elements to an array and returns that array - need to set to run on load, perhaps? Otherwise might not get everything
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
let serializedPageText; 

function getSerializedPageText(){
    serializedPageText = cleanArray(document.body.innerText.replace(/[^A-Za-z0-9_-]/g, ' ').toLowerCase().split(" ")) //Assigning a variable in global scope from local seems like bad practice, need to clean-up this code to return a value that THEN gets assigned to serializedPageText.
};

getSerializedPageText(); 

let playersFound; 

chrome.runtime.sendMessage(serializedPageText, function(response) {
    playersFound = response;
}); //LEFT OFF HERE: Need to get response and use it to create tooltips and populate them with data. How do you get the value of a promise out of the promise itself?

console.log(playersFound);

const t2 = performance.now()

console.log(t2 - t1);


// Runs once serach is done
//const playersFound = PlayerMap.playerSearch(serializedPageText); //Need to determine how it will access PlayerMap Data

function extractNames(arr){
    let newArr = [];
    for(i = 0; i < (arr.length); i++){
        if(!newArr.includes(arr[i].Player.toLowerCase())) {
            newArr.push(arr[i].Player.toLowerCase());
            }   
        }
    return newArr;
};

/*

 playersFoundNames = extractNames(playersFound); An array of all players found. Used after search, may move to background script. 

// Search and Wrap with Element Tag Logic 

//recursive function that iterates through all nodes
function walkTheDOM(node, func) {
    func(node);
    node = node.firstChild;
    while(node) {
        walkTheDOM(node, func);
        node = node.nextSibling;
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

*/ 