//create a class for stat-box element

class statBox extends HTMLElement {
	constructor() {
		super();

		const shadow = this.attachShadow({mode: open});

		const wrapper = document.creatElement("div");
		wrapper.setAttribute("class", "stat-box");

		const table = document.creatElement("table");
		table.setAttribute("class", "stat-table");

	}
}