//Need to check the local storage object for each funciton and make sure there are no:
// - Unintended consequences
// - Double saves
// - Non-saves
// - Other odd functionality
//Should be able to test all changes added in future 
//https://medium.com/information-and-technology/unit-testing-browser-extensions-bdd4e60a4f3d

describe("Options Script", () => {

	beforeEach(() => {
		let optionsBefore = [];
		chrome.storage.get(null, (item => { // how to check options against what they should be?
			console.log(items)
		}))
	})

	describe("save_options", () => {
		it("should capture current options button's states and save them to stroage", ()=> {
			expect(save_options())
		})
	})
	
	describe("restore_options", () => {

	})

})