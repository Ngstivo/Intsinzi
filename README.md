# Intsinzi Digital Studio

A six-language studio website with four interactive software concepts. Built with Next.js App Router, React, TypeScript, Tailwind CSS, and Lucide. The production build exports static files to `out/`.

## Run locally

Use Node.js 22 or 24 and npm.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000/`. English, Polish, French, German, Spanish, and Italian are available under `/en/`, `/pl/`, `/fr/`, `/de/`, `/es/`, and `/it/`.

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
| `NEXT_PUBLIC_ENQUIRY_ENDPOINT` | Public URL for the Supabase `submit-enquiry` Edge Function. Set it when building the production frontend. |
| `PORT` | Optional local static preview port. Defaults to 3000. |
| `NODE_VERSION` | Optional Cloudflare Pages build setting. Use 22 or 24. |

For example, in PowerShell use `$env:SITE_URL = 'https://your-project.pages.dev'`. In Bash use `export SITE_URL=https://your-project.pages.dev`. The starter requires no API credentials.

## Routes and demo workflows

Each page and concept is available beneath both locale prefixes.

| Route under each locale prefix | Function |
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

Demo changes exist only in React state for the current page visit. AI Desk classifies sample inputs using local rules and displays sample knowledge articles. With Supabase configured, enquiries go directly to the studio’s private database. Builds without an endpoint use an email draft for `nsteveintsinzi@gmail.com`.

## Source structure

- `app/` contains static routes, locale layouts, metadata, robots, and sitemap.
- `components/` contains the marketing layout, contact form, and interactive demo workspaces.
- `lib/content.ts` and `lib/demo-data.ts` contain studio content and sample fixtures.
- `lib/localization.ts` defines supported languages and locale formatting. The catalogs in `lib/translations/` provide French, German, Spanish, and Italian copy for the original English and Polish strings.
- `public/mark.svg` is the geometric monogram used for the header and favicon.

## Activate the Supabase enquiry inbox

1. Select the studio’s Supabase project. Link the CLI and apply the tracked migration with `supabase link --project-ref <project-ref>` followed by `supabase db push`. To provision via the dashboard, run the migration once in the SQL Editor.
2. Deploy the function with `supabase functions deploy submit-enquiry`. The repository config allows anonymous HTTP requests to this function. It validates submissions and calls a database function restricted to `service_role`. Supabase supplies `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the Edge Function environment. Keep all privileged keys out of frontend builds.
3. Set `NEXT_PUBLIC_ENQUIRY_ENDPOINT` to the function URL, normally `https://<project-ref>.supabase.co/functions/v1/submit-enquiry`. For Vercel static uploads, set it before rebuilding and upload the new `out/`. For GitHub Pages, add the repository Actions variable with the same name and run the Pages workflow again.
4. Open the live contact page, submit a synthetic enquiry, and locate the matching row in **Supabase → Table Editor → project_enquiries**. The browser shows a receipt after Supabase confirms storage.

The function accepts browser requests from the studio’s Vercel and GitHub Pages origins by default. Add local or custom origins through the Edge Function secret `ENQUIRY_ALLOWED_ORIGINS` as a comma-separated list of complete origins, including the ones already in use. The form validates input, rate-limits accepted submissions, and reuses the same request ID for a retry with identical data.

Sort the inbox by `created_at` and update `status` to `in_review`, `replied`, or `closed` as you work. Use the captured email address to respond. Only project operators can read enquiries through the dashboard.

### Email notifications

New enquiries are queued in the same transaction that saves them. The `intsinzi-enquiry-emails` Supabase Cron job checks for pending alerts every minute and calls the protected `send-enquiry-emails` Edge Function. Provider failures are retried with increasing delays. Existing enquiries are kept in the inbox without a retroactive mailing.

Configure these Supabase Edge Function secrets:

- `RESEND_API_KEY` is a Resend sending key.
- `ENQUIRY_EMAIL_FROM` is a sender on a verified Resend domain, such as `Intsinzi Digital Studio <enquiries@your-domain.example>`.
- `ENQUIRY_EMAIL_WORKER_KEY` is a randomly generated worker authentication value. Store the same value in Supabase Vault as `intsinzi_enquiry_email_worker_key`. Store the function URL in Vault as `intsinzi_enquiry_email_worker_url`.

The recipient is `nsteveintsinzi@gmail.com`. The notification includes project details and sets the reply address to the client when possible. The database inbox and website confirmation continue to work while email setup is pending.

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
