console.log('hi');

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

httpGetAsync('https://cdn.rawgit.com/sindresorhus/pokemon/master/data/en.json', function(pokeNames) {
    pokeNames = JSON.parse(pokeNames);
    pokeNames = shuffle(pokeNames);

    let listID = 0;

    const config = {
        strings: pokeNames,
        //optional
        typeSpeed: 100, //default
        //optional
        backSpeed: 80, //default
        //optional
        startDelay: 500, //default
        //optional
        backDelay: 2500, //default
        //optional    
        loop: true, //default
        //optional
        showCursor: true, //default
        //optional    
        cursorChar: "|", //default
        // optional callback called (if `loop` is false) once the
        // last string was typed
        onFinished: function() {

            if (listID == pokeNames.length) {
                listID = 0;
            } else {
                listID++;
            }
        },
    }
    setTimeout(function() {
        ityped.init('#pokeNames', config);
    }, 3000);

});

function getPokemon(names) {
    let poke = names[Math.floor(Math.random() * names.length)];
    console.log(poke);
    return poke;
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}