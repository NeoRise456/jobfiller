---
name: JOBFILLER
description: Brutalist pitch-black single-page resume-tailoring workbench — thick bone borders, hard offset shadows, one acid accent.
colors:
  bg: "#000000"
  ink: "#f5f5f0"
  accent: "#e8ff00"
  dim: "#8a8a80"
  line: "#f5f5f0"
  paper: "#ffffff"
  print-rule: "#9ca3af"
typography:
  display:
    fontFamily: "Archivo Black, sans-serif"
    fontWeight: 400
    textTransform: "uppercase"
  title:
    fontFamily: "Archivo Black, sans-serif"
    fontSize: "1.25rem–1.5rem"
    fontWeight: 400
    textTransform: "uppercase"
  body:
    fontFamily: "Space Mono, ui-monospace, monospace"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Space Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
  print-classic:
    fontFamily: "Georgia, Times New Roman, serif"
    fontSize: "10.5pt body / 12.5pt headers / 21pt name"
    fontWeight: "400 body / 700 headers and name"
    textTransform: "uppercase centered name / uppercase headers"
    note: "print-only export face for the classic single-column resume template; never rendered on screen"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    padding: "12px 24px–20px 40px"
    typography: "{typography.display}"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
  button-brutal:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    padding: "8px 16px–12px 24px"
    typography: "{typography.display}"
  button-brutal-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.bg}"
  button-brutal-disabled:
    textColor: "{colors.dim}"
  input:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    padding: "12px"
    typography: "{typography.body}"
---

# Design System: JOBFILLER

## Overview

**Creative North Star: "The Industrial Verdict Machine"**

JOBFILLER is a resume-tailoring workbench styled as raw industrial machinery: a pitch-black shop floor on which everything is built from one construction set — 3px solid bone-white boxes, hard offset shadows with zero blur, Archivo Black shouting in all-caps, Space Mono doing the measuring. The screen refuses every soft-card SASS convention: no radii, no gradients, no glows, no blur. Depth is faked physically, as a printed card lifted off the ground, and interaction is mechanical — pressing a button physically pushes it into its own shadow.

The accent (#e8ff00, acid yellow) is rationed like a warning light on machinery: it marks the verdict score, the active step, the primary action, and focus. Everything else is bone on black. The machine's only motion is a running marquee and a terminal cursor blink; both stop entirely under reduced-motion.

The workbench ends by flipping its own material: the print export inverts to white paper with black ink, stripping borders and shadows entirely — the machine's product ships as a clean document, not as machinery.

**Key Characteristics:**
- Pitch-black ground (#000000) with bone-white ink (#f5f5f0); one acid accent (#e8ff00)
- 3px solid borders and 6px 6px 0 hard-offset shadows; zero border-radius, zero blur
- Archivo Black (display, uppercase) / Space Mono (body) two-font system
- Accent restricted to score, active state, primary action, focus
- Print flips to white paper; chrome hidden via no-print guards
- Motion limited to marquee (22s linear) and cursor blink (1s steps), both disabled under prefers-reduced-motion

## Colors

A two-tone industrial palette — bone on black — with a single acid warning color and a dim tone for de-emphasis.

### Primary
- **Acid Signal** (#e8ff00): The only chromatic color. Used exclusively on the match score box (border, shadow, text-on-black), the active step-rail tab (background), the primary ANALYZE/EXPORT/NEXT buttons (background, with black text), text-selection, dropzone drag-over state, and focus outlines. Its scarcity is the entire point.

### Neutral
- **Void Black** (#000000): Page ground, button ground, input ground, text on accent/ink surfaces.
- **Bone White** (#f5f5f0): Primary ink, default border color (`--line` shares this value), hard shadow color, hover inversion for buttons and tabs.
- **Machine Gray** (#8a8a80): Dim copy — subheads, miss-keyword lists, disabled buttons, drag-handle glyphs, instructional labels. Never a background.
- **Paper White** (#ffffff): Print-only. The exported sheet's ground and ink target; never visible on screen.

### Named Rules
**The Acid Ration Rule.** #e8ff00 appears only as the score, the active state, the primary action, or a focus ring. If a design needs a second accent, it needs a redesign, not a color.

**The No-Blur Rule.** Shadows are hard offsets (6px 6px 0) with no blur radius and no translucency. No glow, no fade, no soft elevation anywhere — including on the accent.

## Typography

**Display Font:** Archivo Black (sans-serif fallback)
**Body Font:** Space Mono (ui-monospace, monospace fallback)
**Print-Export Font:** Georgia (serif fallback) — classic single-column resume template, print scope only

**Character:** A heavyweight geometric slab of a display face barked in permanent uppercase against a monospaced body that reads like machine output. Two weights exist in the whole system (both 400); hierarchy is carried by size and case, never by weight.

### Hierarchy
- **Display** (400, 2xl–9xl responsive, leading-none): Marquee header (2xl/4xl), page h1 "FEED THE MACHINE." (4xl/7xl), step headers (3xl/5xl), the verdict score itself (8xl/9xl). Always uppercase.
- **Title** (400, lg–xl): Box headers ("01 / RESUME", "VERDICT", "KEYWORDS HIT"), question text, dropzone CTA line. Archivo Black, uppercase.
- **Body** (400, base, leading-relaxed): Verdict prose, cover-letter paragraphs, answer sketches. Space Mono, sentence case.
- **Label** (400, xs–sm, Space Mono): Micro-copy ("PDF / DOCX / TXT — OR CLICK"), dim subheads ("WHY THEY ASK"), keyword chips. Uppercase by convention in copy, not by CSS.

### Named Rules
**The Two-Weight Rule.** Archivo Black 400 and Space Mono 400 are the entire type system. Never introduce a bold, a light, or a third family; scale and case do all the hierarchical work.

## Layout

Single-page workbench, no routing. A full-bleed marquee header band (border-b-3) sits above a step rail of five equal-width tabs (INTAKE / VERDICT / BUILD / COVER / PREP) separated by 3px right borders; locked tabs render dim until a result exists. Content lives in a max-w-7xl centered container at p-4 / md:p-8. Intake pairs two equal boxes in a 2-col grid with the giant ANALYZE action bottom-right; verdict uses an auto/1fr grid (score box beside verdict panel) then 2- and 3-col card grids; build and cover present a single max-w-3xl print sheet. Spacing rhythm is Tailwind's default scale at gap-6 / space-y-6 / mb-6 between major blocks, p-4 inside standard boxes and p-6/md:p-10 inside sheets.

## Elevation & Depth

Depth is structural and physical, never ambient: a 6px 6px 0 hard offset in bone or acid acts as a solid printed edge under an element, the way a card sits on a table. Pressing a `.btn-brutal` translates it 3px/3px and drops the shadow — the button physically descends onto the ground plane. There are no blurred, translucent, or layered shadows in the system, and no tonal layering: on a #000 ground, boxes are separated by their 3px borders, not by surface tints.

### Shadow Vocabulary
- **Hard Bone** (`box-shadow: 6px 6px 0 0 #f5f5f0`): Default elevation on boxes and secondary buttons.
- **Hard Acid** (`box-shadow: 6px 6px 0 0 #e8ff00`): Reserved for primary actions and the score box — the accent's shadow form.

### Named Rules
**The Press-In Rule.** Active/pressed state is `transform: translate(3px, 3px)` with the shadow removed — elements move down-right onto their shadow, never scale, glow, or lift.

## Shapes

The rectangle is the only shape. Border-radius is 0 everywhere. Corners are defined by 3px solid strokes: full boxes (`.bx`), accent boxes (`.bx-accent`), dashed dropzones (`.dropzone`, 3px dashed), and divided composites built from border-b-3 / border-r-3 segments rather than nested rounded cards. The drag handle is a braille column glyph, not a shape. Nothing is rounded, clipped, or organic.

## Components

### Buttons
- **Shape:** sharp rectangle (0 radius), 3px solid border
- **Primary** (`.btn-brutal.btn-primary`): accent ground, black text, accent border and hard-accent shadow; padding scales from px-4 py-2 (sm) to px-10 py-5 (the ANALYZE block). Hover inverts to bone ground/border with black text.
- **Secondary** (`.btn-brutal`): black ground, bone text/border, hard-bone shadow. Hover inverts to bone ground, black text.
- **Active:** translate(3px, 3px), shadow removed.
- **Disabled:** dim border and text, not-allowed cursor, black ground.
- **Focus:** 3px solid accent outline, offset 3px, on `:focus-visible`.

### Chips
- **Style:** keyword chips are border-only — 3px solid line (hits) or 3px solid dim with dim text and line-through (misses), px-2 py-1, text-sm, no fill.
- **State:** hit vs. miss is the only variant; miss is a struck-through dim ghost.

### Cards / Containers
- **Corner Style:** 0 radius, 3px solid bone border
- **Background:** page black; no surface tint
- **Shadow Strategy:** hard bone by default; hard acid only when the box is the score or hosts a primary action
- **Internal Padding:** p-4 standard, p-6/md:p-10 for print sheets
- Divided cards (builder sections, prep items) use border-b-3 header bands with border-r-3 / border-l-3 segments for the handle and remove zones.

### Inputs / Fields
- **Style:** 3px solid bone border, black ground, Space Mono, p-3; borderless variants inside print sheets (`border-none p-0`).
- **Focus:** 3px solid accent outline, 0 offset.
- **Error / Disabled:** errors render as accent-bordered boxes or accent text ("ERR: …"); there is no red.

### Dropzone
- **Style:** 3px dashed bone border, p-6, centered Archivo Black CTA ("DROP RESUME HERE").
- **State:** drag-over flips the border to accent with a faint acid wash (rgba(232,255,0,0.06)); busy dims to 50% opacity with a blinking cursor.
- **Behavior:** role="button", tabIndex 0, Enter and Space activate; click routes through a hidden file input.

### Navigation (Step Rail)
- **Style:** five equal-width Archivo Black tabs divided by 3px right borders; numbered "01 INTAKE" format.
- **Active:** accent ground, black text. **Enabled+hover:** bone ground, black text. **Locked:** dim text, disabled.

### Marquee Header
Signature component. Full-bleed band under border-b-3; one duplicated track of Archivo Black phrases separated by dim ✕ marks scrolls left on a 22s linear loop. Hidden in print; static under reduced-motion.

### Print Sheet
The system's material inversion. `.print-sheet` boxes that carry `.no-print` editing chrome; in `@media print` the body flips to paper white with black ink, all borders/shadows on the sheet are stripped, inputs render as plain text, and screen chrome (marquee, rail, controls) is display:none.

The export itself is the classic single-column resume: Georgia serif, centered uppercase name over a 1px #9ca3af rule, uppercase section heads under the same gray rule, 0.6in page margins. The cover-letter export pairs with it — same serif, date line and body paragraphs sized for a signature. Print-rule gray (#9ca3af) belongs to these two export faces only.

## Do's and Don'ts

### Do:
- **Do** build every surface from the construction set: 3px solid border, 0 radius, black ground, hard offset shadow.
- **Do** carry hierarchy with size and uppercase case in Archivo Black — never with weight.
- **Do** invert on hover (black↔bone) — that binary flip is the system's hover language.
- **Do** keep focus visible: 3px solid accent outline, offset 3px on buttons, 0 on fields.
- **Do** mark every screen-only element `.no-print` and let print sheets go borderless on white paper.

### Don't:
- **Don't** use accent decoratively — score, active step, primary action, focus only (The Acid Ration Rule).
- **Don't** add blur, translucency, gradients, or glow to any shadow (The No-Blur Rule).
- **Don't** round any corner or introduce a second border weight; 3px is the system.
- **Don't** lift or scale on interaction — press in (translate 3px/3px, shadow off) or don't animate.
- **Don't** introduce red/green status colors; errors are accent-bordered, misses are dim and struck through.
- **Don't** animate beyond the marquee and cursor blink; both must respect prefers-reduced-motion.
