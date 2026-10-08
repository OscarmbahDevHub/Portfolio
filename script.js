const root = document.documentElement;
const themeBtn = document.getElementById('theme-btn');
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Theme toggle */
function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeBtn.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    try { localStorage.setItem('theme', theme); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
setTheme(saved === 'light' ? 'light' : 'dark');
themeBtn.addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* Mobile menu */
function closeMenu() {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.textContent = 'Menu';
}
menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close' : 'Menu';
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

/* Scroll reveal */
const items = document.querySelectorAll(
    'section > h2, #skills h3, .about p, .tags.big, .project, form, #contact > p'
);
items.forEach(el => el.classList.add('reveal'));
document.querySelectorAll('.project').forEach((el, i) => {
    el.style.transitionDelay = (i % 2) * 0.1 + 's';
});

if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('visible'));
} else {
    const reveal = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                reveal.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    items.forEach(el => reveal.observe(el));
}

/* Highlight current section in the nav */
if ('IntersectionObserver' in window) {
    const links = navLinks.querySelectorAll('a');
    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                links.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
                });
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section').forEach(s => spy.observe(s));
}

/* Typing effect */
const words = ['React', 'Node.js', 'MongoDB', 'clean, responsive design'];
const typed = document.getElementById('typed');
if (reduceMotion) {
    typed.textContent = 'React, Node.js, and MongoDB';
} else {
    let w = 0, c = 0, deleting = false;
    function tick() {
        const word = words[w];
        typed.textContent = word.slice(0, c);
        if (!deleting && c < word.length) { c++; setTimeout(tick, 90); }
        else if (!deleting) { deleting = true; setTimeout(tick, 1400); }
        else if (c > 0) { c--; setTimeout(tick, 45); }
        else { deleting = false; w = (w + 1) % words.length; setTimeout(tick, 300); }
    }
    tick();
}