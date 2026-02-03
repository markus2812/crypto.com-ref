// Header scroll effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Parallax Shield Effect - scroll based opening/closing
const parallaxShield = document.getElementById('parallaxShield');
if (parallaxShield) {
    const layers = parallaxShield.querySelectorAll('.shield-layer');

    // Scroll-based animation
    window.addEventListener('scroll', () => {
        const rect = parallaxShield.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate how much of shield is visible (0 to 1)
        const visibleStart = windowHeight - rect.top;
        const visibleRange = windowHeight + rect.height;
        let progress = visibleStart / visibleRange;
        progress = Math.max(0, Math.min(1, progress));

        // Spread layers based on scroll progress - diagonal
        // Reduce spread on mobile
        const isMobile = window.innerWidth <= 768;
        const maxSpread = isMobile ? 20 : 60;

        layers.forEach((layer, i) => {
            const offset = (i - 1.5) * maxSpread * progress;
            layer.style.transform = `translate(${offset}px, ${offset * 0.7}px)`;
        });
    });
}

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close all
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        
        // Open clicked if wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile Menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.getElementById('mobileNav');

// Function to close mobile nav (called from onclick)
function closeMobileNav() {
    mobileNav.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
}

// Make it globally available
window.closeMobileNav = closeMobileNav;

mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.add('active');
    mobileMenuBtn.classList.add('active');
});

// Close mobile menu when clicking on a link
mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
});



// Escape key closes modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMobileNav();
    }
});

// Recovery Estimate Calculator
function updateRecoveryEstimate(value) {
    const estimate = document.getElementById('recoveryEstimate');
    const rateDisplay = document.getElementById('recoveryRate');
    const select = document.getElementById('amount');
    const selectedOption = select.options[select.selectedIndex];
    
    if (value && selectedOption.dataset.rate) {
        rateDisplay.textContent = selectedOption.dataset.rate + '%';
        estimate.classList.add('visible');
    } else {
        estimate.classList.remove('visible');
    }
}

// Urgency Counter - Random realistic number
function updateConsultCount() {
    const count = document.getElementById('consultCount');
    if (count) {
        const baseCount = 8 + Math.floor(Math.random() * 12); // 8-19
        count.textContent = baseCount;
    }
}
updateConsultCount();

// Lead Popup Functions
function openLeadPopup() {
    document.getElementById('leadPopup').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeLeadPopup(e) {
    if (!e || e.target.id === 'leadPopup') {
        document.getElementById('leadPopup').classList.remove('active');
        document.body.style.overflow = '';
    }
}
function submitLeadPopup(e) {
    e.preventDefault();
    const message = window.i18n ? i18n.t('alerts.thankYou') : 'Thank you! Our team will contact you shortly.';
    alert(message);
    e.target.reset();
    closeLeadPopup();
}
// Close lead popup on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('leadPopup').classList.contains('active')) {
        closeLeadPopup();
    }
});

// Increment count occasionally (fake social proof)
setInterval(() => {
    const count = document.getElementById('consultCount');
    if (count) {
        const current = parseInt(count.textContent);
        if (Math.random() > 0.7 && current < 25) {
            count.textContent = current + 1;
            count.style.transform = 'scale(1.2)';
            setTimeout(() => count.style.transform = 'scale(1)', 200);
        }
    }
}, 30000);

// Team Swiper - 3 slides visible, swipe 3 at a time
new Swiper('.team-swiper', {
    slidesPerView: 3,
    slidesPerGroup: 3,
    spaceBetween: 24,
    loop: true,
    pagination: {
        el: '.team-pagination',
        clickable: true
    },
    breakpoints: {
        320: {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 16
        },
        640: {
            slidesPerView: 2,
            slidesPerGroup: 2,
            spaceBetween: 20
        },
        1024: {
            slidesPerView: 3,
            slidesPerGroup: 3,
            spaceBetween: 24
        }
    }
});

// Cases Swiper - 1 slide visible (full width cards)
new Swiper('.cases-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    pagination: {
        el: '.cases-pagination',
        clickable: true
    }
});

// Services Swiper - Mobile only
new Swiper('.services-swiper', {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: true,
    pagination: {
        el: '.services-pagination',
        clickable: true
    }
});

// Certificates Swiper - Mobile only
new Swiper('.certificates-swiper', {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: true,
    pagination: {
        el: '.certificates-pagination',
        clickable: true
    }
});

// Partners Swiper - Mobile only
new Swiper('.partners-swiper', {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: true,
    pagination: {
        el: '.partners-pagination',
        clickable: true
    }
});
