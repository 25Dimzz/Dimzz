// Theme Toggle
const themeBtn = document.getElementById('themeBtn');
const themeIcon = themeBtn.querySelector('i');
const html = document.documentElement;

// Check for saved theme or prefer-color-scheme
const savedTheme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeBtn.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    
    if (navLinks.style.display === 'flex') {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.backgroundColor = 'var(--bg-primary)';
        navLinks.style.padding = '20px';
        navLinks.style.borderTop = '1px solid var(--border-color)';
        navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        navLinks.style.gap = '15px';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.style.display = 'none';
    }
});

// Projects Slider
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dots .dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentSlide = 0;
const totalSlides = slides.length;

// Update slider position
function updateSlider() {
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Next slide
nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
});

// Previous slide
prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
});

// Dot click navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
    });
});

// Auto slide every 5 seconds
setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}, 5000);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Close mobile menu if open
            navLinks.style.display = 'none';
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission
const contactForm = document.querySelector('.contact-form');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // In a real application, you would send this data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    alert('Thank you for your message! I\'ll get back to you soon.');
    
    // Reset form
    this.reset();
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
});