/**Basic constants */

const reachBottomSlack = 50;
const charactersUrl = "https://rickandmortyapi.com/api/character"

const StatusEnum = Object.freeze({ALL:"all", ALIVE:"alive", DEAD:"dead",UNKNOWN:"unknown"});

/**HTML ELEMENTS */
const splashScreen = document.getElementById('splash');
const searchToolbar = document.getElementById('search');
const holder = document.getElementById("hero_holder");

const statusDropdown = document.getElementById('status-dropdown');
const allButton = document.getElementById('show-all-button');
const aliveButton = document.getElementById('alive-button');
const deadButton = document.getElementById('dead-button');
const unknownButton = document.getElementById('unknown-button');
const battleGameButton = document.getElementById('choosePlayerButton');