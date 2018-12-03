
tippy(document.querySelector("#example-box"), {
			allowHTML: true,
			content: function() {
				return `<h4 id="stat-box-header-example" style="background-color: #007A33;"><a target="_blank" href="https://www.basketball-reference.com/players/b/birdla01.html">Larry Bird</a> | SF BOS</h4>
								<table id="stat-box-table-example">
									<tr>
										<th>G</th>
										<th>MPG</th>
										<th>FG%</th>
										<th>3P%</th>
									</tr>
									<tr>
										<td>74</td>
										<td>40.6</td>
										<td>.525</td>
										<td>.400</td>
									</tr>
									<tr>
										<th>PPG</th>
										<th>RPG</th>
										<th>APG</th>
										<th>PER</th>
									</tr>
									<tr>
										<td>28.1</td>
										<td>9.2</td>
										<td>7.6</td>
										<td>26.4</td>
									</tr>
								</table>`}, 
							placement: "top", 
							zIndex: 9999999, 
							interactive: true,
							arrow: true,
							arrowType: "sharp",
							trigger: "click" /*for inspecting html/css*/
					})