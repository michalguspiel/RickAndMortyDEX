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

  // name
  // status
  // species
  // type 
  // gender 
  // origin.name
  // location.name
  // image
  // episodes

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