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
})