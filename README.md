# Player-Stats
A chrome extension that displays relevant, up-to-date NBA Stats for any player simply by hovering over their name on any given webpage. 

## Table of Contents
- Motivation
- How it Works
- Development Status
- ScreenShots
- Tech/framework used
- Tests


## Motivation

As a fan of basketball and the NBA, I often found my NBA reading "workflow" would go something like this. 

1. Open an article to read
2. See a player's name on the page
3. Wonder how they are performing this season 
4. CTL+T
5. Google name
6. Click on ESPN or Basektball Reference for their stats 

I set out to develop an extension that would end this process on step 3. The extension identifies all current NBA player names on any given webpage and adds an HTML element that displays onmouseover and contains the most relevant stats for the current season. That is, Points Per Game (PPG), Rebounds Per Game (RPG), Assists Per Game (APG), and Player Efficiency Rating (PER). The stats JSON object is updated daily. 

## How it Works

1. This app starts by gathering the publicly available data from https://www.basketball-reference.com/leagues/NBA_2018_totals.html (soon to change to 2019) for the per game stats for each player in the league in a csv format. 

2. The csv is converted to JSON and unwanted stats are trimmed. The final stats file will be loaded and synced with local storage for easy access when the app is run. 

3. The app hashes each first and last name with the associated value for each being the key to the JSON object for each respective player. 

4. When the extension is set to run, onpageload all innerText of the webpage is serialized using a regular expression to remove all non-word characters and put into an array is created by calling .split and passing " " (space) as the parameter (while also lowercasing all text).

5. The serialized HTML is hashed and any matches (two hashes in a row with the same key value) are stored in an array. 

6. If any matches are found, a function recursively traverses the DOM, comparing the array of found players with all text nodes that do not have children. 

7. On matches, a special HTML tag and class name are placed around the existing name to define the stats table that will appear onmouseover. The stats are drawn from local storage and the values populated in the table using custom data-attributes.  


## Project Status

In development.

## Screenshots 

Coming Soon

## Tech/framework used

Written entirely in vanilla JS for the purposes of learning while creating. 

## Features 

- Toggle to only run on NBA related sites (determined by the presence of "NBA" in the URL)
- Toggle to search by nicknames (e.g. "Shaquille O'Neal" and "Shaq" would both be acceptable names)
- Expandable box to show more advanced stats

## Tests

Coming soon










