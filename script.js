const app = {};
let filmDataset;
let characterDataset;
let selection;
let character;

app.displayLoading = () => {
    $("#loading").addClass("display");
    $(".gallery").addClass("galleryHide");
    setTimeout(() => {
        $("#loading").removeClass("display");
    }, 5000);
};

app.hideLoading = () => {
    $("#loading").removeClass("display"); 
    $(".gallery").removeClass("galleryHide");
};

app.getFilmAPI = () => {
    $.ajax({
        url: "https://ghibliapi.herokuapp.com/films",
        method: "GET",
        dataType: "json"
    }).then((response) => {
        filmDataset = response;
        app.populateDropdown(filmDataset);
        app.filmGallery(filmDataset);
        app.hideLoading();
        app.generateRandomFilm(filmDataset);
    }).catch((err) => {
        alert("There has been an error! Please try again.");
    });
};

app.getRandomIndex = (array) => {
    const index = Math.floor(Math.random() * array.length);
    return index;
};

app.generateIndexArray = (filmDataset) => {
    const indexArray = [];
    while (indexArray.length < 6) {
        const randomIndex = app.getRandomIndex(filmDataset);
        if (indexArray.includes(randomIndex) === false) {
            indexArray.push(randomIndex);
        } 
    };
    return indexArray;
};

app.filmGallery = (filmDataset) => {
    indexArray = app.generateIndexArray(filmDataset);
    indexArray.forEach ((indexNumber) => {
        const film = filmDataset[indexNumber];
        $(".gallery").append(`
            <div class="filmBox">
                <div>
                    <img class = "tiles" src="${film.movie_banner}" alt="${film.title}">
                </div>
                <a href="#films"><button class="filmTitle">${film.title}</button></a>
            </div>`)
        });
    app.getTileInfo(filmDataset);
};

app.getTileInfo = (filmDataset) => {
    $(".filmTitle").on("click", function () {
        selection = $(this).text();
        app.getFilmDetails(filmDataset, selection);
    });
};

app.populateDropdown = (filmDataset) => {
    filmDataset.forEach((film) => {
        $("#dropdown").append(`<option id = ${film.id}>${film.title}</option>`);
    });
    app.dropdownSelector(filmDataset);
};

app.dropdownSelector = (filmDataset) => {
    $("#dropdown").on("change", () => {
        const selection = $("option:selected").val();
        app.getFilmDetails(filmDataset, selection);
    });
};

app.getFilmDetails = (filmDataset, selection) => {
    $(".filmContainer").empty();    
    filmDataset.forEach((film) => {
        if (film.title === selection) {
            $(".filmContainer").append(`
                <div class = "filmImage">
                    <img class = "filmImageSource" src = "${film.image}" alt = "${film.title}">
                </div>
                <div class = "filmDetails">
                    <div><b>Original Title:</b> ${film.original_title}</div>
                    <div><b>English Title:</b> ${film.title}</div>
                    <div><b>Release Year:</b> ${film.release_date}</div>
                    <div><b>Director:</b> ${film.director}</div>
                    <div><b>Producer:</b> ${film.producer}</div>
                    <div><b>Run-time:</b> ${film.running_time} minutes</div>
                    <div><b>Description:</b> ${film.description}</div>
                </div>`);
        };
    });
};

app.generateRandomFilm = (filmDataset) => {
    $(".random").on("click", () => {
        const randomFilm = filmDataset[app.getRandomIndex(filmDataset)].title;
        app.getFilmDetails(filmDataset, randomFilm);
    });
};

app.getCharacterAPI = () => {
    $.ajax({
        url: "https://ghibliapi.herokuapp.com/people/",
        method: "GET",
        dataType: "json"
    }).then((response) => {
        characterDataset = response;
    }).catch((err) => {
        alert("There has been an error! Please try again.")
    });
};

$("form").on("submit", (event) => {
    event.preventDefault();
    const userInput = $('input').val();
    $(".characterContainer").empty();
    $("#searchInput").val("");
    app.getCharacterDetails(userInput)
});

app.getCharacterDetails = (userInput) => {
    let matches = 0;
    $(".searchMatchNumber").empty();
    if (userInput === "") {
        $(".searchMatchNumber").append(`Please enter a name.`);
    } else {characterDataset.forEach((character) => {
        if ((character.name).toUpperCase().includes(userInput.toUpperCase()) === true) {
            app.returnFilmById(character, filmDataset);
            $(".characterContainer").append(`
                <div class = "characterDetails">
                    <div><b>Name:</b> ${character.name}</div>
                    <div><b>Gender:</b> ${character.gender}</div>
                    <div><b>Age:</b> ${character.age}</div>
                    <div><b>Eye Color:</b> ${character.eye_color}</div>
                    <div><b>Hair Color:</b> ${character.hair_color}</div>
                    <div><b>Film:</b> ${filmTitle}</div>
                </div>`
            );
            matches ++;
            }
        });
        app.searchResults(matches);
    };
};

app.returnFilmById = (character, filmDataset) => {
    const filmId = `${character.films[0]}`.substring(38);
    filmDataset.forEach((film) => {
        if (film.id === filmId) {
            filmTitle = film.title;
        }
    });
};

app.searchResults = (matches) => {
    if (matches === 0) {
        $(".searchMatchNumber").append(`<p class = "no-match">Information on this character is currently unavailable. Please try another name :)</p>`)
    } else if (matches === 1) {
        $(".searchMatchNumber").append(`There is ${matches} match.`)
    } else {
        $(".searchMatchNumber").append(`There are ${matches} matches.`)
    }
};

app.init = () => {
    app.getFilmAPI();
    app.displayLoading();
    app.getCharacterAPI();
};

$(() => {
    app.init();
});