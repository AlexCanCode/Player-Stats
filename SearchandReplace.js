const t1 = performance.now();

function walkTheDOM(node, func) {
	func(node);
	node = node.firstChild;
	while(node) {
		walkTheDOM(node, func);
		node= node.nextSibling;
	}
}

const players = ["jayson tatum", "joe ingles", "lance stephenson", "tim duncan", "michael jordan", "derrick rose", "javale mcgee", "harry giles", "paul pierce", "dwight howard", "kevin durant", "shaun livingston", "nikola jokic", "deandre jordan", "luol deng", "goran dragic", "steph curry", "wayne ellington"]

const nodeArray = []

walkTheDOM(document.body, function(node) {
	if(node.children){
		if((node.textContent.toLowerCase().includes("jayson tatum") || node.textContent.toLowerCase().includes("joe ingles") || node.textContent.toLowerCase().includes("harry giles") || node.textContent.toLowerCase().includes("michael jordan") || node.textContent.toLowerCase().includes("paul pierce") || node.textContent.toLowerCase().includes("dwight howard") || node.textContent.toLowerCase().includes("kevin durant") || node.textContent.toLowerCase().includes("nikola jokic") || node.textContent.toLowerCase().includes("shaun livingston") || node.textContent.toLowerCase().includes("deandre jordan") || node.textContent.toLowerCase().includes("derrick rose") || node.textContent.toLowerCase().includes("luol deng") || node.textContent.toLowerCase().includes("goran dragic") || node.textContent.toLowerCase().includes("lance stephenson") || node.textContent.toLowerCase().includes("steph curry") || node.textContent.toLowerCase().includes("wayne ellington") || node.textContent.toLowerCase().includes("javale mcGee") || node.textContent.toLowerCase().includes("tim duncan") ) && node.children.length === 0){

			console.log(node.innerHTML);
			nodeArray.push(node);
		}
	}
});

function replaceText(arr1, arr2) { // may want to decide which array is bigger before loop and customize for performance
	for(i = 0; i < (arr1.length - 1); i++){
		for(j = 0; j < (arr2.length - 1); j++){
			arr1[i].innerHTML = "got a bunch of tthings <span>jayson tatum</span>"//arr1[i].innerHTML.replace(`/${arr2[j]}/ig`, `<span>${arr2[j]}`); //****** LEFT OFF IN THIS FUNCITON: trying to automatically replace the innerhtml with the right players name and a span. Not working but no errors as of now. 
		}
	}
}

//TAKES A LOT LONGER ON THE COMMENTS SECTION OF REDDIT... WHY? 

replaceText(nodeArray, players);

const t2 = performance.now();

console.log(t2 - t1);