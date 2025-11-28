/* ===== Theme Toggle with persistence ===== */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function applyTheme(t) {
    if (t === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    } else {
        body.classList.remove('dark-mode');
        themeToggle.textContent = '🌙';
    }
}

// init
const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(saved);

themeToggle.addEventListener('click', () => {
    const mode = body.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(mode);
    localStorage.setItem('theme', mode);
});

/* ===== Header background on scroll ===== */
const header = document.getElementById('site-header');
function checkHeaderScroll() {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
}
window.addEventListener('scroll', checkHeaderScroll);
checkHeaderScroll();

/* ===== Typewriter (simple, friendly) ===== */
const typingElement = document.getElementById('typing');
const textToType = ["Hello.", "I'm Hassan", "Software Developer"];
let line = 0, char = 0;

function typeLoop() {
    if (!typingElement) return;
    if (line >= textToType.length) return; // stop after lines
    const current = textToType[line];
    if (char < current.length) {
        typingElement.textContent += current.charAt(char);
        char++;
        setTimeout(typeLoop, 90);
    } else {
        // pause then clear and type next line into same element (or append)
        char = 0;
        line++;
        if (line < textToType.length) {
            // small pause then replace content
            setTimeout(() => { typingElement.textContent = ''; typeLoop(); }, 500);
        }
    }
}
typeLoop();

/* ===== Reveal on scroll + Counters using IntersectionObserver ===== */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            obs.unobserve(entry.target);

            // if this reveal contains counters (inside .about), animate them
            if (entry.target.closest('.about') || entry.target.classList.contains('about')) {
                animateCounters();
            }
            // if skill progress, animate widths
            const progresses = entry.target.querySelectorAll ? entry.target.querySelectorAll('.progress span') : [];
            progresses.forEach(s => {
                const p = s.style.getPropertyValue('--percent') || s.getAttribute('data-percent') || null;
                if (p) s.style.width = p;
            });
        }
    });
}, { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ===== Counters ===== */
let countersAnimated = false;
function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    const counters = document.querySelectorAll('.count');
    counters.forEach(el => {
        const txt = el.textContent.trim();
        const target = parseInt(txt.replace(/\D/g, '')) || 0;
        const suffix = txt.replace(/[0-9]/g, '');
        let current = 0;
        const duration = 1200; // ms
        const stepTime = Math.max(Math.floor(duration / Math.max(target, 1)), 8);
        const inc = Math.ceil(target / (duration / stepTime));
        const timer = setInterval(() => {
            current += inc;
            if (current >= target) {
                el.textContent = target + suffix;
                clearInterval(timer);
            } else {
                el.textContent = current + suffix;
            }
        }, stepTime);
    });
}

/* ===== Simple tilt effect for profile image ===== */
const heroImage = document.getElementById('hero-image');
if (heroImage) {
    heroImage.addEventListener('mousemove', (e) => {
        const rect = heroImage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const tilt = heroImage.querySelector('.profile-tilt');
        if (tilt) tilt.style.transform = `rotateX(${-y * 6}deg) rotateY(${x * 8}deg) translateZ(6px)`;
    });
    heroImage.addEventListener('mouseleave', () => {
        const tilt = heroImage.querySelector('.profile-tilt');
        if (tilt) tilt.style.transform = '';
    });
}

/* ===== Set current year in footer ===== */
document.getElementById('year').textContent = new Date().getFullYear();
