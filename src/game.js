const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const colorInput = document.getElementById('colorPicker');

const configSize = localStorage.getItem('pc_size') || 'medium';
const configDayNight = localStorage.getItem('pc_daynight') || 'day';
const configWeather = localStorage.getItem('pc_weather') || 'none';
const configWorldType = localStorage.getItem('pc_world_type') || 'normal';

const resolutions = {
    'small': { w: 600, h: 400 },
    'medium': { w: 800, h: 500 },
    'large': { w: 1000, h: 700 },
    'hd': { w: 1280, h: 720 },
    'fullhd': { w: 1920, h: 1080 }
};

const selectedRes = resolutions[configSize] || resolutions['medium'];
canvas.width = selectedRes.w;
canvas.height = selectedRes.h;

const TILE_SIZE = 40;
const ROWS = Math.floor(canvas.height / TILE_SIZE);
const COLS = Math.floor(canvas.width / TILE_SIZE);

let world = [];
let particles = [];
let mouseX = 0;
let mouseY = 0;
let currentTool = 'pickaxe';
let currentColor = '#8b4513';

const toolEls = {
    pickaxe: document.getElementById('tool-pickaxe'),
    block: document.getElementById('tool-block'),
    picker: document.getElementById('tool-picker'),
    color: document.getElementById('tool-color-wrapper')
};

function initWorld() {
    for (let r = 0; r < ROWS; r++) {
        world[r] = [];
        for (let c = 0; c < COLS; c++) {
            world[r][c] = null;
        }
    }

    if (configWorldType === 'empty') {
        const midR = Math.floor(ROWS / 2);
        const midC = Math.floor(COLS / 2);
        world[midR][midC] = '#7f8c8d';
    } 
    else {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (r > 8) world[r][c] = '#7f8c8d';
                else if (r > 6) world[r][c] = '#8b4513';
                else if (r === 6) world[r][c] = '#7cfc00';
            }
        }

        if (configWorldType === 'normal') {
            for (let c = 2; c < COLS - 2; c++) {
                if (Math.random() < 0.15) {
                    createTree(c, 6);
                    c += 3;
                }
            }
        }
    }

    initWeather();
}

function createTree(c, groundRow) {
    if (groundRow - 4 >= 0) {
        world[groundRow - 1][c] = '#A0522D';
        world[groundRow - 2][c] = '#A0522D';
        world[groundRow - 3][c] = '#A0522D';
        world[groundRow - 3][c - 1] = '#228B22';
        world[groundRow - 3][c + 1] = '#228B22';
        world[groundRow - 4][c] = '#228B22';
        world[groundRow - 4][c - 1] = '#228B22';
        world[groundRow - 4][c + 1] = '#228B22';
    }
}

function initWeather() {
    particles = [];
    if (configWeather === 'none') return;
    
    const count = 100;
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            speed: Math.random() * 2 + 2,
            length: Math.random() * 10 + 5
        });
    }
}

function updateWeather() {
    if (configWeather === 'none') return;

    particles.forEach(p => {
        p.y += p.speed;
        if (p.y > canvas.height) {
            p.y = -10;
            p.x = Math.random() * canvas.width;
        }
    });
}

function drawWeather() {
    if (configWeather === 'none') return;

    ctx.fillStyle = configWeather === 'snow' ? 'white' : 'rgba(174, 194, 224, 0.6)';
    ctx.strokeStyle = 'rgba(174, 194, 224, 0.6)';
    ctx.lineWidth = 1;

    particles.forEach(p => {
        if (configWeather === 'rain') {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x, p.y + p.length);
            ctx.stroke();
        } else if (configWeather === 'snow') {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function selectTool(toolName) {
    currentTool = toolName;
    Object.values(toolEls).forEach(el => el.classList.remove('active'));
    
    if (toolName === 'color') {
        toolEls['color'].classList.add('active');
    } else {
        toolEls[toolName].classList.add('active');
    }
}

function triggerColorClick() {
    selectTool('color');
}

colorInput.addEventListener('input', (e) => {
    currentColor = e.target.value;
    selectTool('block');
});

colorInput.addEventListener('click', (e) => {
    selectTool('color');
});

function draw() {
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    if (configDayNight === 'day') {
        gradient.addColorStop(0, "#87CEEB");
        gradient.addColorStop(1, "#E0F7FA");
    } else {
        gradient.addColorStop(0, "#000033");
        gradient.addColorStop(1, "#222255");
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (configDayNight === 'day' && configWeather !== 'rain') {
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(canvas.width - 50, 50, 30, 0, Math.PI * 2);
        ctx.fill();
    } else if (configDayNight === 'night') {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(canvas.width - 50, 50, 20, 0, Math.PI * 2);
        ctx.fill();
    }

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            let color = world[r][c];
            if (color) {
                drawBlock(c * TILE_SIZE, r * TILE_SIZE, color);
            }
        }
    }

    const gridX = Math.floor(mouseX / TILE_SIZE);
    const gridY = Math.floor(mouseY / TILE_SIZE);
    
    if (gridX >= 0 && gridX < COLS && gridY >= 0 && gridY < ROWS) {
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        ctx.lineWidth = 2;
        ctx.strokeRect(gridX * TILE_SIZE, gridY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        
        if (currentTool === 'block' && world[gridY][gridX] === null) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = currentColor;
            ctx.fillRect(gridX * TILE_SIZE, gridY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            ctx.globalAlpha = 1.0;
        }
    }

    drawWeather();
}

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillRect(x, y, TILE_SIZE, 4);
    ctx.fillRect(x, y, 4, TILE_SIZE);
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(x + TILE_SIZE - 4, y, 4, TILE_SIZE);
    ctx.fillRect(x, y + TILE_SIZE - 4, TILE_SIZE, 4);
}

function gameLoop() {
    updateWeather();
    draw();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const r = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return;

    if (currentTool === 'pickaxe') {
        world[r][c] = null;
    } 
    else if (currentTool === 'block') {
        if (world[r][c] === null) {
            world[r][c] = currentColor;
        }
    }
    else if (currentTool === 'picker') {
        let picked = world[r][c];
        if (picked) {
            currentColor = picked;
            colorInput.value = picked;
            selectTool('block');
        }
    }
});

window.addEventListener('keydown', e => {
    if (e.key === '1') selectTool('pickaxe');
    if (e.key === '2') selectTool('block');
    if (e.key === '3') selectTool('picker');
    if (e.key === '4') {
        selectTool('color');
        colorInput.click();
    }
});

initWorld();
gameLoop();