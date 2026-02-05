const splashes = ["Choose your World!", "Flat or Normal?", "Void is scary", "Build anything!"];
document.getElementById('splashText').innerText = splashes[Math.floor(Math.random() * splashes.length)];

const settingsModal = document.getElementById('settingsModal');
const playModal = document.getElementById('playModal');
const infoModal = document.getElementById('infoModal');

const bgInput = document.getElementById('optBgUrl');
const colorInput = document.getElementById('optBgColor');

window.onload = () => {
    if(localStorage.getItem('pc_size')) document.getElementById('optSize').value = localStorage.getItem('pc_size');
    if(localStorage.getItem('pc_daynight')) document.getElementById('optDayNight').value = localStorage.getItem('pc_daynight');
    if(localStorage.getItem('pc_weather')) document.getElementById('optWeather').value = localStorage.getItem('pc_weather');
    
    const savedColor = localStorage.getItem('pc_bg_color') || '#382618';
    colorInput.value = savedColor;

    const savedBgUrl = localStorage.getItem('pc_bg_url');
    if(savedBgUrl && savedBgUrl.trim() !== "") {
        document.body.style.backgroundImage = `url(${savedBgUrl})`;
        bgInput.value = savedBgUrl;
    } else {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = savedColor;
    }
}

function openPlayModal() { playModal.style.display = 'flex'; }

function openPlayMPModal() {
    alert("Multiplayer system coming soon!");
}

function closePlayModal() { playModal.style.display = 'none'; }

function launchGame() {
    const worldType = document.getElementById('optWorldType').value;
    localStorage.setItem('pc_world_type', worldType);
    window.location.href = 'game.html';
}

function openSettings() { settingsModal.style.display = 'flex'; }

function saveAndCloseSettings() {
    const size = document.getElementById('optSize').value;
    const dayNight = document.getElementById('optDayNight').value;
    const weather = document.getElementById('optWeather').value;
    const bgUrl = bgInput.value;
    const bgColor = colorInput.value;

    localStorage.setItem('pc_size', size);
    localStorage.setItem('pc_daynight', dayNight);
    localStorage.setItem('pc_weather', weather);
    localStorage.setItem('pc_bg_url', bgUrl);
    localStorage.setItem('pc_bg_color', bgColor);

    if (bgUrl && bgUrl.trim() !== "") {
        document.body.style.backgroundImage = `url(${bgUrl})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundColor = bgColor;
    } else {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = bgColor;
    }

    settingsModal.style.display = 'none';
}

function openInfo() { infoModal.style.display = 'flex'; }
function closeInfo() { infoModal.style.display = 'none'; }

function exitGame() {
    if(confirm("Are you sure you want to leave PaintCraft?")) {
        window.close();
        
        document.body.style.backgroundImage = "none";
        document.body.style.backgroundColor = "#382618"; 

        document.body.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; color:white; font-family:'VT323', monospace; text-align:center;">
                <h1 style="font-size:60px; text-shadow: 4px 4px #000;">PAINTCRAFT</h1>
                <p style="font-size:24px;">Thanks for playing!</p>
                <p style="color:#aaa;">You can now safely close this tab.</p>
                <button class="mc-btn" onclick="location.reload()" style="margin-top:20px;">Return to Menu</button>
            </div>
        `;
    }
}