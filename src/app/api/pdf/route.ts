import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import type { ResumeSection, Contact, ExperienceEntry, CoverLetter } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function resumeHtml(sections: ResumeSection[], contact: Contact): string {
  const contactLine = [contact.email, contact.location, contact.linkedin, contact.portfolio, contact.github]
    .filter((v) => v && v.trim())
    .join(" · ");
  const entryBlock = (e: ExperienceEntry) => `
<div class="entry">
  <p class="entry-head"><span class="role">${esc(e.role)}</span><span class="dates">${esc(e.dates)}</span></p>
  <p class="company">${esc(e.company)}</p>
  <ul>${e.bullets.filter(Boolean).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
</div>`;
  const body = sections
    .map((s) => {
      const list =
        s.entries && s.entries.length
          ? s.entries.map(entryBlock).join("")
          : `<ul>${s.bullets.filter(Boolean).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`;
      return `<h2>${esc(s.title)}</h2>${list}`;
    })
    .join("");
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  body { font-family: Georgia, 'Times New Roman', serif; color: #111; margin: 0; }
  .name { text-align: center; text-transform: uppercase; font-weight: bold; font-size: 21pt; margin: 0 0 4pt; }
  .rule { border: none; border-top: 1px solid #9ca3af; margin: 0 0 6pt; }
  .title { text-align: center; font-size: 11pt; margin: 0 0 3pt; }
  .contact { text-align: center; font-size: 9.5pt; margin: 0 0 10pt; }
  h2 { font-size: 12.5pt; text-transform: uppercase; border-bottom: 1px solid #9ca3af; margin: 10pt 0 5pt; padding-bottom: 2pt; }
  ul { margin: 0 0 8pt; padding-left: 18pt; list-style-type: disc; }
  li { font-size: 10.5pt; line-height: 1.5; margin-bottom: 3pt; }
  .entry { margin: 0 0 8pt; page-break-inside: avoid; }
  .entry-head { display: flex; justify-content: space-between; align-items: baseline; margin: 4pt 0 0; }
  .role { font-size: 11pt; font-weight: bold; }
  .dates { font-size: 9.5pt; font-style: italic; }
  .company { font-size: 10.5pt; font-style: italic; margin: 0 0 2pt; }
</style></head>
<body>
  <p class="name">${esc(contact.name)}</p>
  <hr class="rule">
  <p class="title">${esc(contact.title)}</p>
  <p class="contact">${esc(contactLine)}</p>
  ${body}
</body></html>`;
}

function coverHtml(cover: CoverLetter, contact: Contact): string {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const recipient = cover.hiringManager
    ? `Dear ${cover.hiringManager},`
    : "Dear Hiring Manager,";
  const companyLines = [
    cover.company,
    cover.hiringManager,
  ]
    .filter((v) => v && v.trim())
    .join("\n");
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  body { font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; line-height: 1.6; color: #111; margin: 0; padding-bottom: 1.5in; }
  .letter-head { margin: 0 0 12pt; line-height: 1.4; }
  .letter-date { margin: 0 0 12pt; }
  .letter-recipient { margin: 0 0 12pt; line-height: 1.4; white-space: pre-line; }
  .salutation { margin: 0 0 8pt; }
  .signoff { margin: 18pt 0 0; }
  .signature { margin: 4pt 0 0; font-weight: bold; }
  p { margin: 0 0 4mm; text-align: justify; }
</style></head>
<body>
  <p class="letter-head">${esc(contact.name)}<br>${esc(contact.email)}${contact.location ? `<br>${esc(contact.location)}` : ""}</p>
  <p class="letter-date">${esc(today)}</p>
  ${companyLines ? `<p class="letter-recipient">${esc(companyLines)}</p>` : ""}
  <p class="salutation">${esc(recipient)}</p>
  ${cover.body.filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join("")}
  <p class="signoff">Sincerely,</p>
  <p class="signature">${esc(contact.name)}</p>
</body></html>`;
}

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as
      | { kind: "resume"; sections: ResumeSection[]; contact: Contact }
      | { kind: "cover"; cover: CoverLetter; contact: Contact };

    // ponytail: per-request browser launch, fine for single-user local tool; pool if concurrent exports hurt
    const browser = await puppeteer.launch({ headless: true });
    try {
      const page = await browser.newPage();
      const html =
        data.kind === "resume"
          ? resumeHtml(data.sections, data.contact)
          : coverHtml(data.cover, data.contact);
      await page.setContent(html, { waitUntil: "load" });
      const pdf = await page.pdf({
        format: "Letter",
        printBackground: true,
        margin: { top: "0.6in", bottom: "0.6in", left: "0.6in", right: "0.6in" },
      });
      const filename = data.kind === "resume" ? "resume.pdf" : "cover-letter.pdf";
      return new Response(pdf as unknown as BodyInit, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    } finally {
      await browser.close();
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "PDF export failed" }, { status: 500 });
  }
}
