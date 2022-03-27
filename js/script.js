console.log("HELLO WORLD");

var charactersUrl = "https://rickandmortyapi.com/api/character"

/**
 * Theese are two flags regarding splash screen.
 * The intended behaviour is that splash screen should disappear only if content is loaded but not earlier than 1.2 seconds
 * since the page load.
 * 
*/
var isSplashScreenTimerGone = false
var isContentLoaded = false

/**
 * Starts timer for splash screen on the page load.
 * */ 
var onLoad = function(){
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
  var splashScreen = document.getElementById('splash')
  splashScreen.classList.add('display-none');
}

var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET",charactersUrl,true);
xmlhttp.send();

xmlhttp.onreadystatechange = function(){

    if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
      isContentLoaded = true
      if(isSplashScreenTimerGone)removeSplashScreen // if splash screen timer has already passsed, splash screen will be removed from here
        var data = xmlhttp.responseText
        var json = JSON.parse(data)
        var results = json.results
        console.log(results.length)
        for (i = 0; i < results.length; i++){
            console.log("loop :" + i);
            console.log(results[i].name);
            var heroData = results[i]
            var hero = document.createElement('char')
            hero.id = "hero"
        
            hero.innerHTML = `<h2> ${heroData.name} </h2>`

            var holder = document.getElementById("hero_holder")
            holder.append(hero);
        }


    }

}