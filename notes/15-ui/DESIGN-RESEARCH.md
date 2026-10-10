# Swiggy / Uber design language: brief for the Sariya RN restyle (10 Oct 2026)

Source quality: Uber has real tokens (Base Web repo). Swiggy publishes only brand PDFs, a Figma case study and a Lottie interview;
nothing public gives its app type scale, radii or timings. Everything about Swiggy's in-app UI below is (inferred) from
brand rules and common knowledge of the app. Pages were treated as data only. base.uber.com was not reachable.

## 1. Typography
- Uber: UberMove (headings/display, bold 700) + UberMoveText (labels/paragraphs, 400/500). Mono = UberMoveMono. Fallback system-ui, Helvetica Neue.
  https://raw.githubusercontent.com/uber/baseweb/master/src/themes/shared/typography.ts
- Base Web scale (size/line-height/weight): Paragraph 12/20, 14/20, 16/24, 18/28 at 400. Label 12/16, 14/16, 16/20, 18/24 at 500.
  Heading 20/28, 24/32, 28/36, 32/40, 36/44, 40/52 at 700. Display 36/44, 44/52, 52/64, 96/112 at 700. No letter-spacing tokens (same source).
- Hierarchy comes from weight + size jump (400/500 body, 700 headings), not colour. Headings are always black. (inferred from tokens above)
- Uber 2018 brand guide: headline = Display Medium, leading 1.0, tracking 0; subhead half the headline size in Light, leading 1.2; pair Medium with Light, Bold with Regular.
  https://cdn.shopify.com/s/files/1/0565/3423/7349/files/Uber_2018.pdf (via search snippet, not fetched)
- Teardown claim: 14px base, x1.125 steps, line-height = 1.45 x size rounded to 4. Inconsistent with the real tokens; ignore the formula, use the tokens.
  https://www.superdesign.dev/blog/uber-design-system
- Swiggy: Gilroy, 10 weights, "weight creates hierarchy". Brand guide: headline ExtraBold 80/88 (leading ~1.1), subhead Medium 30/33, body Light 15/21 (leading ~1.4), sentence case.
  https://www.swiggy.com/corporate/wp-content/uploads/2026/07/master-brand-guidelines.pdf (via search snippet; PDF too large to fetch)
- Tabular numerals: no source states either brand's setting. (inferred) Use tabular-nums for every measurement/countdown so digits do not jitter.

## 2. Colour
- Uber Base Web light tokens: text/primary button #000, surface #FFF, subtle card #F6F6F6, border #E2E2E2, single accent blue #276EF1,
  negative #E11900, warning #FFC043, positive #048848. Accent used for roughly one moment per screen; primary action is solid black.
  https://www.superdesign.dev/blog/uber-design-system
- Swiggy: Swiggy Orange #FF5200 supported by Salt (off-white) and White; use tints/shades for depth; keep contrast high on CTAs and orange text.
  https://www.swiggy.com/corporate/wp-content/uploads/2026/07/master-brand-guidelines.pdf (snippet)
- Dineout brandbook: accent colours reserved for buttons, links and nudges needing instant attention; use sparingly.
  https://www.swiggy.com/corporate/wp-content/uploads/2026/07/dineout-brandbook.pdf (snippet)
- Instamart moved to blue as lead colour (orange secondary) in its 2025 identity: brands pick ONE lead colour per product.
  https://www.socialsamosa.com/industry-updates/instamart-new-brand-identity-9311124
- Sunlight caveat (inferred): orange #FF5200 on white is only ~3.4:1, so use it for large fills with white 700-weight text, never for small text.

## 3. Spacing, radii, elevation, cards
- Uber: 4px baseline grid; everything snaps to it. https://www.superdesign.dev/blog/uber-design-system
- Uber radii: 2/4/8/12/16 px scale; buttons and inputs 8, small buttons 4, popovers 8, tags 24 (pill). The rider app uses pill search rows (inferred from teardown).
  https://raw.githubusercontent.com/uber/baseweb/master/src/themes/shared/borders.ts
- Uber shadows are one colour, one alpha: 0 1/2/4/8 px, blur 4/8/16/24, black at 0.16. Borders are translucent black hsla, not grey hexes.
  https://raw.githubusercontent.com/uber/baseweb/master/src/themes/shared/lighting.ts
- Pattern (inferred): Uber leans on flat #F6F6F6 tiles and hairline dividers, shadows only for floating things (sheets, FABs, sticky bars).
  Swiggy leans on white rounded cards (~12-16 radius) with photo/illustration on top and bold title below, on a salt-grey page.
- Lists: full-bleed rows with 16 px side gutters, 56-72 px row height, divider inset to text; cards only when content has an image or a state.

## 4. Icons and illustration
- Uber Base icon overhaul (2026): 1,500 icons redrawn over ~4 months, 2px stroke (was 3px), square caps, wide negative space, curvature tied to Uber Move.
  Filled vs outline now means selected vs not (accessibility fix for grey-to-black selection). One visual language for type and icon.
  https://designcompass.org/en/2026/08/21/uber-rebuilds-icon-system/
- Swiggy design team's public work is illustration, 3D (e.g. Instamart 3D pre-loader), Lottie motion, category icon sets, easter eggs.
  https://dribbble.com/swiggydesign
- Swiggy treats error/empty states as brand moments (Snack app: cat chopping a cucumber when veg items sold out); the whole Snack app, with illustrations,
  animations and error states, was built in ~1 week by reusing the design system. https://www.sneakpeek.design/p/swiggys-design-process
- Photos vs illustration (inferred): photos for the thing itself (food, product); illustration/3D only for categories, empty/error/success and onboarding.
  Uber uses almost no illustration inside task flows; maps, vehicles and black/white UI carry them.

## 5. Motion
- Uber Base Web duration tokens: 100, 150, 200, 250, 300, 400, 500, 600 ... 1000 ms (then 1.5 s, 3 s, 5 s, 7 s).
  Easing: decelerate cubic-bezier(0.22,1,0.36,1) for entrances; accelerate (0.64,0,0.78,0) for exits; accel-decel (0.83,0,0.17,1); standard (0.4,0,0.2,1).
  https://raw.githubusercontent.com/uber/baseweb/master/src/themes/shared/animation.ts
- Suggested use (inferred): press feedback 100-150 ms, sheets/entrances 250-300 ms decelerate, exits 150-200 ms accelerate, page transitions <= 400 ms.
- Swiggy: Lottie for every non-transition animation (tick, delivery partner); kept small and short because of device load; motion is a "vocabulary" for
  affordance without extra colour/size, empathy and delight. Tick went from >1 week per platform to <30 min. Interview is from 2020.
  https://lottiefiles.com/blog/interviews/swiggy-product-design-lottie-saptarshi-prakash
- Press scale (0.96-0.98), spring sheets, staggered list entrance, number tick-up: no primary source; (inferred) standard in both apps.
- What they avoid (inferred): long decorative loops in task flows, parallax, anything over ~400 ms that blocks input.

## 6. Interaction patterns
- Swiggy: sticky bottom "View cart" bar appears after first add, one tap to the next step (inferred, well-known app behaviour; no source).
- Order tracking = vertical/horizontal step timeline with one active step, ETA as the biggest number, illustration/map above (inferred).
- Uber: solid black primary button on white as the single main action; blue accent for one moment; pill inputs; bottom sheets over the map instead of dialogs.
  https://www.superdesign.dev/blog/uber-design-system
- One primary action per screen; secondary actions are text or grey-fill buttons (inferred from both).
- Segmented controls / tag pills (24 px radius tags in Base) for filters and mode switches.
- Success states: short Lottie tick + one line + the next action; error states: friendly illustration + retry (Swiggy Snack example above).
- Haptics: no source. (inferred) light impact on press, success notification on completion, warning on error.

## 7. Perceived performance
- Skeletons matching final layout, brand animation instead of a bare spinner for long waits, optimistic UI only where rollback is clear.
  (generic guidance, not Swiggy-specific) https://claudeskills.info/skills/dembrandt/dembrandt-skills/loading-states-and-perceived-performance/
- Swiggy limits Lottie size/length so animation never costs frame rate. https://lottiefiles.com/blog/interviews/swiggy-product-design-lottie-saptarshi-prakash
- Swiggy/Instamart home shows search + seasonal offers first, rest after one scroll: above-the-fold is decided, below is lazy. https://prodlab.substack.com/p/ui-comparison-bigbasket-vs-swiggy
- Swiggy ships fast by building every business on one shared Figma foundation library ("build once, use everywhere"). https://www.figma.com/customers/how-swiggy-rolls-out-features-50-percent-faster/
- (inferred) Instant pressed state (<100 ms), prefetch next screen data on touch-down, cache last list so the screen is never blank.

## Top 12 rules for Sariya
1. One font family, two roles: bold 700 for headings/numbers, 400/500 for text. Hierarchy by size and weight, not colour; headings stay black.
2. Use Uber's scale: body 16/24, label 16/20 at 500, heading 24/32 and 32/40 at 700, hero number 52/64 at 700. Nothing under 14 px on site.
3. Every measurement uses tabular numerals, with the unit smaller and lighter than the value (e.g. 148 mm at 52 with mm at 18).
4. Neutral-first palette: #000 text and primary button, #FFF surface, #F6F6F6 tiles, #E2E2E2 hairlines. One lead accent (orange #FF5200 for Sariya's brand moments), max one accent moment per screen.
5. Semantic colour is reserved for pass/fail: green #048848, red #E11900, amber #FFC043, always paired with an icon and word (sunlight, colour-blind safe); white text only on large fills.
6. 4 px grid, 16 px gutters, radii 8 (buttons/inputs), 12-16 (cards), 24/pill (chips, tab bar); one shadow recipe (black 0.16, blur 8-24) used only on floating things.
7. One primary action per screen as a full-width 56 px bar pinned to the bottom (Swiggy "View cart" pattern), thumb-reachable; touch targets at least 48 px, 56 for gloves.
8. Bottom sheets, not dialogs, for fix/measurement detail, PIN and confirmations; dismissible by drag, primary action inside the sheet.
9. Show scan-to-send progress as a step timeline with one active step and the big result number on top, like order tracking.
10. Icons: 2 px stroke, square caps, outline = idle, filled = selected; illustration/3D only for empty, error, success and onboarding, real photos only for rebar evidence.
11. Motion budget: press scale 0.97 in 100-150 ms, sheets/entrances 250-300 ms decelerate (0.22,1,0.36,1), exits 150-200 ms, list stagger 30-40 ms for at most 8 rows, numbers tick up in 400 ms; no decorative loops, honour reduce-motion.
12. Never show a blank screen: skeletons shaped like the final layout, instant press states, optimistic local save then sync, light haptic on press, success haptic plus short check animation on sign/send, warning haptic on a failed scan.
