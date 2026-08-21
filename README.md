# North Haven — website front end

The real front end for `northhaven.mv`.

Plain HTML, CSS and JavaScript.

```
north-haven-site/
├── index.html          home page
├── privacy.html        Privacy Policy
├── terms.html          Terms of Service
├── assets/
│   ├── styles.css      the whole design system
│   └── main.js         mobile nav, scroll reveal, contact form
└── README.md
```
---

## What's in it

**Design.** Colours: ink `#0B1F2A`, teal `#0F766E`,
sand `#D9A441`, warm canvas `#FBFAF8`. Fraunces for headings, DM Sans for everything else,
loaded from Google Fonts. Every value is a CSS custom property at the top of `styles.css`.

**Accessibility.** Skip link, one `h1` per page, visible focus rings, 44px tap targets, labelled
form fields, `aria-expanded` on the menu, live region on form status, and full keyboard operation.
The FAQ uses native `<details>`, so it works with no JavaScript at all.

**Robustness.** Content is visible without JavaScript — the scroll-reveal animation is scoped to a
`.js` class that only exists once the script runs. If JS fails, the page still reads correctly.
`prefers-reduced-motion` is respected throughout.

**Performance.** No frameworks, no images, inline SVG icons. Two fonts are the only external
request.

**SEO.** Per-page titles and descriptions, canonical URLs, Open Graph tags, and
`ProfessionalService` structured data on the home page.

---

## Verified

Checked in headless Chromium at 390px, 768px and 1440px:

- No horizontal overflow at any width
- Mobile drawer opens, closes on link tap, closes on Escape, closes on resize past 860px
- Exactly one `h1` per page, no console errors, no broken internal links
- Content fully visible with JavaScript disabled

---

## Still to add later

- `og:image` — a 1200×630 social preview card
- `favicon.ico` — once there's a mark to use
- A real form endpoint, when the back end exists
- Client work as case studies, once the first pilot is live
