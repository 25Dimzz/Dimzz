// DOM Elements
const pages = {
    login: document.getElementById('loginPage'),
    dashboard: document.getElementById('dashboardPage'),
    page1: document.getElementById('page1'),
    page2: document.getElementById('page2'),
    page3: document.getElementById('page3'),
    page10: document.getElementById('page10')
};

const musicPlayer = document.getElementById('musicPlayer');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const progressBar = document.getElementById('progressBar');
const loginBtn = document.getElementById('loginBtn');
const passwordInput = document.getElementById('password');
const logoutBtn = document.getElementById('logoutBtn');
const backToDashboard = document.getElementById('backToDashboard');
const pigeon = document.getElementById('pigeon');
const navDots = document.getElementById('navDots');

// Music Data
const songs = [
    { title: "Memories - Maroon 5", duration: 189 },
    { title: "Perfect - Ed Sheeran", duration: 263 },
    { title: "Someone You Loved - Lewis Capaldi", duration: 182 },
    { title: "All of Me - John Legend", duration: 269 },
    { title: "Stay With Me - Sam Smith", duration: 172 }
];

let currentSong = 0;
let isPlaying = false;
let progressInterval;

// Navigation Dots
function createNavDots() {
    const pageCount = 10;
    for (let i = 1; i <= pageCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.dataset.page = i;
        dot.addEventListener('click', () => navigateToPage(i));
        navDots.appendChild(dot);
    }
    updateNavDots(1);
}

function updateNavDots(pageNum) {
    document.querySelectorAll('.dot').forEach((dot, index) => {
        if (index + 1 === pageNum) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Navigation Functions
function showPage(pageId) {
    // Hide all pages
    Object.values(pages).forEach(page => {
        if (page) page.classList.remove('active');
    });
    
    // Show the requested page
    if (pages[pageId]) {
        pages[pageId].classList.add('active');
    } else if (pageId.startsWith('page')) {
        const pageNum = pageId.replace('page', '');
        document.getElementById(pageId)?.classList.add('active');
        updateNavDots(parseInt(pageNum));
    }
    
    // Animate pigeon for page transitions
    animatePigeon();
}

function navigateToPage(pageNum) {
    if (pageNum === 1) {
        showPage('page1');
    } else if (pageNum === 2) {
        showPage('page2');
    } else if (pageNum === 3) {
        showPage('page3');
    } else if (pageNum === 10) {
        showPage('page10');
    } else {
        // For pages 4-9 (not created in HTML), show a placeholder
        showPage('page10');
        alert(`Page ${pageNum} would be here! For now, enjoy the final page.`);
    }
}

// Music Player Functions
function togglePlay() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        playIcon.className = 'fas fa-pause';
        startProgress();
    } else {
        playIcon.className = 'fas fa-play';
        stopProgress();
    }
}

function startProgress() {
    clearInterval(progressInterval);
    let progress = 0;
    const duration = songs[currentSong].duration;
    
    progressInterval = setInterval(() => {
        progress += 1;
        const percentage = (progress / duration) * 100;
        progressBar.style.width = `${percentage}%`;
        
        if (progress >= duration) {
            nextSong();
        }
    }, 1000);
}

function stopProgress() {
    clearInterval(progressInterval);
}

function nextSong() {
    currentSong = (currentSong + 1) % songs.length;
    updateSongInfo();
    if (isPlaying) {
        startProgress();
    }
}

function prevSong() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    updateSongInfo();
    if (isPlaying) {
        startProgress();
    }
}

function updateSongInfo() {
    document.querySelector('.song-title').textContent = songs[currentSong].title;
    progressBar.style.width = '0%';
}

// Pigeon Animation
function animatePigeon() {
    pigeon.style.animation = 'none';
    void pigeon.offsetWidth; // Trigger reflow
    pigeon.style.animation = 'flyAcross 20s linear infinite';
}

// Form Submission
function handleLogin() {
    const password = passwordInput.value.toLowerCase().trim();
    
    if (password === 'love') {
        showPage('dashboard');
        passwordInput.value = '';
    } else {
        alert('Try again! Hint: The strongest feeling ❤️');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Fade in on load
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s';
        document.body.style.opacity = '1';
    }, 100);
    
    // Create navigation dots
    createNavDots();
    
    // Music player events
    playBtn.addEventListener('click', togglePlay);
    document.getElementById('nextBtn').addEventListener('click', nextSong);
    document.getElementById('prevBtn').addEventListener('click', prevSong);
    document.getElementById('volumeBtn').addEventListener('click', function() {
        this.querySelector('i').classList.toggle('fa-volume-up');
        this.querySelector('i').classList.toggle('fa-volume-mute');
    });
    
    // Login events
    loginBtn.addEventListener('click', handleLogin);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    
    // Logout event
    logoutBtn.addEventListener('click', () => showPage('login'));
    
    // Back to dashboard
    backToDashboard.addEventListener('click', () => showPage('dashboard'));
    
    // Navigation cards
    document.querySelectorAll('.nav-card').forEach(card => {
        card.addEventListener('click', function() {
            const pageNum = this.dataset.page;
            navigateToPage(parseInt(pageNum));
        });
    });
    
    // Page navigation buttons
    document.querySelectorAll('[data-next]').forEach(btn => {
        btn.addEventListener('click', function() {
            const nextPage = this.dataset.next;
            navigateToPage(parseInt(nextPage));
        });
    });
    
    document.querySelectorAll('[data-prev]').forEach(btn => {
        btn.addEventListener('click', function() {
            const prevPage = this.dataset.prev;
            navigateToPage(parseInt(prevPage));
        });
    });
    
    // Background music autoplay (with user interaction)
    document.addEventListener('click', function initMusic() {
        if (!musicPlayer.dataset.initialized) {
            updateSongInfo();
            musicPlayer.dataset.initialized = 'true';
            document.removeEventListener('click', initMusic);
        }
    });
});

// Mouse follower effect
document.addEventListener('mousemove', (e) => {
    const loveShapes = document.querySelectorAll('.love-shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    loveShapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX * speed * 20) - 10;
        const y = (mouseY * speed * 20) - 10;
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});