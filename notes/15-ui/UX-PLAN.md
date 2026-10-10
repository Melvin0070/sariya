# Sariya UI/UX pass (10 Oct 2026): brief for every screen

Users are busy site people: an owner's engineer or QC person on a slab the evening before a pour, often in sunlight and possibly wearing gloves, with a mason waiting. Every screen must answer "what do I do next?" at a glance.

Look: Uber's black-and-white clarity plus Swiggy's warmth (3D clay illustrations, orange accent, sticky "next step" bar). Research: `DESIGN-RESEARCH.md` (same folder).

## Non-negotiables
1. **One primary action per screen.** It is pinned in the footer as a 56 px black `Button`, or an `ActionBar` when it should also show progress. Keep at most one quiet `TextBtn` under it; remove any other stacked buttons.
2. **Cut what slows the user down for little value:**
   - Show at most one `Notice` per screen, the most important one. Merge or drop the rest.
   - Delete sub-lines that repeat the title or the chip.
   - Move hashes, key fingerprints, frame counts and engine names out of the main path into `<Details>`. Keep them only where they prove trust: the engineer's review and the sign screen.
   - A title plus a `Sub` of one short sentence at most; no paragraph explainers.
3. **Hierarchy:**
   - Sizes: title 32/38 bold; H2 20/26 bold; body 15-16; captions 13. Nothing interactive under 14 px.
   - Every measurement uses `Num` (tabular numerals). The unit is smaller and grey (e.g. value 56, unit 20).
   - Use grey only for secondary text, never for headings.
4. **Colour:**
   - The neutral system carries the screen. Orange (`accent`) appears once per screen at most: promos/DEMO tags and the mason fix.
   - Green, red and amber mean outcomes only, always with an icon and a word (`Chip`).
5. **Touch:** every target is at least 48 px, 56 for primary actions. Use `Press` (scale plus haptic) for every custom tappable; never a bare `Pressable` with `active:opacity`.
6. **Motion:**
   - Wrap list rows and cards in `<Enter i={index}>`, which staggers them in (max 8).
   - Use the existing `Meter` and `Segmented` for progress and language/mode switches.
   - Keep it short: no loops except `Skeleton`.
7. **Illustrations:**
   - `<Illo name=… size=…/>` takes these names: slab, beam, card, tape, phone, records, approve, verify, send, speak, operator, engineer, empty.
   - Use them for member identity, empty, success and onboarding states, and as row leads (`Row illo="slab"`).
   - Stop using the old SVG art in `components/art.tsx` (`MemberArt`, `Clipboard`, `CardArt`, ...). It will be deleted.
8. **Language:** never "safe", "PASS", "certified" or "permit"; the five outcome words stay as they are. Keep the trust copy: source tags, ± bands, "Re-scan", and "not a safety certificate" once per record or sign screen.
9. **Don't change behaviour:**
   - Store actions, routing targets, signing, PIN checks, pack formats and rules stay exactly as they are.
   - This is a presentation and flow-clarity pass. Behaviour may change only where a cut removes a redundant control.

## Primitives (`src/components/ui.tsx`; read it first, do NOT edit it)
`T, Num, Title, Sub, H2, Overline, Press, Enter, Illo, HERO, Screen, IconBtn, TopBar, Tile, Badge, Group, Hairline, Skeleton, Meter, Segmented, Button (kind primary|secondary|accent|success, busy), ActionBar, TextBtn, OUTCOME, Chip, SourceTag, Notice, Row (icon | illo), KV, Details, C (colours), SHADOW, SPRING, tap, thud, success`.

If you need something missing, build it inside your own file and say so in your report.

## Flow (target)
- **Operator:** Home → New (name; the kind is preselected from Home) → Drawing values (choose → keypad → confirm) → Scanner → Checks (the tracking screen) → Readings → Fix (when outside) → Sign (PIN) → Signed → Send.
- **Checks screen = order tracking:**
  - Member illo, then a big tally (`Num`), then a `Meter`.
  - A compact step timeline: Drawing ✓ / camera targets / Readings / Sign, with exactly one active step.
  - Grouped check rows, then a sticky `ActionBar` with "N of M checked" on the left and the next step on the right.
- **Engineer:** Home → Received pack → Review (verdict summary up top, then checks, evidence, drawing; the footer holds the decision) → PIN → Send back.
- **Verifier:** Home → Scan QR → result.

## Rules for parallel agents
- Edit only the files you are assigned. Don't edit `ui.tsx`, `lib/*`, `modules/*`, `android/*` or other agents' files.
- Don't drive the phone or run gradle; Metro hot-reloads to the device and the lead does device QA.
- Before reporting, run `npx tsc --noEmit` and `npx expo lint`, and fix any errors in your files (ignore errors in files you don't own).
- Report back in at most 15 lines: what you cut and why, any new local components, anything risky.
