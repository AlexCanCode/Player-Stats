describe("Content Script", function() {

	describe("cleanArray(arr)", () => {

		let pageText; 
		let ret; 

		beforeEach(function () {
			pageText = document.body.innerText.replace(/[^A-Za-z0-9_-]/g, ' ').toLowerCase().split(" ");
			ret = cleanArray(pageText);
		})

		it("should return an array of strings with no falsy values - specifically targeting empty strings", () => {
			expect(ret).not.toEqual(jasmine.arrayContaining([""]));
			
		})

		it("should return an array", () => {
			expect(ret.constructor).toEqual(Array)
		})

	})

	describe("getSerializedPageText(element)", () => {
		const acceptableChars = ["-", "_"]


		it("should return no special characters other than those listed in acceptableChars", () => {
				const unacceptableChars = [".", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "+", "=", "'", ",", "<", ">", "?", "/", ":", ";", '"', "`", "~", " "]
				const serializedPageText = getSerializedPageText();
				const hasSpecialChars = unacceptableChars.reduce((all, char) => {
					if(serializedPageText.includes(char)){
						all = true;
					}
					return all;
				}, false)
				
				expect(hasSpecialChars).toEqual(false)				
			})

	 /*	it("should capture all words on a webpage", () => {
			//Don't Know how to test for this!
		})*/

		it("should return an array", () => {
			expect(getSerializedPageText().constructor).toEqual(Array)
		})
	})

	describe("extractNames(arr)", () => {

		let inputArray = {"response": [{"3P%": ".208","AST": "2.1","Age": "19","FG%": ".469","G": "27","MP": "25.3","PER": "16.1","PS/G": "10.9","Player": "Wendell Carter","Pos": "C","TRB": "7.0","TS%": ".534","Tm": "CHI","URL": "/players/c/cartewe01.html"},{"3P%": ".500","AST": "5.8","Age": "30","FG%": ".513","G": "16","MP": "33.4","PER": "28.4","PS/G": "29.6","Player": "Stephen Curry","Pos": "PG","TRB": "5.1","TS%": ".686","Tm": "GSW","URL": "/players/c/curryst01.html" },{"3P%": ".350", "AST": "2.0", "Age": "27", "FG%": ".435", "G": "24", "MP": "19.7", "PER": "16.1", "PS/G": "9.3", "Player": "Kelly Olynyk", "Pos": "PF", "TRB": "4.1", "TS%": ".606", "Tm": "MIA", "URL": "/players/o/olynyke01.html"}]};

		// let liveInputArray = TODO - write ajax request to get live data and test your code with it as well so you aren't always using static tests.

		//Tests for specific cases against the input array
		it("should return an array of names from an array of objects with player information", () => {
			const nameOne = inputArray["response"][0].Player.toLowerCase();
			const nameTwo = inputArray["response"][1].Player.toLowerCase();
			const nameThree = inputArray["response"][2].Player.toLowerCase();
			const ret = extractNames(inputArray["response"])
			
			expect(ret[0]).toEqual(nameOne);
			expect(ret[1]).toEqual(nameTwo);
			expect(ret[2]).toEqual(nameThree);
		})

		it("should return an array", () => {
			expect(extractNames(inputArray["response"]).constructor).toEqual(Array)
		})

	})

	describe("findAllNodesWithPlayerNames(arr, element)", () => {
		//Should return all nodes with any of the players listed in it
		it("should return an array", () => {
			expect(findAllNodesWithPlayerNames(playerFoundNames, document).constructor).toEqual(Array)
		})
	})











})