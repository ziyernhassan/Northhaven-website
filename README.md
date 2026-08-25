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
llms.txt            guide for AI crawlers/assistants
_headers            security headers (Cloudflare Pages format)
assets/styles.css
assets/main.js
assets/favicon.svg  tab/bookmark icon
assets/apple-touch-icon.png  180×180 iOS home-screen icon
assets/og.png       1200×630 social card
```

## Fill in before launch

| What | Where | Now |
|---|---|---|
| WhatsApp number | `index.html` → `data-whatsapp="9607000000"` | **placeholder** |
| WhatsApp number | `index.html` → Business details row + `wa.me` link | same placeholder, both must change together |
| Registration no. | `index.html` → Business details | row hidden until the number exists — do not ship an em-dash placeholder |
| Registered name | `index.html` → Business details | must match the certificate exactly |
| Domain | all pages → `canonical`, `og:*`, `sitemap.xml`, `robots.txt`, `llms.txt` | `https://northhaven.mv/` |

The WhatsApp number is launch-blocking: with no form endpoint set, the deep link is the
form's only path, so an unset number means the contact form goes nowhere.

## Google Search Console

Blocked on owning the domain. Once DNS is live:

1. Create a GSC property for `https://northhaven.mv`
2. Verify — easiest on Cloudflare Pages is the **DNS TXT record** method (no HTML edit);
   otherwise add the `<meta name="google-site-verification" content="…">` line to all
   four pages' heads
3. Submit `https://northhaven.mv/sitemap.xml` under Sitemaps
4. After launch, request indexing for `/`

Do not commit a made-up verification token "so it's ready" — GSC rejects unknown tokens
silently and a stale one is just more placeholder junk.

## Contact form

`#demo-form` has two modes, set by `data-endpoint`.

- **Empty** — opens WhatsApp with the enquiry pre-filled. No backend needed.
- **A URL** — POSTs `{ name, business, phone, message }` as JSON. Any 2xx is success.

A honeypot field (`company_website`) sits off-screen at the top of the form. Anything that
fills it gets a success message and is silently dropped.

## Cookies & consent

Deliberately **no consent banner**. The site sets no cookies, runs no analytics and loads
nothing from third parties — a banner would be compliance theatre with a real conversion
cost. The one stored item (light/dark choice in `localStorage`) is device-local,
functionality-only, and disclosed plainly in the Privacy Policy. Revisit only if
analytics or embeds are ever added.

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
type    Times New Roman (display + body) — system stack, zero downloads
space   8pt scale, --s1 … --s12
```

## Type

Times New Roman everywhere (`--disp` and `--sans` share the same stack:
`'Times New Roman', Times, 'Liberation Serif', Georgia, serif`). It is a
system face on Windows/macOS and metric-fallback Linux fonts cover the rest,
so there are no font requests at all — no preloads, no `@font-face`, nothing
to self-host. Tracking was loosened slightly versus the old sans/serif pair
because Times runs tight. If a display face is ever wanted back, restore the
`@font-face` block from git history and re-add the two preloads to each head.

## Backend (lead endpoint)

`POST /api/lead` is a Cloudflare Pages Function (`functions/api/lead.js`) — same repo,
same deploy, no CORS. It validates, honeypot-checks, rate-limits (5/IP/hour), stores
the lead in D1, then pings Telegram best-effort. Storage is the source of truth; a
failed Telegram ping never loses a lead.

| Piece | Value |
|---|---|
| D1 database | `nh_leads`, binding name **`DB`** |
| Schema | paste `d1-migrations/0001_leads.sql` into the D1 console once |
| Env vars | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — same bot as the automation project; mark encrypted |
| Form wiring | `index.html` → `data-endpoint="/api/lead"` |

If the function ever fails, the form already degrades gracefully: the visitor is told to
message WhatsApp directly instead.

## Deploy

Upload everything to any static host, point the domain at it, enable HTTPS, and configure
`404.html` as the not-found page. Recommended host: Cloudflare Pages (git-push deploys,
free TLS, and the same account can later run the WhatsApp webhook).

Because `404.html` can be served from any path, all of its links are root-absolute. Keep
them that way.

## Motion

Three authored motion layers, all doubly gated behind `html.js` **and**
`prefers-reduced-motion`, so no-JS and motion-sensitive visitors get a fully
static page:

1. Hero copy rises in on first paint (`data-rise` on hero elements)
2. The phone breathes (`float` keyframe on `.demo__phone`)
3. Sections reveal on scroll (`data-reveal`, staggered groups via
   `data-reveal-group`) driven by an IntersectionObserver in `main.js`

The hero conversation replay is untouched. `[hidden]{display:none!important}`
guards the stylesheet so author display rules can never resurrect a hidden
element (this bug class shipped once — the guard stays).

## Backend status

Cloudflare Pages setup completed:

- [x] D1 database `nh_leads` created; `d1-migrations/0001_leads.sql` applied
- [x] D1 binding **`DB`** attached to the Pages project
- [x] `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` stored as encrypted Secrets

## Still open

Tracked in the launch checklist artifact; all of these are blocked on information we do
not have yet:

- WhatsApp number
- Company registration number
- Domain registration and DNS
- Meta business verification
- A Dhivehi test corpus — the site currently promises Dhivehi replies as a shipped
  capability, and that has not been validated against real messages
