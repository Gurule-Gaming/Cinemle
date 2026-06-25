 Conversation with Gemini

Make a name for a movie themed wordle

Here are a few catchy name ideas for a movie-themed Wordle game, broken down by the "vibe" you might want to go for:
The Clever Puns

    Cinemle (Cinema + Wordle)

    Wordie (Like "movie" but for word lovers)

    Scriptle (Script + Wordle)

    Flicktle (Flick + Wordle)

The Hollywood Vibe

    Box Office

    Final Cut

    The Logline (Perfect if the clues involve guessing a movie's plot)

    Screenplay

The Movie Buff / Inside Jokes

    MacGuffin (A nod to Hitchcock's classic plot device)

    Cinephile

    Title Card

    Pro-Tip: If the game involves guessing a 5-letter movie title (like Jaws, Fargo, or Shrek), Cinemle or Flicktle work best. If they are guessing 5-letter movie industry terms (like Scene, Actor, Genre), Scriptle is a perfect fit.

Which angle fits the specific gameplay you have in mind?

How can I launch the website for free

Launching a Wordle-style web game for absolutely free is incredibly easy. Because a Wordle game is typically a static website (just HTML, CSS, and JavaScript running entirely in the user's browser), you don't need to pay for heavy backend servers or databases.

Here are the best free platforms to use, ranked by how you prefer to build:
The Top Free Platforms
1. GitHub Pages (Best if you already use Git)

If you are already tracking your code in a GitHub repository, this is a no-brainer.

    The Cost: $0 (100% free forever for public repositories).  

    How it works: You just turn on "GitHub Pages" in your repository settings, select your main branch, and GitHub automatically launches your site.

    Your URL: yourusername.github.io/your-game-name

2. Vercel or Netlify (Easiest 1-Click Deployment)

These are modern web-hosting platforms that connect directly to your GitHub account.

    The Cost: Free hobby tiers with a soft limit of 100GB of monthly bandwidth (which is plenty for a puzzle game).  

    Why they rule: Every single time you push a code update to GitHub, these platforms automatically rebuild and update your live website instantly. They also give you cool "preview links" to test changes before making them live.  

    Your URL: your-game-name.vercel.app or your-game-name.netlify.app

3. Tiny.host or Static.app (Best if you don't use Git)

If you just wrote the code locally in a text editor and have an index.html file on your computer, you don't even need to learn Git.

    The Cost: Free basic tiers.

    How it works: You literally drag and drop your project folder containing your HTML, CSS, and JS files directly into your browser window on their homepage, and boom—your site is live in 5 seconds.

🛠️ Step-by-Step: The Easiest "Git-Free" Launch

If you want the absolute fastest route right now without messing with the terminal, use Netlify's Drag-and-Drop feature:

1
Prepare your files
Prerequisite

Put your HTML, CSS, and JavaScript files into a single, dedicated folder on your computer. Make sure your main file is named exactly index.html (lowercase), or the server won't know what to load first.
2
Go to Netlify Drop
10 seconds

Open your browser and head to app.netlify.com/drop. You don't even need to sign up for an account yet to test it.
3
Drag, drop, and launch
5 seconds

Drag your entire project folder from your computer and drop it directly onto the big box on the webpage. Netlify will instantly upload it and give you a live random link (like shiny-unicorn-12345.netlify.app).
4
Claim your site
Optional but recommended

Create a free Netlify account right there on the screen to save the site. Once logged in, you can go to Site Settings and change that random name to whatever you picked for your game (e.g., cinemle.netlify.app).

    💡 What about a custom domain (like .com)?
    While the hosting itself is completely free on all these platforms, a custom domain name (without the .netlify.app or .github.io at the end) always costs money—usually around $10–$15 a year through a registrar like Namecheap or Porkbun. You can absolutely just use the free subdomains indefinitely while you build and test your game!

  

What stack or language are you using to build the game? I can show you how to structure the files so it uploads smoothly on the first try.

Add the // (Paste your existing launchDevPanel, search, and helper functions here)

Yourself here's the full script


// 1. Setup API configuration and Daily State Variables

const API_KEY = "a24cbba3b16a5ea825ec42ac4e4c8d52";

let SECRET_MOVIE = null;

let dailyMoviePool = [];

let CURRENT_DATE_SEED = 0;


const searchInput = document.getElementById("movie-search");

const dropdown = document.getElementById("dropdown-results");

const feed = document.getElementById("guesses-feed");


// 2. Fetch a global list of movies safely for the Daily Target Picker

async function initGame() {

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


// 3. Mathematical Formula to pick one synchronized movie per calendar day (UTC Fixed)

async function setDailyMovie(customDate = null) {

try {

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


// Helper to pull complete target details from TMDB

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

poster: details.poster_path ? `https://image.tmdb.org/t/p/w200${details.poster_path}` : ""

};


updateHintText(`Daily Hint: A popular ${SECRET_MOVIE.genre} movie released in ${SECRET_MOVIE.year}.`);

}


// 4. Live Search Input Autocomplete & Hidden Dev Passcode Hook

if (searchInput) {

searchInput.addEventListener("input", async () => {

let query = searchInput.value.trim();

// --- SECRET PASSCODE TRIGGER ---

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


// --- VISUAL DEV PANEL ENGINE ---

function launchDevPanel() {

if (document.getElementById("admin-dev-overlay")) return;


let overlay = document.createElement("div");

overlay.id = "admin-dev-overlay";

overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,15,20,0.98); z-index:9999; color:#fff; font-family:sans-serif; padding:30px; box-sizing:border-box; overflow-y:auto;";


let title = document.createElement("h2");

title.innerText = "🛠️ SYSTEM DEVELOPER CONTROL PANEL";

title.style.borderBottom = "2px solid #333";

title.style.paddingBottom = "10px";

overlay.appendChild(title);


// [1] POOL DIAGNOSTIC TRACKER

let diagnostics = document.createElement("div");

diagnostics.style = "background:#1a202c; padding:12px; border-radius:6px; border:1px solid #2d3748; margin:15px 0; font-size:14px; font-family:monospace; color:#a0aec0;";

let targetIndex = CURRENT_DATE_SEED % (dailyMoviePool.length || 1);

diagnostics.innerHTML = `

<strong>[DIAGNOSTICS]</strong><br>

• Total Loaded Pool: ${dailyMoviePool.length} movies<br>

• Current Date Seed: ${CURRENT_DATE_SEED}<br>

• Active Pool Index: ${targetIndex}

`;

overlay.appendChild(diagnostics);


// Metadata Display Container

let infoBox = document.createElement("div");

infoBox.id = "dev-info-box";

infoBox.style = "background:#222; padding:15px; border-radius:8px; margin:15px 0; font-size:16px; line-height:1.6; display:none;";

overlay.appendChild(infoBox);


// Action Grid Box

let sectionGrid = document.createElement("div");

sectionGrid.style = "display:grid; grid-template-columns: 1fr; gap:15px; max-width:500px;";

overlay.appendChild(sectionGrid);


// Button: Toggle Movie Info

let btnInfo = document.createElement("button");

btnInfo.innerText = "👁️ Show / Hide Target Data";

styleDevButton(btnInfo, "#4a5568");

btnInfo.onclick = () => {

if (infoBox.style.display === "none") {

infoBox.style.display = "block";

refreshInfoBox(infoBox);

} else {

infoBox.style.display = "none";

}

};

sectionGrid.appendChild(btnInfo);


// Button: Re-roll / Change Movie Entirely

let btnChange = document.createElement("button");

btnChange.innerText = "🎲 Force Swap Target Movie (Random Re-roll)";

styleDevButton(btnChange, "#e53e3e");

btnChange.onclick = async () => {

if (dailyMoviePool.length === 0) return alert("Pool empty!");

let randomIndex = Math.floor(Math.random() * dailyMoviePool.length);

let selectedMovie = dailyMoviePool[randomIndex];

await loadTargetDetails(selectedMovie.id);

refreshInfoBox(infoBox);

showCustomGameModal("Target updated successfully!", `The new hidden answer is now locked into memory.`);

};

sectionGrid.appendChild(btnChange);


// Button: Next Up Preview

let btnPreview = document.createElement("button");

btnPreview.innerText = "🔮 Next Up Preview (Tomorrow's Movie)";

styleDevButton(btnPreview, "#3182ce");

btnPreview.onclick = async () => {

if (dailyMoviePool.length === 0) return alert("Pool empty!");

const tomorrow = new Date();

tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

const tomorrowSeed = tomorrow.getUTCFullYear() * 10000 + (tomorrow.getUTCMonth() + 1) * 100 + tomorrow.getUTCDate();

const tomorrowIndex = tomorrowSeed % dailyMoviePool.length;

const tomorrowMovie = dailyMoviePool[tomorrowIndex];


try {

let res = await fetch(`https://api.themoviedb.org/3/movie/${tomorrowMovie.id}?api_key=${API_KEY}`);

let d = await res.json();

alert(`🔮 TOMORROW'S TARGET SNEAK PEEK:\n\nTitle: ${d.title.toUpperCase()}\nRelease Year: ${d.release_date ? d.release_date.split("-")[0] : 'Unknown'}\nID: ${d.id}`);

} catch (e) {

alert("Error fetching tomorrow's data.");

}

};

sectionGrid.appendChild(btnPreview);


// [2] INTERNAL TMDB SEARCH ENGINE ENGINE

let searchBlock = document.createElement("div");

searchBlock.style = "margin:15px 0; padding:15px; background:#1a202c; border-radius:8px; border:1px solid #2d3748; max-width:500px;";

searchBlock.innerHTML = `

<label style="display:block; font-size:13px; font-weight:bold; color:#cbd5e1; margin-bottom:6px;">🔍 Internal TMDB Search Engine (Find IDs / Force Target):</label>

<div style="display:flex; gap:10px;">

<input type="text" id="dev-search-input" placeholder="Search any movie..." style="flex:1; padding:8px; border-radius:4px; border:1px solid #4a5568; background:#2d3748; color:#fff;">

<button id="dev-search-btn" style="padding:8px 15px; background:#3182ce; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Search</button>

</div>

<div id="dev-search-results" style="margin-top:10px; max-height:150px; overflow-y:auto; font-size:12px; background:#111; border-radius:4px;"></div>

`;

overlay.appendChild(searchBlock);


setTimeout(() => {

const dInput = document.getElementById("dev-search-input");

const dBtn = document.getElementById("dev-search-btn");

const dResults = document.getElementById("dev-search-results");

dBtn.onclick = async () => {

let query = dInput.value.trim();

if (!query) return;

dResults.innerHTML = "<div style='padding:8px; color:#aaa;'>Searching...</div>";

try {

let res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);

let data = await res.json();

dResults.innerHTML = "";

(data.results || []).slice(0, 5).forEach(m => {

let yr = m.release_date ? m.release_date.split("-")[0] : "N/A";

let row = document.createElement("div");

row.style = "padding:8px; border-bottom:1px solid #222; display:flex; justify-content:space-between; align-items:center;";

row.innerHTML = `

<span><strong>${m.title} (${yr})</strong> - ID: ${m.id}</span>

<div>

<button class="dev-set-tgt" data-id="${m.id}" style="background:#e53e3e; color:#fff; border:none; padding:4px 8px; font-size:11px; border-radius:3px; cursor:pointer; margin-right:5px;">Set Target</button>

<button class="dev-inj-guess" data-id="${m.id}" style="background:#4ade80; color:#000; border:none; padding:4px 8px; font-size:11px; border-radius:3px; cursor:pointer;">Inject Guess</button>

</div>

`;

dResults.appendChild(row);

});


document.querySelectorAll(".dev-set-tgt").forEach(b => {

b.onclick = async () => {

await loadTargetDetails(b.getAttribute("data-id"));

refreshInfoBox(infoBox);

alert(`Target locked to: ${SECRET_MOVIE.title}`);

};

});

document.querySelectorAll(".dev-inj-guess").forEach(b => {

b.onclick = async () => {

await fetchAndSubmitGuess(b.getAttribute("data-id"), true);

showCustomGameModal("Row Injected", "Movie row added to layout.");

};

});

} catch (err) { dResults.innerHTML = "<div style='padding:8px; color:#e53e3e;'>Search Failed</div>"; }

};

}, 50);


// [3] ATTRIBUTE MODIFIER (RIG THE MATCH)

let rigBlock = document.createElement("div");

rigBlock.style = "margin:15px 0; padding:15px; background:#1a202c; border-radius:8px; border:1px solid #2d3748; max-width:500px;";

rigBlock.innerHTML = `

<label style="display:block; font-size:13px; font-weight:bold; color:#cbd5e1; margin-bottom:8px;">🎛️ Match Attribute Modifier (Rig Core Parameters):</label>

<div style="display:grid; grid-template-columns: 80px 1fr; gap:8px; font-size:12px; align-items:center;">

<span>Title:</span><input type="text" id="rig-title" style="padding:6px; background:#2d3748; border:1px solid #4a5568; color:#fff; border-radius:4px;">

<span>Year:</span><input type="number" id="rig-year" style="padding:6px; background:#2d3748; border:1px solid #4a5568; color:#fff; border-radius:4px;">

<span>Genre:</span><input type="text" id="rig-genre" style="padding:6px; background:#2d3748; border:1px solid #4a5568; color:#fff; border-radius:4px;">

<span>Director:</span><input type="text" id="rig-director" style="padding:6px; background:#2d3748; border:1px solid #4a5568; color:#fff; border-radius:4px;">

</div>

<button id="btn-rig-apply" style="width:100%; margin-top:10px; padding:8px; background:#d69e2e; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Apply Attribute Rig overrides</button>

`;

overlay.appendChild(rigBlock);


setTimeout(() => {

document.getElementById("rig-title").value = SECRET_MOVIE.title;

document.getElementById("rig-year").value = SECRET_MOVIE.year;

document.getElementById("rig-genre").value = SECRET_MOVIE.genre;

document.getElementById("rig-director").value = SECRET_MOVIE.director;


document.getElementById("btn-rig-apply").onclick = () => {

SECRET_MOVIE.title = document.getElementById("rig-title").value.toUpperCase();

SECRET_MOVIE.year = parseInt(document.getElementById("rig-year").value) || 0;

SECRET_MOVIE.genre = document.getElementById("rig-genre").value;

SECRET_MOVIE.director = document.getElementById("rig-director").value;

refreshInfoBox(infoBox);

updateHintText(`Daily Hint: A popular ${SECRET_MOVIE.genre} movie released in ${SECRET_MOVIE.year}.`);

alert("Core match variables rigged successfully!");

};

}, 50);


// [4] TIME-TRAVEL SIMULATOR (DATE TESTER)

let timeBlock = document.createElement("div");

timeBlock.style = "margin:15px 0; padding:15px; background:#1a202c; border-radius:8px; border:1px solid #2d3748; max-width:500px;";

timeBlock.innerHTML = `

<label style="display:block; font-size:13px; font-weight:bold; color:#cbd5e1; margin-bottom:6px;">⏱️ Time-Travel Simulator (Test Specific Calendar Seeds):</label>

<div style="display:flex; gap:10px;">

<input type="date" id="time-travel-date" style="flex:1; padding:8px; border-radius:4px; border:1px solid #4a5568; background:#2d3748; color:#fff;">

<button id="btn-time-travel" style="padding:8px 15px; background:#805ad5; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Simulate Date</button>

</div>

`;

overlay.appendChild(timeBlock);


setTimeout(() => {

document.getElementById("btn-time-travel").onclick = async () => {

let val = document.getElementById("time-travel-date").value;

if (!val) return alert("Select a date layout parameter first!");

let parts = val.split("-");

let mockDate = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));

await setDailyMovie(mockDate);

refreshInfoBox(infoBox);

diagnostics.innerHTML = `

<strong>[DIAGNOSTICS]</strong><br>

• Total Loaded Pool: ${dailyMoviePool.length} movies<br>

• Current Date Seed: ${CURRENT_DATE_SEED}<br>

• Active Pool Index: ${CURRENT_DATE_SEED % dailyMoviePool.length}

`;

alert(`Engine shifted to Date Seed: ${CURRENT_DATE_SEED}`);

};

}, 50);


// [5] PLAYER STAT SPOOFER & RESET

let statsBlock = document.createElement("div");

statsBlock.style = "margin:15px 0; padding:15px; background:#1a202c; border-radius:8px; border:1px solid #2d3748; max-width:500px; display:flex; gap:10px;";

let btnSpoof = document.createElement("button");

btnSpoof.innerText = "📊 Spoof 99 Win Streak";

styleDevButton(btnSpoof, "#2b6cb0");

btnSpoof.style.margin = "0"; bknStyle(btnSpoof);

btnSpoof.onclick = () => {

localStorage.setItem("movidle_stat_streak", "99");

alert("Local storage data win streak spoofed to 99!");

};

statsBlock.appendChild(btnSpoof);


let btnResetCache = document.createElement("button");

btnResetCache.innerText = "🗑️ Reset Cache History";

styleDevButton(btnResetCache, "#d69e2e");

btnResetCache.style.margin = "0"; bknStyle(btnResetCache);

btnResetCache.onclick = () => {

if (confirm("Clear local guess history cache and refresh board?")) {

localStorage.removeItem("moviedle_guesses");

localStorage.removeItem("moviedle_date_seed");

localStorage.removeItem("movidle_stat_streak");

window.location.reload();

}

};

statsBlock.appendChild(btnResetCache);

overlay.appendChild(statsBlock);


// Close Button

let btnClose = document.createElement("button");

btnClose.innerText = "❌ Close Developer Suite";

styleDevButton(btnClose, "#2d3748");

btnClose.style.marginTop = "20px";

btnClose.onclick = () => overlay.remove();

overlay.appendChild(btnClose);


document.body.appendChild(overlay);

}


function refreshInfoBox(box) {

box.innerHTML = `

<strong>TITLE:</strong> ${SECRET_MOVIE.title}<br>

<strong>YEAR:</strong> ${SECRET_MOVIE.year}<br>

<strong>GENRE:</strong> ${SECRET_MOVIE.genre}<br>

<strong>DIRECTOR:</strong> ${SECRET_MOVIE.director}<br>

<strong>TMDB ID:</strong> ${SECRET_MOVIE.id}

`;

}

function styleDevButton(btn, bgColor) {

btn.style = `display:block; width:100%; background:${bgColor}; color:#fff; border:none; padding:12px; margin:5px 0; font-size:14px; font-weight:bold; border-radius:6px; cursor:pointer; text-align:left;`;

}

function bknStyle(b) { b.style.flex = "1"; b.style.textAlign = "center"; }


// --- CUSTOM NATIVE IN-GAME MODAL ELEMENT ---

function showCustomGameModal(titleText, bodyText) {

if (document.getElementById("custom-game-modal-overlay")) return;


let overlay = document.createElement("div");

overlay.id = "custom-game-modal-overlay";

overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:10000; padding:20px; box-sizing:border-box; font-family:sans-serif;";


let card = document.createElement("div");

card.style = "background:#1e1e24; color:#ffffff; padding:30px; border-radius:16px; width:100%; max-width:420px; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,0.5); border:1px solid #333; transform: scale(0.9); animation: modalPop 0.25s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275)

It looks like your code snippet cut off at the end of the showCustomGameModal function. To get your "Movidle" game fully functional and ready to launch, you need to complete that modal function and ensure you have the fetchAndSubmitGuess logic (which calculates the green/yellow/gray feedback) fully implemented.

Here is the completion for your modal function and the necessary logic helper you need to add so the game actually processes the guesses.
1. Complete the Modal Function

Add this to the end of your script.js to close the animation tag and the function:
JavaScript

    card.innerHTML = `
        <h2 style="margin-top:0;">${titleText}</h2>
        <p style="color:#a0aec0; margin-bottom:20px;">${bodyText}</p>
        <button id="modal-close" style="padding:10px 25px; background:#538d4e; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Close</button>
    `;
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    document.getElementById("modal-close").onclick = () => overlay.remove();
    
    // Add the CSS animation for the modal
    const style = document.createElement('style');
    style.innerHTML = `@keyframes modalPop { to { transform: scale(1); } }`;
    document.head.appendChild(style);
}

2. Add the Guess Logic Helper

Your code calls fetchAndSubmitGuess(id, isManual). You need this function to compare the guessed movie against your SECRET_MOVIE object.

Add this function to your script:
JavaScript

async function fetchAndSubmitGuess(movieId, isManual = false) {
    // 1. Fetch movie data for the guess
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`);
    const data = await res.json();
    const director = data.credits?.crew?.find(m => m.job === "Director")?.name || "Unknown";
    const releaseYear = parseInt(data.release_date?.split("-")[0]);
    const genre = data.genres?.[0]?.name || "Unknown";

    // 2. Logic: Compare against SECRET_MOVIE
    const row = document.createElement("div");
    row.classList.add("guess-row");
    
    const fields = [
        { val: data.title, target: SECRET_MOVIE.title },
        { val: releaseYear, target: SECRET_MOVIE.year },
        { val: genre, target: SECRET_MOVIE.genre },
        { val: director, target: SECRET_MOVIE.director }
    ];

    fields.forEach(f => {
        const block = document.createElement("div");
        block.classList.add("info-block");
        block.innerText = f.val;
        
        // Match Logic
        if (f.val === f.target) block.classList.add("correct");
        else if (String(f.val).includes(String(f.target)) || String(f.target).includes(String(f.val))) block.classList.add("present");
        else block.classList.add("absent");
        
        row.appendChild(block);
    });

    feed.prepend(row); // Show newest guess at the top
    if (dropdown) dropdown.innerHTML = ""; // Clear search
}

3. Final Launch Checklist

Before you drag your folder to Netlify, ensure your script.js runs initGame() when the page loads. Add this to the very bottom of your script.js:
JavaScript

// Start the engine
document.addEventListener("DOMContentLoaded", () => {
    initGame();
});

Quick Troubleshooting:

    API Key: Your API key is embedded in the script. Since this is a public game, this is fine, but be aware that if you get a lot of traffic, you might hit TMDB's rate limits.

    index.html File: Ensure the <script> tag at the bottom of your HTML points to your script.js file correctly.

    Styling: Make sure your style.css is in the same folder as index.html.

Once you drop the folder onto Netlify Drop, your game will be live for the world to play. Do you have a plan for how you want players to share their results, or should we look at adding a "Share Score" button next?

Make me a app icon for it

I have created a minimal, movie-themed app icon for "Movidle," incorporating the signature yellow and green match colors and a classic cinematic camera.

{image}

Here are the design details:

    Color Scheme: The icon uses a background in shades of green and yellow, representing the successful match criteria from Wordle.

    Iconic Symbol: A stylized silhouette of a vintage movie camera with reels serves as the main visual element.

    Typography: The name "MOVIDLE" is clearly visible in a clean, high-contrast sans-serif font at the bottom.

    Aesthetics: To fit modern design standards, I’ve used soft gradients, rounded corners, and subtle light reflections for a polished, 3D effect.

I'm adding it to the website I need to download it and it be ready re make it so I don't have to crop it and also so it's more themed towards mine instead of the classic worlds squares create this image

make the hints better


// 1. Setup API configuration and Daily State Variables

const API_KEY = "a24cbba3b16a5ea825ec42ac4e4c8d52";

let SECRET_MOVIE = null;

let dailyMoviePool = [];

let CURRENT_DATE_SEED = 0;

let IS_ENDLESS = false; // Tracks if the player is in endless mode


const searchInput = document.getElementById("movie-search");

const dropdown = document.getElementById("dropdown-results");

const feed = document.getElementById("guesses-feed");

const endlessBtn = document.getElementById("endless-btn");


// 2. Fetch a global list of movies safely for the Daily Target Picker

async function initGame() {

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


// 3. Mathematical Formula to pick one synchronized movie per calendar day (UTC Fixed)

async function setDailyMovie(customDate = null) {

try {

IS_ENDLESS = false;

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


// New Function: Set up a random movie for Endless Mode

async function setEndlessMovie() {

if (dailyMoviePool.length === 0) return;

IS_ENDLESS = true;

if (endlessBtn) endlessBtn.innerText = "Back to Daily Mode 📅";

// Clear existing layout feed

if (feed) feed.innerHTML = "";

if (searchInput) searchInput.value = "";

if (dropdown) dropdown.innerHTML = "";

// Select completely random movie from current pool

const randomIndex = Math.floor(Math.random() * dailyMoviePool.length);

const selectedMovie = dailyMoviePool[randomIndex];

await loadTargetDetails(selectedMovie.id);

}


// Hook up Endless button click listener

if (endlessBtn) {

endlessBtn.addEventListener("click", () => {

if (!IS_ENDLESS) {

setEndlessMovie();

} else {

if (feed) feed.innerHTML = ""; // Clear endless board

setDailyMovie(); // Revert back to daily challenge

}

});

}


// Helper to pull complete target details from TMDB

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


const modePrefix = IS_ENDLESS ? "Endless Challenge" : "Daily Hint";

updateHintText(`${modePrefix}: A popular ${SECRET_MOVIE.genre} movie released in ${SECRET_MOVIE.year}.`);

}


// 4. Live Search Input Autocomplete & Hidden Dev Passcode Hook

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


// --- VISUAL DEV PANEL ENGINE ---

function launchDevPanel() {

if (document.getElementById("admin-dev-overlay")) return;


let overlay = document.createElement("div");

overlay.id = "admin-dev-overlay";

overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,15,20,0.98); z-index:9999; color:#fff; font-family:sans-serif; padding:30px; box-sizing:border-box; overflow-y:auto;";


let title = document.createElement("h2");

title.innerText = "🛠️ SYSTEM DEVELOPER CONTROL PANEL";

title.style.borderBottom = "2px solid #333";

title.style.paddingBottom = "10px";

overlay.appendChild(title);


let diagnostics = document.createElement("div");

diagnostics.style = "background:#1a202c; padding:12px; border-radius:6px; border:1px solid #2d3748; margin:15px 0; font-size:14px; font-family:monospace; color:#a0aec0;";

let targetIndex = CURRENT_DATE_SEED % (dailyMoviePool.length || 1);

diagnostics.innerHTML = `

<strong>[DIAGNOSTICS]</strong><br>

• Total Loaded Pool: ${dailyMoviePool.length} movies<br>

• Current Date Seed: ${CURRENT_DATE_SEED}<br>

• Active Pool Index: ${targetIndex}

`;

overlay.appendChild(diagnostics);


let infoBox = document.createElement("div");

infoBox.id = "dev-info-box";

infoBox.style = "background:#222; padding:15px; border-radius:8px; margin:15px 0; font-size:16px; line-height:1.6; display:none;";

overlay.appendChild(infoBox);


let sectionGrid = document.createElement("div");

sectionGrid.style = "display:grid; grid-template-columns: 1fr; gap:15px; max-width:500px;";

overlay.appendChild(sectionGrid);


let btnInfo = document.createElement("button");

btnInfo.innerText = "👁️ Show / Hide Target Data";

styleDevButton(btnInfo, "#4a5568");

btnInfo.onclick = () => {

if (infoBox.style.display === "none") {

infoBox.style.display = "block";

refreshInfoBox(infoBox);

} else {

infoBox.style.display = "none";

}

};

sectionGrid.appendChild(btnInfo);


let btnChange = document.createElement("button");

btnChange.innerText = "🎲 Force Swap Target Movie (Random Re-roll)";

styleDevButton(btnChange, "#e53e3e");

btnChange.onclick = async () => {

if (dailyMoviePool.length === 0) return alert("Pool empty!");

let randomIndex = Math.floor(Math.random() * dailyMoviePool.length);

let selectedMovie = dailyMoviePool[randomIndex];

await loadTargetDetails(selectedMovie.id);

refreshInfoBox(infoBox);

showCustomGameModal("Target updated successfully!", `The new hidden answer is now locked into memory.`);

};

sectionGrid.appendChild(btnChange);


let btnPreview = document.createElement("button");

btnPreview.innerText = "🔮 Next Up Preview (Tomorrow's Movie)";

styleDevButton(btnPreview, "#3182ce");

btnPreview.onclick = async () => {

if (dailyMoviePool.length === 0) return alert("Pool empty!");

const tomorrow = new Date();

tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

const tomorrowSeed = tomorrow.getUTCFullYear() * 10000 + (tomorrow.getUTCMonth() + 1) * 100 + tomorrow.getUTCDate();

const tomorrowIndex = tomorrowSeed % dailyMoviePool.length;

const tomorrowMovie = dailyMoviePool[tomorrowIndex];


try {

let res = await fetch(`https://api.themoviedb.org/3/movie/${tomorrowMovie.id}?api_key=${API_KEY}`);

let d = await res.json();

alert(`🔮 TOMORROW'S TARGET SNEAK PEEK:\n\nTitle: ${d.title.toUpperCase()}\nRelease Year: ${d.release_date ? d.release_date.split("-")[0] : 'Unknown'}\nID: ${d.id}`);

} catch (e) {

alert("Error fetching tomorrow's data.");

}

};

sectionGrid.appendChild(btnPreview);


let searchBlock = document.createElement("div");

searchBlock.style = "margin:15px 0; padding:15px; background:#1a202c; border-radius:8px; border:1px solid #2d3748; max-width:500px;";

searchBlock.innerHTML = `

<label style="display:block; font-size:13px; font-weight:bold; color:#cbd5e1; margin-bottom:6px;">🔍 Internal TMDB Search Engine (Find IDs / Force Target):</label>

<div style="display:flex; gap:10px;">

<input type="text" id="dev-search-input" placeholder="Search any movie..." style="flex:1; padding:8px; border-radius:4px; border:1px solid #4a5568; background:#2d3748; color:#fff;">

<button id="dev-search-btn" style="padding:8px 15px; background:#3182ce; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Search</button>

</div>

<div id="dev-search-results" style="margin-top:10px; max-height:150px; overflow-y:auto; font-size:12px; background:#111; border-radius:4px;"></div>

`;

overlay.appendChild(searchBlock);


setTimeout(() => {

const dInput = document.getElementById("dev-search-input");

const dBtn = document.getElementById("dev-search-btn");

const dResults = document.getElementById("dev-search-results");

dBtn.onclick = async () => {

let query = dInput.value.trim();

if (!query) return;

dResults.innerHTML = "<div style='padding:8px; color:#aaa;'>Searching...</div>";

try {

let res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);

let data = await res.json();

dResults.innerHTML = "";

(data.results || []).slice(0, 5).forEach(m => {

let yr = m.release_date ? m.release_date.split("-")[0] : "N/A";

let row = document.createElement("div");

row.style = "padding:8px; border-bottom:1px solid #222; display:flex; justify-content:space-between; align-items:center;";

row.innerHTML = `

<span><strong>${m.title} (${yr})</strong> - ID: ${m.id}</span>

<div>

<button class="dev-set-tgt" data-id="${m.id}" style="background:#e53e3e; color:#fff; border:none; padding:4px 8px; font-size:11px; border-radius:3px; cursor:pointer; margin-right:4px;">Set</button>

<button class="dev-inj-guess" data-id="${m.id}" style="background:#4ade80; color:#000; border:none; padding:4px 8px; font-size:11px; border-radius:3px; cursor:pointer;">Inj</button>

</div>

`;

dResults.appendChild(row);

});


document.querySelectorAll(".dev-set-tgt").forEach(b => {

b.onclick = async () => {

await loadTargetDetails(b.getAttribute("data-id"));

refreshInfoBox(infoBox);

alert(`Target locked to: ${SECRET_MOVIE.title}`);

};

});

document.querySelectorAll(".dev-inj-guess").forEach(b => {

b.onclick = async () => {

await fetchAndSubmitGuess(b.getAttribute("data-id"), true);

showCustomGameModal("Row Injected", "Movie row added to layout.");

};

});

} catch (err) { dResults.innerHTML = "<div style='padding:8px; color:#e53e3e;'>Search Failed</div>"; }

};

}, 50);


let rigBlock = document.createElement("div");

rigBlock.style = "margin:15px 0; padding:15px; background:#1a202c; border-radius:8px; border:1px solid #2d3748; max-width:500px;";

rigBlock.innerHTML = `

<label style="display:block; font-size:13px; font-weight:bold; color:#cbd5e1; margin-bottom:8px;">🎛️ Match Attribute Modifier (Rig Core Parameters):</label>

<div style="display:grid; grid-template-columns: 80px 1fr; gap:8px; font-size:12px; align-items:center;">

<span>Title:</span><input type="text" id="rig-title" style="padding:6px; background:#2d3748; border:1px solid #4a5568; color:#fff; border-radius:4px;">

<span>Year:</span><input type="number" id="rig-year" style="padding:6px; background:#2d3748; border:1px solid #4a5568; color:#fff; border-radius:4px;">

<span>Genre:</span><input type="text" id="rig-genre" style="padding:6px; background:#2d3748; border:1px solid #4a5568; color:#fff; border-radius:4px;">

<span>Director:</span><input type="text" id="rig-director" style="padding:6px; background:#2d3748; border:1px solid #4a5568; color:#fff; border-radius:4px;">

</div>

<button id="btn-rig-apply" style="width:100%; margin-top:10px; padding:8px; background:#d69e2e; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Apply Attribute Rig</button>

`;

overlay.appendChild(rigBlock);


setTimeout(() => {

document.getElementById("rig-title").value = SECRET_MOVIE.title;

document.getElementById("rig-year").value = SECRET_MOVIE.year;

document.getElementById("rig-genre").value = SECRET_MOVIE.genre;

document.getElementById("rig-director").value = SECRET_MOVIE.director;


document.getElementById("btn-rig-apply").onclick = () => {

SECRET_MOVIE.title = document.getElementById("rig-title").value.toUpperCase();

SECRET_MOVIE.year = parseInt(document.getElementById("rig-year").value) || 0;

SECRET_MOVIE.genre = document.getElementById("rig-genre").value;

SECRET_MOVIE.director = document.getElementById("rig-director").value;

refreshInfoBox(infoBox);

updateHintText(`Daily Hint: A popular ${SECRET_MOVIE.genre} movie released in ${SECRET_MOVIE.year}.`);

alert("Core match variables rigged successfully!");

};

}, 50);


let timeBlock = document.createElement("div");

timeBlock.style = "margin:15px 0; padding:15px; background:#1a202c; border-radius:8px; border:1px solid #2d3748; max-width:500px;";

timeBlock.innerHTML = `

<label style="display:block; font-size:13px; font-weight:bold; color:#cbd5e1; margin-bottom:6px;">⏱️ Time-Travel Simulator (Test Specific Calendar Seeds):</label>

<div style="display:flex; gap:10px;">

<input type="date" id="time-travel-date" style="flex:1; padding:8px; border-radius:4px; border:1px solid #4a5568; background:#2d3748; color:#fff;">

<button id="btn-time-travel" style="padding:8px 15px; background:#805ad5; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Simulate Date</button>

</div>

`;

overlay.appendChild(timeBlock);


setTimeout(() => {

document.getElementById("btn-time-travel").onclick = async () => {

let val = document.getElementById("time-travel-date").value;

if (!val) return alert("Select a date layout parameter first!");

let parts = val.split("-");

let mockDate = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));

await setDailyMovie(mockDate);

refreshInfoBox(infoBox);

diagnostics.innerHTML = `

<strong>[DIAGNOSTICS]</strong><br>

• Total Loaded Pool: ${dailyMoviePool.length} movies<br>

• Current Date Seed: ${CURRENT_DATE_SEED}<br>

• Active Pool Index: ${CURRENT_DATE_SEED % dailyMoviePool.length}

`;

alert(`Engine shifted to Date Seed: ${CURRENT_DATE_SEED}`);

};

}, 50);


let statsBlock = document.createElement("div");

statsBlock.style = "margin:15px 0; padding:15px; background:#1a202c; border-radius:8px; border:1px solid #2d3748; max-width:500px; display:flex; gap:10px;";

let btnSpoof = document.createElement("button");

btnSpoof.innerText = "📊 Spoof 99 Win Streak";

styleDevButton(btnSpoof, "#2b6cb0");

btnSpoof.style.margin = "0"; bknStyle(btnSpoof);

btnSpoof.onclick = () => {

localStorage.setItem("movidle_stat_streak", "99");

alert("Local storage data win streak spoofed to 99!");

};

statsBlock.appendChild(btnSpoof);


let btnResetCache = document.createElement("button");

btnResetCache.innerText = "🗑️ Reset Cache History";

styleDevButton(btnResetCache, "#d69e2e");

btnResetCache.style.margin = "0"; bknStyle(btnResetCache);

btnResetCache.onclick = () => {

if (confirm("Clear local guess history cache and refresh board?")) {

localStorage.removeItem("moviedle_guesses");

localStorage.removeItem("moviedle_date_seed");

localStorage.removeItem("movidle_stat_streak");

window.location.reload();

}

};

statsBlock.appendChild(btnResetCache);

overlay.appendChild(statsBlock);


let btnClose = document.createElement("button");

btnClose.innerText = "❌ Close Developer Suite";

styleDevButton(btnClose, "#2d3748");

btnClose.style.marginTop = "20px";

btnClose.onclick = () => overlay.remove();

overlay.appendChild(btnClose);


document.body.appendChild(overlay);

}


function refreshInfoBox(box) {

box.innerHTML = `

<strong>TITLE:</strong> ${SECRET_MOVIE.title}<br>

<strong>YEAR:</strong> ${SECRET_MOVIE.year}<br>

<strong>GENRE:</strong> ${SECRET_MOVIE.genre}<br>

<strong>DIRECTOR:</strong> ${SECRET_MOVIE.director}<br>

<strong>TMDB ID:</strong> ${SECRET_MOVIE.id}

`;

}

function styleDevButton(btn, bgColor) {

btn.style = `display:block; width:100%; background:${bgColor}; color:#fff; border:none; padding:12px; margin:5px 0; font-size:14px; font-weight:bold; border-radius:6px; cursor:pointer; text-align:center;`;

}

function bknStyle(b) { b.style.flex = "1"; b.style.textAlign = "center"; }


// --- CUSTOM NATIVE IN-GAME MODAL ELEMENT WITH ENHANCED WIN SCREEN ---

function showCustomGameModal(titleText, bodyText, movieData = null) {

if (document.getElementById("custom-game-modal-overlay")) return;


let overlay = document.createElement("div");

overlay.id = "custom-game-modal-overlay";

overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:10000; padding:20px; box-sizing:border-box; overflow-y:auto;";


let card = document.createElement("div");

card.style = "background:#1e1e24; color:#ffffff; padding:30px; border-radius:16px; width:100%; max-width:600px; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,0.5); border:1px solid #333; transform:scale(0.95); transition:transform 0.3s ease-out;";


let headline = document.createElement("h2");

headline.innerText = titleText;

headline.style = "margin:0 0 15px 0; font-size:22px; color:#4ade80; font-weight:bold;";

card.appendChild(headline);


let message = document.createElement("p");

message.innerText = bodyText;

message.style = "margin:0 0 25px 0; font-size:16px; color:#cbd5e1; line-height:1.5;";

card.appendChild(message);


if (movieData) {

let detailsContainer = document.createElement("div");

detailsContainer.style = "background:#2d2d33; padding:20px; border-radius:10px; margin:20px 0; text-align:left; border:1px solid #3a3a3c;";


let titleInfo = document.createElement("div");

titleInfo.style = "margin-bottom:15px;";

titleInfo.innerHTML = `

<h3 style="margin:0 0 8px 0; color:#4ade80; font-size:18px;">${movieData.title}</h3>

<p style="margin:0; color:#a0aec0; font-size:14px;">⭐ ${movieData.rating}/10 | ⏱️ ${movieData.runtime} min | 📅 ${movieData.year}</p>

`;

detailsContainer.appendChild(titleInfo);


let overviewLabel = document.createElement("p");

overviewLabel.style = "margin:12px 0 8px 0; font-weight:bold; color:#cbd5e1; font-size:14px;";

overviewLabel.innerText = "📝 Plot Summary";

detailsContainer.appendChild(overviewLabel);


let overview = document.createElement("p");

overview.style = "margin:0 0 15px 0; color:#a0aec0; font-size:13px; line-height:1.6; max-height:120px; overflow-y:auto;";

overview.innerText = movieData.overview;

detailsContainer.appendChild(overview);


if (movieData.watchProviders && movieData.watchProviders.length > 0) {

let watchLabel = document.createElement("p");

watchLabel.style = "margin:12px 0 8px 0; font-weight:bold; color:#cbd5e1; font-size:14px;";

watchLabel.innerText = "📺 Where to Watch";

detailsContainer.appendChild(watchLabel);


let watchContainer = document.createElement("div");

watchContainer.style = "display:flex; flex-wrap:wrap; gap:10px;";

movieData.watchProviders.forEach(provider => {

let badge = document.createElement("span");

badge.style = "background:#4a5568; color:#fff; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:bold;";

badge.innerText = provider;

watchContainer.appendChild(badge);

});

detailsContainer.appendChild(watchContainer);

} else {

let noWatch = document.createElement("p");

noWatch.style = "margin:0; color:#a0aec0; font-size:13px;";

noWatch.innerText = "📺 Watch info not available in your region.";

detailsContainer.appendChild(noWatch);

}


card.appendChild(detailsContainer);

}


let btn = document.createElement("button");

// If endless, button says "Play Next Movie", otherwise standard "OK"

btn.innerText = IS_ENDLESS ? "Play Next Movie 🎬" : "OK";

btn.style = "background:#4ade80; color:#0f172a; border:none; padding:12px 30px; font-size:16px; font-weight:bold; border-radius:8px; cursor:pointer; width:100%; transition: opacity 0.2s;";

btn.onmouseenter = () => btn.style.opacity = "0.8";

btn.onmouseleave = () => btn.style.opacity = "1";

btn.onclick = () => {

overlay.remove();

// If endless, instantly load another hidden mystery film!

if (IS_ENDLESS) {

setEndlessMovie();

}

};

card.appendChild(btn);


overlay.appendChild(card);

document.body.appendChild(overlay);


setTimeout(() => {

card.style.transform = "scale(1)";

}, 10);


if (!document.getElementById("modal-animation-style")) {

let style = document.createElement("style");

style.id = "modal-animation-style";

style.innerHTML = "@keyframes modalPop { to { transform: scale(1); } }";

document.head.appendChild(style);

}

}


// Helper function to fetch watch providers for a movie

async function getWatchProviders(movieId) {

try {

const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`);

const data = await res.json();

const usProviders = data.results?.US;

if (usProviders) {

let providers = [];

if (usProviders.buy) providers.push(...usProviders.buy.map(p => `Buy on ${p.provider_name}`));

if (usProviders.rent) providers.push(...usProviders.rent.map(p => `Rent on ${p.provider_name}`));

if (usProviders.flatrate) providers.push(...usProviders.flatrate.map(p => `Stream on ${p.provider_name}`));

return providers;

}

return [];

} catch (err) {

console.error("Error fetching watch providers:", err);

return [];

}

}


// 5. Fetch complete details for the user's selected movie guess

async function fetchAndSubmitGuess(movieId, saveToStorage = false) {

try {

let res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`);

let d = await res.json();

let dir = d.credits?.crew?.find(m => m.job === "Director");

submitGuess({

title: d.title ? d.title.toUpperCase() : "UNKNOWN TITLE",

year: parseInt(d.release_date?.split("-")[0]) || 0,

genre: d.genres?.length > 0 ? d.genres[0].name : "Unknown",

director: dir ? dir.name : "Unknown",

poster: d.poster_path ? `https://image.tmdb.org/t/p/w200${d.poster_path}` : "",

overview: d.overview || "No description available.",

runtime: d.runtime || 0,

rating: d.vote_average ? d.vote_average.toFixed(1) : "N/A",

id: d.id

});


if (saveToStorage) {

saveGuessToStorage(movieId);

}

} catch (err) {

console.error("Error processing guess selection:", err);

}

}


// 6. Build Result Comparison Rows

function submitGuess(guessedMovie) {

if (searchInput) searchInput.value = "";

if (dropdown) dropdown.innerHTML = "";

if (!feed) return;


let row = document.createElement("div");

row.classList.add("guess-row");


let posterBlock = document.createElement("div");

posterBlock.classList.add("poster-block");

if (guessedMovie.poster) {

posterBlock.style.backgroundImage = `url('${guessedMovie.poster}')`;

}

row.appendChild(posterBlock);


row.appendChild(createInfoBlock(guessedMovie.title, guessedMovie.title === SECRET_MOVIE.title));


let yearStatus = "absent";

let displayYear = guessedMovie.year;

if (guessedMovie.year === SECRET_MOVIE.year) {

yearStatus = "correct";

} else {

displayYear += guessedMovie.year < SECRET_MOVIE.year ? " ⬆️" : " ⬇️";

}

row.appendChild(createInfoBlock(displayYear, yearStatus));


row.appendChild(createInfoBlock(guessedMovie.genre, guessedMovie.genre === SECRET_MOVIE.genre));

row.appendChild(createInfoBlock(guessedMovie.director, guessedMovie.director === SECRET_MOVIE.director));


feed.insertBefore(row, feed.firstChild);


if (guessedMovie.title === SECRET_MOVIE.title) {

setTimeout(async () => {

const watchProviders = await getWatchProviders(guessedMovie.id);

const titleMsg = IS_ENDLESS ? "🎉 Endless Victory!" : "🎉 Masterful Guessing!";

const bodyMsg = IS_ENDLESS ? "You solved this endless mystery puzzle!" : "You found today's hidden movie! 🎬";

showCustomGameModal(titleMsg, bodyMsg, {

title: guessedMovie.title,

year: guessedMovie.year,

rating: guessedMovie.rating,

runtime: guessedMovie.runtime,

overview: guessedMovie.overview,

watchProviders: watchProviders

});

}, 300);

}

}


// Helper function to create blocks

function createInfoBlock(text, statusClass) {

let block = document.createElement("div");

block.classList.add("info-block");

if (statusClass === true) block.classList.add("correct");

else if (statusClass === false) block.classList.add("absent");

else block.classList.add(statusClass);

block.innerText = text;

return block;

}


// --- STORAGE CACHING LOOPS ---

function saveGuessToStorage(movieId) {

// Prevent daily local history caching if in Endless Mode

if (IS_ENDLESS) return;


let savedGuesses = JSON.parse(localStorage.getItem("moviedle_guesses")) || [];

if (!savedGuesses.includes(movieId)) {

savedGuesses.push(movieId);

localStorage.setItem("moviedle_guesses", JSON.stringify(savedGuesses));

localStorage.setItem("moviedle_date_seed", CURRENT_DATE_SEED.toString());

}

}


async function loadSavedGuesses(currentDateSeed) {

const storedDateSeed = localStorage.getItem("moviedle_date_seed");

if (storedDateSeed !== currentDateSeed.toString()) {

localStorage.removeItem("moviedle_guesses");

localStorage.removeItem("moviedle_date_seed");

return;

}

let savedGuesses = JSON.parse(localStorage.getItem("moviedle_guesses")) || [];

for (const id of savedGuesses) {

await fetchAndSubmitGuess(id, false);

}

}


initGame();

To make your hints more useful and engaging, we can make them progressive. Instead of just giving the genre and year once, we can unlock a new, more specific hint every time the player makes an incorrect guess. This turns the hint area into a dynamic tool for the player.
Step 1: Update your script's logic

Replace your current loadTargetDetails and add a new triggerProgressiveHint function to your script.js.
JavaScript

// Keep track of how many guesses have been made
let guessCount = 0;

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
        rating: details.vote_average ? details.vote_average.toFixed(1) : "N/A",
        actors: details.credits?.cast?.slice(0, 3).map(a => a.name).join(", ") || "Unknown"
    };

    guessCount = 0; // Reset count for new movie
    const modePrefix = IS_ENDLESS ? "Endless Challenge" : "Daily Hint";
    updateHintText(`${modePrefix}: A ${SECRET_MOVIE.genre} movie released in ${SECRET_MOVIE.year}.`);
}

function triggerProgressiveHint() {
    guessCount++;
    const modePrefix = IS_ENDLESS ? "Endless" : "Daily";
    
    // Logic: Provide increasingly helpful hints
    switch(guessCount) {
        case 2:
            updateHintText(`${modePrefix} Hint: Directed by the legendary ${SECRET_MOVIE.director}.`);
            break;
        case 3:
            updateHintText(`${modePrefix} Hint: Starring actors like ${SECRET_MOVIE.actors}.`);
            break;
        case 4:
            updateHintText(`${modePrefix} Hint: The film runtime is approximately ${SECRET_MOVIE.runtime} minutes.`);
            break;
        case 5:
            updateHintText(`${modePrefix} Hint: ${SECRET_MOVIE.overview.substring(0, 100)}...`);
            break;
        default:
            // Keep the last hint or cycle
            break;
    }
}

Step 2: Connect it to your Guess Logic

In your submitGuess function (inside script.js), call this new function whenever a wrong guess is submitted:
JavaScript

function submitGuess(guessedMovie) {
    // ... (your existing row creation code) ...

    feed.insertBefore(row, feed.firstChild);

    // Add this new check:
    if (guessedMovie.title !== SECRET_MOVIE.title) {
        triggerProgressiveHint();
    } else {
        // ... (your existing win condition code) ...
    }
}

Why this is better:

    Encourages Gameplay: Players will feel rewarded for staying in the game longer because the clues become "easier" the more they play.

    Reduced Frustration: If a user is stuck on a movie they don't recognize, they don't hit a dead end—they get a plot summary or an actor list to help them cross-reference.

    Dynamic Feel: The interface feels alive and responsive to their specific progress, which is a hallmark of good UI/UX design.

This approach ensures that even if a movie is obscure, the player eventually receives enough "breadcrumbs" to solve the puzzle successfully!

you do it


// 1. Setup API configuration and Daily State Variables

const API_KEY = "a24cbba3b16a5ea825ec42ac4e4c8d52"; 

let SECRET_MOVIE = null;

let dailyMoviePool = []; 

let CURRENT_DATE_SEED = 0;

let IS_ENDLESS = false; // Tracks if the player is in endless mode


const searchInput = document.getElementById("movie-search");

const dropdown = document.getElementById("dropdown-results");

const feed = document.getElementById("guesses-feed");

const endlessBtn = document.getElementById("endless-btn");


// 2. Fetch a global list of movies safely for the Daily Target Picker

async function initGame() {

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


// 3. Mathematical Formula to pick one synchronized movie per calendar day (UTC Fixed)

async function setDailyMovie(customDate = null) {

    try {

        IS_ENDLESS = false;

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


// New Function: Set up a random movie for Endless Mode

async function setEndlessMovie() {

    if (dailyMoviePool.length === 0) return;

    

    IS_ENDLESS = true;

    if (endlessBtn) endlessBtn.innerText = "Back to Daily Mode 📅";

    

    // Clear existing layout feed

    if (feed) feed.innerHTML = "";

    if (searchInput) searchInput.value = "";

    if (dropdown) dropdown.innerHTML = "";

    

    // Select completely random movie from current pool

    const randomIndex = Math.floor(Math.random() * dailyMoviePool.length);

    const selectedMovie = dailyMoviePool[randomIndex];

    

    await loadTargetDetails(selectedMovie.id);

}


// Hook up Endless button click listener

if (endlessBtn) {

    endlessBtn.addEventListener("click", () => {

        if (!IS_ENDLESS) {

            setEndlessMovie();

        } else {

            if (feed) feed.innerHTML = ""; // Clear endless board

            setDailyMovie(); // Revert back to daily challenge

        }

    });

}


// Helper to pull complete target details from TMDB

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


    const modePrefix = IS_ENDLESS ? "Endless Challenge" : "Daily Hint";

    updateHintText(`${modePrefix}: A popular ${SECRET_MOVIE.genre} movie released in ${SECRET_MOVIE.year}.`);

}


// 4. Live Search Input Autocomplete & Hidden Dev Passcode Hook

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


// --- VISUAL DEV PANEL ENGINE ---

function launchDevPanel() {

    if (document.getElementById("admin-dev-overlay")) return;


    let overlay = document.createElement("div");

    overlay.id = "admin-dev-overlay";

    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,15,20,0.98); z-index:9999; color:#fff; font-family:sans-serif; padding:30px; box-sizing:border-box; overflow-y:auto;";


    let title = document.createElement("h2");

    title.innerText = "🛠️ SYSTEM DEVELOPER CONTROL PANEL";

    title.style.borderBottom = "2px solid #333";

    title.style.paddingBottom = "10px";

    overlay.appendChild(title);


    let diagnostics = document.createElement("div");

    diagnostics.style = "background:#1a202c; padding:12px; border-radius:6px; border:1px solid #2d3748; margin:15px 0; font-size:14px; font-family:monospace; color:#a0aec0;";

    let targetIndex = CURRENT_DATE_SEED % (dailyMoviePool.length || 1);

    diagnostics.innerHTML = `

        <strong>[DIAGNOSTICS]</strong><br>

        • Total Loaded Pool: ${dailyMoviePool.length} movies<br>

        • Current Date Seed: ${CURRENT_DATE_SEED}<br>

        • Active Pool Index: ${targetIndex}

    `;

    overlay.appendChild(diagnostics);


    let infoBox = document.createElement("div");

    infoBox.id = "dev-info-box";

    infoBox.style = "background:#222; padding:15px; border-radius:8px; margin:15px 0; font-size:16px; line-height:1.6; display:none;";

    overlay.appendChild(infoBox);


    let sectionGrid = document.createElement("div");

    sectionGrid.style = "display:grid; grid-template-columns: 1fr; gap:15px; max-width:500px;";

    overlay.appendChild(sectionGrid);


    let btnInfo = document.createElement("button");

    btnInfo.innerText = "👁️ Show / Hide Target Data";

    styleDevButton(btnInfo, "#4a5568");

    btnInfo.onclick = () => {

        if (infoBox.style.display === "none") {

            infoBox.style.display = "block";

            refreshInfoBox(infoBox);

        } else {

            infoBox.style.display = "none";

        }

    };

    sectionGrid.appendChild(btnInfo);


    let btnChange = document.createElement("button");

    btnChange.innerText = "🎲 Force Swap Target Movie (Random Re-roll)";

    styleDevButton(btnChange, "#e53e3e");

    btnChange.onclick = async () => {

        if (dailyMoviePool.length === 0) return alert("Pool empty!");

        let randomIndex = Math.floor(Math.random() * dailyMoviePool.length);

        let selectedMovie = dailyMoviePool[randomIndex];

        await loadTargetDetails(selectedMovie.id);

        refreshInfoBox(infoBox);

        showCustomGameModal("Target updated successfully!", `The new hidden answer is now locked into memory.`);

    };

    sectionGrid.appendChild(btnChange);


    let btnPreview = document.createElement("button");

    btnPreview.innerText = "🔮 Next Up Preview (Tomorrow's Movie)";

    styleDevButton(btnPreview, "#3182ce");

    btnPreview.onclick = async () => {

        if (dailyMoviePool.length === 0) return alert("Pool empty!");

        const tomorrow = new Date();

        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

        const tomorrowSeed = tomorrow.getUTCFullYear() * 10000 + (tomorrow.getUTCMonth() + 1) * 100 + tomorrow.getUTCDate();

        const tomorrowIndex = tomorrowSeed % dailyMoviePool.length;

        const tomorrowMovie = dailyMoviePool[tomorrowIndex];


        try {

            let res = await fetch(`https://api.themoviedb.org/3/movie/${tomorrowMovie.id}?api_key=${API_KEY}`);

            let d = await res.json();

            alert(`🔮 TOMORROW'S TARGET SNEAK PEEK:\n\nTitle: ${d.title.toUpperCase()}\nRelease Year: ${d.release_date ? d.release_date.split("-")[0] : 'Unknown'}\nID: ${d.id}`);

        } catch (e) {

            alert("Error fetching tomorrow's data.");

        }

    };

    sectionGrid.appendChild(btnPreview);


    let searchBlock = document.createElement("div");

    searchBlock.style = "margin:15px 0; padding:15px; background:#1a202c; border-radius:8px; border:1px solid #2d3748; max-width:500px;";

    searchBlock.innerHTML = `

        <label style="display:block; font-size:13px; font-weight:bold; color:#cbd5e1; margin-bottom:6px;">🔍 Internal TMDB Search Engine (Find IDs / Force Target):</label>

        <div style="display:flex; gap:10px;">

            <input type="text" id="dev-search-input" placeholder="Search any movie..." style="flex:1; padding:8px; border-radius:4px; border:1px solid #4a5568; background:#2d3748; color:#fff;">

            <button id="dev-search-btn" style="padding:8px 15px; background:#3182ce; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Search</button>

        </div>

        <div id="dev-search-results" style="margin-top:10px; max-height:150px; overflow-y:auto; font-size:12px; background:#111; border-radius:4px;"></div>

    `;

    overlay.appendChild(searchBlock);


    setTimeout(() => {

        const dInput = document.getElementById("dev-search-input");

        const dBtn = document.getElementById("dev-search-btn");

        const dResults = document.getElementById("dev-search-results");

        

        dBtn.onclick = async () => {

            let query = dInput.value.trim();

            if (!query) return;

            dResults.innerHTML = "<div style='padding:8px; color:#aaa;'>Searching...</div>";

            try {

                let res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);

                let data = await res.json();

                dResults.innerHTML = "";

                (data.results || []).slice(0, 5).forEach(m => {

                    let yr = m.release_date ? m.release_date.split("-")[0] : "N/A";

                    let row = document.createElement("div");

                    row.style = "padding:8px; border-bottom:1px solid #222; display:flex; justify-content:space-between; align-items:center;";

                    row.innerHTML = `

                        <span><strong>${m.title} (${yr})</strong> - ID: ${m.id}</span>

                        <div>

                            <button class="dev-set-tgt" data-id="${m.id}" style="background:#e53e3e; color:#fff; border:none; padding:4px 8px; font-size:11px; border-radius:3px; cursor:pointer; margin-right:4px;">Set</button>

                            <button class="dev-inj-guess" data-id="${m.id}" style="background:#4ade80; color:#000; border:none; padding:4px 8px; font-size:11px; border-radius:3px; cursor:pointer;">Inj</button>

                        </div>

                    `;

                    dResults.appendChild(row);

                });


                document.querySelectorAll(".dev-set-tgt").forEach(b => {

                    b.onclick = async () => {

                        await loadTargetDetails(b.getAttribute("data-id"));

                        refreshInfoBox(infoBox);

                        alert(`Target locked to: ${SECRET_MOVIE.title}`);

                    };

                });

                document.querySelectorAll(".dev-inj-guess").forEach(b => {

                    b.onclick = async () => {

                        await fetchAndSubmitGuess(b.getAttribute("data-id"), true);

                        showCustomGameModal("Row Injected", "Movie row added to layout.");

                    };

                });

            } catch (err) { dResults.innerHTML = "<div style='padding:8px; color:#e53e3e;'>Search Failed</div>"; }

        };

    }, 50);


    let rigBlock = document.createElement("div");

    rigBlock.style = "margin:15px 0; padding:15px; background:#1a202c; border-radius:8px; border:1px solid #2d3748; max-width:500px;";

    rigBlock.innerHTML = `

        <label style="display:block; font-size:13px; font-weight:bold; color:#cbd5e1; margin-bottom:8px;">🎛️ Match Attribute Modifier (Rig Core Parameters):</label>

        <div style="display:grid; grid-template-columns: 80px 1fr; gap:8px; font-size:12px; align-items:center;">

            <span>Title:</span><input type="text" id="rig-title" style="padding:6px; background:#2d3748; border:1px solid #4a5568; color:#fff; border-radius:4px;">

            <span>Year:</span><input type="number" id="rig-year" style="padding:6px; background:#2d3748; border:1px solid #4a5568; color:#fff; border-radius:4px;">

            <span>Genre:</span><input type="text" id="rig-genre" style="padding:6px; background:#2d3748; border:1px solid #4a5568; color:#fff; border-radius:4px;">

            <span>Director:</span><input type="text" id="rig-director" style="padding:6px; background:#2d3748; border:1px solid #4a5568; color:#fff; border-radius:4px;">

        </div>

        <button id="btn-rig-apply" style="width:100%; margin-top:10px; padding:8px; background:#d69e2e; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Apply Attribute Rig</button>

    `;

    overlay.appendChild(rigBlock);


    setTimeout(() => {

        document.getElementById("rig-title").value = SECRET_MOVIE.title;

        document.getElementById("rig-year").value = SECRET_MOVIE.year;

        document.getElementById("rig-genre").value = SECRET_MOVIE.genre;

        document.getElementById("rig-director").value = SECRET_MOVIE.director;


        document.getElementById("btn-rig-apply").onclick = () => {

            SECRET_MOVIE.title = document.getElementById("rig-title").value.toUpperCase();

            SECRET_MOVIE.year = parseInt(document.getElementById("rig-year").value) || 0;

            SECRET_MOVIE.genre = document.getElementById("rig-genre").value;

            SECRET_MOVIE.director = document.getElementById("rig-director").value;

            refreshInfoBox(infoBox);

            updateHintText(`Daily Hint: A popular ${SECRET_MOVIE.genre} movie released in ${SECRET_MOVIE.year}.`);

            alert("Core match variables rigged successfully!");

        };

    }, 50);


    let timeBlock = document.createElement("div");

    timeBlock.style = "margin:15px 0; padding:15px; background:#1a202c; border-radius:8px; border:1px solid #2d3748; max-width:500px;";

    timeBlock.innerHTML = `

        <label style="display:block; font-size:13px; font-weight:bold; color:#cbd5e1; margin-bottom:6px;">⏱️ Time-Travel Simulator (Test Specific Calendar Seeds):</label>

        <div style="display:flex; gap:10px;">

            <input type="date" id="time-travel-date" style="flex:1; padding:8px; border-radius:4px; border:1px solid #4a5568; background:#2d3748; color:#fff;">

            <button id="btn-time-travel" style="padding:8px 15px; background:#805ad5; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Simulate Date</button>

        </div>

    `;

    overlay.appendChild(timeBlock);


    setTimeout(() => {

        document.getElementById("btn-time-travel").onclick = async () => {

            let val = document.getElementById("time-travel-date").value;

            if (!val) return alert("Select a date layout parameter first!");

            let parts = val.split("-");

            let mockDate = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));

            await setDailyMovie(mockDate);

            refreshInfoBox(infoBox);

            diagnostics.innerHTML = `

                <strong>[DIAGNOSTICS]</strong><br>

                • Total Loaded Pool: ${dailyMoviePool.length} movies<br>

                • Current Date Seed: ${CURRENT_DATE_SEED}<br>

                • Active Pool Index: ${CURRENT_DATE_SEED % dailyMoviePool.length}

            `;

            alert(`Engine shifted to Date Seed: ${CURRENT_DATE_SEED}`);

        };

    }, 50);


    let statsBlock = document.createElement("div");

    statsBlock.style = "margin:15px 0; padding:15px; background:#1a202c; border-radius:8px; border:1px solid #2d3748; max-width:500px; display:flex; gap:10px;";

    

    let btnSpoof = document.createElement("button");

    btnSpoof.innerText = "📊 Spoof 99 Win Streak";

    styleDevButton(btnSpoof, "#2b6cb0");

    btnSpoof.style.margin = "0"; bknStyle(btnSpoof);

    btnSpoof.onclick = () => {

        localStorage.setItem("movidle_stat_streak", "99");

        alert("Local storage data win streak spoofed to 99!");

    };

    statsBlock.appendChild(btnSpoof);


    let btnResetCache = document.createElement("button");

    btnResetCache.innerText = "🗑️ Reset Cache History";

    styleDevButton(btnResetCache, "#d69e2e");

    btnResetCache.style.margin = "0"; bknStyle(btnResetCache);

    btnResetCache.onclick = () => {

        if (confirm("Clear local guess history cache and refresh board?")) {

            localStorage.removeItem("moviedle_guesses");

            localStorage.removeItem("moviedle_date_seed");

            localStorage.removeItem("movidle_stat_streak");

            window.location.reload();

        }

    };

    statsBlock.appendChild(btnResetCache);

    overlay.appendChild(statsBlock);


    let btnClose = document.createElement("button");

    btnClose.innerText = "❌ Close Developer Suite";

    styleDevButton(btnClose, "#2d3748");

    btnClose.style.marginTop = "20px";

    btnClose.onclick = () => overlay.remove();

    overlay.appendChild(btnClose);


    document.body.appendChild(overlay);

}


function refreshInfoBox(box) {

    box.innerHTML = `

        <strong>TITLE:</strong> ${SECRET_MOVIE.title}<br>

        <strong>YEAR:</strong> ${SECRET_MOVIE.year}<br>

        <strong>GENRE:</strong> ${SECRET_MOVIE.genre}<br>

        <strong>DIRECTOR:</strong> ${SECRET_MOVIE.director}<br>

        <strong>TMDB ID:</strong> ${SECRET_MOVIE.id}

    `;

}

function styleDevButton(btn, bgColor) {

    btn.style = `display:block; width:100%; background:${bgColor}; color:#fff; border:none; padding:12px; margin:5px 0; font-size:14px; font-weight:bold; border-radius:6px; cursor:pointer; text-align:center;`;

}

function bknStyle(b) { b.style.flex = "1"; b.style.textAlign = "center"; }


// --- CUSTOM NATIVE IN-GAME MODAL ELEMENT WITH ENHANCED WIN SCREEN ---

function showCustomGameModal(titleText, bodyText, movieData = null) {

    if (document.getElementById("custom-game-modal-overlay")) return;


    let overlay = document.createElement("div");

    overlay.id = "custom-game-modal-overlay";

    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:10000; padding:20px; box-sizing:border-box; overflow-y:auto;";


    let card = document.createElement("div");

    card.style = "background:#1e1e24; color:#ffffff; padding:30px; border-radius:16px; width:100%; max-width:600px; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,0.5); border:1px solid #333; transform:scale(0.95); transition:transform 0.3s ease-out;";


    let headline = document.createElement("h2");

    headline.innerText = titleText;

    headline.style = "margin:0 0 15px 0; font-size:22px; color:#4ade80; font-weight:bold;";

    card.appendChild(headline);


    let message = document.createElement("p");

    message.innerText = bodyText;

    message.style = "margin:0 0 25px 0; font-size:16px; color:#cbd5e1; line-height:1.5;";

    card.appendChild(message);


    if (movieData) {

        let detailsContainer = document.createElement("div");

        detailsContainer.style = "background:#2d2d33; padding:20px; border-radius:10px; margin:20px 0; text-align:left; border:1px solid #3a3a3c;";


        let titleInfo = document.createElement("div");

        titleInfo.style = "margin-bottom:15px;";

        titleInfo.innerHTML = `

            <h3 style="margin:0 0 8px 0; color:#4ade80; font-size:18px;">${movieData.title}</h3>

            <p style="margin:0; color:#a0aec0; font-size:14px;">⭐ ${movieData.rating}/10 | ⏱️ ${movieData.runtime} min | 📅 ${movieData.year}</p>

        `;

        detailsContainer.appendChild(titleInfo);


        let overviewLabel = document.createElement("p");

        overviewLabel.style = "margin:12px 0 8px 0; font-weight:bold; color:#cbd5e1; font-size:14px;";

        overviewLabel.innerText = "📝 Plot Summary";

        detailsContainer.appendChild(overviewLabel);


        let overview = document.createElement("p");

        overview.style = "margin:0 0 15px 0; color:#a0aec0; font-size:13px; line-height:1.6; max-height:120px; overflow-y:auto;";

        overview.innerText = movieData.overview;

        detailsContainer.appendChild(overview);


        if (movieData.watchProviders && movieData.watchProviders.length > 0) {

            let watchLabel = document.createElement("p");

            watchLabel.style = "margin:12px 0 8px 0; font-weight:bold; color:#cbd5e1; font-size:14px;";

            watchLabel.innerText = "📺 Where to Watch";

            detailsContainer.appendChild(watchLabel);


            let watchContainer = document.createElement("div");

            watchContainer.style = "display:flex; flex-wrap:wrap; gap:10px;";

            

            movieData.watchProviders.forEach(provider => {

                let badge = document.createElement("span");

                badge.style = "background:#4a5568; color:#fff; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:bold;";

                badge.innerText = provider;

                watchContainer.appendChild(badge);

            });

            

            detailsContainer.appendChild(watchContainer);

        } else {

            let noWatch = document.createElement("p");

            noWatch.style = "margin:0; color:#a0aec0; font-size:13px;";

            noWatch.innerText = "📺 Watch info not available in your region.";

            detailsContainer.appendChild(noWatch);

        }


        card.appendChild(detailsContainer);

    }


    let btn = document.createElement("button");

    // If endless, button says "Play Next Movie", otherwise standard "OK"

    btn.innerText = IS_ENDLESS ? "Play Next Movie 🎬" : "OK";

    btn.style = "background:#4ade80; color:#0f172a; border:none; padding:12px 30px; font-size:16px; font-weight:bold; border-radius:8px; cursor:pointer; width:100%; transition: opacity 0.2s;";

    btn.onmouseenter = () => btn.style.opacity = "0.8";

    btn.onmouseleave = () => btn.style.opacity = "1";

    btn.onclick = () => {

        overlay.remove();

        // If endless, instantly load another hidden mystery film!

        if (IS_ENDLESS) {

            setEndlessMovie();

        }

    };

    card.appendChild(btn);


    overlay.appendChild(card);

    document.body.appendChild(overlay);


    setTimeout(() => {

        card.style.transform = "scale(1)";

    }, 10);


    if (!document.getElementById("modal-animation-style")) {

        let style = document.createElement("style");

        style.id = "modal-animation-style";

        style.innerHTML = "@keyframes modalPop { to { transform: scale(1); } }";

        document.head.appendChild(style);

    }

}


// Helper function to fetch watch providers for a movie

async function getWatchProviders(movieId) {

    try {

        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`);

        const data = await res.json();

        

        const usProviders = data.results?.US;

        if (usProviders) {

            let providers = [];

            if (usProviders.buy) providers.push(...usProviders.buy.map(p => `Buy on ${p.provider_name}`));

            if (usProviders.rent) providers.push(...usProviders.rent.map(p => `Rent on ${p.provider_name}`));

            if (usProviders.flatrate) providers.push(...usProviders.flatrate.map(p => `Stream on ${p.provider_name}`));

            return providers;

        }

        return [];

    } catch (err) {

        console.error("Error fetching watch providers:", err);

        return [];

    }

}


// 5. Fetch complete details for the user's selected movie guess

async function fetchAndSubmitGuess(movieId, saveToStorage = false) {

    try {

        let res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`);

        let d = await res.json();

        let dir = d.credits?.crew?.find(m => m.job === "Director");

        

        submitGuess({

            title: d.title ? d.title.toUpperCase() : "UNKNOWN TITLE",

            year: parseInt(d.release_date?.split("-")[0]) || 0,

            genre: d.genres?.length > 0 ? d.genres[0].name : "Unknown",

            director: dir ? dir.name : "Unknown",

            poster: d.poster_path ? `https://image.tmdb.org/t/p/w200${d.poster_path}` : "",

            overview: d.overview || "No description available.",

            runtime: d.runtime || 0,

            rating: d.vote_average ? d.vote_average.toFixed(1) : "N/A",

            id: d.id

        });


        if (saveToStorage) {

            saveGuessToStorage(movieId);

        }

    } catch (err) {

        console.error("Error processing guess selection:", err);

    }

}


// 6. Build Result Comparison Rows

function submitGuess(guessedMovie) {

    if (searchInput) searchInput.value = "";

    if (dropdown) dropdown.innerHTML = "";

    if (!feed) return;


    let row = document.createElement("div");

    row.classList.add("guess-row");


    let posterBlock = document.createElement("div");

    posterBlock.classList.add("poster-block");

    if (guessedMovie.poster) {

        posterBlock.style.backgroundImage = `url('${guessedMovie.poster}')`;

    }

    row.appendChild(posterBlock);


    row.appendChild(createInfoBlock(guessedMovie.title, guessedMovie.title === SECRET_MOVIE.title));


    let yearStatus = "absent";

    let displayYear = guessedMovie.year;

    if (guessedMovie.year === SECRET_MOVIE.year) {

        yearStatus = "correct";

    } else {

        displayYear += guessedMovie.year < SECRET_MOVIE.year ? " ⬆️" : " ⬇️";

    }

    row.appendChild(createInfoBlock(displayYear, yearStatus));


    row.appendChild(createInfoBlock(guessedMovie.genre, guessedMovie.genre === SECRET_MOVIE.genre));

    row.appendChild(createInfoBlock(guessedMovie.director, guessedMovie.director === SECRET_MOVIE.director));


    feed.insertBefore(row, feed.firstChild);


    if (guessedMovie.title === SECRET_MOVIE.title) {

        setTimeout(async () => {

            const watchProviders = await getWatchProviders(guessedMovie.id);

            const titleMsg = IS_ENDLESS ? "🎉 Endless Victory!" : "🎉 Masterful Guessing!";

            const bodyMsg = IS_ENDLESS ? "You solved this endless mystery puzzle!" : "You found today's hidden movie! 🎬";

            

            showCustomGameModal(titleMsg, bodyMsg, {

                title: guessedMovie.title,

                year: guessedMovie.year,

                rating: guessedMovie.rating,

                runtime: guessedMovie.runtime,

                overview: guessedMovie.overview,

                watchProviders: watchProviders

            });

        }, 300);

    }

}


// Helper function to create blocks

function createInfoBlock(text, statusClass) {

    let block = document.createElement("div");

    block.classList.add("info-block");

    if (statusClass === true) block.classList.add("correct");

    else if (statusClass === false) block.classList.add("absent");

    else block.classList.add(statusClass);

    block.innerText = text;

    return block;

}


// --- STORAGE CACHING LOOPS ---

function saveGuessToStorage(movieId) {

    // Prevent daily local history caching if in Endless Mode

    if (IS_ENDLESS) return; 


    let savedGuesses = JSON.parse(localStorage.getItem("moviedle_guesses")) || [];

    if (!savedGuesses.includes(movieId)) {

        savedGuesses.push(movieId);

        localStorage.setItem("moviedle_guesses", JSON.stringify(savedGuesses));

        localStorage.setItem("moviedle_date_seed", CURRENT_DATE_SEED.toString());

    }

}


async function loadSavedGuesses(currentDateSeed) {

    const storedDateSeed = localStorage.getItem("moviedle_date_seed");

    if (storedDateSeed !== currentDateSeed.toString()) {

        localStorage.removeItem("moviedle_guesses");

        localStorage.removeItem("moviedle_date_seed");

        return;

    }

    let savedGuesses = JSON.parse(localStorage.getItem("moviedle_guesses")) || [];

    for (const id of savedGuesses) {

        await fetchAndSubmitGuess(id, false);

    }

}


initGame();

To implement the Progressive Hint System, I have modified your code to track the number of guesses and update the hint box dynamically based on the player's performance.
1. Updated Variable and loadTargetDetails

Add a guessCount variable at the top, and update loadTargetDetails to handle the new hint data.
JavaScript

// ... existing variables ...
let IS_ENDLESS = false;
let guessCount = 0; // NEW: Track number of guesses

// ... inside loadTargetDetails function, update SECRET_MOVIE and initial hint ...
SECRET_MOVIE = {
    // ... existing fields ...
    actors: details.credits?.cast?.slice(0, 3).map(a => a.name).join(", ") || "Unknown"
};

guessCount = 0; // Reset count
const modePrefix = IS_ENDLESS ? "Endless" : "Daily";
updateHintText(`${modePrefix} Hint: A popular ${SECRET_MOVIE.genre} movie released in ${SECRET_MOVIE.year}.`);

2. The Progressive Hint Logic

Add this function to your script.js. It changes the hint based on how many guesses the player has made.
JavaScript

function triggerProgressiveHint() {
    guessCount++;
    const modePrefix = IS_ENDLESS ? "Endless" : "Daily";
    
    switch(guessCount) {
        case 2:
            updateHintText(`${modePrefix} Hint: Directed by the legendary ${SECRET_MOVIE.director}.`);
            break;
        case 3:
            updateHintText(`${modePrefix} Hint: Starring actors like ${SECRET_MOVIE.actors}.`);
            break;
        case 4:
            updateHintText(`${modePrefix} Hint: The film runtime is approximately ${SECRET_MOVIE.runtime} minutes.`);
            break;
        case 5:
            updateHintText(`${modePrefix} Hint: ${SECRET_MOVIE.overview.substring(0, 80)}...`);
            break;
        default:
            break;
    }
}

3. Integrate into submitGuess

Find your submitGuess(guessedMovie) function and add the trigger at the end of the logic flow.
JavaScript

function submitGuess(guessedMovie) {
    // ... (keep all your existing row creation logic here) ...

    feed.insertBefore(row, feed.firstChild);

    // NEW: Trigger a hint only if the guess was wrong
    if (guessedMovie.title !== SECRET_MOVIE.title) {
        triggerProgressiveHint();
    } else {
        // ... keep your existing win-condition setTimeout code ...
    }
}

Why this is better:

    Encourages Gameplay: Players are no longer left guessing blindly; they get more "intel" the longer the game goes.

    Lower Barrier to Entry: Even if a movie is somewhat obscure, the actor and runtime hints provide enough data to narrow down the search effectively.

    Retains Challenge: By waiting until the 2nd or 3rd guess to provide the director or actors, you keep the initial challenge high for expert players.

make the full script


// 1. Setup API configuration and Daily State Variables

const API_KEY = "a24cbba3b16a5ea825ec42ac4e4c8d52"; 

let SECRET_MOVIE = null;

let dailyMoviePool = []; 

let CURRENT_DATE_SEED = 0;

let IS_ENDLESS = false; // Tracks if the player is in endless mode


const searchInput = document.getElementById("movie-search");

const dropdown = document.getElementById("dropdown-results");

const feed = document.getElementById("guesses-feed");

const endlessBtn = document.getElementById("endless-btn");


// 2. Fetch a global list of movies safely for the Daily Target Picker

async function initGame() {

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


// 3. Mathematical Formula to pick one synchronized movie per calendar day (UTC Fixed)

async function setDailyMovie(customDate = null) {

    try {

        IS_ENDLESS = false;

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


// New Function: Set up a random movie for Endless Mode

async function setEndlessMovie() {

    if (dailyMoviePool.length === 0) return;

    

    IS_ENDLESS = true;

    if (endlessBtn) endlessBtn.innerText = "Back to Daily Mode 📅";

    

    // Clear existing layout feed

    if (feed) feed.innerHTML = "";

    if (searchInput) searchInput.value = "";

    if (dropdown) dropdown.innerHTML = "";

    

    // Select completely random movie from current pool

    const randomIndex = Math.floor(Math.random() * dailyMoviePool.length);

    const selectedMovie = dailyMoviePool[randomIndex];

    

    await loadTargetDetails(selectedMovie.id);

}


// Hook up Endless button click listener

if (endlessBtn) {

    endlessBtn.addEventListener("click", () => {

        if (!IS_ENDLESS) {

            setEndlessMovie();

        } else {

            if (feed) feed.innerHTML = ""; // Clear endless board

            setDailyMovie(); // Revert back to daily challenge

        }

    });

}


// Helper to pull complete target details from TMDB

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


    const modePrefix = IS_ENDLESS ? "Endless Challenge" : "Daily Hint";

    updateHintText(`${modePrefix}: A popular ${SECRET_MOVIE.genre} movie released in ${SECRET_MOVIE.year}.`);

}


// 4. Live Search Input Autocomplete & Hidden Dev Passcode Hook

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


// --- VISUAL DEV PANEL ENGINE ---

function launchDevPanel() {

    if (document.getElementById("admin-dev-overlay")) return;


    let overlay = document.createElement("div");

    overlay.id = "admin-dev-overlay";

    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,15,20,0.98); z-index:9999; color:#fff; font-family:sans-serif; padding:30px; box-sizing:border-box; overflow-y:auto;";


    let title = document.createElement("h2");

    title.innerText = "🛠️ SYSTEM DEVELOPER CONTROL PANEL";

    title.style.borderBottom = "2px solid #333";

    title.style.paddingBottom = "10px";

    overlay.appendChild(title);


    let diagnostics = document.createElement("div");

    diagnostics.style = "background:#1a202c; padding:12px; border-radius:6px; border:1px solid #2d3748; margin:15px 0; font-size:14px; font-family:monospace; color:#a0aec0;";

    let targetIndex = CURRENT_DATE_SEED % (dailyMoviePool.length || 1);

    diagnostics.innerHTML = `

        <strong>[DIAGNOSTICS]</strong><br>

        • Total Loaded Pool: ${dailyMoviePool.length} movies<br>

        • Current Date Seed: ${CURRENT_DATE_SEED}<br>

        • Active Pool Index: ${targetIndex}

    `;

    overlay.appendChild(diagnostics);


    let infoBox = document.createElement("div");

    infoBox.id = "dev-info-box";

    infoBox.style = "background:#222; padding:15px; border-radius:8px; margin:15px 0; font-size:16px; line-height:1.6; display:none;";

    overlay.appendChild(infoBox);


    let sectionGrid = document.createElement("div");

    sectionGrid.style = "display:grid; grid-template-columns: 1fr; gap:15px; max-width:500px;";

    overlay.appendChild(sectionGrid);


    let btnInfo = document.createElement("button");

    btnInfo.innerText = "👁️ Show / Hide Target Data";

    styleDevButton(btnInfo, "#4a5568");

    btnInfo.onclick = () => {

        if (infoBox.style.display === "none") {

            infoBox.style.display = "block";

            refreshInfoBox(infoBox);

        } else {

            infoBox.style.display = "none";

        }

    };

    sectionGrid.appendChild(btnInfo);


    let btnChange = document.createElement("button");

    btnChange.innerText = "🎲 Force Swap Target Movie (Random Re-roll)";

    styleDevButton(btnChange, "#e53e3e");

    btnChange.onclick = async () => {

        if (dailyMoviePool.length === 0) return alert("Pool empty!");

        let randomIndex = Math.floor(Math.random() * dailyMoviePool.length);

        let selectedMovie = dailyMoviePool[randomIndex];

        await loadTargetDetails(selectedMovie.id);

        refreshInfoBox(infoBox);

        showCustomGameModal("Target updated successfully!", `The new hidden answer is now locked into memory.`);

    };

    sectionGrid.appendChild(btnChange);


    let btnPreview = document.createElement("button");

    btnPreview.innerText = "🔮 Next Up Preview (Tomorrow's Movie)";

    styleDevButton(btnPreview, "#3182ce");

    btnPreview.onclick = async () => {

        if (dailyMoviePool.length === 0) return alert("Pool empty!");

        const tomorrow = new Date();

        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

        const tomorrowSeed = tomorrow.getUTCFullYear() * 10000 + (tomorrow.getUTCMonth() + 1) * 100 + tomorrow.getUTCDate();

        const tomorrowIndex = tomorrowSeed % dailyMoviePool.length;

        const tomorrowMovie = dailyMoviePool[tomorrowIndex];


        try {

            let res = await fetch(`https://api.themoviedb.org/3/movie/${tomorrowMovie.id}?api_key=${API_KEY}`);

            let d = await res.json();

            alert(`🔮 TOMORROW'S TARGET SNEAK PEEK:\n\nTitle: ${d.title.toUpperCase()}\nRelease Year: ${d.release_date ? d.release_date.split("-")[0] : 'Unknown'}\nID: ${d.id}`);

        } catch (e) {

            alert("Error fetching tomorrow's data.");

        }

    };

    sectionGrid.appendChild(btnPreview);


    let searchBlock = document.createElement("div");

    searchBlock.style = "margin:15px 0; padding:15px; background:#1a202c; border-radius:8px; border:1px solid #2d3748; max-width:500px;";

    searchBlock.innerHTML = `

        <label style="display:block; font-size:13px; font-weight:bold; color:#cbd5e1; margin-bottom:6px;">🔍 Internal TMDB Search Engine (Find IDs / Force Target):</label>

        <div style="display:flex; gap:10px;">

            <input type="text" id="dev-search-input" placeholder="Search any movie..." style="flex:1; padding:8px; border-radius:4px; border:1px solid #4a5568; background:#2d3748; color:#fff;">

            <button id="dev-search-btn" style="padding:8px 15px; background:#3182ce; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Search</button>

        </div>

        <div id="dev-search-results" style="margin-top:10px; max-height:150px; overflow-y:auto; font-size:12px; background:#111; border-radius:4px;"></div>

    `;

    overlay.appendChild(searchBlock);


    setTimeout(() => {

        const dInput = document.getElementById("dev-search-input");

        const dBtn = document.getElementById("dev-search-btn");

        const dResults = document.getElementById("dev-search-results");

        

        dBtn.onclick = async () => {

            let query = dInput.value.trim();

            if (!query) return;

            dResults.innerHTML = "<div style='padding:8px; color:#aaa;'>Searching...</div>";

            try {

                let res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);

                let data = await res.json();

                dResults.innerHTML = "";

                (data.results || []).slice(0, 5).forEach(m => {

                    let yr = m.release_date ? m.release_date.split("-")[0] : "N/A";

                    let row = document.createElement("div");

                    row.style = "padding:8px; border-bottom:1px solid #222; display:flex; justify-content:space-between; align-items:center;";

                    row.innerHTML = `

                        <span><strong>${m.title} (${yr})</strong> - ID: ${m.id}</span>

                        <div>

                            <button class="dev-set-tgt" data-id="${m.id}" style="background:#e53e3e; color:#fff; border:none; padding:4px 8px; font-size:11px; border-radius:3px; cursor:pointer; margin-right:4px;">Set</button>

                            <button class="dev-inj-guess" data-id="${m.id}" style="background:#4ade80; color:#000; border:none; padding:4px 8px; font-size:11px; border-radius:3px; cursor:pointer;">Inj</button>

                        </div>

                    `;

                    dResults.appendChild(row);

                });


                document.querySelectorAll(".dev-set-tgt").forEach(b => {

                    b.onclick = async () => {

                        await loadTargetDetails(b.getAttribute("data-id"));

                        refreshInfoBox(infoBox);

                        alert(`Target locked to: ${SECRET_MOVIE.title}`);

                    };

                });

                document.querySelectorAll(".dev-inj-guess").forEach(b => {

                    b.onclick = async () => {

                        await fetchAndSubmitGuess(b.getAttribute("data-id"), true);

                        showCustomGameModal("Row Injected", "Movie row added to layout.");

                    };

                });

            } catch (err) { dResults.innerHTML = "<div style='padding:8px; color:#e53e3e;'>Search Failed</div>"; }

        };

    }, 50);


    let rigBlock = document.createElement("div");

    rigBlock.style = "margin:15px 0; padding:15px; background:#1a202c; border-radius:8px; border:1px solid #2d3748; max-width:500px;";

    rigBlock.innerHTML = `

        <label style="display:block; font-size:13px; font-weight:bold; color:#cbd5e1; margin-bottom:8px;">🎛️ Match Attribute Modifier (Rig Core Parameters):</label>

        <div style="display:grid; grid-template-columns: 80px 1fr; gap:8px; font-size:12px; align-items:center;">

            <span>Title:</span><input type="text" id="rig-title" style="padding:6px; background:#2d3748; border:1px solid #4a5568; color:#fff; border-radius:4px;">

            <span>Year:</span><input type="number" id="rig-year" style="padding:6px; background:#2d3748; border:1px solid #4a5568; color:#fff; border-radius:4px;">

            <span>Genre:</span><input type="text" id="rig-genre" style="padding:6px; background:#2d3748; border:1px solid #4a5568; color:#fff; border-radius:4px;">

            <span>Director:</span><input type="text" id="rig-director" style="padding:6px; background:#2d3748; border:1px solid #4a5568; color:#fff; border-radius:4px;">

        </div>

        <button id="btn-rig-apply" style="width:100%; margin-top:10px; padding:8px; background:#d69e2e; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Apply Attribute Rig</button>

    `;

    overlay.appendChild(rigBlock);


    setTimeout(() => {

        document.getElementById("rig-title").value = SECRET_MOVIE.title;

        document.getElementById("rig-year").value = SECRET_MOVIE.year;

        document.getElementById("rig-genre").value = SECRET_MOVIE.genre;

        document.getElementById("rig-director").value = SECRET_MOVIE.director;


        document.getElementById("btn-rig-apply").onclick = () => {

            SECRET_MOVIE.title = document.getElementById("rig-title").value.toUpperCase();

            SECRET_MOVIE.year = parseInt(document.getElementById("rig-year").value) || 0;

            SECRET_MOVIE.genre = document.getElementById("rig-genre").value;

            SECRET_MOVIE.director = document.getElementById("rig-director").value;

            refreshInfoBox(infoBox);

            updateHintText(`Daily Hint: A popular ${SECRET_MOVIE.genre} movie released in ${SECRET_MOVIE.year}.`);

            alert("Core match variables rigged successfully!");

        };

    }, 50);


    let timeBlock = document.createElement("div");

    timeBlock.style = "margin:15px 0; padding:15px; background:#1a202c; border-radius:8px; border:1px solid #2d3748; max-width:500px;";

    timeBlock.innerHTML = `

        <label style="display:block; font-size:13px; font-weight:bold; color:#cbd5e1; margin-bottom:6px;">⏱️ Time-Travel Simulator (Test Specific Calendar Seeds):</label>

        <div style="display:flex; gap:10px;">

            <input type="date" id="time-travel-date" style="flex:1; padding:8px; border-radius:4px; border:1px solid #4a5568; background:#2d3748; color:#fff;">

            <button id="btn-time-travel" style="padding:8px 15px; background:#805ad5; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">Simulate Date</button>

        </div>

    `;

    overlay.appendChild(timeBlock);


    setTimeout(() => {

        document.getElementById("btn-time-travel").onclick = async () => {

            let val = document.getElementById("time-travel-date").value;

            if (!val) return alert("Select a date layout parameter first!");

            let parts = val.split("-");

            let mockDate = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));

            await setDailyMovie(mockDate);

            refreshInfoBox(infoBox);

            diagnostics.innerHTML = `

                <strong>[DIAGNOSTICS]</strong><br>

                • Total Loaded Pool: ${dailyMoviePool.length} movies<br>

                • Current Date Seed: ${CURRENT_DATE_SEED}<br>

                • Active Pool Index: ${CURRENT_DATE_SEED % dailyMoviePool.length}

            `;

            alert(`Engine shifted to Date Seed: ${CURRENT_DATE_SEED}`);

        };

    }, 50);


    let statsBlock = document.createElement("div");

    statsBlock.style = "margin:15px 0; padding:15px; background:#1a202c; border-radius:8px; border:1px solid #2d3748; max-width:500px; display:flex; gap:10px;";

    

    let btnSpoof = document.createElement("button");

    btnSpoof.innerText = "📊 Spoof 99 Win Streak";

    styleDevButton(btnSpoof, "#2b6cb0");

    btnSpoof.style.margin = "0"; bknStyle(btnSpoof);

    btnSpoof.onclick = () => {

        localStorage.setItem("movidle_stat_streak", "99");

        alert("Local storage data win streak spoofed to 99!");

    };

    statsBlock.appendChild(btnSpoof);


    let btnResetCache = document.createElement("button");

    btnResetCache.innerText = "🗑️ Reset Cache History";

    styleDevButton(btnResetCache, "#d69e2e");

    btnResetCache.style.margin = "0"; bknStyle(btnResetCache);

    btnResetCache.onclick = () => {

        if (confirm("Clear local guess history cache and refresh board?")) {

            localStorage.removeItem("moviedle_guesses");

            localStorage.removeItem("moviedle_date_seed");

            localStorage.removeItem("movidle_stat_streak");

            window.location.reload();

        }

    };

    statsBlock.appendChild(btnResetCache);

    overlay.appendChild(statsBlock);


    let btnClose = document.createElement("button");

    btnClose.innerText = "❌ Close Developer Suite";

    styleDevButton(btnClose, "#2d3748");

    btnClose.style.marginTop = "20px";

    btnClose.onclick = () => overlay.remove();

    overlay.appendChild(btnClose);


    document.body.appendChild(overlay);

}


function refreshInfoBox(box) {

    box.innerHTML = `

        <strong>TITLE:</strong> ${SECRET_MOVIE.title}<br>

        <strong>YEAR:</strong> ${SECRET_MOVIE.year}<br>

        <strong>GENRE:</strong> ${SECRET_MOVIE.genre}<br>

        <strong>DIRECTOR:</strong> ${SECRET_MOVIE.director}<br>

        <strong>TMDB ID:</strong> ${SECRET_MOVIE.id}

    `;

}

function styleDevButton(btn, bgColor) {

    btn.style = `display:block; width:100%; background:${bgColor}; color:#fff; border:none; padding:12px; margin:5px 0; font-size:14px; font-weight:bold; border-radius:6px; cursor:pointer; text-align:center;`;

}

function bknStyle(b) { b.style.flex = "1"; b.style.textAlign = "center"; }


// --- CUSTOM NATIVE IN-GAME MODAL ELEMENT WITH ENHANCED WIN SCREEN ---

function showCustomGameModal(titleText, bodyText, movieData = null) {

    if (document.getElementById("custom-game-modal-overlay")) return;


    let overlay = document.createElement("div");

    overlay.id = "custom-game-modal-overlay";

    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.75); display:flex; align-items:center; justify-content:center; z-index:10000; padding:20px; box-sizing:border-box; overflow-y:auto;";


    let card = document.createElement("div");

    card.style = "background:#1e1e24; color:#ffffff; padding:30px; border-radius:16px; width:100%; max-width:600px; text-align:center; box-shadow:0 10px 25px rgba(0,0,0,0.5); border:1px solid #333; transform:scale(0.95); transition:transform 0.3s ease-out;";


    let headline = document.createElement("h2");

    headline.innerText = titleText;

    headline.style = "margin:0 0 15px 0; font-size:22px; color:#4ade80; font-weight:bold;";

    card.appendChild(headline);


    let message = document.createElement("p");

    message.innerText = bodyText;

    message.style = "margin:0 0 25px 0; font-size:16px; color:#cbd5e1; line-height:1.5;";

    card.appendChild(message);


    if (movieData) {

        let detailsContainer = document.createElement("div");

        detailsContainer.style = "background:#2d2d33; padding:20px; border-radius:10px; margin:20px 0; text-align:left; border:1px solid #3a3a3c;";


        let titleInfo = document.createElement("div");

        titleInfo.style = "margin-bottom:15px;";

        titleInfo.innerHTML = `

            <h3 style="margin:0 0 8px 0; color:#4ade80; font-size:18px;">${movieData.title}</h3>

            <p style="margin:0; color:#a0aec0; font-size:14px;">⭐ ${movieData.rating}/10 | ⏱️ ${movieData.runtime} min | 📅 ${movieData.year}</p>

        `;

        detailsContainer.appendChild(titleInfo);


        let overviewLabel = document.createElement("p");

        overviewLabel.style = "margin:12px 0 8px 0; font-weight:bold; color:#cbd5e1; font-size:14px;";

        overviewLabel.innerText = "📝 Plot Summary";

        detailsContainer.appendChild(overviewLabel);


        let overview = document.createElement("p");

        overview.style = "margin:0 0 15px 0; color:#a0aec0; font-size:13px; line-height:1.6; max-height:120px; overflow-y:auto;";

        overview.innerText = movieData.overview;

        detailsContainer.appendChild(overview);


        if (movieData.watchProviders && movieData.watchProviders.length > 0) {

            let watchLabel = document.createElement("p");

            watchLabel.style = "margin:12px 0 8px 0; font-weight:bold; color:#cbd5e1; font-size:14px;";

            watchLabel.innerText = "📺 Where to Watch";

            detailsContainer.appendChild(watchLabel);


            let watchContainer = document.createElement("div");

            watchContainer.style = "display:flex; flex-wrap:wrap; gap:10px;";

            

            movieData.watchProviders.forEach(provider => {

                let badge = document.createElement("span");

                badge.style = "background:#4a5568; color:#fff; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:bold;";

                badge.innerText = provider;

                watchContainer.appendChild(badge);

            });

            

            detailsContainer.appendChild(watchContainer);

        } else {

            let noWatch = document.createElement("p");

            noWatch.style = "margin:0; color:#a0aec0; font-size:13px;";

            noWatch.innerText = "📺 Watch info not available in your region.";

            detailsContainer.appendChild(noWatch);

        }


        card.appendChild(detailsContainer);

    }


    let btn = document.createElement("button");

    // If endless, button says "Play Next Movie", otherwise standard "OK"

    btn.innerText = IS_ENDLESS ? "Play Next Movie 🎬" : "OK";

    btn.style = "background:#4ade80; color:#0f172a; border:none; padding:12px 30px; font-size:16px; font-weight:bold; border-radius:8px; cursor:pointer; width:100%; transition: opacity 0.2s;";

    btn.onmouseenter = () => btn.style.opacity = "0.8";

    btn.onmouseleave = () => btn.style.opacity = "1";

    btn.onclick = () => {

        overlay.remove();

        // If endless, instantly load another hidden mystery film!

        if (IS_ENDLESS) {

            setEndlessMovie();

        }

    };

    card.appendChild(btn);


    overlay.appendChild(card);

    document.body.appendChild(overlay);


    setTimeout(() => {

        card.style.transform = "scale(1)";

    }, 10);


    if (!document.getElementById("modal-animation-style")) {

        let style = document.createElement("style");

        style.id = "modal-animation-style";

        style.innerHTML = "@keyframes modalPop { to { transform: scale(1); } }";

        document.head.appendChild(style);

    }

}


// Helper function to fetch watch providers for a movie

async function getWatchProviders(movieId) {

    try {

        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${API_KEY}`);

        const data = await res.json();

        

        const usProviders = data.results?.US;

        if (usProviders) {

            let providers = [];

            if (usProviders.buy) providers.push(...usProviders.buy.map(p => `Buy on ${p.provider_name}`));

            if (usProviders.rent) providers.push(...usProviders.rent.map(p => `Rent on ${p.provider_name}`));

            if (usProviders.flatrate) providers.push(...usProviders.flatrate.map(p => `Stream on ${p.provider_name}`));

            return providers;

        }

        return [];

    } catch (err) {

        console.error("Error fetching watch providers:", err);

        return [];

    }

}


// 5. Fetch complete details for the user's selected movie guess

async function fetchAndSubmitGuess(movieId, saveToStorage = false) {

    try {

        let res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`);

        let d = await res.json();

        let dir = d.credits?.crew?.find(m => m.job === "Director");

        

        submitGuess({

            title: d.title ? d.title.toUpperCase() : "UNKNOWN TITLE",

            year: parseInt(d.release_date?.split("-")[0]) || 0,

            genre: d.genres?.length > 0 ? d.genres[0].name : "Unknown",

            director: dir ? dir.name : "Unknown",

            poster: d.poster_path ? `https://image.tmdb.org/t/p/w200${d.poster_path}` : "",

            overview: d.overview || "No description available.",

            runtime: d.runtime || 0,

            rating: d.vote_average ? d.vote_average.toFixed(1) : "N/A",

            id: d.id

        });


        if (saveToStorage) {

            saveGuessToStorage(movieId);

        }

    } catch (err) {

        console.error("Error processing guess selection:", err);

    }

}


// 6. Build Result Comparison Rows

function submitGuess(guessedMovie) {

    if (searchInput) searchInput.value = "";

    if (dropdown) dropdown.innerHTML = "";

    if (!feed) return;


    let row = document.createElement("div");

    row.classList.add("guess-row");


    let posterBlock = document.createElement("div");

    posterBlock.classList.add("poster-block");

    if (guessedMovie.poster) {

        posterBlock.style.backgroundImage = `url('${guessedMovie.poster}')`;

    }

    row.appendChild(posterBlock);


    row.appendChild(createInfoBlock(guessedMovie.title, guessedMovie.title === SECRET_MOVIE.title));


    let yearStatus = "absent";

    let displayYear = guessedMovie.year;

    if (guessedMovie.year === SECRET_MOVIE.year) {

        yearStatus = "correct";

    } else {

        displayYear += guessedMovie.year < SECRET_MOVIE.year ? " ⬆️" : " ⬇️";

    }

    row.appendChild(createInfoBlock(displayYear, yearStatus));


    row.appendChild(createInfoBlock(guessedMovie.genre, guessedMovie.genre === SECRET_MOVIE.genre));

    row.appendChild(createInfoBlock(guessedMovie.director, guessedMovie.director === SECRET_MOVIE.director));


    feed.insertBefore(row, feed.firstChild);


    if (guessedMovie.title === SECRET_MOVIE.title) {

        setTimeout(async () => {

            const watchProviders = await getWatchProviders(guessedMovie.id);

            const titleMsg = IS_ENDLESS ? "🎉 Endless Victory!" : "🎉 Masterful Guessing!";

            const bodyMsg = IS_ENDLESS ? "You solved this endless mystery puzzle!" : "You found today's hidden movie! 🎬";

            

            showCustomGameModal(titleMsg, bodyMsg, {

                title: guessedMovie.title,

                year: guessedMovie.year,

                rating: guessedMovie.rating,

                runtime: guessedMovie.runtime,

                overview: guessedMovie.overview,

                watchProviders: watchProviders

            });

        }, 300);

    }

}


// Helper function to create blocks

function createInfoBlock(text, statusClass) {

    let block = document.createElement("div");

    block.classList.add("info-block");

    if (statusClass === true) block.classList.add("correct");

    else if (statusClass === false) block.classList.add("absent");

    else block.classList.add(statusClass);

    block.innerText = text;

    return block;

}


// --- STORAGE CACHING LOOPS ---

function saveGuessToStorage(movieId) {

    // Prevent daily local history caching if in Endless Mode

    if (IS_ENDLESS) return; 


    let savedGuesses = JSON.parse(localStorage.getItem("moviedle_guesses")) || [];

    if (!savedGuesses.includes(movieId)) {

        savedGuesses.push(movieId);

        localStorage.setItem("moviedle_guesses", JSON.stringify(savedGuesses));

        localStorage.setItem("moviedle_date_seed", CURRENT_DATE_SEED.toString());

    }

}


async function loadSavedGuesses(currentDateSeed) {

    const storedDateSeed = localStorage.getItem("moviedle_date_seed");

    if (storedDateSeed !== currentDateSeed.toString()) {

        localStorage.removeItem("moviedle_guesses");

        localStorage.removeItem("moviedle_date_seed");

        return;

    }

    let savedGuesses = JSON.parse(localStorage.getItem("moviedle_guesses")) || [];

    for (const id of savedGuesses) {

        await fetchAndSubmitGuess(id, false);

    }

}


initGame(); 
