---
name: Tot or Not
description: A potato-dish ranking app dressed as the world's most serious restaurant guide.
colors:
  backdrop: 'oklch(40% 0.15 26)'
  backdrop-deep: 'oklch(33% 0.13 26)'
  brand: 'oklch(43% 0.16 26)'
  brand-strong: 'oklch(35% 0.14 26)'
  brand-text: 'oklch(43% 0.16 26)'
  gold: 'oklch(60% 0.12 84)'
  gold-bright: 'oklch(78% 0.125 88)'
  bg: 'oklch(97.5% 0.004 25)'
  surface: 'oklch(99.4% 0.002 25)'
  surface-sunken: 'oklch(94.5% 0.007 25)'
  ink: 'oklch(22% 0.02 25)'
  ink-secondary: 'oklch(40% 0.03 25)'
  ink-muted: 'oklch(49% 0.025 25)'
  on-brand: 'oklch(97.5% 0.008 25)'
  on-brand-soft: 'oklch(88% 0.035 25)'
  rule: 'oklch(86% 0.014 25)'
  rule-strong: 'oklch(70% 0.025 25)'
typography:
  page-title:
    fontFamily: 'Bodoni Moda, Bodoni MT, Didot, Georgia, serif'
    fontSize: 'clamp(2.75rem, 4.5vw + 1.25rem, 4.25rem)'
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: '-0.015em'
  menu-display:
    fontFamily: 'Bodoni Moda, Bodoni MT, Didot, Georgia, serif'
    fontSize: '1.125rem'
    fontWeight: 650
    lineHeight: 1.12
    letterSpacing: '-0.01em'
  page-subtitle:
    fontFamily: 'Bodoni Moda, Bodoni MT, Didot, Georgia, serif'
    fontSize: 'clamp(1.125rem, 1vw + 0.875rem, 1.375rem)'
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 'normal'
  body:
    fontFamily: 'Hanken Grotesk, system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 'normal'
  course-label:
    fontFamily: 'Hanken Grotesk, system-ui, sans-serif'
    fontSize: '0.75rem'
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: '0.18em'
rounded:
  sharp: '2px'
  frame: '1px'
  pill: '9999px'
spacing:
  card-pad: 'clamp(1.25rem, 4vw, 3.5rem)'
  plate-mat: '10px'
components:
  button-primary:
    backgroundColor: '{colors.brand}'
    textColor: '{colors.on-brand}'
    rounded: '{rounded.sharp}'
    padding: '12px 32px'
  button-primary-hover:
    backgroundColor: '{colors.brand-strong}'
    textColor: '{colors.on-brand}'
  course-card:
    backgroundColor: '{colors.surface}'
    textColor: '{colors.ink}'
    rounded: '{rounded.sharp}'
  menu-input:
    backgroundColor: '{colors.surface-sunken}'
    textColor: '{colors.ink}'
    rounded: '{rounded.sharp}'
    padding: '10px 16px'
  menu-card:
    backgroundColor: '{colors.bg}'
    textColor: '{colors.ink}'
    rounded: '{rounded.sharp}'
    padding: '{spacing.card-pad}'
---

# Design System: Tot or Not

## 1. Overview

**Creative North Star: "The Red Guide"**

The page is not a website about a restaurant guide; the page _is_ the guide. The entire viewport is bound in guide-red, deepening top to bottom like the cover of a leather book, and every screen of content is printed on a single cream menu card lifted off that cover and ringed with an engraved gilt double-frame. Potatoes are treated with the unblinking gravity of a Michelin inspection: dishes are "courses," the leaderboard is "The Guide," rank is awarded in stars, and the joke is that none of the production value ever once acknowledges that it is about fried potatoes. The reverence is the comedy.

This system rejects three things by name. It is **not a generic SaaS landing page**: no Inter, no white-on-white, no gradient buttons, no identical icon-card grids, no hero-metric template. It is **not kitsch theme overload**: the old diner execution piled on checkerboards, neon glow, and chrome until the theme drowned the content; here the personality is carried by typography, a committed color, and engraved detail, not by decoration. And it is **one design under two lights**, never two designs: light ("day service") and dark ("night service") are the same composition, the same red book, the same frame, with only the room's lighting turned down. Dark mode is a dimmed dining room, not an inverted palette.

Restraint is deliberate but never timid. The red is _committed_: it owns 40%+ of every screen as the bound cover. Whitespace inside the card is generous and editorial; the type does the talking.

**Key Characteristics:**

- A drenched guide-red backdrop framing one cream menu card per screen.
- Gilt engraved double-frame as the signature container motif.
- Bodoni Moda (Didone display) over Hanken Grotesk (quiet grotesque body).
- Michelin stars as the house currency: rank, dividers, the winner stamp.
- Sharp 2px corners everywhere; this is printed matter, not soft UI.
- Identical structure across light and dark; only lightness shifts.

## 2. Colors

A committed oxblood-red identity (hue 26) anchors everything, with a single warm gold (hue ~84) reserved for honors, all sitting on red-tinted neutrals so nothing reads as pure gray. Every value below is OKLCH and is the canonical source (the frontmatter carries the same values; Stitch's hex linter warning is accepted on purpose, per the project's OKLCH doctrine). Each token has a day-service value and a night-service value; the night values live in the `.dark` scope and in the sidecar.

### Primary

- **Guide Red** (`oklch(43% 0.16 26)`, dark `oklch(50% 0.17 26)`): the brand. Buttons, the "vs." mark, the active-selection check, link text, focus rings. This is the spine of the identity.
- **Guide Red, Deepened** (`oklch(35% 0.14 26)`): primary-button hover only. A press into the cover.
- **Cover Red / Cover Red Deep** (`oklch(40% 0.15 26)` → `oklch(33% 0.13 26)`; dark `oklch(22% 0.06 26)` → `oklch(17% 0.045 26)`): the drenched backdrop gradient. This is the leather cover the whole page is bound in. It is the largest single area of color on every screen and is the reason the palette reads as "Committed," not "Restrained."

### Secondary

- **Honors Gold** (`oklch(60% 0.12 84)`, dark `oklch(80% 0.125 88)`): stars, the engraved frame tint, divider stars. Strictly for honors and ornament, never for body or CTAs.
- **Winner Gold** (`oklch(86% 0.155 92)`, fixed): the winner stamp star only. A fixed bright value because it always sits on dish photography, never on a theme surface.

### Neutral

- **Card Cream** (`oklch(97.5% 0.004 25)`, dark `oklch(17% 0.012 25)`): the menu-card page surface; the "paper" everything is printed on.
- **Raised Surface** (`oklch(99.4% 0.002 25)`, dark `oklch(21% 0.015 25)`): course cards, notices, the help modal.
- **Sunken Surface** (`oklch(94.5% 0.007 25)`, dark `oklch(14.5% 0.01 25)`): inputs, image mats, info-dot chips.
- **Ink / Ink Secondary / Ink Muted** (`oklch(22% 0.02 25)` / `oklch(40% 0.03 25)` / `oklch(49% 0.025 25)`; dark `oklch(93% 0.008 25)` / `oklch(78% 0.016 25)` / `oklch(67% 0.016 25)`): body text ramp on the card. All carry a faint red tint (hue 25) so they harmonize with the cover.
- **On-Brand / On-Brand Soft** (`oklch(97.5% 0.008 25)` / `oklch(88% 0.035 25)`): text and chrome printed directly on the red cover (wordmark, nav, footer).
- **Rule / Rule Strong** (`oklch(86% 0.014 25)` / `oklch(70% 0.025 25)`; dark `oklch(30% 0.018 25)` / `oklch(44% 0.025 25)`): hairlines, card borders, dotted leaders, input strokes.

### Named Rules

**The Two-Lights Rule.** Light and dark are the same design under different illumination. Every semantic token exists in both scopes and shifts only lightness (and a touch of chroma); composition, hierarchy, and the red-cover framing never change. Never ship a dark treatment that is a different design.

**The Gold-For-Honors Rule.** Gold is earned, never decorative-by-default. It appears on stars, the engraved frame, and dividers. It is forbidden on buttons, body text, and backgrounds.

## 3. Typography

**Display Font:** Bodoni Moda (with Bodoni MT, Didot, Georgia fallback)
**Body Font:** Hanken Grotesk (with system-ui fallback)

**Character:** A high-contrast Didone display paired with a calm, slightly condensed grotesque. The pairing is the whole voice: Bodoni supplies the engraved-menu, fashion-plate formality (the "fine dining" register); Hanken stays quiet and legible so the formality never tips into hard-to-read. Contrast is on a real axis (Didone serif vs. humanist-grotesque sans), never two near-identical sans.

### Hierarchy

- **Page Title** (Bodoni, 700, `clamp(2.75rem, 4.5vw + 1.25rem, 4.25rem)`, line-height 1.05, letter-spacing -0.015em): the one big statement per screen ("Tonight's Tasting", "The Guide"). Always followed by a star divider.
- **Menu Display** (Bodoni, 650, 1.125–2.5rem, line-height 1.12, letter-spacing -0.01em): dish names, section headings, the gold podium names, modal titles. The workhorse display role.
- **Page Subtitle** (Bodoni italic, 500, `clamp(1.125rem, 1vw + 0.875rem, 1.375rem)`): the italic line under each title. Italic Bodoni, not sans, carries the menu-epigraph tone.
- **Body** (Hanken Grotesk, 400, 1rem, line-height 1.6): all prose and UI copy. Capped at ~65ch (`max-w-prose`) for comfortable measure.
- **Course Label** (Hanken Grotesk, 600, 0.75rem, uppercase, letter-spacing 0.18em): the small-caps device. "First Course / Second Course", podium aria, ledger rank numbers. The _only_ sanctioned all-caps tracked label.

### Named Rules

**The One-Label Rule.** Uppercase tracked small-caps is reserved for the course-label role and used sparingly (course markers, rank numbers). It is never sprinkled as an eyebrow above every section; the star divider does that job.

**The Italic-Epigraph Rule.** Subtitles and the winner word are italic Bodoni, never italic sans. Italic display type is the menu's spoken voice.

## 4. Elevation

A hybrid system. The page is otherwise flat printed matter, with exactly one dramatic lift: the menu card floats off the red cover on a deep two-layer shadow, the way a card sits above a book. Course cards carry a quiet ambient shadow and lift 2px on hover. In dark mode, depth additionally comes from surface lightness (raised surfaces are lighter than the card), not from heavier shadow.

### Shadow Vocabulary

- **Card lift** (`box-shadow: 0 2px 8px oklch(0% 0 0 / 25%), 0 24px 64px oklch(0% 0 0 / 35%)`): the menu card off the cover. The signature elevation; used once per screen.
- **Course ambient** (`0 1px 2px oklch(22% 0.02 25 / 5%), 0 8px 24px oklch(22% 0.02 25 / 6%)`): course cards and notices at rest.
- **Course hover** (`0 2px 6px / 7%, 0 14px 36px / 9%`): course card on hover, paired with a -2px translate.

### Named Rules

**The One-Lift Rule.** Only the menu card gets the dramatic shadow. Everything else is flat or quietly ambient. Stacking big shadows turns the page into a pile of floating chrome, which is the kitsch failure mode this system rejects.

## 5. Components

### Buttons

- **Shape:** sharp (2px radius). Printed, not pill-soft.
- **Primary:** Guide Red background, On-Brand text, 12px/32px padding, weight 600. The single most important action per screen ("Find my match", "Send suggestion").
- **Hover / Focus:** background deepens to Guide Red Deepened; `:active` scales to 0.98. Focus-visible draws a 2px Brand-Text outline at 2px offset.
- **Text button:** Brand-Text color, underline with a 35%-opacity rule that solidifies on hover. For tertiary actions ("Start over", inline links).

### Cards / Containers

- **Course card:** Raised Surface background, 1px Rule border, 2px corners, Course-ambient shadow. Hover lifts 2px and strengthens the border. The universal content container (dish cards, sliders, modal, podium plates).
- **Menu card:** the page itself. Card Cream background, the Card-lift shadow, and an engraved gilt double-frame (`3px double` gold, inset ~`clamp(0.5rem, 1.5vw, 1rem)`). Never nested inside another card.
- **Plated image:** photographs sit on a `10px` mat with a 1px hairline around the image, like a plate framed on a menu. Used on dish cards and podium.
- **Internal padding:** card-pad `clamp(1.25rem, 4vw, 3.5rem)` for the menu card; 1rem for course cards.

### Inputs / Fields

- **Style:** Sunken Surface background, 1px Rule stroke, 2px corners, 10px/16px padding.
- **Focus:** border shifts to Brand-Text (no glow). Placeholder uses Ink Muted to keep ≥4.5:1, never a faint gray.

### Notices

- **Full-border, never a stripe.** Error notices use a Brand-Text border with a 6% red wash; success uses a gold border. A 1px full perimeter plus tint, never a colored side-stripe.

### Navigation

- Wordmark + nav links printed directly on the red cover in On-Brand. Links are quiet (On-Brand Soft) with an underline border that fills in on hover and on `aria-current`. The theme toggle is a pill-bordered icon button on the cover. Nav wraps on narrow screens; no hamburger.

### Star Divider (signature)

- Three Honors-Gold stars flanked by hairline rules, centered under every page title. The house ornament that replaces the AI eyebrow.

### The Tasting Arena (signature)

- The head-to-head vote: two plated course cards with a Bodoni-italic "vs." between them. On vote, the winner slides to center and scales up while the loser shrinks and dims; a gold star + italic "Winner" stamp presses onto the winning plate. Horizontal slide on desktop, vertical on mobile. Fully reduced-motion aware (crossfade + dim, no transform).

### The Guide Ledger (signature)

- Top three as a star-tiered podium (3/2/1 gold stars). Ranks 4-10 as menu lines: a course-label rank number, the dish name in Bodoni, a dotted leader, and the Elo score set as the "price" in tabular figures.

### Motion

- Easing is exponential ease-out only: `--ease-out-quart` `cubic-bezier(0.25,1,0.5,1)`, `--ease-out-quint` `cubic-bezier(0.22,1,0.36,1)`, `--ease-out-expo` `cubic-bezier(0.16,1,0.3,1)`. No bounce, no elastic. State changes 150ms, the vote choreography ~500ms. Every animation has a `prefers-reduced-motion` fallback.

## 6. Do's and Don'ts

### Do:

- **Do** keep the red cover carrying 40%+ of every screen and print content on the single framed menu card. The committed red is the identity.
- **Do** keep light and dark the same composition; shift only lightness per the Two-Lights Rule.
- **Do** open every screen with a Page Title plus the three-star divider.
- **Do** reserve gold for honors and the engraved frame (stars, dividers, podium, winner stamp).
- **Do** use sharp 2px corners and full 1px hairline borders; this is printed matter.
- **Do** keep body text on Ink (≥4.5:1 on the card) and pair Bodoni display against Hanken body on a real serif/sans contrast axis.
- **Do** give every animation a reduced-motion fallback and use exponential ease-out curves.

### Don't:

- **Don't** ship the generic SaaS landing look: no Inter/system-default body, no gradient buttons, no identical icon-card grids, no hero-metric template.
- **Don't** pile on kitsch theme decoration (checkerboards, neon glow, chrome). Personality comes from type, the red, and engraved detail, not props.
- **Don't** let light and dark drift into two different designs; a dimmed room is not an inverted palette.
- **Don't** use `border-left`/`border-right` greater than 1px as a colored accent stripe on cards or notices. Full border plus tint instead.
- **Don't** use gradient text (`background-clip: text`); emphasis comes from Bodoni weight and size.
- **Don't** put an uppercase tracked eyebrow above every section. The star divider is the cadence; course-labels are the only sanctioned tracked caps.
- **Don't** stack dramatic shadows. Only the menu card lifts; everything else is flat or quietly ambient.
- **Don't** set body or placeholder text in faint gray. Tinted Ink at full contrast, always.
