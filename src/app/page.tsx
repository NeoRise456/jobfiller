"use client";

import { useRef, useState } from "react";
import Dropzone from "@/components/Dropzone";
import type {
  Analysis,
  Contact,
  ResumeSection,
  TailoredResume,
  CoverLetter,
  InterviewPrep,
} from "@/lib/types";

type FullResult = Analysis & {
  tailored: TailoredResume;
  coverLetter: CoverLetter;
  interviewPrep: InterviewPrep;
};

const STEPS = ["INTAKE", "VERDICT", "BUILD", "COVER", "PREP"] as const;

const EMPTY_CONTACT: Contact = {
  name: "",
  title: "",
  email: "",
  location: "",
  linkedin: "",
  portfolio: "",
  github: "",
};

export default function Home() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [result, setResult] = useState<FullResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [coverLetter, setCoverLetter] = useState<CoverLetter>({
    company: "",
    hiringManager: "",
    body: [],
  });
  const [step, setStep] = useState(0);
  const dragId = useRef<string | null>(null);

  async function analyze() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, job }),
      });
      const data: { error?: string } = await r.json();
      if (!r.ok) throw new Error(data.error ?? "Analysis failed");
      const full = data as unknown as FullResult;
      setResult(full);
      setSections(full.tailored.sections.map((s) => ({ ...s })));
      setContact({ ...EMPTY_CONTACT, ...full.tailored.contact });
      setCoverLetter({
        company: full.coverLetter.company ?? "",
        hiringManager: full.coverLetter.hiringManager ?? "",
        body: [...full.coverLetter.body],
      });
      setStep(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setBusy(false);
    }
  }

  function onDropSection(targetId: string) {
    const from = dragId.current;
    dragId.current = null;
    if (!from || from === targetId) return;
    setSections((prev) => {
      const list = [...prev];
      const fi = list.findIndex((s) => s.id === from);
      const ti = list.findIndex((s) => s.id === targetId);
      if (fi < 0 || ti < 0) return prev;
      const [moved] = list.splice(fi, 1);
      list.splice(ti, 0, moved);
      return list;
    });
  }

  function updateSection(id: string, patch: Partial<ResumeSection>) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function removeSection(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }

  function addSection() {
    setSections((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: "NEW SECTION",
        kind: "custom",
        bullets: ["Edit this bullet."],
      },
    ]);
  }

  const [exporting, setExporting] = useState(false);

  async function exportPdf(kind: "resume" | "cover") {
    if (!result) return;
    setExporting(true);
    setError(null);
    try {
      const payload =
        kind === "resume"
          ? { kind: "resume" as const, sections, contact }
          : { kind: "cover" as const, cover: coverLetter, contact };
      const r = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        setError("PDF export failed");
        return;
      }
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = kind === "resume" ? "resume.pdf" : "cover-letter.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("PDF export failed");
    } finally {
      setExporting(false);
    }
  }

  const hits = result?.keywords.filter((k) => k.present) ?? [];
  const misses = result?.keywords.filter((k) => !k.present) ?? [];
  const ready = resume.trim().length > 0 && job.trim().length > 0;

  return (
    <main className="flex-1">
      {/* MARQUEE HEADER */}
      <header className="no-print border-b-3 border-line overflow-hidden py-3">
        <div className="marquee-track font-display text-2xl md:text-4xl">
          {[0, 1].map((i) => (
            <span key={i} className="flex shrink-0">
              {["JOBFILLER", "✕", "RESUME vs JOB", "✕", "GLM-5.2 REASONING", "✕", "NO MERCY", "✕"].map(
                (t, j) => (
                  <span key={j} className="mx-6">
                    {t === "✕" ? <span className="text-dim">✕</span> : t}
                  </span>
                ),
              )}
            </span>
          ))}
        </div>
      </header>

      {/* STEP RAIL */}
      <nav className="no-print border-b-3 border-line flex flex-wrap" aria-label="Steps">
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => result && setStep(i)}
            disabled={!result && i > 0}
            className={`flex-1 min-w-24 border-r-3 border-line last:border-r-0 px-3 py-2 font-display text-sm md:text-base ${
              step === i
                ? "bg-accent text-black"
                : result
                  ? "cursor-pointer hover:bg-ink hover:text-black"
                  : "text-dim cursor-not-allowed"
            }`}
          >
            {String(i + 1).padStart(2, "0")} {s}
          </button>
        ))}
      </nav>

      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {/* STEP 0 — INTAKE */}
        {step === 0 && (
          <section aria-label="Intake">
            <h1 className="font-display text-4xl md:text-7xl leading-none mb-2">
              FEED THE MACHINE.
            </h1>
            <p className="text-dim mb-8 text-sm md:text-base">
              RESUME IN. JOB IN. VERDICT OUT. GLM-5.2 REASONS OVER BOTH.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bx p-4">
                <h2 className="font-display text-xl mb-4">01 / RESUME</h2>
                <Dropzone onText={(t) => setResume(t)} />
                <textarea
                  aria-label="Resume text"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  placeholder="…or paste resume text here"
                  className="w-full h-56 mt-4 p-3 text-sm resize-y"
                />
              </div>
              <div className="bx p-4 flex flex-col">
                <h2 className="font-display text-xl mb-4">02 / JOB DESCRIPTION</h2>
                <textarea
                  aria-label="Job description text"
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  placeholder="Paste the entire job description. All of it."
                  className="w-full flex-1 min-h-72 p-3 text-sm resize-y"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => void analyze()}
                disabled={!ready || busy}
                className="btn-brutal btn-primary shadow-hard-accent px-10 py-5 text-2xl md:text-4xl"
              >
                {busy ? (
                  <>
                    REASONING<span className="blink">_</span>
                  </>
                ) : (
                  "ANALYZE ▶"
                )}
              </button>
            </div>
            {error && (
              <p className="mt-4 bx-accent p-3 text-sm" role="alert">
                ERR: {error}
              </p>
            )}
          </section>
        )}

        {/* STEP 1 — VERDICT */}
        {step === 1 && result && (
          <section aria-label="Verdict">
            <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
              <div className="bx-accent shadow-hard-accent p-6 text-center">
                <p className="font-display text-8xl md:text-9xl leading-none">{result.score}</p>
                <p className="font-display text-sm mt-2">/ 100 MATCH</p>
              </div>
              <div className="bx p-6">
                <h2 className="font-display text-2xl md:text-4xl mb-3">VERDICT</h2>
                <p className="text-lg">{result.verdict}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bx p-4">
                <h3 className="font-display text-lg mb-3">
                  KEYWORDS <span className="">HIT {hits.length}</span>
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {hits.map((k) => (
                    <li
                      key={k.keyword}
                      className="border-3 border-line px-2 py-1 text-sm"
                      title={`importance: ${k.importance}`}
                    >
                      ✔ {k.keyword}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bx p-4">
                <h3 className="font-display text-lg mb-3">
                  KEYWORDS <span className="text-dim">MISS {misses.length}</span>
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {misses.map((k) => (
                    <li
                      key={k.keyword}
                      className="border-3 border-dim text-dim px-2 py-1 text-sm line-through"
                      title={`importance: ${k.importance}`}
                    >
                      {k.keyword}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="bx p-4">
                <h3 className="font-display text-lg mb-3">STRENGTHS</h3>
                <ul className="space-y-2 text-sm">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="pl-4 -indent-4 before:content-['■_']">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bx p-4">
                <h3 className="font-display text-lg mb-3">GAPS</h3>
                <ul className="space-y-2 text-sm">
                  {result.gaps.map((s, i) => (
                    <li key={i} className="pl-4 -indent-4 before:content-['□_'] before:text-dim">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bx p-4">
                <h3 className="font-display text-lg mb-3">FIXES</h3>
                <ul className="space-y-2 text-sm">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="pl-4 -indent-4 before:content-['→_']">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* STEP 2 — BUILD */}
        {step === 2 && result && (
          <section aria-label="Builder">
            <div className="no-print flex items-baseline justify-between flex-wrap gap-4 mb-6">
              <h2 className="font-display text-3xl md:text-5xl">BUILD. DRAG. CUT.</h2>
              <div className="flex gap-3">
                <button onClick={addSection} className="btn-brutal shadow-hard px-4 py-2 text-sm">
                  + SECTION
                </button>
                <button
                  onClick={() => void exportPdf("resume")}
                  disabled={exporting}
                  className="btn-brutal btn-primary shadow-hard-accent px-4 py-2 text-sm"
                >
                  {exporting ? "EXPORTING…" : "EXPORT PDF ▶"}
                </button>
              </div>
            </div>
            <div className="print-sheet bx p-6 md:p-10 max-w-3xl">
              <div className="no-print mb-6">
                <h3 className="font-display text-xl mb-4">CONTACT</h3>
                <input
                  aria-label="Full name"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  placeholder="FULL NAME"
                  className="w-full font-display text-3xl md:text-5xl border-none p-0 mb-4"
                />
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
                  {(
                    [
                      ["title", "TITLE"],
                      ["email", "EMAIL"],
                      ["location", "LOCATION"],
                      ["linkedin", "LINKEDIN URL"],
                      ["portfolio", "PORTFOLIO URL"],
                      ["github", "GITHUB URL"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="block">
                      <span className="block text-dim text-xs uppercase mb-1">{label}</span>
                      <input
                        aria-label={label}
                        value={contact[key]}
                        onChange={(e) => setContact({ ...contact, [key]: e.target.value })}
                        className="w-full border-none p-0 text-sm"
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                {sections.map((s) => (
                  <article
                    key={s.id}
                    draggable
                    onDragStart={() => (dragId.current = s.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDropSection(s.id)}
                    className="bx no-print grab"
                    aria-label={`Section ${s.title}`}
                  >
                    <div className="flex items-stretch border-b-3 border-line">
                      <span
                        className="flex items-center px-3 border-r-3 border-line text-dim select-none"
                        aria-hidden
                      >
                        ⠿
                      </span>
                      <input
                        aria-label="Section title"
                        value={s.title}
                        onChange={(e) => updateSection(s.id, { title: e.target.value })}
                        className="flex-1 border-none font-display text-lg px-3 py-2"
                      />
                      <button
                        onClick={() => removeSection(s.id)}
                        aria-label={`Remove section ${s.title}`}
                        className="px-4 border-l-3 border-line font-display hover:bg-ink hover:text-black"
                      >
                        ✕
                      </button>
                    </div>
                    {s.entries?.length ? (
                      <div className="p-3 space-y-4">
                        {s.entries.map((en, ei) => (
                          <div key={ei} className="border-3 border-line">
                            <div className="grid grid-cols-2 gap-x-4 p-2 border-b-3 border-line">
                              <input
                                aria-label="Role"
                                value={en.role}
                                onChange={(e) =>
                                  updateSection(s.id, {
                                    entries: s.entries!.map((x, i) =>
                                      i === ei ? { ...x, role: e.target.value } : x,
                                    ),
                                  })
                                }
                                placeholder="ROLE"
                                className="border-none p-1 font-display text-sm"
                              />
                              <input
                                aria-label="Dates"
                                value={en.dates}
                                onChange={(e) =>
                                  updateSection(s.id, {
                                    entries: s.entries!.map((x, i) =>
                                      i === ei ? { ...x, dates: e.target.value } : x,
                                    ),
                                  })
                                }
                                placeholder="DATES"
                                className="border-none p-1 text-sm text-right"
                              />
                              <input
                                aria-label="Company"
                                value={en.company}
                                onChange={(e) =>
                                  updateSection(s.id, {
                                    entries: s.entries!.map((x, i) =>
                                      i === ei ? { ...x, company: e.target.value } : x,
                                    ),
                                  })
                                }
                                placeholder="COMPANY"
                                className="border-none p-1 text-sm"
                              />
                            </div>
                            <textarea
                              aria-label="Entry bullets"
                              value={en.bullets.join("\n")}
                              onChange={(e) =>
                                updateSection(s.id, {
                                  entries: s.entries!.map((x, i) =>
                                    i === ei
                                      ? { ...x, bullets: e.target.value.split("\n") }
                                      : x,
                                  ),
                                })
                              }
                              rows={Math.max(3, en.bullets.length + 1)}
                              className="w-full border-none p-2 text-sm resize-y"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        aria-label="Section bullets"
                        value={s.bullets.join("\n")}
                        onChange={(e) =>
                          updateSection(s.id, { bullets: e.target.value.split("\n") })
                        }
                        rows={Math.max(3, s.bullets.length + 1)}
                        className="w-full border-none p-3 text-sm resize-y"
                      />
                    )}
                  </article>
                ))}
              </div>
              {/* print-only rendering of the sheet content */}
              {sections.length === 0 && (
                <p className="no-print text-dim text-sm">
                  NO SECTIONS — ADD ONE
                </p>
              )}
              <div className="print-classic hidden print:block">
                <p className="print-classic-name">{contact.name}</p>
                <p className="print-classic-title">{contact.title}</p>
                <p className="print-classic-contact">
                  {[contact.email, contact.location, contact.linkedin, contact.portfolio, contact.github]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {sections.map((s) => (
                  <div key={s.id}>
                    <p className="print-classic-h">{s.title}</p>
                    {s.entries?.length ? (
                      s.entries.map((en, i) => (
                        <div key={i} className="mb-2">
                          <p className="print-classic-role">
                            {en.role} <span className="print-classic-dates">| {en.dates}</span>
                          </p>
                          <p className="print-classic-company">{en.company}</p>
                          <ul className="print-classic-list">
                            {en.bullets.filter(Boolean).map((b, j) => (
                              <li key={j}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <ul className="print-classic-list">
                        {s.bullets.filter(Boolean).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* STEP 3 — COVER LETTER */}
        {step === 3 && result && (
          <section aria-label="Cover letter">
            <div className="no-print flex items-baseline justify-between flex-wrap gap-4 mb-6">
              <h2 className="font-display text-3xl md:text-5xl">COVER LETTER.</h2>
              <button
                onClick={() => void exportPdf("cover")}
                disabled={exporting}
                className="btn-brutal btn-primary shadow-hard-accent px-4 py-2 text-sm"
              >
                {exporting ? "EXPORTING…" : "EXPORT PDF ▶"}
              </button>
            </div>
            <div className="print-sheet bx p-6 md:p-10 max-w-3xl space-y-5 text-base leading-relaxed">
              <div className="no-print space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="block text-xs uppercase tracking-widest text-[var(--dim)] mb-1">COMPANY</span>
                    <input
                      className="w-full px-2 py-1"
                      value={coverLetter.company}
                      onChange={(e) => setCoverLetter({ ...coverLetter, company: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    <span className="block text-xs uppercase tracking-widest text-[var(--dim)] mb-1">HIRING MANAGER</span>
                    <input
                      className="w-full px-2 py-1"
                      value={coverLetter.hiringManager}
                      onChange={(e) => setCoverLetter({ ...coverLetter, hiringManager: e.target.value })}
                    />
                  </label>
                </div>
                {coverLetter.body.map((p, i) => (
                  <textarea
                    key={i}
                    className="w-full px-2 py-1 leading-relaxed"
                    rows={Math.max(3, Math.ceil(p.length / 70))}
                    value={p}
                    onChange={(e) =>
                      setCoverLetter((c) => ({
                        ...c,
                        body: c.body.map((x, xi) => (xi === i ? e.target.value : x)),
                      }))
                    }
                  />
                ))}
              </div>
              <div className="hidden print:block print-cover">
                <p className="print-cover-head">{contact.name}<br />{contact.email}{contact.location ? ` · ${contact.location}` : ""}</p>
                <p className="print-cover-date">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                {(coverLetter.company || coverLetter.hiringManager) && (
                  <p className="print-cover-recipient">
                    {coverLetter.company}
                    {coverLetter.company && coverLetter.hiringManager ? <br /> : null}
                    {coverLetter.hiringManager}
                  </p>
                )}
                <p className="print-cover-salutation">
                  {coverLetter.hiringManager ? `Dear ${coverLetter.hiringManager},` : "Dear Hiring Manager,"}
                </p>
                {coverLetter.body.map((p, i) => (
                  <p key={i} className="print-cover-p">
                    {p}
                  </p>
                ))}
                <p className="print-cover-signoff">Sincerely,</p>
                <p className="print-cover-sign">{contact.name}</p>
              </div>
            </div>
          </section>
        )}

        {/* STEP 4 — INTERVIEW PREP */}
        {step === 4 && result && (
          <section aria-label="Interview prep">
            <h2 className="font-display text-3xl md:text-5xl mb-6">INTERVIEW PREP.</h2>
            <ol className="space-y-6">
              {result.interviewPrep.questions.map((q, i) => (
                <li key={i} className="bx">
                  <div className="border-b-3 border-line p-4 flex gap-4 items-baseline">
                    <span className="font-display text-3xl text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-lg">{q.question}</h3>
                  </div>
                  <dl className="p-4 text-sm space-y-3">
                    <div>
                      <dt className="text-dim">WHY THEY ASK</dt>
                      <dd>{q.why}</dd>
                    </div>
                    <div>
                      <dt className="text-dim">ANSWER SKETCH</dt>
                      <dd>{q.answerSketch}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ol>
          </section>
        )}

        {step > 0 && result && (
          <div className="no-print mt-10 flex justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="btn-brutal shadow-hard px-6 py-3"
            >
              ◀ BACK
            </button>
            {step < 4 && (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="btn-brutal btn-primary shadow-hard-accent px-6 py-3"
              >
                NEXT ▶
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
