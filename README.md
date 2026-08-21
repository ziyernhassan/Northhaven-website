# North Haven — website front end

The real front end for `northhaven.mv`, built from the palette in
`Outputs/North Haven Designs/05-north-haven-website.html`.

Plain HTML, CSS and JavaScript. **No build step, no framework, no dependencies.** Upload the
folder to any host and it works.

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

## ⚠️ Fill these in before it goes live

Search the files for these and replace them. **Meta business verification will look at this
page**, so the business details have to be real and match the registration certificate exactly.

| What | Where | Currently |
|---|---|---|
| WhatsApp number | `index.html` → `data-whatsapp="9607000000"` | placeholder |
| WhatsApp number | `index.html` → Business details table | `—` |
| Registration number | `index.html` → Business details table | `—` |
| Registered name | `index.html` → Business details table | "North Haven" — must match the certificate character for character |
| Domain | all pages → `canonical` and `og:url` | `https://northhaven.mv/` |
| Email | all pages | `hello@northhaven.mv` — needs to exist before launch |

Everything else is finished content, not placeholder.

---

## The contact form

It works in two modes, set by one attribute on `#demo-form` in `index.html`:

**Now — `data-endpoint=""` (empty).** The form opens WhatsApp with the enquiry pre-filled. This
means the site is genuinely useful from the day it goes live, before any back end exists. Just
set `data-whatsapp` to the real number.

**Later — `data-endpoint="https://…"`.** Set it to the back end's URL and the form POSTs JSON
instead:

```json
{ "name": "...", "business": "...", "phone": "...", "message": "..." }
```

Return any 2xx for success. The front end handles the loading and error states already.

---

## Deploying

Any static host. Nothing to compile.

- **Netlify / Vercel / Cloudflare Pages** — drag the folder in, or connect the GitHub repo
- **Any shared host** — upload by FTP to the web root
- **GitHub Pages** — push and enable Pages

Then point `northhaven.mv` at it and make sure HTTPS is on. Meta reviewers will open the site,
so it must be **live and complete** at submission — not "coming soon".

> Once the GitHub repo exists, this folder should move into it. The vault copy is a reference,
> not the working source. See [[Working with the Developer]].

---

## What's in it

**Design.** Colours, type and shape all match the mockup: ink `#0B1F2A`, teal `#0F766E`,
sand `#D9A441`, warm canvas `#FBFAF8`. Fraunces for headings, DM Sans for everything else,
loaded from Google Fonts. Every value is a CSS custom property at the top of `styles.css` — change
it once, it changes everywhere.

**No logo**, as requested — the company name is set in Fraunces with "Haven" in teal. The short
teal-and-sand rule appears only as a section divider in the footer, never attached to the name,
so dropping a real logo in later changes nothing else.

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
