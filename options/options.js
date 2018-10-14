const save = document.querySelector("#save");
save.addEventListener('click', save_options);

//LEFT OFF - INPUT VALUES ARE NOT CHANGING WHEN SLIDER CHANGES - need to find out how to capture

function truthConverter(input) {
		if(input === "on") {
			return true;
		}
		else if (input === "off") {
			return false;
		}
		else if (input === true) {
			return "on";
		}
		else if(inpur === false) {
			return "off";
		}
	}

function save_options() {

	const NBAOnlyURLsOption = truthConverter(document.querySelector("#NBAOnlyURLs").value);
	const playerHighlightingOption = truthConverter(document.querySelector("#playerHighlighting").value);

	console.log(NBAOnlyURLsOption, playerHighlightingOption)

	chrome.storage.sync.set({
		options: {
			extensionOn: true, //MAKE CLICKABLE TURN OFF FOR EXTENSION -- 
			nbaURL: NBAOnlyURLsOption,
			highlighting: playerHighlightingOption,
			color: "rgba(12.9%,95.3%,49.4%, .25)", //INSERT COLOR PICKER
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
  	console.log(truthConverter(items.options.nbaURL));
    document.querySelector('#NBAOnlyURLs').value = truthConverter(items.options.nbaURL);
    document.querySelector('#playerHighlighting').checked = truthConverter(items.options.highlighting);
  });
};

document.addEventListener('DOMContentLoaded', restore_options);






