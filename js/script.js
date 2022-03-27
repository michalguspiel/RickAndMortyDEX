console.log("HELLO WORLD");

var charactersUrl = "https://rickandmortyapi.com/api/character"
var nextPageToLoad =  "https://rickandmortyapi.com/api/character/?page=2"

var splashScreen = document.getElementById('splash')
var loadMoreBtn = document.getElementById('load-more-btn')
var holder = document.getElementById("hero_holder")
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
        
            hero.innerHTML = `
            <div>
            <h2> ${heroData.name} </h2>
            <img class="hero-card-pic" src="${heroData.image}" alt="Character picture" >
            </div>
            `
            holder.append(hero);
        }
    }
}

/**
 * Updates the variable which holds the next page to load
 */
var updateNextPage = function(json){
  var nextPage = json.info.next
  nextPageToLoad = nextPage
}

/** Loads more characters to the page*/
var loadMoreHeros = function(){
  getHeroes(nextPageToLoad)
}
