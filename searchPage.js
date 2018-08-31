const t1 = performance.now();

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

function runWalker(arr){
	const nodes = []; 
	for(i = 0; i < (arr.length - 1); i++){
		nodes.push(textNodesUnder(body, arr[i]));
	}
};

const foundNodes = runWalker(NEEDSARR);

const t2 = performance.now();

console.log(t2 - t1);

console.log(foundNodes);

//manipulate items in the array

foundNodes[0][0].innerHTML = [same inner HTML with your element added around the word]
