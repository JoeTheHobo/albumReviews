let linesRaw = rawData.split(/\r?\n/)

let newAlbums = [];
for (let i = 0; i < linesRaw.length; i++) {
    let line = linesRaw[i].split(`"`);
    if (line.length < 3) continue;

    let artists = line[0];
    let albumName = line[1];
    let rating = line[2];

    if (artists.includes("Various Artists")) continue;

    //Clean Up
    artists = artists.replaceAll("• ","");
    artists = artists.replaceAll(" - ","");

    artists = artists.split(" & ");


    
    if (rating.includes("5 8====Ds")) continue;


    rating = rating.toLowerCase().replaceAll("t-d","t d");
    rating = rating.toLowerCase().replaceAll("d-s","d s");

    if (rating.toLowerCase().includes("classic")) rating = "10";

    let numbers = rating.split('-');
    let newNumbers = [];
    for (let i = 0; i < numbers.length; i++) {

        let number = numbers[i].replace(/\D/g, "");

        let contains = {
            strong: false,
            light: false,
            decent: false,
    
        }
        
        if (numbers[i].toLowerCase().includes("strong")) contains.strong = true;
        if (numbers[i].toLowerCase().includes("light")) contains.light = true;
        if (numbers[i].toLowerCase().includes("decent")) contains.decent = true;
    
        let secondNumber = 0;
        if (contains.strong) secondNumber = "8";
        if (contains.light) secondNumber = "2";
        if (contains.decent) secondNumber = "5";
    
        if (contains.strong && contains.decent) secondNumber = "7";
        if (contains.light && contains.decent) secondNumber = "3";

        newNumbers.push(Number(number + '.' + secondNumber));
    
    }

    rating = newNumbers.avg();
    let album = {
        artists: artists,
        name: albumName,
        rating: rating,
    }
    newAlbums.push(album)

}   


importAlbums(JSON.stringify(newAlbums))