# Quick-Stats
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

I set out to develop an extension that would end this process on step 3. This extension identifies all current NBA player names on any given webpage and adds an HTML element that displays onmouseover and contains the most relevant stats for the current season. That is, Points Per Game (PPG), Rebounds Per Game (RPG), Assists Per Game (APG), and Player Efficiency Rating (PER). The stats JSON object is updated daily. 

## How it Works

1. This app starts by gathering the publicly available data from https://www.basketball-reference.com/leagues/NBA_2019_totals.html for the per game stats for each player in the league in a csv format. 

2. The csv is converted to JSON and unwanted stats are trimmed. The final stats file is loaded into client storage for simple access without AJAX calls. Each day the client will make a call to the server to update the file with the previous night's stats. 

3. The app creates a hashes table with all first and last names with the associated value for each being the key to the JSON object for each respective player. 

4. When the extension is set to run, onpageload all innerText of the webpage is serialized using a regular expression to remove all non-word characters.

5. The serialized HTML is hashed and any matches (two hashes in a row with the same key value) are stored in an array. 

6. If any matches are found, a function runs over all DOM nodes that commonly hold text comparing the array of found players against the text.  

7. On matches, a special HTML tag and class name are placed around the existing name to define the stats table that will appear onmouseover. A tooltip library (tippy.js) is used to create and populate all the tooltips. The player name also serves as a link to their basketball-reference page.  


## Project Status

Released November 2018


## Tech/framework used

Written almost exclusively in Vanilla Javascript in order to learn core concepts of development and keep the applicaiton lightweight. Some select tasks (e.g. tooltip creation) were best left to a library. 

## Features 

- Toggle to only run on NBA related sites (determined by the presence of "NBA" in the URL)
- Player name highlighting (which can be toggled on or off) with choice of non-intrusive colors
- Link directly to the player's basketball-reference page 










