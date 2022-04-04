console.log("HELLO WORLD");

var charactersUrl = "https://rickandmortyapi.com/api/character"
var nextPageToLoad =  "https://rickandmortyapi.com/api/character/?page=2"

var splashScreen = document.getElementById('splash');
var loadMoreBtn = document.getElementById('load-more-btn');
var searchToolbar = document.getElementById('search');
var searchedPhrase = '';
var holder = document.getElementById("hero_holder");
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

/**
 * Gets initial heroes from the API 
 * Starts timer for splash screen on the page load.
 * */ 
var onLoad = function(){
  getHeroes(charactersUrl)
  setTimeout(splashScreenTimeOut,1200)
}
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

/**listen to load more character button */
loadMoreBtn.addEventListener('click',function(){
  loadMoreHeros()
})

/**Listen to the change of value in searchbar */
searchToolbar.addEventListener('keyup',function(){
searchedPhrase = searchToolbar.value;
holder.innerHTML = '' //  restart holder
loadMoreBtn.style.visibility = 'hidden';
if(searchedPhrase.value != '') getSearchedResults(searchedPhrase); // if there's phrase to search use it
else getHeroes(charactersUrl); // otherwise get basic characters
})

var getSearchedResults = function(phrase){
 var url = "https://rickandmortyapi.com/api/character/?name=" + phrase
  getHeroes(url)
}

/**
 * Sending request to the API
*/
var getHeroes = function(url){
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
        console.log(results.length)
        for (i = 0; i < results.length; i++){
            var heroData = results[i]
            var hero = document.createElement('div');
            hero.id = "hero";
            hero.className += 'hero-card';
            heroLocation = getFirstAppearance(heroData.episode[0],hero)
            hero.innerHTML = `
            <div class="name-background" data-bs-toggle="modal" data-bs-target="#heroModal"> <h2> ${heroData.name} </h2> </div>
            <img class="hero-card-pic" src="${heroData.image}" alt="Character picture" >
            <div class="d-flex flex-row"> <h5 class="attribute">Species:&nbsp;</h5> <h5> ${heroData.species}</h5></div>
            <div class="d-flex flex-row"> <h5 class="attribute">Status:&nbsp;</h5> <h5> ${heroData.status}</h5></div>
            <div class="d-flex flex-row"> <h5 class="attribute">Origin:&nbsp;</h5> <h5> ${heroData.origin.name}</h5></div>
            `
            holder.append(hero);
        }
    }
}





/**
 * Get first appearance and add it to the hero card.
 * 
*/
var getFirstAppearance = function(url,hero){
  console.log("Tryin to get location")
  var xhr = new XMLHttpRequest;
  xhr.open("GET",url,true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = xhr.responseText
        var json = JSON.parse(data)
        hero.innerHTML += `
        <div class="d-flex flex-row">
          <h5 id="first-app" class="attribute">First appearance:&nbsp;</h5> <h5>${json.name}</h5>
        </div> 
          `
    }
  }
}

/**
 * Updates the variable which holds the next page to load
 */
var updateNextPage = function(json){
  console.log("Next page: "+json.info.next)
  var nextPage = json.info.next
  nextPageToLoad = nextPage
  if(json.info.next != null)loadMoreBtn.style.visibility = 'visible'
}

/** Loads more characters to the page*/
var loadMoreHeros = function(){
  getHeroes(nextPageToLoad)
}

function showHeroModal(json){
  console.log(json);

  // The code below puts data from the card into the modal but I can't figure out 
  // how to access the rest of the data from the JSON object yet
  
  var name = json.path[0].innerText;
  var content = json.path[2].innerText;
  document.getElementById("heroModalName").innerText = `${name}`
  document.getElementById("heroModalContent").innerText = `${content}`
}

document.getElementById("hero_holder").addEventListener("click", showHeroModal);