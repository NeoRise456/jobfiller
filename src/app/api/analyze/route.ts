import { NextRequest, NextResponse } from "next/server";
import { askJSON } from "@/lib/llm";
import type { Analysis, TailoredResume, CoverLetter, InterviewPrep } from "@/lib/types";

export const maxDuration = 300;

interface FullResult extends Analysis {
  tailored: TailoredResume;
  coverLetter: CoverLetter;
  interviewPrep: InterviewPrep;
}

const SCHEMA = `{
  "score": 0-100 integer,
  "verdict": "one blunt sentence",
  "keywords": [{"keyword":"...","present":true/false,"importance":"high|medium|low"}],
  "strengths": ["..."],
  "gaps": ["..."],
  "suggestions": ["concrete rewrite suggestions"],
  "tailored": {
    "headline": "tailored professional headline",
    "contact": {
      "name": "full name as written in the resume",
      "title": "professional title, e.g. \"Appointment Setter / SDR\"",
      "email": "email address found in the resume",
      "location": "location in \"City, ST\" style",
      "linkedin": "full LinkedIn URL",
      "portfolio": "full portfolio/personal site URL",
      "github": "full GitHub URL"
    },
    "sections": [{"title":"SUMMARY","kind":"summary|experience|education|skills|project|custom","bullets":["..."],"entries":[{"role":"Job Title","company":"Company","dates":"Jan 2024 – Present","bullets":["..."]}]}]
  },
  "coverLetter": {"company": "target company name from the JD", "hiringManager": "named contact in the JD or \"\"", "body": ["paragraph 1", "paragraph 2", "paragraph 3"]},
  "interviewPrep": {"questions": [{"question":"...","why":"why they will ask this","answerSketch":"how to answer using the resume"}]}
}`;

export async function POST(req: NextRequest) {
  try {
    const { resume, job } = (await req.json()) as { resume: string; job: string };
    if (!resume?.trim() || !job?.trim()) {
      return NextResponse.json({ error: "resume and job are required" }, { status: 400 });
    }

    const result = await askJSON<FullResult>(
      "You are a ruthless technical recruiter and resume expert. Think step by step, then output ONLY valid JSON matching the schema — no markdown fences, no commentary.",
      `RESUME:\n${resume}\n\nJOB DESCRIPTION:\n${job}\n\nSchema:\n${SCHEMA}\n\nRules: score honestly against the JD; keywords = 10-20 JD keywords/skills with present=true only if the resume genuinely evidences them; per keyword: (a) in resume → rewrite and emphasize, (b) weak → strengthen, move higher, add measurable impact, (c) absent but transferable → add one truthful line connecting it, (d) absent and not inferable → NEVER invent, leave out; order tailored.sections most-relevant-first, summary stays first; mirror JD terminology without copying phrases word-for-word; tailored sections must reuse real resume facts, never invent employers, dates, or metrics not derivable from the resume; experience sections MUST use entries (one per real job: role, company, dates exactly as in the resume, plus that job's bullets) — never flatten jobs into one bullet list; education sections may use entries too (school/company field = institution); copy URLs and contact values CHARACTER-FOR-CHARACTER from the resume, never normalize, shorten, or reconstruct them (if the resume says https://www.linkedin.com/in/juan-astonitas-5ba0b425a/ output exactly that string, even if it looks non-canonical); coverLetter 3 paragraphs, no placeholders like [Your Name]; coverLetter.company and hiringManager come ONLY from the JD text, use "" when the JD names no company or person, never invent; coverLetter.body = content paragraphs ONLY — no date, no recipient block, no salutation, no sign-off, no signature (those are added at render time); tailored.contact fields: extract ONLY what is explicitly present in the resume text, use "" for anything absent, never invent or guess; interviewPrep 5 questions grounded in the JD and resume.`,
    );

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Analysis failed" },
      { status: 502 },
    );
  }
}
