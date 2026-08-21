# North Haven — website

Static HTML, CSS and JavaScript. No build step, no framework, no dependencies.

```
index.html          home
privacy.html        Privacy Policy
terms.html          Terms of Service
assets/styles.css
assets/main.js
```

## Fill in before launch

| What | Where | Now |
|---|---|---|
| WhatsApp number | `index.html` → `data-whatsapp="9607000000"` | placeholder |
| WhatsApp number | `index.html` → Business details | `—` |
| Registration no. | `index.html` → Business details | `—` |
| Registered name | `index.html` → Business details | must match the certificate exactly |
| Domain | all pages → `canonical`, `og:url` | `https://northhaven.mv/` |
| Email | all pages | `hello@northhaven.mv` |

## Contact form

`#demo-form` has two modes, set by `data-endpoint`.

- **Empty** — opens WhatsApp with the enquiry pre-filled.
- **A URL** — POSTs `{ name, business, phone, message }` as JSON. Any 2xx is success.

## Theme

Dark is the default. The header toggle writes `nh-theme` to `localStorage` and sets
`data-theme="light"` on `<html>`. An inline script in each `<head>` applies the stored value
before first paint, so there is no flash.

Every colour is a custom property. `:root` holds dark, `[data-theme="light"]` overrides it.
Nothing else in the stylesheet references a literal colour.

## Design tokens

```
dark    bg #07100F · surface #0E1E1C · fg #E9F1EF · accent #4FD1B9
light   bg #FBFAF8 · surface #FFFFFF · fg #0B1F2A · accent #0C6B63
type    Instrument Serif (display) · Instrument Sans (body)
space   8pt scale, --s1 … --s12
```

## Deploy

Upload the four files and the `assets` folder to any static host. Then point the domain at it
and enable HTTPS.

## Still missing

- `og:image` — 1200×630 social card
- A real form endpoint
