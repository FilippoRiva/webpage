# Portfolio

Static Astro site. Dark split layout, plain CSS, Markdown projects. No UI framework or client-side JavaScript.

## Local development

Use Node.js 24 LTS (recommended), or Node.js 22.23.4+, and npm.

```sh
git switch dev
npm ci
npm run dev
```

Open the URL printed in the terminal (normally http://localhost:4321). Changes update automatically. Stop with `Ctrl+C`.

Use `npm run dev -- --host` to view it from another device on a trusted local network.

### Private remote access

Copy `.env.example` to `.env`, then set `LOCAL_DEV_HOSTNAME` to your own remote-access hostname (without a protocol or port). This explicitly allows that hostname in the local dev/preview server. Restart the server after changing it.

For Tailscale, bind the server to this machine's Tailscale IP:

```sh
npm run dev -- --host <your-tailscale-ip>
```

Then open `http://<your-hostname>:4321` from an authorized device on your tailnet. The hostname allowlist is not authentication; Tailscale permissions and the interface binding control remote access.

`.env` is ignored by Git. Keep real hostnames and addresses out of `.env.example`, source files, and documentation. The hostname is read only by the Astro config and is not included in the generated static site.

## Structure

- `src/data/site.ts` — name and contact links.
- `src/i18n/ui.ts` — English/Italian interface copy, Home statements, URL and date helpers.
- `src/styles/global.css` — colors, typography, sidebar, mobile layout.
- `src/layouts/Layout.astro` — shared document and navigation.
- `src/components/PhiLogo.astro` — small phi mark; two CSS stroke animations play once on page load. It stays in place and skips animation for reduced-motion preferences.
- `src/pages/[...locale]/index.astro` — shared Home template with the statement and two linked panels: ARCO (thesis label and one-line description) and all projects. Panels sit side by side on wide screens and stack on smaller screens. Includes a comment marking a future chatbot insertion point; no chatbot is implemented yet.
- `src/pages/[...locale]/projects/index.astro` — shared project previews template.
- `src/pages/[...locale]/projects/[id].astro` — shared individual project template.
- `src/content/projects/en/*.md` — English project content.
- `src/content/projects/it/*.md` — Italian project content.
- `src/content.config.ts` — project content schema.

## Languages

English is the default: `/`, `/projects/`, `/projects/arco/`.
Italian uses `/it/`: `/it/`, `/it/projects/`, `/it/projects/arco/`.

The EN / IT switch stays on the equivalent page. There are no automatic language redirects or language cookies. Both versions are built as static HTML, with translated labels, metadata, accessibility text, and language-aware dates. Set `site` in `astro.config.mjs` to your production URL for absolute alternate-language links and canonical URLs; local development uses relative alternate-language links.

Edit interface translations and each language's Home statement in `src/i18n/ui.ts`. Project translations are separate Markdown files. Names, repository URLs, and technology names do not need translating.

## Edit or add a project

Create matching Markdown files in **both** `src/content/projects/en/` and `src/content/projects/it/`. For example, `en/arco.md` and `it/arco.md` produce `/projects/arco/` and `/it/projects/arco/`. Each file also supplies that language's project preview. Home has only two links: ARCO and all projects.

The build fails if a project translation is missing, so language switches never silently point to nonexistent pages.

```md
---
title: "Full project title"
shortTitle: "Short title for the browser tab"
summary: "A short introduction for the project preview."
startDate: "2026-02"
endDate: "2026-12"
keywords: ["Python", "LangGraph"]
color: "sage"
url: "https://github.com/your-username/your-project"
---

Describe the work here. This body appears only on the individual project page.

## Implementation

Add more detail, lists, code blocks, or images as needed.
```

- Dates use `YYYY-MM` for sorting and semantic HTML. `Intl.DateTimeFormat` displays them in the page's language automatically.
- Translate `title`, `shortTitle`, `summary`, and the Markdown body. Keep dates, keywords, colors, and repository URLs consistent across both files.
- Projects are ordered newest first by start date.
- Available colors: `sage`, `clay`, `slate`, `ochre`. Change their values in `global.css`.
- `url` is optional; omit it for a project without a public repository.
- Keep filenames to simple lowercase hyphenated slugs, without subdirectories.
- For images, put a file in `public/images/` and reference it in Markdown with descriptive alt text: `![Dashboard showing benchmark results](/images/dashboard.png)`. Prefix the image URL with your deployment subpath if you configure one.

## Production preview

```sh
npm run build
npm run preview
```

Preview serves the last build, so rebuild after editing. It is not a production server.

## Cloudflare Workers deployment

`wrangler.jsonc` configures the **`webpage`** Worker to serve only the static files in `dist/`. Wrangler is pinned as a development dependency. No Astro server adapter is needed.

In the Cloudflare Git build settings, use:

- **Production branch:** `main` (keep `dev` separate).
- **Root directory:** repository root.
- **Build command:** `npm run build`.
- **Deploy command:** `npx wrangler deploy`.
- **Build environment variable:** `NODE_VERSION=24`.

Cloudflare installs dependencies before building. Do not disable development dependencies: Wrangler is needed for the deployment step. Do not copy the local `.env` or its hostname to Cloudflare.

Review on `dev`, then commit and merge into `main` when ready. This repository does not configure the Cloudflare account, domain, Git integration, or branch settings; configure those in the dashboard.

To validate deployment locally **without publishing**:

```sh
npm run build
npx wrangler deploy --dry-run
```

For a different static host, use `npm ci`, build with `npm run build`, and publish `dist/`. Alternatively, upload the contents of `dist/` to a static web server.

Set `site` in `astro.config.mjs` when you know your public URL. For subpath hosting, such as `https://username.github.io/repository/`, also set `base: '/repository'`. Navigation and project links respect this setting; use the same prefix for any manually authored Markdown links or images.
