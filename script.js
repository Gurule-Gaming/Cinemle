// 1. Setup API configuration and Daily State Variables
const API_KEY = "a24cbba3b16a5ea825ec42ac4e4c8d52"; 
let SECRET_MOVIE = null;
let dailyMoviePool = []; 
let CURRENT_DATE_SEED = 0;
let IS_ENDLESS = false;
let guessCount = 0; 

const searchInput = document.getElementById("movie-search");
const dropdown = document.getElementById("dropdown-results");
const feed = document.getElementById("guesses-feed");
const endlessBtn = document.getElementById("endless-btn");

// 2. Fetch a global list of movies safely for the Daily Target Picker
async function initGame() {
    guessCount = 0;
    try {
        let moviePromises = [];
        for (let page = 1; page <= 3; page++) {
            moviePromises.push(
                fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&vote_count.gte=50&page=${page}`)
                .then(res => {
                    if (!res.ok) return { results: [] };
                    return res.json();
                })
                .catch(() => { return { results: [] }; })
            );
        }
        
        let results = await Promise.all(moviePromises);
        dailyMoviePool = results.flatMap(data => data.results || []);
        dailyMoviePool = dailyMoviePool.filter(m => m && m.id);

        if (dailyMoviePool.length > 0) {
            await setDailyMovie();
        } else {
            updateHintText("Error loading movie pool. Check your internet connection.");
        }
    } catch (err) {
        console.error("Error loading movie library:", err);
        updateHintText("Failed to load game data.");
    }
}

// Helper to update hint safely
function updateHintText(text) {
    const hintElement = document.getElementById("hint-text") || document.querySelector('.hint-box') || document.querySelector('div blockquote');
    if (hintElement) {
        hintElement.innerText = text;
    }
}

// Progressive Hint Logic
function triggerProgressiveHint() {
    guessCount++;
    const mode = IS_ENDLESS ? "Endless" : "Daily";
    
    switch(guessCount) {
        case 1: updateHintText(`${mode} Hint: Directed by ${SECRET_MOVIE.director}.`); break;
        case 2: updateHintText(`${mode} Hint: The movie runtime is ${SECRET_MOVIE.runtime} minutes.`); break;
        case 3: updateHintText(`${mode} Hint: Plot: ${SECRET_MOVIE.overview.substring(0, 80)}...`); break;
        default: break;
    }
}

// 3. Mathematical Formula to pick one synchronized movie per calendar day (UTC Fixed)
async function setDailyMovie(customDate = null) {
    try {
        IS_ENDLESS = false;
        guessCount = 0;
        if (endlessBtn) endlessBtn.innerText = "Endless Mode 🎲";
        
        const today = customDate || new Date();
        CURRENT_DATE_SEED = today.getUTCFullYear() * 10000 + (today.getUTCMonth() + 1) * 100 + today.getUTCDate();
        
        const targetIndex = CURRENT_DATE_SEED % dailyMoviePool.length;
        const basicMovieInfo = dailyMoviePool[targetIndex];

        await loadTargetDetails(basicMovieInfo.id);
        loadSavedGuesses(CURRENT_DATE_SEED);

    } catch (err) {
        console.error("Error setting daily movie:", err);
        updateHintText("Failed to load game data.");
    }
}

async function setEndlessMovie() {
    if (dailyMoviePool.length === 0) return;
    
    IS_ENDLESS = true;
    guessCount = 0;
    if (endlessBtn) endlessBtn.innerText = "Back to Daily Mode 📅";
    
    if (feed) feed.innerHTML = "";
    if (searchInput) searchInput.value = "";
    if (dropdown) dropdown.innerHTML = "";
    
    const randomIndex = Math.floor(Math.random() * dailyMoviePool.length);
    const selectedMovie = dailyMoviePool[randomIndex];
    
    await loadTargetDetails(selectedMovie.id);
}

if (endlessBtn) {
    endlessBtn.addEventListener("click", () => {
        if (!IS_ENDLESS) {
            setEndlessMovie();
        } else {
            if (feed) feed.innerHTML = "";
            setDailyMovie();
        }
    });
}

async function loadTargetDetails(movieId) {
    const detailRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`);
    const details = await detailRes.json();

    const directorObj = details.credits?.crew?.find(member => member.job === "Director");
    const mainGenre = details.genres?.length > 0 ? details.genres[0].name : "Unknown";

    SECRET_MOVIE = {
        id: details.id,
        title: details.title.toUpperCase(),
        year: parseInt(details.release_date?.split("-")[0]) || 0,
        genre: mainGenre,
        director: directorObj ? directorObj.name : "Unknown",
        poster: details.poster_path ? `https://image.tmdb.org/t/p/w200${details.poster_path}` : "",
        overview: details.overview || "No description available.",
        runtime: details.runtime || 0,
        rating: details.vote_average ? details.vote_average.toFixed(1) : "N/A"
    };

    guessCount = 0;
    const modePrefix = IS_ENDLESS ? "Endless Challenge" : "Daily Hint";
    updateHintText(`${modePrefix}: A popular ${SECRET_MOVIE.genre} movie released in ${SECRET_MOVIE.year}.`);
}

if (searchInput) {
    searchInput.addEventListener("input", async () => {
        let query = searchInput.value.trim();
        
        if (query.toUpperCase() === "DEVPANEL99") {
            searchInput.value = ""; 
            if (dropdown) dropdown.innerHTML = "";
            launchDevPanel();
            return; 
        }

        if (!dropdown) return;
        dropdown.innerHTML = "";
        if (query.length < 2) return;

        try {
            let res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`);
            let data = await res.json();
            let searchResults = data.results || [];
            let filtered = searchResults.filter(m => m.release_date && m.vote_count >= 5).slice(0, 8);
            
            filtered.forEach(movie => {
                let movieYear = movie.release_date.split("-")[0];
                let item = document.createElement("div");
                item.classList.add("dropdown-item");
                item.innerText = `${movie.title} (${movieYear})`;
                item.addEventListener("click", () => fetchAndSubmitGuess(movie.id, true));
                dropdown.appendChild(item);
            });
        } catch (err) {
            console.error("Live search request failed:", err);
        }
    });
}

function launchDevPanel() {
    if (document.getElementById("admin-dev-overlay")) return;
    let overlay = document.createElement("div");
    overlay.id = "admin-dev-overlay";
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,15,20,0.98); z-index:9999; color:#fff; font-family:sans-serif; padding:30px; box-sizing:border-box; overflow-y:auto;";
    let title = document.createElement("h2");
    title.innerText = "🛠️ SYSTEM DEVELOPER CONTROL PANEL";
    overlay.appendChild(title);
    let diagnostics = document.createElement("div");
    diagnostics.innerHTML = `[DIAGNOSTICS] Total: ${dailyMoviePool.length}`;
    overlay.appendChild(diagnostics);
    let btnClose = document.createElement("button");
    btnClose.innerText = "❌ Close";
    btnClose.onclick = () => overlay.remove();
    overlay.appendChild(btnClose);
    document.body.appendChild(overlay);
}

function showCustomGameModal(titleText, bodyText, movieData = null) {
    if (document.getElementById("custom-game-modal-overlay")) return;
    let overlay = document.createElement("div");
    overlay.id = "custom-game-modal-overlay";
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:10000;";
    let card = document.createElement("div");
    card.style = "background:#1e1e24; color:#fff; padding:30px; border-radius:16px; width:100%; max-width:600px; text-align:center;";
    card.innerHTML = `<h2>${titleText}</h2><p>${bodyText}</p>`;
    let btn = document.createElement("button");
    btn.innerText = "OK";
    btn.onclick = () => { overlay.remove(); if(IS_ENDLESS) setEndlessMovie(); };
    card.appendChild(btn);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
}

async function getWatchProviders(movieId) {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`);
        const data = await res.json();
        return data.results?.US?.flatrate?.map(p => p.provider_name) || [];
    } catch { return []; }
}

async function fetchAndSubmitGuess(movieId, saveToStorage = false) {
    try {
        let res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`);
        let d = await res.json();
        let dir = d.credits?.crew?.find(m => m.job === "Director");
        submitGuess({
            title: d.title.toUpperCase(),
            year: parseInt(d.release_date?.split("-")[0]) || 0,
            genre: d.genres?.[0]?.name || "Unknown",
            director: dir?.name || "Unknown",
            poster: d.poster_path ? `https://image.tmdb.org/t/p/w200${d.poster_path}` : "",
            overview: d.overview || "No description.",
            runtime: d.runtime || 0,
            rating: d.vote_average?.toFixed(1) || "N/A",
            id: d.id
        });
        if (saveToStorage) saveGuessToStorage(movieId);
    } catch (err) { console.error(err); }
}

function submitGuess(guessedMovie) {
    if (searchInput) searchInput.value = "";
    if (dropdown) dropdown.innerHTML = "";
    if (!feed) return;

    let row = document.createElement("div");
    row.classList.add("guess-row");
    row.appendChild(createInfoBlock(guessedMovie.title, guessedMovie.title === SECRET_MOVIE.title));
    row.appendChild(createInfoBlock(guessedMovie.year, guessedMovie.year === SECRET_MOVIE.year ? "correct" : "absent"));
    row.appendChild(createInfoBlock(guessedMovie.genre, guessedMovie.genre === SECRET_MOVIE.genre));
    row.appendChild(createInfoBlock(guessedMovie.director, guessedMovie.director === SECRET_MOVIE.director));
    feed.insertBefore(row, feed.firstChild);

    if (guessedMovie.title === SECRET_MOVIE.title) {
        showCustomGameModal("Success!", "You found it!");
    } else {
        triggerProgressiveHint();
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

function saveGuessToStorage(movieId) {
    if (IS_ENDLESS) return; 
    let saved = JSON.parse(localStorage.getItem("moviedle_guesses")) || [];
    if (!saved.includes(movieId)) {
        saved.push(movieId);
        localStorage.setItem("moviedle_guesses", JSON.stringify(saved));
        localStorage.setItem("moviedle_date_seed", CURRENT_DATE_SEED.toString());
    }
}

async function loadSavedGuesses(currentDateSeed) {
    const stored = localStorage.getItem("moviedle_date_seed");
    if (stored !== currentDateSeed.toString()) return;
    let saved = JSON.parse(localStorage.getItem("moviedle_guesses")) || [];
    for (const id of saved) await fetchAndSubmitGuess(id, false);
}

initGame();
