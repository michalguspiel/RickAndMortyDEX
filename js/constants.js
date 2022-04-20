/**Basic constants */

const reachBottomSlack = 50;
const charactersUrl = "https://rickandmortyapi.com/api/character"

const StatusEnum = Object.freeze({ALL:"all", ALIVE:"alive", DEAD:"dead",UNKNOWN:"unknown"});

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