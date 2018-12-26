//Need to check the local storage object for each funciton and make sure there are no:
// - Unintended consequences
// - Double saves
// - Non-saves
// - Other odd functionality
//Should be able to test all changes added in future 

describe("Options Script", () => {

	beforeEach(() => {
		let optionsBefore = [];
		chrome.storage.get(null, (item => { // how to check options against what they should be?
			console.log(items)
		}))
	})

	describe("save_options", () => {

	})
	
	describe("restore_options", () => {

	}

})