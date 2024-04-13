ls.clear();
let _artists = localStorage.getItem("artists"); 
let artists = _artists == null ? [] : JSON.parse(_artists);
let _id = localStorage.getItem("id");
let id = _id == null ? 0 : _id;

let albums = [];
let accending = false;
let searchBy = "Album";



$('goToTop').onclick = function() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}
document.body.onscroll = function() {
    let rect = window.scrollY;
    if (rect > 500) {
        $('goToTop').style.display = 'block';
    } else {
        $('goToTop').style.display = 'none';
    }
}
document.addEventListener("click",function(e) {
    if (e.target.id !== "dontHide")
        $('.hamburger').style.display = "none";

    if (!e.target.classList.contains("stats"))
        $('statisticPage').style.display = 'none';

})
function toggleHamburger() {
    if ($('.hamburger').style.display == 'none' || $('.hamburger').style.display == "") {
        $('.hamburger').style.display = "block";
    } else {
        $('.hamburger').style.display = "none";
    }
}
function exportArtists() {
    prompt("Copy JSON: ",JSON.stringify(artists));
    $('.hamburger').style.display = "none";
}
function importAlbums(string) {
    
    string = JSON.parse(string);
    artists = [];
    id = 0;
    albums = [];
    let album;
    for (let i = 0; i < string.length; i++) {
        
        album = {
            artists: string[i].artists,
            name: string[i].name,
            rating: string[i].rating,
            review: "",
            id: id,
        }
        id++;

        
        for (let i = 0; i < album.artists.length; i++) {
            let found = false;
            for (let j = 0; j < artists.length; j++) {
                if (album.artists[i].toLowerCase() == artists[j].name.toLowerCase()) {
                    artists[j].albums.push(album);
                    found = true;
                }
            }
            if (!found) {
                let artist = {
                    name: album.artists[i],
                    albums: [album],
                }
                artists.push(artist);
            }
        }



    
    }
    
    localStorage.setItem("id",id);
    localStorage.setItem("artists",JSON.stringify(artists));
    renderAlbums();
}
function importArtist() {
    let JSO = prompt("Paste JSON");
    $('.hamburger').style.display = "none";
    if (JSO == "") return;
    JSO = JSON.parse(JSO);
    console.log(JSO)


    artists = JSO;
    

    renderAlbums();

    let highestID = 0;
    for (let i = 0; i < artists.length; i++) {
        for (let j = 0; j < artists[i].albums.length; j++) {
            if (artists[i].albums[j].id > highestID) highestID = artists[i].albums[j].id;
        }
    }
    id = highestID+1;

    
    localStorage.setItem("id",id);
    localStorage.setItem("artists",JSON.stringify(artists));
}

$('searchBy').on("click",function() {
    searchBy = searchBy == "Album" ? "Artist" : "Album";
    $('.searchType').innerHTML = searchBy;
    $('.searchInput').value = "";
    renderAlbums();
})
$('.searchInput').addEventListener("input",function() {
    renderAlbums();
})

function toggleAccending() {
    accending = accending == true ? false : true;

    if (accending) {
        $('accendingIcon').classList.add("accendingIcon");
    } else {
        $('accendingIcon').classList.remove("accendingIcon");
    }
    renderAlbums();
}
$('ratingInput').on("input",function() {
    let val = this.value;
    if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)
    if (this.value > 10) this.value = 10;
})

function closeAddScreen() {
    document.body.style.background = "rgb(219, 184, 124)";
    $('body').style.display = "flex";
    $('add').style.display = "block";
    
    let artistName = $('artistNameInput');
    let albumName = $('albumNameInput');
    let review = $("reviewText");
    let rating = $("ratingInput");


    artistName.value = '';
    albumName.value = '';
    review.value = '';
    rating.value = '';
    $('addScreen').style.display = 'none';
}
function editAlbum(pos) {
    $('add').style.display = "none";
    document.body.style.background = "#414141";
    $('body').style.display = "none";
    $('.asTitle').innerHTML = "Edit Album";
    let album = albums[pos];

    let artistName = $('artistNameInput');
    let albumName = $('albumNameInput');
    let review = $("reviewText");
    let rating = $("ratingInput");

    artistName.disabled = true;
    albumName.disabled = true;


    artistName.value = album.artists.join(", ");
    albumName.value = album.name;
    review.value = album.review != undefined ? album.review : "";
    rating.value = album.rating;

    $('finish').editingAlbum = true;
    $('finish').i = pos;
    $('deleteReview').style.display = "block";

    $("addScreen").style.display = 'flex';
}
function showAddScreen() {
    
    $('add').style.display = "none";
    document.body.style.background = "#414141";
    $('body').style.display = "none";
    let artistName = $('artistNameInput');
    let albumName = $('albumNameInput');

    $('.asTitle').innerHTML = "Create A New Review!";
    
    artistName.disabled = false;
    albumName.disabled = false;
    
    $('finish').editingAlbum = false;
    $('deleteReview').style.display = "none";
    $("addScreen").style.display = 'flex';
}

function reviewAdd() {
    let artistName = $('artistNameInput');
    let albumName = $('albumNameInput');
    let review = $("reviewText");
    let rating = $("ratingInput");

    if (artistName.value == '') {
        showWarning("Artist Name Required");
        return;
    }
    if (albumName.value == '') {
        showWarning("Album Name Required");
        return;
    }
    if (rating.value == '') {
        showWarning("Rating Required");
        return;
    }

    let album;
    if ($('finish').editingAlbum) {
        album = albums[$('finish').i];
        album.rating = rating.value;
        album.review = review.value;

        for (let i = 0; i < album.artists.length; i++) {
            for (let j = 0; j < artists.length; j++) {
                if (album.artists[i].toLowerCase() == artists[j].name.toLowerCase()) {
                    for (let p = 0; p < artists[j].albums.length; p++) {
                        if (artists[j].albums[p].id == album.id) {
                            artists[j].albums[p] = album;
                        }
                    }
                }
            }
        }
    } else {

        album = {
            artists: artistName.value.split(', '),
            name: albumName.value,
            rating: rating.value,
            review: review.value,
            id: id,
        }
        id++;

        
        for (let i = 0; i < album.artists.length; i++) {
            let found = false;
            for (let j = 0; j < artists.length; j++) {
                if (album.artists[i].toLowerCase() == artists[j].name.toLowerCase()) {
                    artists[j].albums.push(album);
                    found = true;
                }
            }
            if (!found) {
                let artist = {
                    name: album.artists[i],
                    albums: [album],
                }
                artists.push(artist);
            }
        }
    }



    
    closeAddScreen();
    localStorage.setItem("id",id);
    localStorage.setItem("artists",JSON.stringify(artists));
    renderAlbums();
}
let lastSearch = "";
function focusSearch() {
    if (lastSearch !== $('.searchInput').value) {
        $('.searchInput').blur();
        lastSearch = $('.searchInput').value;
    } else {

        $('.searchInput').value = "";
        lastSearch = "";
        renderAlbums();
        $('.searchInput').focus();
    }
}
function deleteReview() {
    
    for (let i = 0; i < artists.length; i++) {
        for (let p = 0; p < artists[i].albums.length; p++) {
            if (artists[i].albums[p].id == albums[$('finish').i].id) {
                artists[i].albums.splice(p,1);
                continue;
            }
        }
    }
    
    closeAddScreen();
    localStorage.setItem("id",id);
    localStorage.setItem("artists",JSON.stringify(artists));
    renderAlbums();
}
function showWarning(text) {
    $('warning').innerHTML = text;
    $('warning').style.display = "block";

    setTimeout(function() {

        $('warning').style.display = "none";

    },1000);   
}
function statisticPage() {
    
    $('.hamburger').style.display = "none";

    $('statTotalArtist').innerHTML = artists.length;
    $('statTotalAlbums').innerHTML = albums.length;

    setArtistsScores();
    let artistScoreList = [];
    for (let i = 0; i < artists.length; i++) {
        artistScoreList.push(artists[i].rating);
    }
    $("statArtistRating").innerHTML = Math.round(artistScoreList.avg()*10)/10;
    
    let albumScoreList = [];
    for (let i = 0; i < albums.length; i++) {
        
        albumScoreList.push(albums[i].rating);
    }
    $("statAlbumRating").innerHTML = Math.round(albumScoreList.avg()*10)/10;


    $('statisticPage').style.display = 'flex';
}
function compare( a, b ) {
    if ( a.rating < b.rating ){
      return -1;
    }
    if ( a.rating > b.rating ){
      return 1;
    }
    return 0;
}
function searchForArtist(who) {
    searchBy = "Artist";
    $('.searchType').innerHTML = searchBy;
    $('.searchInput').value = who;
    lastSearch = $('.searchInput').value
    renderArtists();
}
function searchFor(who) {
    searchBy = "Album";
    $('.searchType').innerHTML = searchBy;
    $('.searchInput').value = who;
    lastSearch = $('.searchInput').value
    renderAlbums();
}
function renderArtists() {
    $('body').innerHTML = '';

    setArtistsScores();

    let list = [...artists];
    
    if (accending) list.sort( compare );
    else list.sort( compare ).reverse(); 


    let critaria = $('.searchInput').value;
    if (critaria !== "") {
        critaria = critaria.toLowerCase();
        let newList = [];
        for (let i = 0; i < list.length; i++) {
            let add = false;
            if (list[i].name.toLowerCase().includes(critaria)) {
                add = true;
            }

            if (add) {
                newList.push(list[i]);
            }
        }
        list = newList;
    }

    
    let string = ``;
    for (let i = 0; i < list.length; i++) {
        let artist = list[i];

        string += `
            <div id="album${i}" class="albumHolder">
                <div class="albumName">${artist.name}</div>
                <div onclick="searchFor('${artist.name}')" class="albumArtist">Albums Reviewed: ${artist.albums.length}</div>
                <div class="albumRating">${artist.rating}</div>
            </div>
        `

    }
    $('body').innerHTML = string;

    
    for (let i = 0; i < list.length; i++) {
        let artist = list[i];

        $('album' + i).style.background = "rgb(" + (255-(artist.rating*22.5)) + ",133,133)";
    }
    
}
function setArtistsScores() {
    for (let i = 0; i < artists.length; i++) {
        let trueRatings = [];
        let albumsReviewed = artists[i].albums.length;
        for (let j = 0; j < albumsReviewed; j++) {
            let score = artists[i].albums[j].rating;
            let b =  (Math.abs(5-score));
            let max = 4;
            if (albumsReviewed > max) albumsReviewed = max;
            let c = ((albumsReviewed*b)/max);
            if (score > 5) {
                trueRatings.push(5+c);
            } else {
                trueRatings.push(5-c);
            }
        }
        if (trueRatings.length < 1) {
            artists.splice(i,1);
            i--;
        } else {
            artists[i].rating = Math.round(trueRatings.avg()*10)/10;
        }
    }
}
function renderAlbums() {
    if (searchBy == "Artist") {
        renderArtists();
        return;
    }

    albums = gatherAlbums();

    if (accending) albums.sort( compare );
    else albums.sort( compare ).reverse(); 
    
    

    let critaria = $('.searchInput').value;
    if (critaria !== "") {
        critaria = critaria.toLowerCase();
        let newList = [];
        for (let i = 0; i < albums.length; i++) {
            let add = false;
            if (albums[i].name.toLowerCase().includes(critaria)) {
                add = true;
            }
            for (let j= 0; j < albums[i].artists.length; j++) {
                if (albums[i].artists[j].toLowerCase().includes(critaria)) add = true;
            }

            if (add) {
                newList.push(albums[i]);
            }
        }
        albums = newList;
    }
    
    let string = ``;
    for (let i = 0; i < albums.length; i++) {
        let album = albums[i];

        let artistDiv = `<div id="artist${i}" class="albumArtist">`;
        for (let j = 0; j < album.artists.length; j++) {
            artistDiv += `<span class="albumArtist2" onclick="searchForArtist('${album.artists[j]}')">` + album.artists[j] + "</span>";
            if (j < album.artists.length-1) artistDiv += ",  ";
        }
        artistDiv += "</div>"

        string += `
            <div id="album${i}" class="albumHolder">
                <div class="albumName">${album.name}</div>
                <img onclick="editAlbum(${i})" class="albumEdit" src="img/pencil.png">
                <div id="review${i}" class="albumReview"></div>
                ${artistDiv}
                <div class="albumRating">${album.rating}</div>
            </div>
        `
    }
    $('body').innerHTML = string;

    
    for (let i = 0; i < albums.length; i++) {
        let album = albums[i];
        $('album' + i).style.background = "rgb(" + (255-(album.rating*22.5)) + ",133,133)";
        $('review' + i).innerHTML = album.review;
        $('album' + i).i = i;
        $('album' + i).addEventListener("click",function(e) {
            if (!e.target.classList.contains("albumEdit") && !e.target.classList.contains("albumArtist2")) {
                if ($("review" + this.i).style.display == "none" || $("review" + this.i).style.display == "") {

                    $("review" + this.i).style.display = 'block';
                } else {
                    $("review" + this.i).style.display = 'none';

                }
            }
        })
    }
    
}

function gatherAlbums() {
    let albums = [];
    for (let i = 0; i < artists.length; i++) {
        for (let j = 0; j < artists[i].albums.length; j++) {
            let album = artists[i].albums[j];
            let alreadyAdded = false;
            for (let k = 0; k < albums.length; k++) {
                if (albums[k].id == album.id) alreadyAdded = true;
            }
            if (!alreadyAdded) albums.push(album);
        }
    }
    return albums;
}


renderAlbums();