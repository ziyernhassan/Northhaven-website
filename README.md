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

## Deploy

Upload the four files and the `assets` folder to any static host. Then point the domain at it and
enable HTTPS.

## Design tokens

Every colour, font and radius is a custom property at the top of `assets/styles.css`.

```
ink #0B1F2A · teal #0F766E · sand #D9A441 · canvas #FBFAF8
Fraunces (headings) · DM Sans (body)
```

## Still missing

- `og:image` — 1200×630 social card
- `favicon.ico`
- A real form endpoint
