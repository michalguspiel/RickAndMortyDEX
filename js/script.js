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

// Empty var for player one
var playerOne = ''

var filterStatus = StatusEnum.ALL

/** Sets functionality of navbar battle simulation buttton 
 * TODO : this button has to randomize two heroes so the modal gets populated with data initially,
 * This heroes must be fetched from API every time button is clicked.
 * 
*/
var setBattleFeature = function(){
  var navBattleBtn = document.getElementById('nav-battleBtn')
  navBattleBtn.setAttribute("data-bs-toggle", "modal");
  navBattleBtn.setAttribute("data-bs-target", "#gameArenaModal");
  navBattleBtn.addEventListener('click', function(){
    battleGameFunction()
})
}

/**
 * Gets initial heroes from the API 
 * Starts timer for splash screen on the page load.
 * Checks all the checkboxes
 * */ 
var onLoad = function(){
  setBattleFeature();
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
           //battleGameFunction(heroData, results);
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
  console.log(heroData);

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

  var myModalEl = document.getElementById('heroModal');
  var modal = bootstrap.Modal.getInstance(myModalEl)

  var choosePlayer = function(){
    playerOne = heroData
    let chosenPlayerCard = document.getElementById('chosenPlayer')
    chosenPlayerCard.style.display = "block" // need to make sure the card is in display
    chosenPlayerCard.innerHTML = `
    <div class="container">
        <div class="row">
          <p id="nameText"></p>
          <p id="chosenPlayerName" class="text-center"></p>
        </div>
        <div class="row">
          <img id="chosenPlayerImg" src="">
        </div>
        <div class="row" id="release-hero-btn-holder">
          <button type="button "class="btn btn-primary" id="release-hero-btn">Release hero</button>
        </div>
      </div>
  
    `
    let playerOneNameCard = document.getElementById('chosenPlayerName')
    let playerOneImgCard = document.getElementById('chosenPlayerImg')
    playerOneNameCard.innerText = `You're Playing As:\n${heroData.name}`
    playerOneNameCard.style.fontFamily = "'Shadows Into Light', cursive"
    playerOneImgCard.setAttribute("src", `${heroData.image}`)
    modal.hide();
    window.scrollTo(0, 0);

      // Event listener to release hero
  var releaseHeroBtn = document.getElementById('release-hero-btn')
  releaseHeroBtn.addEventListener("click",function(){
    playerOne = ''
    chosenPlayerCard.innerHTML = ""
    chosenPlayerCard.style.display = "none"
  });
  }
  // Event listener to select player one
  var selectPlayerOneButton = document.getElementById('choosePlayer')
  selectPlayerOneButton.addEventListener("click", choosePlayer);
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

var battleGameFunction = function(){  
  var firstRequest = new XMLHttpRequest();
  var secondRequest = new XMLHttpRequest();
  /** PSEUDO CODE:
   * Get all modal elements,                                            - DONE 
   * Randomize two numbers, from 1 to 826(numberOfHeroes - constant)    - DONE
   * Get two herooes according two the randomized numbers               - DONE
   * Save fetched heroes in two different variables                     - DONE
   * set hp for both heroes using setHp function                        - DONE
   * calculate strenght for both characters using their hp and formula  - DONE
   * populate heroes elements with proper hero data                     - DONE
   * provide game logic to Fight button                                 - DONE
   * add button which allows for next game                              - DONE
   */   
   let oneWinner = document.getElementById('playerOneWinner');
   let twoWinner = document.getElementById('playerTwoWinner');
   let draw = document.getElementById('inEventOfATie');

   oneWinner.innerText = '';
   twoWinner.innerText = '';
   draw.innerText = '';

   if (playerOne.name == undefined) {
    nextFight.innerText = 'PICK NEW FIGHTERS'
   } else {
    nextFight.innerText = 'PICK NEW OPPONENT'
   }

   let firstNumber  = Math.floor(Math.random() * numberOfHeroes);
   let secondNumber = Math.floor(Math.random() * numberOfHeroes);

    var firstCall = "https://rickandmortyapi.com/api/character/" + firstNumber;
    var secondCall = "https://rickandmortyapi.com/api/character/" + secondNumber;

    firstRequest.open("GET",firstCall,true);
    firstRequest.send();
    secondRequest.open("GET",secondCall,true);
    secondRequest.send();

    var firstHero = null
    var secondHero =  null


    // This function builds player one regardless of where the data is pulled from
    var createFirstHero = function (playerOneData) {
      var fighter = playerOneData
      let playerOneHp =  setHp(fighter.name[0]);
      firstHero = new BattleHero(fighter.name,fighter.image,fighter.species,fighter.status,fighter.origin.name,playerOneHp * fighter.episode.length)
      populateHeroCardInBattle(firstHero,playerOneDiv)

    }

    // If the playerOne variable is empty then player one will be chosen at random

    if(playerOne.name === undefined) {
      firstRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var data = firstRequest.responseText
          var json = JSON.parse(data)
          createFirstHero(json)
        }
      }
    } else {
      createFirstHero(playerOne)
    }

    versus.innerText = 'VERSUS'
    fightButton.setAttribute("class", "btn btn-danger");
    fightButton.innerHTML = 'FIGHT';

    secondRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var data = secondRequest.responseText
        var json = JSON.parse(data)
        let playerTwoHp =  setHp(json.name[0]);  
        secondHero = new BattleHero(json.name,json.image,json.species,json.status,json.origin.name,playerTwoHp * json.episode.length)
        populateHeroCardInBattle(secondHero,playerTwoDiv)
      }
    }

    fightButton.addEventListener('click', function() {
      shakingElements = []
      shake(playerOneDiv,45)
      shake(playerTwoDiv,45)
      setTimeout(() => {    // IT'S JUST THAT A LITTLE DELAY MAKE THE BATTLE MORE REALISTIC. LIKE SOME REAL DIFFICULT COMPUTATION IS GOING BEHIND THE CURTAIN!
        console.log("I'm here to make a little delay on purpose!");
        if(firstHero.strength > secondHero.strength){
          oneWinner.innerText = getWinMessage();
          twoWinner.innerText = getLoseMessage();
          draw.innerText = '';
          oneWinner.style.color = "green";
          twoWinner.style.color = "red";
        } else if (firstHero.strength < secondHero.strength) {
          twoWinner.innerText = getWinMessage();
          oneWinner.innerText = getLoseMessage();
          draw.innerText = '';
          oneWinner.style.color = "red";
          twoWinner.style.color = "green";
        } else if (firstHero.strength == secondHero.strength) {
          oneWinner.innerText = ""
          twoWinner.innerText = ""
          draw.innerText = getDrawMessage();
          draw.style.color = "blue"; 
        }
        nextFight.innerText = 'NEXT FIGHT';
      }, 300);   

    })
}

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

var getWinMessage = function(){
  return WinMessages.random().toUpperCase()
}
var getDrawMessage = function(){
  return DrawMessages.random().toUpperCase()
}
var getLoseMessage = function(){
  return LoseMessages.random().toUpperCase()
}

var populateHeroCardInBattle = function(hero,holderDiv){
  holderDiv.innerHTML = `
  <div> <h2 class="text-center"> ${hero.name}</h2> </div>
  <img class="hero-card-pic mx-auto d-block" src="${hero.image}" alt="Character picture" >
  <div class="d-flex flex-row"> <h5 class="attribute">Species:&nbsp;</h5> <h5> ${hero.species}</h5></div>
  <div class="d-flex flex-row"> <h5 class="attribute">Status:&nbsp;</h5> <h5> ${hero.status}</h5></div>
  <div class="d-flex flex-row"> <h5 class="attribute">Origin:&nbsp;</h5> <h5>${hero.origin}</h5></div>
  `
  }

/** Sets HP of the hero based of the first letter of their name. */
var setHp = function (nameFirstLetter){
  switch(nameFirstLetter) {
    case "B":
    case "D":
    case "F":
    case "H":
    case "J":
    case "L":
    case "N":
    case "P":
    case "R":
    case "T":
    case "V":
    case "X":
    case "Z":
      return 4;
    case "C":
    case "G":
    case "K":
    case "O":
    case "S":
    case "W":
      return 5;
    default:
      return 3;
  }
}

//Set up next battle
nextFight.setAttribute("class", "btn btn-danger");    
nextFight.addEventListener("click", battleGameFunction);

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

var shakingElements = [];
var shake = function (element, magnitude = 16) {
  //First set the initial tilt angle to the right (+1) 
  var tiltAngle = 1;
  //A counter to count the number of shakes
  var counter = 1;
  //The total number of shakes (there will be 1 shake per frame)
  var numberOfShakes = 20;
  //Capture the element's position and angle so you can
  //restore them after the shaking has finished
  var startX = 0,
      startY = 0,
      startAngle = 0;
  // Divide the magnitude into 10 units so that you can 
  // reduce the amount of shake by 10 percent each frame
  var magnitudeUnit = magnitude / numberOfShakes;
  //The `randomInt` helper function
  var randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  //Add the element to the `shakingElements` array if it
  //isn't already there
  if(shakingElements.indexOf(element) === -1) {
    //console.log("added")
    shakingElements.push(element);
      upAndDownShake();
    }
  function upAndDownShake() {
    //Shake the element while the `counter` is less than 
    //the `numberOfShakes`
    if (counter < numberOfShakes) {
      //Reset the element's position at the start of each shake
      element.style.transform = 'translate(' + startX + 'px, ' + startY + 'px)';
      //Reduce the magnitude
      magnitude -= magnitudeUnit;
      //Randomly change the element's position
      var randomX = randomInt(-magnitude, magnitude);
      var randomY = randomInt(-magnitude, magnitude);
      element.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)';
      //Add 1 to the counter
      counter += 1;
      requestAnimationFrame(upAndDownShake);
    }
  }
}