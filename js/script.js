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

var filterAlive = false
var filterDead = false
var filterUnknown = false

aliveCheckBox.addEventListener('change', function(){
  filterAlive = !this.checked; 
  console.log("filter alive:" + filterAlive)
  refreshHeroHolder();
});

deadCheckBox.addEventListener('change', function(){
  filterDead = !this.checked; 
  console.log("filter dead:" + filterDead)
  refreshHeroHolder();
});
unknownCheckBox.addEventListener('change', function(){
  filterUnknown = !this.checked; 
  console.log("filter unknown:" + filterUnknown)
  refreshHeroHolder();
});


/**
 * Gets initial heroes from the API 
 * Starts timer for splash screen on the page load.
 * Checks all the checkboxes
 * */ 
var onLoad = function(){
  getHeroes(charactersUrl);
  setTimeout(splashScreenTimeOut,1200);
  checkCheckboxes();
}
var checkCheckboxes = function(){
  aliveCheckBox.checked = true;
  deadCheckBox.checked = true;
  unknownCheckBox.checked = true;
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


/** When almost bottom of the page is reached, load more characters. Slack defined by 'reachBottomSlack' */
window.onscroll = function(event){
  if((window.innerHeight + window.scrollY) >= document.body.offsetHeight - reachBottomSlack){
    if(isThereMoreHeroesToLoad)loadMoreHeros()
  }
}

var refreshHeroHolder = function(){
searchedPhrase = searchToolbar.value;
holder.innerHTML = '' //  restart holder
isThereMoreHeroesToLoad = false // no more heroes to load at this point -> this get changed if there's an update to 'nextPageToLoad'
if(searchedPhrase.value != '') getSearchedResults(searchedPhrase); // if there's phrase to search use it
else getHeroes(charactersUrl); // otherwise get basic characters
}

/**Listen to the change of value in searchbar */
searchToolbar.addEventListener('keyup',function(){
refreshHeroHolder()
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
  getHeroes(nextPageToLoad)
}