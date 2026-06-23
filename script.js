// 1. Setup API configuration and Daily State Variables
const API_KEY = "a24cbba3b16a5ea825ec42ac4e4c8d52"; // 👈 PASTE YOUR API KEY HERE
let SECRET_MOVIE = null;
let allHollywoodMovies = [];

const searchInput = document.getElementById("movie-search");
const dropdown = document.getElementById("dropdown-results");
const feed = document.getElementById("guesses-feed");

// 2. Fetch a curated list of popular Hollywood movies on launch
async function initGame() {
    try {
        // Fetches top-rated English movies across multiple pages to build a pool of thousands of films
        let moviePromises = [];
        for (let page = 1; page <= 5; page++) {
            moviePromises.push(
                fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&region=US&sort_by=vote_count.desc&with_original_language=en&page=${page}`)
                .then(res => res.json())
            );
        }
        
        let results = await Promise.all(moviePromises);
        // Flatten pages into one giant movie list array
        allHollywoodMovies = results.flatMap(data => data.results);

        // Fetch deep details (like director) for our special daily movie
        await setDailyMovie();
    } catch (err) {
        console.error("Error loading movie library:", err);
    }
}

// 3. Mathematical Formula to pick one synchronized movie per calendar day
async function setDailyMovie() {
    // Generates a consistent number based on the current calendar date (Year-Month-Day)
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Pick an index from our pool using the date seed
    const targetIndex = dateSeed % allHollywoodMovies.length;
    const basicMovieInfo = allHollywoodMovies[targetIndex];

    // Request deep credits to uncover the Director's name
    const detailRes = await fetch(`https://api.themoviedb.org/3/movie/${basicMovieInfo.id}?api_key=${API_KEY}&append_to_response=credits`);
    const details = await detailRes.json();

    const directorObj = details.credits.crew.find(member => member.job === "Director");
    const mainGenre = details.genres.length > 0 ? details.genres[0].name : "Unknown";

    // Format the official Daily Target Movie object
    SECRET_MOVIE = {
        title: details.title.toUpperCase(),
        year: parseInt(details.release_date.split("-")[0]),
        genre: mainGenre,
        director: directorObj ? directorObj.name : "Unknown",
        hint: details.overview, // Uses the movie's official tagline summary plot as a clue
        poster: `https://image.tmdb.org/t/p/w200${details.poster_path}`
    };

    // Update layout hints safely
    document.getElementById("hint-text").innerText = `Daily Hint: ${SECRET_MOVIE.hint}`;
}

// 4. Live Search Input Autocomplete filtering real API data
searchInput.addEventListener("input", async () => {
    let query = searchInput.value.trim();
    dropdown.innerHTML = "";
    if (query.length < 2) return;

    // Filter local popular pool or fetch dynamic lookups directly from TMDB
    let filtered = allHollywoodMovies.filter(m => m.title.toUpperCase().includes(query.toUpperCase())).slice(0, 8);
    
    for (let movie of filtered) {
        let item = document.createElement("div");
        item.classList.add("dropdown-item");
        item.innerText = `${movie.title} (${movie.release_date.split("-")[0]})`;
        
        item.addEventListener("click", async () => {
            // Fetch comprehensive record block when item is clicked
            let res = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&append_to_response=credits`);
            let d = await res.json();
            let dir = d.credits.crew.find(m => m.job === "Director");
            
            submitGuess({
                title: d.title.toUpperCase(),
                year: parseInt(d.release_date.split("-")[0]),
                genre: d.genres.length > 0 ? d.genres[0].name : "Unknown",
                director: dir ? dir.name : "Unknown",
                poster: `https://image.tmdb.org/t/p/w200${d.poster_path}`
            });
        });
        dropdown.appendChild(item);
    }
});

// 5. Build Result Comparison Rows
function submitGuess(guessedMovie) {
    searchInput.value = "";
    dropdown.innerHTML = "";

    let row = document.createElement("div");
    row.classList.add("guess-row");

    // Poster Image Square Block
    let posterBlock = document.createElement("div");
    posterBlock.classList.add("poster-block");
    posterBlock.style.backgroundImage = `url('${guessedMovie.poster}')`;
    row.appendChild(posterBlock);

    // Title Check
    let titleBlock = createInfoBlock(guessedMovie.title, guessedMovie.title === SECRET_MOVIE.title);
    row.appendChild(titleBlock);

    // Year Check with arrow indicators
    let yearStatus = "absent";
    let displayYear = guessedMovie.year;
    if (guessedMovie.year === SECRET_MOVIE.year) {
        yearStatus = "correct";
    } else {
        displayYear += guessedMovie.year < SECRET_MOVIE.year ? " ⬆️" : " ⬇️";
    }
    row.appendChild(createInfoBlock(displayYear, yearStatus));

    // Genre Check
    row.appendChild(createInfoBlock(guessedMovie.genre, guessedMovie.genre === SECRET_MOVIE.genre));

    // Director Check
    row.appendChild(createInfoBlock(guessedMovie.director, guessedMovie.director === SECRET_MOVIE.director));

    feed.insertBefore(row, feed.firstChild);

    if (guessedMovie.title === SECRET_MOVIE.title) {
        setTimeout(() => alert("Masterful guessing! You found today's hidden movie! 🎬🎉"), 200);
    }
}

function createInfoBlock(text, statusClass) {
    let block = document.createElement("div");
    block.classList.add("info-block");
    if (statusClass === true) block.classList.add("correct");
    else if (statusClass === false) block.classList.add("absent");
    else block.classList.add(statusClass);
    block.innerText = text;
    return block;
}

// Start the setup loop
initGame();
