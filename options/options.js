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
	const blacklistValues = document.querySelector("#blacklist-entries").value.replace( /\n/g, " " ).split( " " ).filter((str) => /\S/.test(str));

	console.log(blacklistValues);
	
	//manage icon color
	if(powerOption) {
		chrome.browserAction.setIcon( {
			path: "../assets/icon16.png"
		})
	}
	if(!powerOption){
		chrome.browserAction.setIcon( {
			path: "../assets/icon16-grey.png"
		})
	}

	//If no color selection, default to green
	if(!colorOption) {
		colorOption = "green";
	}

	chrome.storage.local.set({
		options: {
			extensionOn: powerOption, 
			nbaOnlyURLs: NBAOnlyURLsOption,
			highlighting: playerHighlightingOption,
			colorChoice: colorOption, 
			blacklist: blacklistValues
		}
	}, function(options) {
		console.log("options saved");
	});
};

//runs on page load
function restore_options() {
	tippy(document.querySelectorAll(".info-tip"), {
	"placement": "top"
	});
	//Adds save for all inputs (sliders)
	const inputs = document.querySelectorAll("input");
	inputs.forEach(function(item, index) {
		item.addEventListener("change", save_options);
	})

	//Adds save for all buttons with .save
	const buttons = document.querySelectorAll(".save");
	buttons.forEach(function(item, index) {
		item.addEventListener("click", save_options);
	})

	document.querySelector("#example").textContent = sampleNames[Math.floor(Math.random()* (sampleNames.length - 1))]

	//restore options
  	chrome.storage.local.get( "options", function(items) {
	  	document.querySelector('#power').checked = items.options.extensionOn;
	    document.querySelector('#NBAOnlyURLs').checked = items.options.nbaOnlyURLs;
	    document.querySelector('#playerHighlighting').checked = items.options.highlighting;
	    document.querySelector('#example').style.backgroundColor = colors[items.options.colorChoice];
	    const blacklistTextarea = document.querySelector('#blacklist-entries')
	    items.options.blacklist.map((item) => {
	    	blacklistTextarea.value += item + "\n";
	    })
	});

  	//Add event listener to button update => send message to background script to trigger update XHR and rehash
	const updateButton = document.querySelector("#update")
	updateButton.addEventListener("click", (e) => {
		let stampedDate = +new Date(new Date().setDate(new Date().getDate()-1));
		chrome.runtime.sendMessage(["update", JSON.stringify(stampedDate)], (response) => {
			const updateStatus = document.querySelector("#update-status")
			updateStatus.style.color = "red";
			setTimeout(()=> updateStatus.style.color = "white", 750)
		});
	})
};

document.addEventListener('DOMContentLoaded', restore_options);

const colorButtons = document.querySelectorAll(".color")

colorButtons.forEach(function(element, index) {
	element.addEventListener('click', function(e) {
		const exampleName = document.querySelector("#example");
		exampleName.style.backgroundColor = colors[e.toElement.id];
	})	
})









