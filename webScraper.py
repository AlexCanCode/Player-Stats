import requests
from bs4 import BeautifulSoup

url = 'https://www.basketball-reference.com/leagues/NBA_2018_per_game.html'
response = requests.get(url)
html = response.content

soup = BeautifulSoup(html, "html.parser")
table = soup.find("table")
print (table.prettify())
