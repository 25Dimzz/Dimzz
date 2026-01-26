// Application State
const state = {
    currentPage: 'login',
    currentLetterPage: 1,
    isPlaying: false,
    currentSong: 0,
    progress: 0,
    volume: 70
};

// DOM Elements
const elements = {
    pages: {
        login: document.getElementById('loginPage'),
        dashboard: document.getElementById('dashboardPage'),
        page1: document.getElementById('page1'),
        page2: document.getElementById('page2'),
        page3: document.getElementById('page3'),
        page10: document.getElementById('page10')
    },
    music: {
        player: document.getElementById('musicPlayer'),
        playBtn: document.getElementById('playBtn'),
        playIcon: document.getElementById('playIcon'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        volumeSlider: document.getElementById('volumeSlider'),
        progressBar: document.getElementById('progressBar'),
        songTitle: document.getElementById('songTitle')
    },
    navigation: {
        loginBtn: document.getElementById('loginBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
        backButtons: document.querySelectorAll('.back-btn'),
        navButtons: document.querySelectorAll('.nav-btn'),
        pageNavButtons: document.querySelectorAll('.page-nav-btn'),
        completeBtn: document.getElementById('completeBtn')
    },
    progress: {
        bar: document.getElementById('pageProgress'),
        text: document.getElementById('currentPageText')
    },
    password: document.getElementById('password')
};

// Song Data
const songs = [
    { title: "Perfect - Ed Sheeran", duration: 263 },
    { title: "Memories - Maroon 5", duration: 189 },
    { title: "Someone You Loved - Lewis Capaldi", duration: 182 },
    { title: "All of Me - John Legend", duration: 269 },
    { title: "Stay With Me - Sam Smith", duration: 172 }
];

// Initialize Application
function init() {
    // Set initial states
    updateMusicDisplay();
    setupEventListeners();
    
    // Auto-hide music player after 5 seconds
    setTimeout(() => {
        elements.music.player.style.opacity = '0.7';
        elements.music.player.style.transform = 'translateY(10px) scale(0.95)';
    }, 5000);
    
    // Show music player on hover
    elements.music.player.addEventListener('mouseenter', () => {
        elements.music.player.style.opacity = '1';
        elements.music.player.style.transform = 'translateY(0) scale(1)';
    });
    
    elements.music.player.addEventListener('mouseleave', () => {
        elements.music.player.style.opacity = '0.7';
        elements.music.player.style.transform = 'translateY(10px) scale(0.95)';
    });
}

// Page Navigation
function navigateTo(page) {
    // Hide all pages
    Object.values(elements.pages).forEach(pageEl => {
        if (pageEl) pageEl.classList.remove('active');
    });
    
    // Show target page
    if (elements.pages[page]) {
        elements.pages[page].classList.add('active');
        state.currentPage = page;
        
        // Update progress if on letter page
        if (page.startsWith('page')) {
            const pageNum = parseInt(page.replace('page', ''));
            state.currentLetterPage = pageNum;
            updatePageProgress(pageNum);
        }
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Play subtle transition sound
    playTransitionSound();
}

function updatePageProgress(pageNum) {
    const progressPercent = (pageNum / 10) * 100;
    elements.progress.bar.style.width = `${progressPercent}%`;
    elements.progress.text.textContent = `Page ${pageNum}`;
}

// Music Player Functions
function togglePlay() {
    state.isPlaying = !state.isPlaying;
    
    if (state.isPlaying) {
        elements.music.playIcon.className = 'fas fa-pause';
        startProgress();
    } else {
        elements.music.playIcon.className = 'fas fa-play';
        stopProgress();
    }
}

function startProgress() {
    let progress = 0;
    const duration = songs[state.currentSong].duration;
    
    // Clear existing interval
    if (state.progressInterval) clearInterval(state.progressInterval);
    
    state.progressInterval = setInterval(() => {
        progress += 1;
        const percentage = (progress / duration) * 100;
        elements.music.progressBar.style.width = `${percentage}%`;
        
        if (progress >= duration) {
            nextSong();
        }
    }, 1000);
}

function stopProgress() {
    if (state.progressInterval) {
        clearInterval(state.progressInterval);
        state.progressInterval = null;
    }
}

function nextSong() {
    state.currentSong = (state.currentSong + 1) % songs.length;
    updateMusicDisplay();
    
    if (state.isPlaying) {
        startProgress();
    }
}

function prevSong() {
    state.currentSong = (state.currentSong - 1 + songs.length) % songs.length;
    updateMusicDisplay();
    
    if (state.isPlaying) {
        startProgress();
    }
}

function updateMusicDisplay() {
    elements.music.songTitle.textContent = songs[state.currentSong].title;
    elements.music.progressBar.style.width = '0%';
}

function updateVolume() {
    state.volume = elements.music.volumeSlider.value;
    // In a real app, you would update the audio volume here
}

// Form Handling
function handleLogin() {
    const password = elements.password.value.trim().toLowerCase();
    
    if (password === 'love') {
        navigateTo('dashboard');
        elements.password.value = '';
        
        // Show success message
        showToast('Welcome back! 🎉');
    } else {
        // Shake animation for wrong password
        elements.password.style.animation = 'none';
        setTimeout(() => {
            elements.password.style.animation = 'shake 0.5s ease';
        }, 10);
        
        elements.password.value = '';
        elements.password.focus();
        
        showToast('Try again! Hint: ❤️', 'error');
    }
}

// UI Effects
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function playTransitionSound() {
    // Create a subtle transition sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 523.25; // C5
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Event Listeners Setup
function setupEventListeners() {
    // Login
    elements.navigation.loginBtn.addEventListener('click', handleLogin);
    elements.password.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    
    // Logout
    elements.navigation.logoutBtn.addEventListener('click', () => {
        navigateTo('login');
        showToast('Logged out successfully');
    });
    
    // Back buttons
    elements.navigation.backButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.currentTarget.dataset.back;
            navigateTo(target || 'dashboard');
        });
    });
    
    // Dashboard navigation buttons
    elements.navigation.navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pageNum = e.currentTarget.dataset.page;
            navigateTo(`page${pageNum}`);
        });
    });
    
    // Page navigation buttons
    elements.navigation.pageNavButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pageNum = e.currentTarget.dataset.page;
            if (pageNum) navigateTo(`page${pageNum}`);
        });
    });
    
    // Complete button
    if (elements.navigation.completeBtn) {
        elements.navigation.completeBtn.addEventListener('click', () => {
            navigateTo('dashboard');
            showToast('You completed reading all letters! ❤️');
        });
    }
    
    // Music controls
    elements.music.playBtn.addEventListener('click', togglePlay);
    elements.music.prevBtn.addEventListener('click', prevSong);
    elements.music.nextBtn.addEventListener('click', nextSong);
    elements.music.volumeSlider.addEventListener('input', updateVolume);
    
    // Click anywhere to reveal music player
    document.addEventListener('click', function initMusicPlayer() {
        elements.music.player.style.opacity = '1';
        elements.music.player.style.transform = 'translateY(0) scale(1)';
        document.removeEventListener('click', initMusicPlayer);
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);