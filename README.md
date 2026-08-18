# JobFiller

Local-first resume tailoring tool. Upload your master resume, paste a job
description, get an AI match analysis (score, keyword hits/misses, suggestions),
a tailored resume you can edit and reorder, a cover letter, and PDF export.

Rebuild of [srbhr/Resume-Matcher](https://github.com/srbhr/Resume-Matcher) as a
single-user Next.js app using the Z.AI GLM-5.2 reasoning model. No accounts, no
database — session state only.

![JobFiller preview](public/preview.png)

## Features

- **Resume upload** — PDF (parsed server-side), DOCX, or TXT
- **AI analysis** — match score, keyword hits/misses, suggestions via GLM-5.2
- **Section builder** — drag-and-drop reorder and edit of tailored resume content
- **Cover letter** — generated from your resume + the job description
- **PDF export** — tailored resume and cover letter rendered with Puppeteer

## Getting started

Requires Node.js 18+ (Puppeteer will download Chromium on install).

```bash
npm install
cp .env.example .env.local   # add your Z.AI API key
npm run dev
```

Open http://localhost:3000.

## Configuration

| Variable     | Description                                  |
| ------------ | -------------------------------------------- |
| `ZAI_API_KEY`| API key from [z.ai](https://z.ai) — required |

The key is used server-side only and never exposed to the client. Resume and
job description text are sent to the Z.AI API for analysis — run it locally
for content you don't want leaving your machine.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com) v4
- [openai](https://www.npmjs.com/package/openai) SDK against the Z.AI endpoint
- [mammoth](https://www.npmjs.com/package/mammoth) (DOCX), [unpdf](https://www.npmjs.com/package/unpdf) (PDF), [puppeteer](https://www.npmjs.com/package/puppeteer) (PDF export)

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start dev server           |
| `npm run build` | Production build           |
| `npm start`     | Serve production build     |
| `npm run lint`  | Run ESLint                 |

## License

MIT
