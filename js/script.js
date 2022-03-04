console.log("HELLO WORLD");

var charactersUrl = "https://rickandmortyapi.com/api/character"


/** ONE OPTION TO FETCH DATA with fetch
fetch(charactersUrl)
  .then((response) => {
    return response.text();
  })
  .then((data) => {
console.log(data)
});
*/

/** ANOTHER OPTION TO FETCH DATA */

var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET",charactersUrl,true);
xmlhttp.send();

xmlhttp.onreadystatechange = function(){

    if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
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