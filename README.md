# Phidel Ochieng — Portfolio

> A modern, professional, recruiter-ready portfolio with Progressive Web App capabilities. Built from scratch with vanilla HTML, CSS and JavaScript — no frameworks.

**Live site:** [tariq926.github.io/my-portfolio](https://tariq926.github.io/my-portfolio/)

## Features

### Design

- Modern, professional design with a polished dark theme (default) and a light theme
- Modern typography: **Sora** (headings), **Inter** (body)
- Recruiter-first page structure: featured work → about → experience → contact
- Bento-grid featured projects with case-study format (problem → solution → result)
- Smooth scroll-reveal animations powered by the Intersection Observer API
- Glassmorphism sticky navigation with scrollspy (active section highlighting)
- Fully responsive — mobile, tablet and desktop
- Respects `prefers-reduced-motion` for accessibility

### Content Sections

- **Hero** — outcome-focused intro, open-to-work badge, PageSpeed link
- **Featured Projects** — bento grid with case studies for top work
- **All Projects** — filterable showcase (All / Live / Web Apps / Portfolios / In Progress)
- **About** — condensed bio, profile card, and skill chips
- **Experience** — freelance, university, and training roles
- **Journey** — education timeline with certificate links
- **Certifications** — completed and in-progress credentials
- **Services** — compact three-column offerings
- **GitHub** — live stats + curated pinned repositories
- **Recommendations** — LinkedIn-verified social proof
- **Contact** — form with loading state, resume links, 24h response note
- **Resume page** — [`resume.html`](resume.html) + PDF download

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
- Meta description, keywords, Open Graph and Twitter Card tags (custom OG image)
- JSON-LD structured data (Person + WebSite schemas)
- `robots.txt`, `sitemap.xml`, canonical URLs

## Custom Domain (optional)

To use a professional domain (e.g. `phidelochieng.dev`):

1. Purchase a domain from any registrar
2. Add a `CNAME` record pointing to `tariq926.github.io`
3. Configure the custom domain in GitHub Pages settings
4. Update the `canonical` link and OG URLs in `index.html`

## Technologies

- **Frontend:** HTML5, CSS3 (custom properties, Grid, Flexbox), Vanilla JavaScript
- **Fonts:** Sora, Inter (Google Fonts, reduced weights)
- **Icons:** Font Awesome 6.4.0 (with SRI)
- **PWA:** Service Worker + Web App Manifest
- **Form:** FormSubmit.co

## File Structure

```
my-portfolio/
├── index.html          # Main portfolio page
├── resume.html         # Online resume
├── styles.css          # All styles
├── script.js           # All functionality
├── og-image.png        # Social sharing card (1200×630)
├── portfolio-preview.png  # Project thumbnail mockup
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
