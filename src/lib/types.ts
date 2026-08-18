export interface Keyword {
  keyword: string;
  present: boolean;
  importance: "high" | "medium" | "low";
}

export interface Analysis {
  score: number; // 0-100
  verdict: string; // one blunt line
  keywords: Keyword[];
  strengths: string[];
  gaps: string[];
  suggestions: string[];
}

export interface ExperienceEntry {
  role: string;
  company: string;
  dates: string; // "Jan 2024 – Present" style
  bullets: string[];
}

export interface ResumeSection {
  id: string;
  title: string; // SUMMARY / EXPERIENCE / ...
  kind: "summary" | "experience" | "education" | "skills" | "project" | "custom";
  bullets: string[];
  entries?: ExperienceEntry[]; // experience sections: role blocks instead of flat bullets
}

export interface Contact {
  name: string; // full name
  title: string; // professional title, e.g. "Appointment Setter / SDR"
  email: string;
  location: string; // "City, ST"
  linkedin: string; // full URL or ""
  portfolio: string; // full URL or ""
  github: string; // full URL or ""
}

export interface TailoredResume {
  headline: string;
  contact: Contact;
  sections: ResumeSection[];
}

export interface CoverLetter {
  company: string; // target company from the JD, "" if unknown
  hiringManager: string; // named contact from the JD, "" if none
  body: string[]; // content paragraphs only — no date/salutation/sign-off
}

export interface InterviewPrep {
  questions: { question: string; why: string; answerSketch: string }[];
}
