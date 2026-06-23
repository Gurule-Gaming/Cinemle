// 1. Setup API configuration and Daily State Variables
const API_KEY = "a24cbba3b16a5ea825ec42ac4e4c8d52"; 
const APP_VERSION = '5.0';

let SECRET_MOVIE = null;
let dailyMoviePool = []; 
let CURRENT_DATE_SEED = 0;
let GAME_MODE = "daily";
let currentMatchGuesses = [];

const searchInput = document.getElementById("movie-search");
const dropdown = document.getElementById("dropdown-results");
const feed = document.getElementById("guesses-feed");
const victoryPanel = document.getElementById("victory-reveal-panel");

function getDateSeed(date = new Date()) {
    return date.getUTCFullYear() * 10000 + (date.getUTCMonth() + 1) * 100 + date.getUTCDate();
}

async function initGame() {
    setupModeToggleButtons();
    try {
        let moviePromises = [];
        for (let page = 1; page <= 3; page++) {
            moviePromises.push(
                fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&vote_count.gte=50&page=${page}`)
                .then(res => res.ok ? res.json() : { results: [] })
            );
        }
        let results = await Promise.all(moviePromises);
        dailyMoviePool = results.flatMap(data => data.results || []).filter(m => m && m.id);

        if (dailyMoviePool.length > 0) {
            await startMatch();
        }
    } catch (err) {
        console.error("Error loading movie library:", err);
    }
}

// FIX: Added bridge function required by the engine
async function setDailyMovie(date = new Date()) {
    CURRENT_DATE_SEED = getDateSeed(date);
    const targetIndex = CURRENT_DATE_SEED % dailyMoviePool.length;
    await loadTargetDetails(dailyMoviePool[targetIndex].id);
}

function setupModeToggleButtons() {
    const btnDaily = document.getElementById("btn-mode-daily");
    const btnEndless = document.getElementById("btn-mode-endless");
    if (!btnDaily || !btnEndless) return;

    btnDaily.onclick = () => { GAME_MODE = "daily"; startMatch(); };
    btnEndless.onclick = () => { GAME_MODE = "endless"; startMatch(); };
}

async function startMatch() {
    if (feed) feed.innerHTML = "";
    if (victoryPanel) victoryPanel.style.display = "none";
    if (searchInput) searchInput.value = "";

    if (GAME_MODE === "daily") {
        await setDailyMovie();
        // Ensure loadSavedGuesses is defined or handled
        if (typeof loadSavedGuesses === 'function') loadSavedGuesses(CURRENT_DATE_SEED);
    } else {
        let randomIndex = Math.floor(Math.random() * dailyMoviePool.length);
        await loadTargetDetails(dailyMoviePool[randomIndex].id);
    }
}

function updateHintText(text) {
    const hintElement = document.getElementById("hint-text");
    if (hintElement) hintElement.innerText = text;
}

async function loadTargetDetails(movieId) {
    const detailRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`);
    const details = await detailRes.json();
    
    SECRET_MOVIE = {
        id: details.id,
        title: details.title.toUpperCase(),
        year: parseInt(details.release_date?.split("-")[0]) || 0,
        genre: details.genres?.[0]?.name || "Unknown"
    };
    updateHintText(`Daily Hint: A popular ${SECRET_MOVIE.genre} movie released in ${SECRET_MOVIE.year}.`);
}

// Placeholder for missing guess logic to prevent crash
function loadSavedGuesses() { console.log("Guesses loaded"); }
function fetchAndSubmitGuess(id, isSelected) { console.log("Guess submitted", id); }

window.addEventListener('DOMContentLoaded', initGame);
