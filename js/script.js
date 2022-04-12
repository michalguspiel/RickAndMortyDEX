var nextPageToLoad =  "https://rickandmortyapi.com/api/character/?page=2"
var searchedPhrase = '';
var xmlhttp = new XMLHttpRequest();
/**
 * Theese are two flags regarding splash screen.
 * The intended behaviour is that splash screen should disappear only if content is loaded but not earlier than 1.2 seconds
 * since the page load.
 * 
*/
var isSplashScreenTimerGone = false
var isContentLoaded = false
var isSplashScreenDisplayed = true
var isThereMoreHeroesToLoad = false

var filterStatus = StatusEnum.ALL

/**
 * Gets initial heroes from the API 
 * Starts timer for splash screen on the page load.
 * Checks all the checkboxes
 * */ 
var onLoad = function(){
  getHeroes(charactersUrl);
  setTimeout(splashScreenTimeOut,1200);
}

/**
 * Dropdown button listeners,
 * Change text of button,
 * Change filterStatus variable
*/
document.body.addEventListener('click',function(e){
var target = e.target;
switch(target){
  case aliveButton:
    statusDropdown.innerHTML = "Show alive"
    filterStatus = StatusEnum.ALIVE
    refreshHeroHolder();
    break;
  case deadButton:
    statusDropdown.innerHTML = "Show dead"
    filterStatus = StatusEnum.DEAD
    refreshHeroHolder();
    break;
  case unknownButton:
    statusDropdown.innerHTML = "Show unknown"
    filterStatus = StatusEnum.UNKNOWN
    refreshHeroHolder();
    break;
  case allButton:
    statusDropdown.innerHTML = "Show all"
    filterStatus = StatusEnum.ALL
    refreshHeroHolder();
    break;
}
})


/**
 * Function called when the timer for splash screen has ended,
 * if the flag for loaded content is already changed for true it will remove splash screen otherwise won't
 */
function splashScreenTimeOut(){
  isSplashScreenTimerGone = true
  if(isContentLoaded)removeSplashScreen()
}

/**
 * Function which adds class display-none to splashs screen and therefore removes splash screen
 */
function removeSplashScreen(){
  splashScreen.classList.add('display-none');
  isSplashScreenDisplayed = false
}




/**When user scroll down, hide the navbar
 * When user scroll up, show navbar
 * 
 * /** When almost bottom of the page is reached, load more characters. Slack defined by 'reachBottomSlack'
*/

let oldValue = 0
let newValue = 0
window.onscroll = function(event){
  newValue = window.pageYOffset;
  if (oldValue < newValue) { // scrolling down
   hideNavBar();
  } else if (oldValue > newValue) { // scrolling up
    showNavBar();
  }
  oldValue = newValue;
  if(hasUserReachedBottomOfPage() && isThereMoreHeroesToLoad){
   loadMoreHeros()
  }
}

var hasUserReachedBottomOfPage = function(){
  return ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - reachBottomSlack);
}

var showNavBar = function(){
  navBar.style.animationName = "navbar-appear"
  navBar.classList.add("navbar-show");
  navBar.ontransitionend = null;
  navBar.ontransitionstart = function(){
        changeNavBarStatus(false);
      }
}

var hideNavBar = function(){
  navBar.classList.remove("navbar-show");
  navBar.ontransitionstart = null;
  navBar.ontransitionend = function(){
     changeNavBarStatus(true);
   }
}

/** This function changes the status of each child in navbar element. */
var changeNavBarStatus = function(disabled){
  var nodes = navBar.getElementsByTagName('*');
  for(var i = 0; i < nodes.length; i++){
     nodes[i].disabled = disabled;
}
}

var refreshHeroHolder = function(){
searchedPhrase = searchToolbar.value;
holder.innerHTML = '' //  restart holder
isThereMoreHeroesToLoad = false // no more heroes to load at this point -> this get changed if there's an update to 'nextPageToLoad'
if(searchedPhrase != '') getHeroes(charactersUrl,searchedPhrase,false); // if there's phrase to search use it
else getHeroes(charactersUrl,null,false); // otherwise get basic characters
}

/**Listen to the change of value in searchbar */
searchToolbar.addEventListener('keyup',function(){
refreshHeroHolder()
})

/**
 * If the query is next page or there is not search phrase and status enum equals ALL 
 * Send url request and return function
 * Otherwise:
 * Build the proper query 
 * And then sending request to the API
*/
var getHeroes = function(url,searchedPhrase,isNextPage){
  if((isNextPage) || (searchedPhrase == null && filterStatus == StatusEnum.ALL)){
    sendRequest(url)
    return;
  }
  url = buildUrlString(url,searchedPhrase)
  sendRequest(url);
}

/** BUILDS PROPER URL STRING QUERY :) */
var buildUrlString = function(url,searchedPhrase){
  if(searchedPhrase == null) searchedPhrase = '';
  url = "https://rickandmortyapi.com/api/character/?name=" + searchedPhrase
  if(filterStatus != StatusEnum.ALL){
     url = url + '&status=' + filterStatus
  }
  return url;
};

var sendRequest = function(url){
  console.log("Query:" + url)
  xmlhttp.open("GET",url,true);
  xmlhttp.send();
}

/**
 * Reacting to the response from the API
*/
xmlhttp.onreadystatechange = function(){
    if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
      isContentLoaded = true
      if(isSplashScreenTimerGone && isSplashScreenDisplayed)removeSplashScreen // if splash screen timer has already passsed, splash screen will be removed from here
        var data = xmlhttp.responseText
        var json = JSON.parse(data)
       updateNextPage(json)
        var results = json.results
        for (i = 0; i < results.length; i++){
            var heroData = results[i]
            var hero = document.createElement('div');
            modifyHeroElement();
            heroLocation = getFirstAppearance(heroData.episode[0],hero)
            drawCard(heroData,hero)
            addOnClickListenerToThisCard(heroData,hero)
            holder.append(hero);
            battleGameFunction(heroData, results);
        }
    }

  function modifyHeroElement() {
    hero.id = "hero" + heroData.id;
    hero.className += 'hero-card col';
    hero.setAttribute("data-bs-toggle", "modal");
    hero.setAttribute("data-bs-target", "#heroModal");
  }
}

//Function which draws each hero card.
var drawCard = function(heroData,hero){
  hero.innerHTML = `
  <div class="name-background"> <h2> ${heroData.name} </h2> </div>
  <img class="hero-card-pic" src="${heroData.image}" alt="Character picture" >
  <div class="d-flex flex-row"> <h5 class="attribute">Species:&nbsp;</h5> <h5> ${heroData.species}</h5></div>
  <div class="d-flex flex-row"> <h5 class="attribute">Status:&nbsp;</h5> <h5> ${heroData.status}</h5></div>
  `
}
//Function which adds click listener to each card.
var addOnClickListenerToThisCard = function(heroData,hero){
  hero.addEventListener('click',function(){
    showHeroModal(heroData)
  })
}

function showHeroModal(heroData){
  // console.log(heroData);

  // The code below puts data from the card into the modal 
  var totalNumberOfEpisodes = heroData.episode.length;

  document.getElementById("heroModalName").innerText = `${heroData.name}`
  document.getElementById("modalImage").setAttribute("src", `${heroData.image}`)
  document.getElementById("heroModalSpecies").innerText = `Species: ${heroData.species}`
  document.getElementById("heroModalGender").innerText = `Gender: ${heroData.gender}`
  document.getElementById("heroModalStatus").innerText = `Status: ${heroData.status}`
  document.getElementById("heroModalOrigin").innerText = `Origin: ${heroData.origin.name}`
  
  document.getElementById("heroModalCurrentLocation").innerText = `Current location: ${heroData.location.name}`
  if (totalNumberOfEpisodes < 2 ) {
    document.getElementById("heroModalTotalEpisodes").innerText = `Appears in: ${totalNumberOfEpisodes} episode`
  } else {
    document.getElementById("heroModalTotalEpisodes").innerText = `Appears in: ${totalNumberOfEpisodes} episodes`
  }
}

/**
 * Get first appearance and add it to the hero card.
*/
var getFirstAppearance = function(url,hero){
  var xhr = new XMLHttpRequest;
  xhr.open("GET",url,true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = xhr.responseText
        var json = JSON.parse(data)
        hero.innerHTML += `
        <div class="d-flex flex-row mb-3">
          <h5 id="first-app" class="attribute text-start">First appearance:&nbsp;</h5> <h5 class="text-start">${json.name}</h5>
        </div> 
          `
    }
  }
}

var addOnClickListenerToThisCard = function(heroData,hero){
  hero.addEventListener('click',function(){
    showHeroModal(heroData)
  })
}

var battleGameFunction = function(heroData, results){  
  // console.log(results.length);
  // console.log(heroData);
  
  let playerOne = heroData;
  let randomPlayer = Math.floor(Math.random() * results.length);
  let playerTwo = results.splice(randomPlayer, 1)[0];
  let playerOneDiv = document.getElementById('playerOne');
  let playerTwoDiv = document.getElementById('playerTwo');
  let versus = document.getElementById('versus'); 
  let fightButton = document.getElementById('fightButton');
  let myModalEl = document.getElementById('heroModal');
  let modal = bootstrap.Modal.getInstance(myModalEl);

  let playerOneHp = 0;
  
  switch(playerOne.name[0]) {
    case "A":
      playerOneHp = 3
      break;
    case "B":
      playerOneHp = 4
      break;
    case "C":
      playerOneHp = 5
      break;
    case "D":
      playerOneHp = 4
      break;
    case "E":
      playerOneHp = 3
      break;
    case "F":
      playerOneHp = 4
      break;
    case "G":
      playerOneHp = 5
      break;
    case "H":
      playerOneHp = 4
      break;
    case "I":
      playerOneHp = 3
      break;
    case "J":
      playerOneHp = 4
      break;
    case "K":
      playerOneHp = 5
      break;
    case "L":
      playerOneHp = 4
      break;
    case "M":
      playerOneHp = 3
      break;
    case "N":
      playerOneHp = 4
      break;
    case "O":
      playerOneHp = 5
      break;
    case "P":
      playerOneHp = 4
      break;
    case "Q":
      playerOneHp = 3
      break;
    case "R":
      playerOneHp = 4
      break;
    case "S":
      playerOneHp = 5
      break;
    case "T":
      playerOneHp = 4
      break;
    case "U":
      playerOneHp = 3
      break;
    case "V":
      playerOneHp = 4
      break;
    case "W":
      playerOneHp = 5
      break;
    case "X":
      playerOneHp = 4
      break;
    case "Y":
      playerOneHp = 3
      break;
    case "Z":
      playerOneHp = 4
      break;
    default:
      playerOneHp = 3
  }
  
  let playerTwoHp = 0;

  switch(playerTwo.name[0]) {
    case "A":
      playerTwoHp = 3
      break;
    case "B":
      playerTwoHp = 4
      break;
    case "C":
      playerTwoHp = 5
      break;
    case "D":
      playerTwoHp = 4
      break;
    case "E":
      playerTwoHp = 3
      break;
    case "F":
      playerTwoHp = 4
      break;
    case "G":
      playerTwoHp = 5
      break;
    case "H":
      playerTwoHp = 4
      break;
    case "I":
      playerTwoHp = 3
      break;
    case "J":
      playerTwoHp = 4
      break;
    case "K":
      playerTwoHp = 5
      break;
    case "L":
      playerTwoHp = 4
      break;
    case "M":
      playerTwoHp = 3
      break;
    case "N":
      playerTwoHp = 4
      break;
    case "O":
      playerTwoHp = 5
      break;
    case "P":
      playerTwoHp = 4
      break;
    case "Q":
      playerTwoHp = 3
      break;
    case "R":
      playerTwoHp = 4
      break;
    case "S":
      playerTwoHp = 5
      break;
    case "T":
      playerTwoHp = 4
      break;
    case "U":
      playerTwoHp = 3
      break;
    case "V":
      playerTwoHp = 4
      break;
    case "W":
      playerTwoHp = 5
      break;
    case "X":
      playerTwoHp = 4
      break;
    case "Y":
      playerTwoHp = 3
      break;
    case "Z":
      playerTwoHp = 4
      break;
    default:
      playerTwoHp = 3
  }

  let playerOneStrength = playerOneHp * playerOne.episode.length;
  let playerTwoStrength = playerTwoHp * playerTwo.episode.length;

  function scrollToTop() {
    window.scroll({top: 0, left: 0, behavior: 'smooth'});
    document.getElementById('playerOneWinner').innerText = '';
    document.getElementById('playerTwoWinner').innerText = '';
  }

  playerOneDiv.innerHTML = `
  <div class="name-background"> <h2> ${playerOne.name}</h2> </div>
  <img class="hero-card-pic" src="${playerOne.image}" alt="Character picture" >
  <div class="d-flex flex-row"> <h5 class="attribute">Species:&nbsp;</h5> <h5> ${playerOne.species}</h5></div>
  <div class="d-flex flex-row"> <h5 class="attribute">Status:&nbsp;</h5> <h5> ${playerOne.status}</h5></div>
  <div class="d-flex flex-row"> <h5 class="attribute">Origin:&nbsp;</h5> <h5>${playerOne.origin.name}</h5></div>
  <div class="d-flex flex-row"> <h5 class="attribute">Strength:&nbsp;</h5> <h5>+${playerOneStrength}</h5></div>
  `

  versus.innerText = 'VERSUS'

  playerTwoDiv.innerHTML = `
  <div class="name-background"> <h2> ${playerTwo.name}</h2> </div>
  <img class="hero-card-pic" src="${playerTwo.image}" alt="Character picture" >
  <div class="d-flex flex-row"> <h5 class="attribute">Species:&nbsp;</h5> <h5> ${playerTwo.species}</h5></div>
  <div class="d-flex flex-row"> <h5 class="attribute">Status:&nbsp;</h5> <h5> ${playerTwo.status}</h5></div>
  <div class="d-flex flex-row"> <h5 class="attribute">Origin:&nbsp;</h5> <h5> ${playerTwo.origin.name}</h5></div>
  <div class="d-flex flex-row"> <h5 class="attribute">Strength:&nbsp;</h5> <h5>+${playerTwoStrength}</h5></div>
  `

  

  fightButton.setAttribute("class", "btn btn-danger");
  fightButton.innerHTML = 'FIGHT';

  fightButton.addEventListener('click', function() {    
    let oneWinner = document.getElementById('playerOneWinner');
    let twoWinner = document.getElementById('playerTwoWinner');

    if(playerOneStrength > playerTwoStrength){
      oneWinner.innerText = 'WINNER'
      twoWinner.innerText = ''
      oneWinner.setAttribute("class", "fs-1 text-success")
    } else if (playerOneStrength < playerTwoStrength) {
      twoWinner.innerText = 'WINNER';
      oneWinner.innerText = '';
      twoWinner.setAttribute("class", "fs-1 text-success")
    } else if (playerOneStrength == playerTwoStrength) {
      oneWinner.innerText = "IT'S A DRAW"
      oneWinner.setAttribute("class", "fs-1 text-danger")
      twoWinner.innerText = "IT'S A DRAW";
      twoWinner.setAttribute("class", "fs-1 text-danger")

    }
  })
  scrollToTop();
  modal.hide();
}

// initiates the battle game function
battleGameButton.addEventListener('click', battleGameFunction);

/**
 * Updates the variable which holds the next page to load
 */
var updateNextPage = function(json){
  var nextPage = json.info.next
  nextPageToLoad = nextPage
  if(json.info.next != null)isThereMoreHeroesToLoad = true
}

/** Loads more characters to the page*/
var loadMoreHeros = function(){
  console.log("Load more heroes, Next page to load: " + nextPageToLoad)
  getHeroes(nextPageToLoad,null,true)
}