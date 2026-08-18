# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router, TypeScript, Tailwind v4), OpenAI-compatible client to Z.AI GLM-5.2 reasoning model (user's key, server-side only). Single-user local tool.

## Users

Single user (the owner) tailoring their own resume for each job application. Runs locally.

## Product Purpose

Clone of srbhr/Resume-Matcher rebuilt in Next.js: upload a master resume, paste a job description, get AI analysis (match score, keyword hits/misses, suggestions), a tailored resume with drag-and-drop section builder, cover letter, interview prep, and PDF export. Success = a tailored, exported resume+cover letter per job with minimal friction.

## Positioning

Local-first, single-user, Z.AI GLM-5.2 reasoning for analysis instead of the original's multi-provider LiteLLM backend. No accounts, no server-side persistence beyond local session state.

## Operating Context

User has a master resume (PDF/DOCX/TXT) and a pasted job description. Workflow: upload resume, paste JD, run analysis, review tailored content in builder, reorder/edit sections, export resume and cover letter as PDF, optionally run interview prep.

## Capabilities and Constraints

- Resume upload: PDF (parsed server-side), DOCX, TXT.
- Job description: pasted text.
- Analysis via GLM-5.2 (reasoning model): match score, keyword extraction, hits/misses, suggestions, tailored resume content, cover letter, interview prep questions.
- Drag-and-drop resume section builder with edit.
- PDF export: tailored resume + cover letter.
- API key lives in `.env.local` (ZAI_API_KEY), never exposed client-side.
- Confirmed: resume/JD text is sent to Z.AI API for analysis.

## Brand Commitments

Design: brutalist, pitch black (user-mandated). New design, not the original's look.

## Evidence on Hand

None — no resume, JD, or copy assets provided yet. No placeholder testimonials or metrics to be fabricated.

## Product Principles

1. One screen per step: resume in, JD in, analysis out, build, export.
2. Analysis is the product — GLM-5.2 reasoning output must be front and center.
3. No accounts, no persistence complexity; session-scoped state only.
4. Brutalist black design is a hard constraint, not a theme option.
