import csv
import requests
from bs4 import BeautifulSoup

url = 'https://www.basketball-reference.com/leagues/NBA_2018_per_game.html'
response = requests.get(url)
html = response.content

soup = BeautifulSoup(html, "html.parser")
table = soup.find('tbody')

list_of_rows = []
for row in table.findAll('tr'):
	list_of_cells = []
	for cell in row.findAll('td'):
		text = cell.text
		list_of_cells.append(text)
	list_of_rows.append(list_of_cells)

clean_list_of_rows = filter(None, list_of_rows)

outfile = open("./players.csv", "w", newline='')
writer = csv.writer(outfile)
writer.writerow(["Player", "Pos", "Age", "Tm", "G", "GS", "MP", "FG", "FGA", "FG%", "3P", "3PA", "3P%", "2P", "2PA", "2P%", "eFG%", "FT", "FTA", "FT%", "ORB", "DRB", "TRB", "AST", "STL", "BLK", "TOV", "PF", "PS/G"])
writer.writerows(clean_list_of_rows)