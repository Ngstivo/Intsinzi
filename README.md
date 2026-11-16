# Intsinzi Digital Studio

A bilingual studio website with four interactive software concepts. Built with Next.js App Router, React, TypeScript, Tailwind CSS, and Lucide. The production build exports static files to `out/`.

## Run locally

Use Node.js 22 or 24 and npm.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000/`. The English homepage is also available at `/en/`, and the Polish homepage is at `/pl/`.

## Build and preview

Set `SITE_URL` to the public origin you plan to use, then run the build.

```sh
npx next build
npm run preview
```

Open `http://127.0.0.1:3000/`. The preview serves the generated files from `out/` and accepts a `PORT` override. For a separate type check after a build, run `npm run typecheck`.

## Environment

| Variable | Use |
| --- | --- |
| `SITE_URL` | Public origin for canonical links, Open Graph URLs, language alternates, and sitemap entries. Set it for production. A local build can omit it and will generate an empty sitemap. |
| `NEXT_PUBLIC_BASE_PATH` | Optional hosting path such as `/Intsinzi`, with no trailing slash. The GitHub Pages workflow sets it automatically. Leave it empty for root deployments. |
| `PORT` | Optional local static preview port. Defaults to 3000. |
| `NODE_VERSION` | Optional Cloudflare Pages build setting. Use 22 or 24. |

For example, in PowerShell use `$env:SITE_URL = 'https://your-project.pages.dev'`. In Bash use `export SITE_URL=https://your-project.pages.dev`. The starter requires no API credentials.

## Routes and demo workflows

Each page and concept is available beneath both locale prefixes.

| Route under `/en/` or `/pl/` | Function |
| --- | --- |
| Home | Studio introduction, featured work, services, stack, process, and contact |
| `services/` | All seven service descriptions |
| `work/` | Portfolio of four interactive concepts |
| `about/` | Independent studio model and development process |
| `pricing/` | Indicative project prices in PLN |
| `contact/` | Project enquiry and direct email link |
| `work/clientflow/` | Add and search leads, change stages, complete follow-ups, and view updated analytics |
| `work/bookease/` | Pick a calendar date, reserve an available slot, cancel an appointment, and view admin totals |
| `work/stockpilot/` | Add and edit products, record receipts and issues, and review stock alerts and reports |
| `work/ai-desk/` | Query sample knowledge, process a sample document, queue draft replies, and approve them |

Demo changes exist only in React state for the current page visit. AI Desk classifies sample inputs using local rules and displays sample knowledge articles. The enquiry form composes a `mailto:` draft for `nsteveintsinzi@gmail.com`. The sender reviews and sends it from their email client.

## Source structure

- `app/` contains static routes, locale layouts, metadata, robots, and sitemap.
- `components/` contains the marketing layout, contact form, and interactive demo workspaces.
- `lib/content.ts` and `lib/demo-data.ts` contain studio content and sample fixtures.
- `public/mark.svg` is the geometric monogram used for the header and favicon.

To introduce persistent applications later, move the demo operations into a data layer backed by a Node.js API or Supabase. Add authentication, authorize writes server-side, apply row-level security for Supabase data, and keep privileged keys in server-side configuration. The marketing site can continue to deploy as a static export.

## Deploy from GitHub to Cloudflare Pages

Create an empty GitHub repository, then run these commands from the project directory. Replace the remote with your repository URL.

```sh
git init -b main
git add .
git commit -m "Build Intsinzi Digital Studio"
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

In Cloudflare, go to **Workers & Pages**, create a **Pages** application, and import the GitHub repository. Use these settings.

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npx next build` |
| Build output directory | `out` |
| Root directory | Repository root |
| Production environment | Set `SITE_URL` to the intended public origin |

Deploy, then check the homepages, direct links to demos, `/robots.txt`, and `/sitemap.xml`. If you add a custom domain later, update `SITE_URL` and redeploy. [Cloudflare Pages static Next.js guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)

## Deploy to GitHub Pages

In the repository, open **Settings → Pages** and select **GitHub Actions** as the source. The workflow in `.github/workflows/pages.yml` builds and deploys after a push to `main`. You can also run **Deploy GitHub Pages** from the Actions tab. The workflow reads the deployment origin and project path from GitHub Pages.
