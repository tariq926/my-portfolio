# Phidel Ochieng — Portfolio

> A modern, professional, recruiter-ready portfolio with Progressive Web App capabilities. Built from scratch with vanilla HTML, CSS and JavaScript — no frameworks.

**Live site:** [tariq926.github.io/my-portfolio](https://tariq926.github.io/my-portfolio/)

## Features

### Design

- Modern, professional design with a polished dark theme (default) and a light theme
- Modern typography: **Sora** (headings), **Inter** (body), **JetBrains Mono** (code & accents)
- Smooth scroll-reveal animations powered by the Intersection Observer API
- Glassmorphism sticky navigation with scrollspy (active section highlighting)
- Fully responsive — mobile, tablet and desktop
- Respects `prefers-reduced-motion` for accessibility

### Content Sections

- **Hero** — introduction, call-to-action buttons, social links and key stats
- **About** — story, developer profile card and animated skills matrix
- **Journey** — education & learning timeline with certificate links
- **Experience** — freelance, university and training experience
- **Certifications** — completed and in-progress credentials
- **Services** — six service offerings
- **Projects** — filterable project showcase (All / Web Apps / Portfolios / In Progress)
- **GitHub Activity** — live stats from the GitHub API
- **Articles** — latest blog posts
- **Testimonials** — client and instructor feedback
- **Contact** — details plus a working contact form (FormSubmit)

### Security

- **Content Security Policy (CSP)** restricting scripts, styles, images, fonts, connections and form targets to trusted origins only
- **Subresource Integrity (SRI)** on the Font Awesome CDN stylesheet
- `rel="noopener noreferrer"` on all external links
- Strict referrer policy (`strict-origin-when-cross-origin`)
- Honeypot spam protection on the contact form
- No inline scripts or inline styles (CSP-friendly), no tracking cookies

### Performance & PWA

- Installable Progressive Web App with offline support (network-first service worker)
- Lazy-loaded images and deferred JavaScript
- Preconnected font origins for faster loading
- Minimal dependencies — only Font Awesome and Google Fonts

### SEO

- Semantic HTML5 landmarks and heading hierarchy
- Meta description, keywords, Open Graph and Twitter Card tags
- JSON-LD structured data (Person + WebSite schemas)

## Technologies

- **Frontend:** HTML5, CSS3 (custom properties, Grid, Flexbox), Vanilla JavaScript
- **Fonts:** Sora, Inter, JetBrains Mono (Google Fonts)
- **Icons:** Font Awesome 6.4.0 (with SRI)
- **PWA:** Service Worker + Web App Manifest
- **Form:** FormSubmit.co

## File Structure

```
my-portfolio/
├── index.html          # Main HTML file
├── styles.css          # All styles
├── script.js           # All functionality
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
├── README.md           # This file
├── tariq2.jpg          # Profile image
├── store.png           # Project screenshot
├── smart-life.png      # Project screenshot
└── Project2.png        # Project screenshot
```

## Deployment (GitHub Pages)

1. Push to GitHub
2. Settings → Pages
3. Select branch
4. Done!

## Contact

**Phidel Emmanuel Ochieng**

- Email: ochiengphidel1@gmail.com
- Phone: 0711524148
- Location: Embu, Kenya
- LinkedIn: [phidel-ochieng](https://linkedin.com/in/phidel-ochieng-832593393)
- GitHub: [@tariq926](https://github.com/tariq926)

## License

Free to use for personal portfolios. Please credit if you use the code structure.
