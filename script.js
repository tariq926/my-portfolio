// ==========================================================
// PHIDEL OCHIENG — PORTFOLIO
// Modern redesign: navigation, theming, reveal animations,
// project filters, GitHub stats & PWA registration.
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('theme');
    } catch (e) { /* storage unavailable */ }
    if (!savedTheme) {
        savedTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
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
    // "More" navigation dropdown
    // ------------------------------------------------------
    const navDropdownBtn = document.getElementById('navDropdownBtn');
    const navDropdownMenu = document.getElementById('navDropdownMenu');

    function closeNavDropdown() {
        if (!navDropdownBtn || !navDropdownMenu) return;
        navDropdownBtn.setAttribute('aria-expanded', 'false');
        navDropdownMenu.classList.remove('open');
    }

    if (navDropdownBtn && navDropdownMenu) {
        navDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navDropdownMenu.classList.toggle('open');
            navDropdownBtn.setAttribute('aria-expanded', String(isOpen));
        });

        navDropdownMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeNavDropdown();
                closeNav();
            });
        });

        document.addEventListener('click', closeNavDropdown);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeNavDropdown();
        });
    }

    // ------------------------------------------------------
    // Eased anchor scrolling
    // Takes over from CSS smooth scrolling for a longer,
    // softer glide between sections.
    // ------------------------------------------------------
    if (!prefersReducedMotion) {
        document.documentElement.classList.add('js-smooth');

        const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

        function scrollToY(targetY, duration = 750) {
            const startY = window.scrollY;
            const distance = targetY - startY;
            if (Math.abs(distance) < 2) return;
            const startTime = performance.now();

            function step(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                window.scrollTo(0, startY + distance * easeInOutCubic(progress));
                if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const hash = anchor.getAttribute('href');
                if (hash === '#' || hash.length < 2) return;
                const target = document.querySelector(hash);
                if (!target) return;

                e.preventDefault();
                const headerOffset = header ? header.offsetHeight + 16 : 0;
                const targetY = target.getBoundingClientRect().top + window.scrollY - headerOffset;
                scrollToY(Math.max(targetY, 0));
                history.replaceState(null, '', hash);
            });
        });

        window.portfolioScrollTo = scrollToY;
    }

    // ------------------------------------------------------
    // Reading progress bar
    // ------------------------------------------------------
    const progressBar = document.getElementById('scrollProgress');

    function updateProgressBar() {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progressBar.style.width = `${Math.min(percent, 100)}%`;
    }

    if (progressBar) {
        updateProgressBar();
        window.addEventListener('scroll', updateProgressBar, { passive: true });
        window.addEventListener('resize', updateProgressBar);
    }

    // ------------------------------------------------------
    // Scrollspy — highlight the active nav link
    // ------------------------------------------------------
    const navLinks = document.querySelectorAll('a.nav-link[href^="#"]');
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
    // Count-up animation for the hero stats
    // ------------------------------------------------------
    function countUp(el, target, suffix, duration = 1500) {
        if (prefersReducedMotion) {
            el.textContent = `${target}${suffix}`;
            return;
        }
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = `${Math.round(target * eased)}${suffix}`;
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                countUp(el, Number(el.dataset.count), el.dataset.suffix || '');
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-value[data-count]').forEach(el => counterObserver.observe(el));

    // ------------------------------------------------------
    // Timeline progress line — fills as the section scrolls by
    // ------------------------------------------------------
    const timelineProgress = document.getElementById('timelineProgress');
    const timelineContainer = document.querySelector('.timeline-container');

    function updateTimelineProgress() {
        const rect = timelineContainer.getBoundingClientRect();
        const midpoint = window.innerHeight * 0.62;
        const filled = Math.min(Math.max(midpoint - rect.top, 0), rect.height);
        timelineProgress.style.height = `${filled}px`;
    }

    if (timelineProgress && timelineContainer) {
        updateTimelineProgress();
        window.addEventListener('scroll', updateTimelineProgress, { passive: true });
        window.addEventListener('resize', updateTimelineProgress);
    }

    // ------------------------------------------------------
    // Pointer-following spotlight on cards
    // ------------------------------------------------------
    const spotlightCards = document.querySelectorAll(
        '.experience-card, .cert-card, .service-card, .project-card, .blog-card, ' +
        '.testimonial-card, .profile-card, .skills-card, .stat-card, .contact-item'
    );

    spotlightCards.forEach(card => {
        card.classList.add('spotlight');

        card.addEventListener('pointermove', (e) => {
            if (e.pointerType === 'touch') return;
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            card.style.setProperty('--my', `${e.clientY - rect.top}px`);
        });
    });

    // ------------------------------------------------------
    // Pause decorative animations while they are off-screen
    // ------------------------------------------------------
    const loopingElements = [
        document.querySelector('.hero-glow'),
        document.querySelector('.marquee-track')
    ].filter(Boolean);

    if (loopingElements.length) {
        const pauseObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('paused', !entry.isIntersecting);
            });
        }, { threshold: 0 });

        loopingElements.forEach(el => pauseObserver.observe(el));
    }

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

            const totalForks = reposData.reduce((acc, repo) => acc + repo.forks_count, 0);

            const reposCount = document.getElementById('reposCount');
            const starsCount = document.getElementById('starsCount');
            const forksCount = document.getElementById('forksCount');

            if (reposCount) countUp(reposCount, userData.public_repos, '+');
            if (starsCount) countUp(starsCount, totalStars, '+');
            if (forksCount) countUp(forksCount, totalForks, '+');
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
            if (window.portfolioScrollTo) {
                window.portfolioScrollTo(0, 850);
            } else {
                window.scrollTo({ top: 0 });
            }
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
