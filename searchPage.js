const t1 = performance.now();

const playerArr = ["kyrie irving", "ben mclemore", "david west", "damian lillard", "kyle singler", "ben wallace", "tony parker", "shawn kemp", "demarcus cousins"]

//create tree walker and search if inputted string exists, return all nodes with no children where it exists
function textNodesUnder(el, str){
	let n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT, 
		{acceptNode: function(node){ 
			if((node.innerHTML.toLowerCase().indexOf(str) >= 0))
				if(node.children.length > 0){
					return NodeFilter.FILTER_SKIP;
				}
				else {
				return NodeFilter.FILTER_ACCEPT;
			}
			} 
		}
		, false);
	while(n=walk.nextNode()) a.push(n);
	return a;
}

const body = document.querySelector("body");

const foundNodes = []; 

function runWalker(){
	for(i = 0; i < (playerArr.length - 1); i++){
		console.log(i);
		foundNodes.push(textNodesUnder(body, playerArr[i]));
	}
};

runWalker();

const t2 = performance.now();

console.log(t2 - t1);

console.log(foundNodes);

//manipulate items in the array

foundNodes[0][0].innerHTML = [same inner HTML with your element added around the word]
