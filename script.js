// ==========================================
// PHIDEL'S PORTFOLIO - ENHANCED TERMINAL
// ==========================================

document.addEventListener('DOMContentLoaded', function() {

    const bootLoader = document.getElementById('bootLoader');
    const bootLoaderDuration = 4500;

    // ==========================================
    // TYPEWRITER EFFECT
    // ==========================================
    function typewriter(element, text, callback) {
        let i = 0;
        const speed = 50; // typing speed in ms
        element.innerHTML = ''; // Clear existing content

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                if (callback) callback();
            }
        }
        type();
    }

    function startTypewriter() {
        const heroH1 = document.querySelector('.hero-text h1');
        const heroH2 = document.querySelector('.hero-text h2');
        const h1Text = 'Phidel Emmanuel Ochieng';
        const h2Text = 'Frontend Developer & Cybersecurity Enthusiast';

        heroH1.innerHTML = '';
        heroH2.innerHTML = '';
        heroH1.style.opacity = '1';
        heroH2.style.opacity = '1';

        typewriter(heroH1, h1Text, () => {
            heroH1.innerHTML += '<span class="cursor-blink">_</span>';
            setTimeout(() => {
                heroH1.querySelector('.cursor-blink').remove();
                typewriter(heroH2, h2Text, () => {
                    heroH2.innerHTML += '<span class="cursor-blink">_</span>';
                });
            }, 500);
        });
    }

    // ==========================================
    // BOOT SEQUENCE
    // ==========================================
    setTimeout(() => {
        bootLoader.style.display = 'none';
        startTypewriter();
    }, bootLoaderDuration);

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
    // REAL GITHUB API INTEGRATION
    // ==========================================
    async function fetchGitHubStats() {
        try {
            const username = 'tariq926';
            const response = await fetch(`https://api.github.com/users/${username}`);
            const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);

            if (response.ok && reposResponse.ok) {
                const userData = await response.json();
                const reposData = await reposResponse.json();

                // Calculate total stars
                const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);

                // Update the stats in the DOM
                const reposCount = document.getElementById('reposCount');
                const starsCount = document.getElementById('starsCount');
                const commitsCount = document.getElementById('commitsCount');

                if (reposCount) {
                    reposCount.textContent = userData.public_repos + '+';
                }
                if (starsCount) {
                    starsCount.textContent = totalStars + '+';
                }

                // For commits, we'll estimate based on repos (actual commit count requires more API calls)
                if (commitsCount) {
                    const estimatedCommits = reposData.length * 50; // Rough estimate
                    commitsCount.textContent = estimatedCommits + '+';
                }

                console.log('[GitHub] Stats updated successfully');
            }
        } catch (error) {
            console.log('[GitHub] Using default stats (API unavailable):', error);
        }
    }

    // Fetch GitHub stats on load
    fetchGitHubStats();

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

        const color = getComputedStyle(document.body).getPropertyValue('--terminal-text');

        function draw() {
            ctx.fillStyle = 'rgba(13, 2, 8, 0.05)';
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            ctx.fillStyle = color;
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

    const commandHistory = [];
    let historyIndex = -1;

    const commands = {
        help: {
            desc: 'Show available commands',
            action: () => `
Available Commands:
------------------
help        - Show this help message
about       - Display information about me
whoami      - Who is Phidel?
skills      - List my technical skills
projects    - Show my projects
contact     - Display contact information
education   - Show education and certifications
experience  - View work experience
achievements- View achievements & milestones
resume      - Download my resume
blog        - View blog posts
services    - View services offered
game        - Play a number guessing game
guess <num> - Guess a number (use with game)
fun-fact    - Random fun facts about me
clear       - Clear the terminal
date        - Display current date and time
github      - Open GitHub profile
linkedin    - Open LinkedIn profile
matrix      - Toggle Matrix rain effect
theme       - Change color theme
ascii       - Display ASCII art
quote       - Random programming quote`
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
        },
        resume: {
            desc: 'Download resume',
            action: () => {
                const link = document.createElement('a');
                link.href = 'Phidel CV.docx';
                link.download = 'Phidel_Emmanuel_Ochieng_CV.docx';
                link.click();
                return 'Downloading resume... Check your downloads folder!';
            }
        },
        achievements: {
            desc: 'View achievements',
            action: () => `
🏆 Achievements & Milestones
============================
✅ Completed 16-week Software Development Program (PowerLearn Africa)
✅ Built 15+ repositories on GitHub
✅ Certified in Critical Infrastructure Protection (OPSWAT)
✅ Currently pursuing Cybersecurity certification (Cisco)
✅ Created terminal-themed interactive portfolio
✅ Mastered responsive web design & PWA development
✅ Active contributor to open-source projects

🎯 Current Goals:
→ Master React.js and Node.js
→ Complete Cisco Cybersecurity certification
→ Build 5 full-stack projects
→ Contribute to major open-source projects`
        },
        'fun-fact': {
            desc: 'Random fun fact',
            action: () => {
                const facts = [
                    '🎮 I debug better with music on - usually lo-fi beats!',
                    '☕ My code-to-coffee ratio is approximately 100 lines per cup',
                    '🌙 I\'m most productive coding between 10 PM and 2 AM',
                    '🐛 My first bug took me 3 hours to fix... it was a missing semicolon',
                    '📚 I learned to code by building a website for my school project',
                    '🎯 I can solve a Rubik\'s cube while thinking about code architecture',
                    '💚 Green is my favorite color - that\'s why this portfolio is green!',
                    '🔐 I\'m passionate about cybersecurity because I love solving puzzles'
                ];
                return facts[Math.floor(Math.random() * facts.length)];
            }
        },
        game: {
            desc: 'Play a mini game',
            action: () => {
                return `
🎮 GUESS THE NUMBER GAME
========================
I'm thinking of a number between 1 and 100.
Type: guess <number>

Example: guess 50

Good luck! 🍀`;
            }
        },
        guess: {
            desc: 'Guess a number (1-100)',
            action: (input) => {
                if (!window.secretNumber) {
                    window.secretNumber = Math.floor(Math.random() * 100) + 1;
                    window.guessCount = 0;
                }

                const userInput = input.split(' ')[1];
                const guess = parseInt(userInput);

                if (!guess || guess < 1 || guess > 100) {
                    return 'Please enter a valid number between 1 and 100. Example: guess 50';
                }

                window.guessCount++;

                if (guess === window.secretNumber) {
                    const result = `
🎉 CONGRATULATIONS! 🎉
You guessed it right! The number was ${window.secretNumber}
It took you ${window.guessCount} attempts.

Type 'game' to play again!`;
                    delete window.secretNumber;
                    delete window.guessCount;
                    return result;
                } else if (guess < window.secretNumber) {
                    return `📈 Too low! Try a higher number. (Attempt ${window.guessCount})`;
                } else {
                    return `📉 Too high! Try a lower number. (Attempt ${window.guessCount})`;
                }
            }
        },
        whoami: {
            desc: 'Who is Phidel?',
            action: () => `
phidel@portfolio:~$ whoami
================================
I'm Phidel Emmanuel Ochieng, a 21-year-old developer from Embu, Kenya.
I started coding in 2023 and fell in love with creating web experiences.

My journey: Student → Self-taught Developer → Cybersecurity Enthusiast

What drives me? The thrill of solving complex problems and building
things that make people's lives easier. Every line of code is a step
toward mastering my craft.

Fun fact: I built this entire portfolio from scratch with vanilla JS! 💚`
        },
        blog: {
            desc: 'View blog posts',
            action: () => {
                window.location.hash = '#blog';
                return 'Navigating to blog section...';
            }
        },
        services: {
            desc: 'View services offered',
            action: () => {
                window.location.hash = '#services';
                return 'Navigating to services section...';
            }
        },
        experience: {
            desc: 'View work experience',
            action: () => `
💼 Work Experience
==================
🔧 Freelance Web Developer (2024 - Present)
   → Built custom websites for local businesses
   → Specialized in responsive design & PWAs
   → Technologies: HTML, CSS, JavaScript, PHP

🎓 Student Developer at University of Embu (2023 - Present)
   → Pursuing Diploma in ICT
   → Lead developer for student projects
   → Mentor for junior students

📚 Software Development Intern - PowerLearn Project (2024)
   → 16-week intensive program
   → Built 10+ projects
   → Specialized in Web Development

Type 'contact' to work with me!`
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
            const input = this.value.trim().toLowerCase();

            if (e.key === 'Enter') {
                const output = document.createElement('p');
                output.innerHTML = `<span class="cli-prompt">phidel@portfolio:~$</span> ${this.value}`;
                output.classList.add('cli-command');
                cliOutput.appendChild(output);

                if (input) {
                    commandHistory.push(this.value);
                    historyIndex = commandHistory.length;

                    // Extract command and arguments
                    const parts = input.split(' ');
                    const command = parts[0];

                    if (command in commands) {
                        const result = commands[command].action(input);
                        if (result) {
                            const response = document.createElement('p');
                            response.innerHTML = result.replace(/\n/g, '<br>');
                            response.classList.add('cli-success');
                            cliOutput.appendChild(response);
                        }
                    } else {
                        const error = document.createElement('p');
                        error.innerHTML = `Command not found: ${command}<br>Type 'help' for available commands.`;
                        error.classList.add('cli-error');
                        cliOutput.appendChild(error);
                    }
                }

                const spacer = document.createElement('p');
                cliOutput.appendChild(spacer);

                this.value = '';
                cliOutput.scrollTop = cliOutput.scrollHeight;
            } else if (e.key === 'ArrowUp') {
                if (historyIndex > 0) {
                    historyIndex--;
                    this.value = commandHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    this.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    this.value = '';
                }
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
    // MOBILE MENU OVERLAY (Bottom Nav Menu Button)
    // ==========================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMobileMenu = document.getElementById('closeMobileMenu');

    // Mobile menu buttons that trigger other features
    const mobileThemeBtn = document.getElementById('mobileThemeBtn');
    const mobileMatrixBtn = document.getElementById('mobileMatrixBtn');
    const mobileTerminalBtn = document.getElementById('mobileTerminalBtn');
    const mobileShareBtn = document.getElementById('mobileShareBtn');
    const mobileInstallBtn = document.getElementById('mobileInstallBtn');

    if (mobileMenuToggle && mobileMenuOverlay) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            mobileMenuOverlay.classList.add('active');
        });
    }

    if (closeMobileMenu && mobileMenuOverlay) {
        closeMobileMenu.addEventListener('click', function() {
            mobileMenuOverlay.classList.remove('active');
        });
    }

    // Close mobile menu when clicking outside
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function(e) {
            if (e.target === mobileMenuOverlay) {
                mobileMenuOverlay.classList.remove('active');
            }
        });
    }

    // Mobile menu action buttons
    if (mobileThemeBtn) {
        mobileThemeBtn.addEventListener('click', function() {
            if (themeToggle) themeToggle.click();
            mobileMenuOverlay.classList.remove('active');
        });
    }

    if (mobileMatrixBtn) {
        mobileMatrixBtn.addEventListener('click', function() {
            if (matrixToggle) matrixToggle.click();
            mobileMenuOverlay.classList.remove('active');
        });
    }

    if (mobileTerminalBtn) {
        mobileTerminalBtn.addEventListener('click', function() {
            showCLI();
            mobileMenuOverlay.classList.remove('active');
        });
    }

    if (mobileShareBtn) {
        mobileShareBtn.addEventListener('click', async function() {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Phidel Emmanuel Ochieng - Portfolio',
                        text: 'Check out this amazing terminal-themed developer portfolio!',
                        url: window.location.href
                    });
                } catch (error) {
                    fallbackShare();
                }
            } else {
                fallbackShare();
            }
            mobileMenuOverlay.classList.remove('active');
        });
    }

    // Mobile menu links
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuOverlay.classList.remove('active');
        });
    });

    // Swipe down to close mobile menu
    let menuTouchStartY = 0;
    let menuTouchEndY = 0;

    if (mobileMenuOverlay) {
        const menuContent = mobileMenuOverlay.querySelector('.mobile-menu-content');
        if (menuContent) {
            menuContent.addEventListener('touchstart', function(e) {
                menuTouchStartY = e.changedTouches[0].screenY;
            }, { passive: true });

            menuContent.addEventListener('touchend', function(e) {
                menuTouchEndY = e.changedTouches[0].screenY;
                if (menuTouchEndY - menuTouchStartY > 100) {
                    mobileMenuOverlay.classList.remove('active');
                }
            }, { passive: true });
        }
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

    // ==========================================
    // PROJECT PREVIEW MODAL
    // ==========================================
    const modal = document.getElementById('projectPreviewModal');
    const closeBtn = document.querySelector('.close-btn');
    const previewBtns = document.querySelectorAll('.preview-btn');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');

    previewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.project-card');
            const title = card.dataset.title;
            const image = card.dataset.image;
            const description = card.dataset.description;

            modalTitle.textContent = title;
            modalImage.src = image;
            modalDescription.textContent = description;

            modal.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

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
