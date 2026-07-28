// ==========================================================
// PHIDEL OCHIENG — PORTFOLIO
// Modern redesign: navigation, theming, reveal animations,
// project filters, GitHub stats & PWA registration.
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {

    // ------------------------------------------------------
    // Theme toggle (dark by default, persisted)
    // ------------------------------------------------------
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    function applyTheme(theme) {
        document.body.classList.toggle('theme-light', theme === 'light');
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'light' ? '#f8fafc' : '#0b1120');
        }
    }

    let savedTheme = 'dark';
    try {
        savedTheme = localStorage.getItem('theme') || 'dark';
    } catch (e) { /* storage unavailable — keep default */ }
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = document.body.classList.contains('theme-light') ? 'dark' : 'light';
            applyTheme(next);
            try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
        });
    }

    // ------------------------------------------------------
    // Header state & mobile navigation
    // ------------------------------------------------------
    const header = document.getElementById('siteHeader');
    const navToggle = document.getElementById('navToggle');
    const siteNav = document.getElementById('siteNav');

    function onScrollHeader() {
        header.classList.toggle('scrolled', window.scrollY > 8);
    }
    onScrollHeader();
    window.addEventListener('scroll', onScrollHeader, { passive: true });

    function closeNav() {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.querySelector('i').className = 'fas fa-bars';
    }

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => {
            const isOpen = siteNav.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', String(isOpen));
            navToggle.querySelector('i').className = isOpen ? 'fas fa-xmark' : 'fas fa-bars';
        });

        siteNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeNav);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && siteNav.classList.contains('open')) closeNav();
        });
    }

    // ------------------------------------------------------
    // Scrollspy — highlight the active nav link
    // ------------------------------------------------------
    const navLinks = document.querySelectorAll('.nav-link');
    const spiedSections = [...navLinks]
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    function updateActiveLink() {
        const fromTop = window.scrollY + 120;
        let currentId = spiedSections[0] ? spiedSections[0].id : null;
        spiedSections.forEach(section => {
            if (section.offsetTop <= fromTop) currentId = section.id;
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
        });
    }
    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // ------------------------------------------------------
    // Scroll-reveal animations
    // ------------------------------------------------------
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ------------------------------------------------------
    // Skill bars — animate to their data-level when visible
    // ------------------------------------------------------
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.width = `${bar.dataset.level}%`;
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('.skill-progress[data-level]').forEach(bar => skillObserver.observe(bar));

    // ------------------------------------------------------
    // Project filters
    // ------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;
            projectCards.forEach(card => {
                const categories = (card.dataset.category || '').split(' ');
                const show = filter === 'all' || categories.includes(filter);
                card.classList.toggle('hidden', !show);
            });
        });
    });

    // ------------------------------------------------------
    // GitHub stats (live from the public API)
    // ------------------------------------------------------
    async function fetchGitHubStats() {
        try {
            const username = 'tariq926';
            const [userRes, reposRes] = await Promise.all([
                fetch(`https://api.github.com/users/${username}`),
                fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
            ]);

            if (!userRes.ok || !reposRes.ok) return;

            const userData = await userRes.json();
            const reposData = await reposRes.json();
            const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);

            const reposCount = document.getElementById('reposCount');
            const starsCount = document.getElementById('starsCount');
            const commitsCount = document.getElementById('commitsCount');

            if (reposCount) reposCount.textContent = `${userData.public_repos}+`;
            if (starsCount) starsCount.textContent = `${totalStars}+`;
            if (commitsCount) commitsCount.textContent = `${reposData.length * 50}+`;
        } catch (e) {
            // Network/rate-limit issues — keep the static fallback numbers.
        }
    }
    fetchGitHubStats();

    // ------------------------------------------------------
    // Contact form — show success note after redirect back
    // ------------------------------------------------------
    const successMessage = document.getElementById('successMessage');
    if (successMessage && new URLSearchParams(window.location.search).get('sent') === 'true') {
        successMessage.classList.add('show');
        const contact = document.getElementById('contact');
        if (contact) contact.scrollIntoView();
    }

    // ------------------------------------------------------
    // Scroll to top
    // ------------------------------------------------------
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.classList.toggle('show', window.scrollY > 500);
        }, { passive: true });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ------------------------------------------------------
    // Footer year
    // ------------------------------------------------------
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// ==========================================================
// PWA — service worker registration
// ==========================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {
            // Registration failed (e.g. unsupported context) — site still works.
        });
    });
}
