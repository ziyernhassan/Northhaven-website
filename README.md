# North Haven — website

Static HTML, CSS and JavaScript. No build step, no framework, no dependencies, no
third-party requests at runtime.

```
index.html          home
privacy.html        Privacy Policy
terms.html          Terms of Service
404.html            not found
robots.txt
sitemap.xml
assets/styles.css
assets/main.js
assets/og.png       1200×630 social card
assets/fonts/       self-hosted Instrument Sans + Serif (woff2)
```

## Fill in before launch

| What | Where | Now |
|---|---|---|
| WhatsApp number | `index.html` → `data-whatsapp="9607000000"` | **placeholder** |
| WhatsApp number | `index.html` → Business details | `—` |
| Registration no. | `index.html` → Business details | `—` |
| Registered name | `index.html` → Business details | must match the certificate exactly |
| Domain | all pages → `canonical`, `og:*`, `sitemap.xml`, `robots.txt` | `https://northhaven.mv/` |

The WhatsApp number is launch-blocking: with no form endpoint set, the deep link is the
form's only path, so an unset number means the contact form goes nowhere.

## Contact form

`#demo-form` has two modes, set by `data-endpoint`.

- **Empty** — opens WhatsApp with the enquiry pre-filled. No backend needed.
- **A URL** — POSTs `{ name, business, phone, message }` as JSON. Any 2xx is success.

A honeypot field (`company_website`) sits off-screen at the top of the form. Anything that
fills it gets a success message and is silently dropped.

## Theme

Dark and light, both complete. On a first visit the page follows the operating system's
`prefers-color-scheme`, falling back to dark. Once the visitor uses the header toggle their
choice is written to `nh-theme` in `localStorage` and from then on it wins over the OS; until
then the page tracks OS changes live.

An inline script in each `<head>` resolves the theme before first paint, so there is no flash.

Every colour is a custom property. `:root` holds dark, `[data-theme="light"]` overrides it.
Nothing else in the stylesheet references a literal colour. Every foreground/background pair
in both themes has been checked against WCAG AA and passes.

## Design tokens

```
dark    bg #07100F · surface #0E1E1C · fg #E9F1EF · accent #4FD1B9
light   bg #FBFAF8 · surface #FFFFFF · fg #0B1F2A · accent #0C6B63
type    Instrument Serif (display) · Instrument Sans (body) — self-hosted
space   8pt scale, --s1 … --s12
```

## Fonts

Self-hosted in `assets/fonts/`, declared at the top of `styles.css`. Google Fonts is
deliberately not used: it would send every visitor's IP to a third party, which contradicts
the Privacy Policy. The two most-used faces are preloaded in each `<head>`.

To refresh them, download the woff2 files Google Fonts serves for Instrument Sans
(`ital,wght@0,400..700;1,400..700`) and Instrument Serif (`ital@0;1`), keep the
`unicode-range` on each `@font-face`, and point the `src` at the local file.

## Deploy

Upload everything to any static host, point the domain at it, enable HTTPS, and configure
`404.html` as the not-found page. Recommended host: Cloudflare Pages (git-push deploys,
free TLS, and the same account can later run the WhatsApp webhook).

Because `404.html` can be served from any path, all of its links are root-absolute. Keep
them that way.

## Still open

Tracked in the launch checklist artifact; all of these are blocked on information we do
not have yet:

- WhatsApp number
- Company registration number
- Domain registration and DNS
- Meta business verification
- A Dhivehi test corpus — the site currently promises Dhivehi replies as a shipped
  capability, and that has not been validated against real messages
