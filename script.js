// script.js
const API_KEY = "a24cbba3b16a5ea825ec42ac4e4c8d52"; 
let SECRET_MOVIE = null;
let dailyMoviePool = []; 
let CURRENT_DATE_SEED = 0;
let GAME_MODE = "daily"; 

const searchInput = document.getElementById("movie-search");
const feed = document.getElementById("guesses-feed");
const victoryPanel = document.getElementById("victory-reveal-panel");

async function initGame() {
    setupModeToggleButtons();
    try {
        // Fetch data from TMDB
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&vote_count.gte=50&page=1`);
        if (!res.ok) throw new Error("API response not okay");
        const data = await res.json();
        
        dailyMoviePool = data.results || [];
        
        if (dailyMoviePool.length > 0) {
            await startMatch();
        } else {
            updateHintText("No movies found in pool.");
        }
    } catch (err) {
        console.error("Initialization Error:", err);
        updateHintText("Failed to load game data. Check Console.");
    }
}

async function setDailyMovie() {
    const today = new Date();
    CURRENT_DATE_SEED = today.getUTCFullYear() * 10000 + (today.getUTCMonth() + 1) * 100 + today.getUTCDate();
    const targetIndex = CURRENT_DATE_SEED % dailyMoviePool.length;
    await loadTargetDetails(dailyMoviePool[targetIndex].id);
}

function setupModeToggleButtons() {
    const btnDaily = document.getElementById("btn-mode-daily");
    const btnEndless = document.getElementById("btn-mode-endless");
    if (!btnDaily || !btnEndless) return;

    btnDaily.onclick = async () => { GAME_MODE = "daily"; await startMatch(); };
    btnEndless.onclick = async () => { GAME_MODE = "endless"; await startMatch(); };
}

async function startMatch() {
    if (feed) feed.innerHTML = "";
    if (victoryPanel) victoryPanel.style.display = "none";
    if (searchInput) searchInput.value = "";

    if (GAME_MODE === "daily") {
        await setDailyMovie();
    } else {
        const randomIndex = Math.floor(Math.random() * dailyMoviePool.length);
        await loadTargetDetails(dailyMoviePool[randomIndex].id);
    }
}

async function loadTargetDetails(movieId) {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`);
        const details = await res.json();
        SECRET_MOVIE = {
            id: details.id,
            title: details.title.toUpperCase(),
            year: parseInt(details.release_date?.split("-")[0]) || 0,
            genre: details.genres?.[0]?.name || "Unknown"
        };
        updateHintText(`Daily Hint: A popular ${SECRET_MOVIE.genre} movie released in ${SECRET_MOVIE.year}.`);
    } catch (err) {
        console.error("Detail Fetch Error:", err);
    }
}

function updateHintText(text) {
    const hintElement = document.getElementById("hint-text");
    if (hintElement) hintElement.innerText = text;
}

window.addEventListener('DOMContentLoaded', initGame);
