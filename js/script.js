console.log("HELLO WORLD");

var charactersUrl = "https://rickandmortyapi.com/api/character"
var isSplashScreenTimerGone = false
var isContentLoaded = false

var onLoad = function(){
  setTimeout(splashScreenTimeOut,1200)
}

function splashScreenTimeOut(){
  isSplashScreenTimerGone = true
  if(isContentLoaded)removeSplashScreen()
}

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
      if(isSplashScreenTimerGone)removeSplashScreen
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