const sampleNames = ["Larry Bird", "Michael Jordan", "Kobe Bryant", "Kareem Abdul-Jabbar", "Shaquille O'Neal", "Tim Duncan", "Wilt Chamberlain", "Hakeem Olajuwon", "Oscar Robertson", "Jerry West", "Julius Erving"]
const colors = {
	"green": "rgba(33, 243,126, 0.25)", 
	"orange": "rgba(243, 126, 33, 0.25)",
	"blue": "rgba(33, 150, 243, 0.25)",
	"purple": "rgba(126, 33, 243, 0.25)"
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function save_options() {

	const powerOption = document.querySelector("#power").checked;
	const NBAOnlyURLsOption = document.querySelector("#NBAOnlyURLs").checked;
	const playerHighlightingOption = document.querySelector("#playerHighlighting").checked;
	let colorOption = getKeyByValue(colors, `${document.querySelector("#example").style.backgroundColor}`);

	if(!colorOption) {
		colorOption = "green";
	}


	chrome.storage.sync.set({
		options: {
			extensionOn: powerOption, //MAKE CLICKABLE TURN OFF FOR EXTENSION -- 
			nbaOnlyURLs: NBAOnlyURLsOption,
			highlighting: playerHighlightingOption,
			colorChoice: colorOption, 
			blacklist: ["basketball-reference"]
		}
	}, function(options) {
		//alert user of save
		let status = document.querySelector("#status");
		status.textContent = "Options Saved."
		console.log("options saved");
		setTimeout(function() {
			status.textContent = '';
		}, 1000)
	});
}

function restore_options() {

	tippy(document.querySelectorAll(".info-tip"), { //move to dom onload content so it doesn't try to run the second it is fired up?
	"placement": "right"
	})

  chrome.storage.sync.get( "options", function(items) {
  	document.querySelector("#power").checked = items.options.extensionOn;
    document.querySelector('#NBAOnlyURLs').checked = items.options.nbaOnlyURLs;
    document.querySelector('#playerHighlighting').checked = items.options.highlighting;
    document.querySelector('#example').style.backgroundColor = colors[items.options.colorChoice];
  });
};

document.addEventListener('DOMContentLoaded', restore_options);
const save = document.querySelector("#save");
save.addEventListener('click', save_options);
document.querySelector("#example").textContent = sampleNames[Math.floor(Math.random()* (sampleNames.length - 1))]


const colorButtons = document.querySelectorAll(".color")

colorButtons.forEach(function(element, index) {
	element.addEventListener('click', function(e) {
		const exampleName = document.querySelector("#example");
		exampleName.style.backgroundColor = colors[e.toElement.id];
		
	})	
})








