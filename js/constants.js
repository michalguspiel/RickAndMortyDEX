/**Basic constants */

const reachBottomSlack = 50;
const charactersUrl = "https://rickandmortyapi.com/api/character"

const StatusEnum = Object.freeze({ALL:"all", ALIVE:"alive", DEAD:"dead",UNKNOWN:"unknown"});

const WinMessages =  ["Wubba lubba dub dub, I won!","I don't care I won!","Life is effort and I'll stop when I die! I Won!","Get Schifty... I won!"]
const LoseMessages = ["You lost! You dirty knife-nippled bastard!","Boom! Big reveal, You lost!","We are all gonna die anyways, You lost!","Welcome to the club, pal You lost!"]
const DrawMessages = ["Sometimes science is more than science, it's a draw", "It's a draw, how boring.","To live is to risk it all.. this time it's a draw."]

const numberOfHeroes = 826;

/**HTML ELEMENTS */
const splashScreen = document.getElementById('splash');
const searchToolbar = document.getElementById('search');
const holder = document.getElementById("hero_holder");

const navBar = document.getElementById('my-navbar');

const statusDropdown = document.getElementById('status-dropdown');
const allButton = document.getElementById('show-all-button');
const aliveButton = document.getElementById('alive-button');
const deadButton = document.getElementById('dead-button');
const unknownButton = document.getElementById('unknown-button');

//in battle modal
const playerOneDiv = document.getElementById('playerOne');
const playerTwoDiv = document.getElementById('playerTwo');
const versus = document.getElementById('versus'); 
const fightButton = document.getElementById('fightButton');
const nextFight = document.getElementById('nextFight');