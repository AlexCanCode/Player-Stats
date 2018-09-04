const t1 = performance.now();


//recursive function that iterates through all nodes
function walkTheDOM(node, func) {
	func(node);
	node = node.firstChild;
	while(node) {
		walkTheDOM(node, func);
		node= node.nextSibling;
	}
}

const players = ["jayson tatum", "joe ingles", "lance stephenson", "tim duncan", "michael jordan", "derrick rose", "javale mcgee", "harry giles", "paul pierce", "dwight howard", "kevin durant", "shaun livingston", "nikola jokic", "deandre jordan", "luol deng", "goran dragic", "steph curry", "wayne ellington"] //NEXT: Generate this list from hash result 

//Array of all nodes that contain players names
const nodeArray = []

//Walk the DOM and return all nodes with text that matches a name in players
walkTheDOM(document.body, function(node) {
	if(node.children){
		if(node.children.length === 0){
			if(new RegExp(players.join("|"), "i").test(node.textContent)) {
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

replaceText(nodeArray, players);

const t2 = performance.now();

console.log(t2 - t1);








