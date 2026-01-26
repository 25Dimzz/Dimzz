// DOM Elements
const navLinks = document.getElementById('navLinks');
const mobileToggle = document.getElementById('mobileToggle');
const navLinksAll = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const contactForm = document.getElementById('contactForm');

// Toggle mobile menu
mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Smooth navigation between pages
navLinksAll.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get the target page
        const targetPage = link.getAttribute('data-page');
        
        // Close mobile menu if open
        navLinks.classList.remove('active');
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Update active nav link
        navLinksAll.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
        
        // Show target page with animation
        pages.forEach(page => {
            if (page.id === `${targetPage}-page`) {
                page.classList.add('active');
                page.style.animation = 'none';
                setTimeout(() => {
                    page.style.animation = 'pageFadeIn 0.6s forwards';
                }, 10);
            } else {
                page.classList.remove('active');
            }
        });
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Contact form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // In a real application, you would send this data to a server
    console.log('Form submitted:', { name, email, message });
    
    // Show success message
    alert('Thank you for your message! I will get back to you soon.');
    
    // Reset form
    contactForm.reset();
});

// Page load animation
window.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add subtle background animation
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    document.body.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
});

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(10, 10, 15, 0.95)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.backgroundColor = 'rgba(10, 10, 15, 0.8)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});