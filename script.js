// ==========================================
// PHIDEL'S PORTFOLIO - ENHANCED TERMINAL
// ==========================================

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // BOOT SEQUENCE
    // ==========================================
    const bootLoader = document.getElementById('bootLoader');

    setTimeout(() => {
        bootLoader.style.display = 'none';
    }, 4500);

    // ==========================================
    // VISITOR COUNTER & LAST UPDATE
    // ==========================================
    function updateVisitorCount() {
        const visitorCount = document.getElementById('visitorCount');
        const lastUpdate = document.getElementById('lastUpdate');

        // Get or set visitor count from localStorage
        let count = localStorage.getItem('visitorCount') || 42;
        count = parseInt(count) + 1;
        localStorage.setItem('visitorCount', count);

        // Format count with leading zeros
        if (visitorCount) {
            visitorCount.textContent = String(count).padStart(5, '0');
        }

        // Update last visit time
        const now = new Date();
        const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
        if (lastUpdate) {
            lastUpdate.textContent = dateStr;
        }
    }

    updateVisitorCount();

    // ==========================================
    // MATRIX RAIN EFFECT
    // ==========================================
    const matrixCanvas = document.getElementById('matrixCanvas');
    const matrixToggle = document.getElementById('matrixToggle');
    let matrixActive = false;
    let matrixAnimation = null;

    function initMatrix() {
        const ctx = matrixCanvas.getContext('2d');
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const fontSize = 14;
        const columns = matrixCanvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function draw() {
            ctx.fillStyle = 'rgba(13, 2, 8, 0.05)';
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            ctx.fillStyle = '#00FF41';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            matrixAnimation = requestAnimationFrame(draw);
        }

        draw();
    }

    if (matrixToggle) {
        matrixToggle.addEventListener('click', function() {
            matrixActive = !matrixActive;

            if (matrixActive) {
                matrixCanvas.style.display = 'block';
                initMatrix();
                this.style.background = 'var(--terminal-text)';
                this.style.color = 'var(--terminal-bg)';
            } else {
                matrixCanvas.style.display = 'none';
                if (matrixAnimation) {
                    cancelAnimationFrame(matrixAnimation);
                }
                this.style.background = 'var(--terminal-bg)';
                this.style.color = 'var(--terminal-text)';
            }
        });
    }

    // Resize matrix canvas on window resize
    window.addEventListener('resize', function() {
        if (matrixActive && matrixCanvas) {
            matrixCanvas.width = window.innerWidth;
            matrixCanvas.height = window.innerHeight;
        }
    });

    // ==========================================
    // THEME SWITCHER
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    const themes = ['theme-green', 'theme-amber', 'theme-blue', 'theme-red', 'theme-purple'];
    let currentTheme = 0;

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            // Remove current theme
            document.body.classList.remove(...themes);

            // Cycle to next theme
            currentTheme = (currentTheme + 1) % themes.length;

            if (currentTheme > 0) {
                document.body.classList.add(themes[currentTheme]);
            }

            // Save theme preference
            localStorage.setItem('portfolioTheme', currentTheme);
        });
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('portfolioTheme');
    if (savedTheme) {
        currentTheme = parseInt(savedTheme);
        if (currentTheme > 0) {
            document.body.classList.add(themes[currentTheme]);
        }
    }

    // ==========================================
    // INTERACTIVE CLI TERMINAL
    // ==========================================
    const cliToggle = document.getElementById('cliToggle');
    const terminalCLI = document.getElementById('terminalCLI');
    const closeCLI = document.getElementById('closeCLI');
    const cliInput = document.getElementById('cliInput');
    const cliOutput = document.getElementById('cliOutput');

    const commands = {
        help: {
            desc: 'Show available commands',
            action: () => `
Available Commands:
------------------
help      - Show this help message
about     - Display information about me
skills    - List my technical skills
projects  - Show my projects
contact   - Display contact information
education - Show education and certifications
clear     - Clear the terminal
date      - Display current date and time
github    - Open GitHub profile
linkedin  - Open LinkedIn profile
matrix    - Toggle Matrix rain effect
theme     - Change color theme
ascii     - Display ASCII art
quote     - Random programming quote`
        },
        about: {
            desc: 'About Phidel',
            action: () => `
About Phidel Emmanuel Ochieng
==============================
Frontend Developer & Cybersecurity Enthusiast

I'm a passionate developer studying at the University of Embu,
specializing in building secure, beautiful web experiences.
I combine clean code principles with user-focused design to
create impactful digital solutions.

Status: Currently learning Cybersecurity through Cisco Networking Academy`
        },
        skills: {
            desc: 'Technical skills',
            action: () => `
Technical Skills
================
HTML/CSS        [████████████████████] 95%
JavaScript      [█████████████████░░░] 85%
PHP & MySQL     [████████████████░░░░] 80%
UI/UX Design    [██████████████████░░] 90%
Git & Linux     [███████████████░░░░░] 75%
Cybersecurity   [██████████████░░░░░░] 70%`
        },
        projects: {
            desc: 'My projects',
            action: () => `
My Projects
===========
1. Online Store
   - E-commerce platform for fashion items
   - Tech: HTML/CSS, PHP, JavaScript
   - GitHub: github.com/tariq926/tariq_store

2. Harriette Adhiambo Portfolio
   - Interactive portfolio website
   - Tech: HTML/CSS, JavaScript
   - Live: tariq345-svg.github.io/harrietteadhiambo

Type 'github' to visit my GitHub profile for more projects!`
        },
        contact: {
            desc: 'Contact information',
            action: () => `
Contact Information
===================
Email:    ochiengphidel1@gmail.com
Phone:    0711524148
Location: Embu, Kenya

GitHub:   github.com/tariq926
LinkedIn: linkedin.com/in/phidel-ochieng-832593393`
        },
        education: {
            desc: 'Education & Certifications',
            action: () => `
Education & Certifications
==========================
🎓 University of Embu
   Diploma in ICT (2023 - Present)

📜 PowerLearn Project Africa
   Software Development (Aug-Dec 2024)
   16-week intensive program

🔒 Cisco Networking Academy
   Cybersecurity (Nov 2025 - Present)`
        },
        clear: {
            desc: 'Clear terminal',
            action: () => {
                cliOutput.innerHTML = '<p>Terminal cleared.</p><p></p>';
                return '';
            }
        },
        date: {
            desc: 'Current date/time',
            action: () => new Date().toString()
        },
        github: {
            desc: 'Open GitHub',
            action: () => {
                window.open('https://github.com/tariq926', '_blank');
                return 'Opening GitHub profile...';
            }
        },
        linkedin: {
            desc: 'Open LinkedIn',
            action: () => {
                window.open('https://www.linkedin.com/in/phidel-ochieng-832593393', '_blank');
                return 'Opening LinkedIn profile...';
            }
        },
        matrix: {
            desc: 'Toggle Matrix effect',
            action: () => {
                matrixToggle.click();
                return matrixActive ? 'Matrix rain activated' : 'Matrix rain deactivated';
            }
        },
        theme: {
            desc: 'Change theme',
            action: () => {
                themeToggle.click();
                return 'Theme changed! Try typing "theme" again for a different color.';
            }
        },
        ascii: {
            desc: 'Show ASCII art',
            action: () => `
  ___  _    _     _      _
 | _ \\| |_ (_)__| |___ | |
 |  _/| ' \\| / _\` / -_)| |
 |_|  |_||_|_\\__,_\\___||_|

 Frontend Developer & Cybersecurity Enthusiast`
        },
        quote: {
            desc: 'Random quote',
            action: () => {
                const quotes = [
                    '"First, solve the problem. Then, write the code." - John Johnson',
                    '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
                    '"Make it work, make it right, make it fast." - Kent Beck',
                    '"Clean code always looks like it was written by someone who cares." - Robert C. Martin',
                    '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler'
                ];
                return quotes[Math.floor(Math.random() * quotes.length)];
            }
        }
    };

    function showCLI() {
        terminalCLI.style.display = 'flex';
        cliInput.focus();
    }

    function hideCLI() {
        terminalCLI.style.display = 'none';
    }

    if (cliToggle) {
        cliToggle.addEventListener('click', showCLI);
    }

    if (closeCLI) {
        closeCLI.addEventListener('click', hideCLI);
    }

    // Handle CLI input
    if (cliInput) {
        cliInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const input = this.value.trim().toLowerCase();
                const output = document.createElement('p');
                output.innerHTML = `<span style="opacity:0.7;">phidel@portfolio:~$</span> ${this.value}`;
                cliOutput.appendChild(output);

                if (input in commands) {
                    const result = commands[input].action();
                    if (result) {
                        const response = document.createElement('p');
                        response.innerHTML = result.replace(/\n/g, '<br>');
                        cliOutput.appendChild(response);
                    }
                } else if (input) {
                    const error = document.createElement('p');
                    error.innerHTML = `Command not found: ${input}<br>Type 'help' for available commands.`;
                    cliOutput.appendChild(error);
                }

                const spacer = document.createElement('p');
                cliOutput.appendChild(spacer);

                this.value = '';
                cliOutput.scrollTop = cliOutput.scrollHeight;
            }
        });
    }

    // Keyboard shortcut: Ctrl + ~ to open terminal
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === '`') {
            e.preventDefault();
            if (terminalCLI.style.display === 'none' || terminalCLI.style.display === '') {
                showCLI();
            } else {
                hideCLI();
            }
        }
        // ESC to close terminal
        if (e.key === 'Escape' && terminalCLI.style.display === 'flex') {
            hideCLI();
        }
    });

    // ==========================================
    // MOBILE MENU TOGGLE
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        const navItems = document.querySelectorAll('.nav-links li a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            });
        });
    }

    // ==========================================
    // SMOOTH SCROLLING
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // SCROLL TO TOP BUTTON
    // ==========================================
    const scrollToTopBtn = document.getElementById('scrollToTop');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // ACTIVE NAV LINK ON SCROLL
    // ==========================================
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // SCROLL REVEAL ANIMATIONS
    // ==========================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.timeline-item, .project-card, .about-text, .skills, .cert-card, .system-info-grid');

    animatedElements.forEach((element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // ==========================================
    // FORM SUBMISSION SUCCESS
    // ==========================================
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            setTimeout(function() {
                const successMessage = document.querySelector('.success-message');
                if (successMessage) {
                    successMessage.style.display = 'block';
                    setTimeout(() => {
                        successMessage.style.display = 'none';
                    }, 5000);
                }
            }, 1000);
        });
    }

    // ==========================================
    // GLITCH EFFECT ON SECTION HEADERS
    // ==========================================
    const sectionHeaders = document.querySelectorAll('.section-header h2');
    sectionHeaders.forEach(header => {
        header.classList.add('glitch');
    });

    // ==========================================
    // CONSOLE WELCOME MESSAGE
    // ==========================================
    console.log('%c Welcome to Phidel\'s Portfolio Terminal! ', 'background: #0D0208; color: #00FF41; font-size: 20px; font-family: monospace; padding: 15px; border: 2px solid #00FF41;');
    console.log('%c phidel@portfolio:~$ ', 'color: #00FF41; font-family: monospace; font-size: 14px;', 'Press Ctrl + ~ to open the interactive terminal');
    console.log('%c Available commands: help, about, skills, projects, contact, github, linkedin ', 'color: #00FF41; font-family: monospace; font-size: 12px; font-style: italic;');

    // ==========================================
    // SKILL BARS ANIMATION ON SCROLL
    // ==========================================
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fillBar 2s ease forwards';
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // ==========================================
    // LAZY LOAD IMAGES
    // ==========================================
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

});

// ==========================================
// MOBILE & PWA ENHANCEMENTS
// ==========================================

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('[PWA] Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('[PWA] Service Worker registration failed:', error);
            });
    });
}

// PWA Install Prompt
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
        installBtn.style.display = 'flex';
    }
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log('[PWA] User response: ' + outcome);
            deferredPrompt = null;
            installBtn.style.display = 'none';
        }
    });
}

// Share Functionality
const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Phidel Emmanuel Ochieng - Portfolio',
                    text: 'Check out this amazing terminal-themed developer portfolio!',
                    url: window.location.href
                });
                console.log('[Share] Successfully shared');
            } catch (error) {
                console.log('[Share] Error:', error);
                fallbackShare();
            }
        } else {
            fallbackShare();
        }
    });
}

function fallbackShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('Portfolio link copied to clipboard!');
    });
}

// Project Filters
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        projectCards.forEach(card => {
            const categories = card.dataset.category;
            if (filter === 'all' || categories.includes(filter)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Mobile Bottom Navigation
const mobileNavItems = document.querySelectorAll('.mobile-nav-item[data-section]');

window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    mobileNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === current) {
            item.classList.add('active');
        }
    });
});

// Touch Gestures
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
        if (diff < 0) {
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) themeToggle.click();
        }
    }
}

// Console API
window.portfolio = {
    theme: (color) => {
        const themes = {
            green: '',
            amber: 'theme-amber',
            blue: 'theme-blue',
            red: 'theme-red',
            purple: 'theme-purple'
        };
        document.body.className = themes[color] || '';
        console.log('[Theme] Changed to ' + color);
    },
    matrix: () => {
        document.getElementById('matrixToggle').click();
    },
    stats: () => {
        console.table({
            visitors: localStorage.getItem('visitorCount') || 42,
            theme: localStorage.getItem('portfolioTheme') || 0
        });
    }
};

console.log('[Portfolio] Type portfolio.stats() for info');

// ==========================================
// END OF SCRIPT
// ==========================================
