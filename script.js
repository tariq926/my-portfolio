// Phidel Ochieng portfolio

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const header = document.getElementById('siteHeader');
    const navToggle = document.getElementById('navToggle');
    const siteNav = document.getElementById('siteNav');
    const themeToggle = document.getElementById('themeToggle');

    function applyTheme(theme) {
        document.body.classList.toggle('theme-dark', theme === 'dark');
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'dark' ? '#1A1917' : '#E7E5E1');
        }
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? 'Light' : 'Theme';
        }
    }

    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('theme');
    } catch (e) { /* storage unavailable */ }

    if (!savedTheme) {
        savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(savedTheme === 'dark' ? 'dark' : 'light');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
            applyTheme(next);
            try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
        });
    }

    function onScrollHeader() {
        if (!header) return;
        header.classList.toggle('is-scrolled', window.scrollY > 6);
    }
    onScrollHeader();
    window.addEventListener('scroll', onScrollHeader, { passive: true });

    function closeNav() {
        if (!siteNav || !navToggle) return;
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = 'Menu';
    }

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', () => {
            const open = siteNav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', String(open));
            navToggle.textContent = open ? 'Close' : 'Menu';
        });

        siteNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeNav);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeNav();
        });
    }

    // Scrollspy
    const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
    const sections = navLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    function updateActiveLink() {
        const fromTop = window.scrollY + 110;
        let currentId = null;
        sections.forEach((section) => {
            if (section.offsetTop <= fromTop) currentId = section.id;
        });
        navLinks.forEach((link) => {
            const match = link.getAttribute('href') === `#${currentId}`;
            if (match) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
        });
    }
    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    // Soft reveal for presence (disabled when reduced motion)
    if (!prefersReducedMotion) {
        const revealEls = document.querySelectorAll(
            '.feature, .project-row, .timeline-list > li, .section-intro, .contact-form-wrap, .facts, .skill-columns'
        );
        revealEls.forEach((el) => el.classList.add('reveal'));

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

        revealEls.forEach((el) => revealObserver.observe(el));
    }

    // Project filters
    const filterButtons = document.querySelectorAll('.filter');
    const projectRows = document.querySelectorAll('.project-row');

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            filterButtons.forEach((btn) => btn.classList.remove('is-active'));
            button.classList.add('is-active');
            const filter = button.dataset.filter;
            projectRows.forEach((row) => {
                const categories = (row.dataset.category || '').split(/\s+/);
                const show = filter === 'all' || categories.includes(filter);
                row.classList.toggle('is-hidden', !show);
            });
        });
    });

    // XSS-safe helpers for GitHub API content
    function sanitizeUrl(url) {
        try {
            const parsed = new URL(url, window.location.origin);
            if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
                return parsed.href;
            }
        } catch (e) { /* invalid */ }
        return '#';
    }

    const PROFESSIONAL_REPOS = [
        'my-portfolio',
        'smart-life-manager',
        'tariq_store',
        'harrietteadhiambo',
        'online_store'
    ];

    function renderPinnedRepos(repos) {
        const container = document.getElementById('pinnedRepos');
        if (!container) return;

        const curated = PROFESSIONAL_REPOS
            .map((name) => repos.find((r) => r.name === name))
            .filter(Boolean);

        if (!curated.length) {
            container.innerHTML = '<p class="repo-empty">No repositories to display yet.</p>';
            return;
        }

        container.replaceChildren();
        curated.forEach((repo) => {
            const link = document.createElement('a');
            link.className = 'repo-card';
            link.href = sanitizeUrl(repo.html_url);
            link.target = '_blank';
            link.rel = 'noopener noreferrer';

            const title = document.createElement('h3');
            title.textContent = repo.name || 'Repository';

            const desc = document.createElement('p');
            desc.textContent = repo.description || 'Professional web development project.';

            const meta = document.createElement('p');
            meta.className = 'repo-meta';
            meta.textContent = `${repo.language || 'Code'} · ${repo.stargazers_count || 0} stars`;

            link.append(title, desc, meta);
            container.append(link);
        });
    }

    function setStat(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value);
    }

    async function fetchGitHubStats() {
        const container = document.getElementById('pinnedRepos');
        try {
            const username = 'tariq926';
            const [userRes, reposRes] = await Promise.all([
                fetch(`https://api.github.com/users/${username}`),
                fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
            ]);

            if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API unavailable');

            const userData = await userRes.json();
            const reposData = await reposRes.json();
            if (!Array.isArray(reposData)) throw new Error('Unexpected repos payload');

            const totalStars = reposData.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
            const totalForks = reposData.reduce((acc, repo) => acc + (repo.forks_count || 0), 0);

            setStat('reposCount', userData.public_repos ?? '-');
            setStat('starsCount', totalStars);
            setStat('forksCount', totalForks);
            renderPinnedRepos(reposData);
        } catch (e) {
            setStat('reposCount', '-');
            setStat('starsCount', '-');
            setStat('forksCount', '-');
            if (container) {
                container.innerHTML = '<p class="repo-empty">Unable to load repositories. <a href="https://github.com/tariq926" target="_blank" rel="noopener noreferrer">View on GitHub</a>.</p>';
            }
        }
    }

    fetchGitHubStats();

    // Contact form UX
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            const fields = [name, email, subject, message];
            const invalid = fields.some((field) => !field || !String(field.value).trim());

            if (invalid) {
                e.preventDefault();
                if (errorMessage) {
                    errorMessage.hidden = false;
                    errorMessage.textContent = 'Please fill in all fields before sending.';
                }
                return;
            }

            submitBtn.disabled = true;
            const label = submitBtn.querySelector('.btn-label');
            if (label) label.textContent = 'Sending...';
            if (errorMessage) errorMessage.hidden = true;
        });
    }

    if (successMessage && new URLSearchParams(window.location.search).get('sent') === 'true') {
        successMessage.hidden = false;
        const contact = document.getElementById('contact');
        if (contact) contact.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        history.replaceState(null, '', `${window.location.pathname}#contact`);
    }

    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    });
}
