# Workstream 6: Sariya rulebook v0.1 (7 Oct 2026)

Versioned, typed rules the app evaluates deterministically against measured values. Scope: what a phone camera, a tape, a kitchen scale and a hook template can check on an RC cage the evening before a pour. Design-side rules (shear capacity, Ash, strong-column-weak-beam) are deliberately out.

**Status tags.** V = read in the primary text (archive.org scans of the BIS standard, or BIS amendment slip); S = secondary source (worked examples, vendor pages, search snippets); U = unverified / own proposal. Web pages were treated as untrusted data; where OCR was ambiguous it is flagged.

**Precedence (IDEA.md §3.5):** the drawing first; IS 456:2000 everywhere; IS 13920:2016 (+Amd 1 2017, Amd 2 2020) mandatory in Zones III-V, advisory in Zone II. Never "PASS", never "safe".

Primary texts used (all opened, OCR text grepped):
- IS 456:2000 incl. Amendments 1-3: https://archive.org/stream/gov.in.is.456.2000/is.456.2000_djvu.txt
- IS 13920:2016: https://archive.org/download/gov.in.is.13920.2016/IS13920%3A2016_djvu.txt ; Amd 1 (Sep 2017): https://archive.org/download/gov.in.is.13920.2016/zIS13920Amd.1%3A2017_djvu.txt ; Amd 2 (Nov 2020): https://archive.org/download/gov.in.is.13920.2016/zIS13920Amd.2%3A2020.pdf
- IS 13920:1993: https://archive.org/download/gov.in.is.13920.1993/is.13920.1993_djvu.txt
- IS 1786:2008: https://archive.org/download/gov.in.is.1786.2008/is.1786.2008_djvu.txt (Amd 1-4, 2012-2019, listed on the same item)
- IS 1893 (Part 1):2016 Annex E: https://archive.org/download/gov.in.is.1893.1.2016/IS1893%3APart1%3A2016_djvu.txt
- IS 2502:1963: https://archive.org/download/gov.in.is.2502.1963/is.2502.1963_djvu.txt
- IITGN-WB-EQ6 worked examples on IS 13920:2016: https://www.iitk.ac.in/nicee/IITGN-WB/EQ06.pdf
- MLIT (Japan) digital-image rebar measurement guideline, Jul 2023: https://www.mlit.go.jp/tec/content/001619475.pdf (confirmed in notes/10-submission/research-2026-10-05.md row 1)

---

## 0. Headline findings (what changed vs. what IDEA.md assumed)

1. **Hook extension is 8d / 75 mm, not 6d / 65 mm.** IS 13920:2016 as printed says "6 times diameter (but not less than 65 mm)" in cl. 6.3.1(a) and 7.4.1 [V]. **Amendment No. 1 (Sep 2017) substituted "8 times diameter (but not less than 75 mm)"** in both clauses and in Figs 4 and 10 [V]. Amd 2 (2020) also changed cl. 3.5 definitions to "8 times" [V]. The 1993 edition said 10d / 75 mm [V]. So the current rule is **135° + 8d ≥ 75 mm**. IDEA.md §8 item 5 is answered; update it.
2. **Beam-end link spacing: d/4, 6 × smallest longitudinal bar, 100 mm.** The 2016 print said "8 times" in 6.3.5(b); Amd 1 changed it to **6 times** [V]. 1993 said 8 times with "need not be less than 100 mm" [V]. research-2026-10-05.md row 6 is correct for the amended code.
3. **Column special confining spacing after Amd 1 is just "6 × smallest longitudinal bar".** The 2016 print (cl. 8.1(b), renumbered 7.6.1(b) by Amd 1) listed ¼ of minimum member dimension, 6 × bar dia and 100 mm. Amd 1 substituted item (b) with the single limit "not more than 6 times the diameter of the smallest longitudinal reinforcement bars" [V]. The IITGN examples still apply ¼-dim and 100 mm as "proposed modifications" [S]. The app keeps all three as the stricter advisory set and flags this for the engineer.
4. **IS 13920 scope (cl. 1.1.1): "shall be adopted in all lateral load resisting systems of RC structures located in Seismic Zone III, IV or V. The standard is optional in Seismic Zone II."** [V]. The "5 storeys / 15 m in Zone II" claim seen on infralens.in is **not** in the 2016 text (that was the 1993 Zone III rule, and 15 m appears only in cl. 5.2 for concrete grade) [V]. Treat infralens.in as unreliable; it also prints ACI-style limits (8d, 24 × hoop dia, 300 mm) under an IS 13920 heading.
5. **Bengaluru: Zone II, Z = 0.10** (IS 1893 Part 1:2016 Annex E, "Bangalore (Bengaluru) II 0.10") [V]. Belgaum, Bijapur, Dharwad: III (0.16) [V]. Gulbarga, Chitradurga: II [V]. Mangaluru, Mysuru, Karwar appear in Annex E but the OCR dropped their zone column; coastal Karnataka is Zone III, Mysuru Zone II [S: asc-india.org/seismi/seis-karnataka-goa.htm; vai.bmtpc.org/map/eqmap/EQ_KARNATAKA.pdf]. IS 1893:2025 was withdrawn by gazette on 3 Mar 2026 and the 2016 edition reinstated [S: visionias.in 2026-03-07; prepairo.ai]; keep the IDEA.md ban on "the 2025 code is in force".
6. **IS 456 gives no spacing placement tolerance.** Cl. 12.3.1: effective depth ±10 mm (d ≤ 200) / ±15 mm (d > 200); cl. 12.3.2 and Table 16 note 2: cover +10 / −0 mm [V]. Spacing tolerance is engineer-set (Section C).
7. **IS 456 Amd 3 (2007) changed slab secondary-bar max spacing from 450 to 300 mm** [V, amendment slip in the same scan: "[Page 46, clause 26.3.3(b)(2), last line] — Substitute '300 mm' for '450 mm'"]. The body text of the scan still reads 450; the app uses 300.

---

## A. Typed rule table

Columns: rule_id | code | clause | member | check | formula / limit | units | inputs | zones | mandatory/advisory | default_tolerance (measurement band is separate, see D) | source | status | engineer_confirm

Legend for `zones`: ALL = every zone; 345 = Zones III, IV, V mandatory; 2adv = advisory in Zone II (mandatory if the drawing invokes IS 13920 or the engineer toggles it).

### A1. Drawing-first rules (apply everywhere; the drawing's own values are the limits)

| rule_id | code | clause | member | check | formula / limit | units | inputs | zones | M/A | default_tolerance | source | status | eng |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DWG-COUNT | drawing | - | slab/beam/column | bar count per zone equals drawing | n_meas == n_spec (fewer = outside; more = note) | count | n_spec, n_meas, coverage_ok | ALL | M | 0 bars | drawing | V | no |
| DWG-SPACING-MEAN | drawing | - | slab mesh, beam links, column ties | mean c/c spacing in zone ≤ spec | mean(s_meas) ≤ s_spec + tol_s | mm | s_spec, s_meas[], zone | ALL | M | tol_s = max(10 mm, 0.05·s_spec) [U] | own; cf. Japan 出来形 "平均間隔 ±φ" [S] | U | **yes** |
| DWG-SPACING-LOCAL | drawing | - | same | no single gap grossly over spec | max(s_meas) ≤ s_spec + tol_local | mm | s_meas[] | ALL | A | tol_local = 25 mm [U] | own; cf. ACI 117 ±3 in with "not fewer bars" [S] | U | **yes** |
| DWG-DIA | drawing | - | all | bar diameter class matches drawing | dia_class == dia_spec, else weigh test | mm | close-up still conf ≥ 0.95, or kg/m | ALL | M | class step (8/10/12/16/20) | drawing; IS 1786 Table 1 | V | no |
| DWG-STIRRUP-DIA | drawing | - | beam/column | link diameter matches drawing | same as DWG-DIA | mm | same | ALL | M | class step | drawing | V | no |
| DWG-ENDZONE-LEN | drawing | - | beam | close-spaced zone length ≥ spec | L_close_meas ≥ L_spec − tol | mm | L_spec (default 2d), link positions | ALL | M | −50 mm [U] | drawing; IS 13920 6.3.5 | U | **yes** |
| DWG-HOOK | drawing | - | beam/column | hook type matches drawing (90/135) | hook_meas == hook_spec | enum | template close-up | ALL | M | n/a | drawing | V | no |

### A2. IS 456:2000 (all zones)

| rule_id | code | clause | member | check | formula / limit | units | inputs | zones | M/A | default_tolerance | source | status | eng |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IS456-SLAB-MAIN-SMAX | IS 456:2000 | 26.3.3(b)(1) | slab | main bar max c/c | s ≤ min(3·d, 300) | mm | d (effective depth) or D and cover | ALL | M | 0 (+measurement band) | archive.org IS 456 p.46 | V | no |
| IS456-SLAB-DIST-SMAX | IS 456:2000 + Amd 3 (2007) | 26.3.3(b)(2) | slab | distribution (shrinkage/temperature) bar max c/c | s ≤ min(5·d, 300) [450 before Amd 3] | mm | d | ALL | M | 0 | amendment slip in same scan | V | no |
| IS456-BAR-MINCLEAR-H | IS 456:2000 | 26.3.2(a) | beam/slab | min horizontal clear gap between main bars | gap ≥ max(φ_larger, agg_max + 5) | mm | φ, agg_max (default 20) | ALL | M | 0 | p.45 | V | no |
| IS456-BAR-MINCLEAR-V | IS 456:2000 | 26.3.2(c) | beam (2 rows) | min vertical clear gap | ≥ max(15, 2/3·agg_max, φ_max) | mm | φ_max, agg_max | ALL | M | 0 | p.45 | V | no |
| IS456-COVER-NOM | IS 456:2000 | 26.4.1, 26.4.2, Table 16 | all | nominal cover ≥ exposure value and ≥ φ | cover ≥ max(T16[exposure], φ); T16: mild 20, moderate 30, severe 45, very severe 50, extreme 75; note 1: main bars ≤ 12 mm in mild −5 | mm | exposure (default **moderate** for external, mild internal), φ, tape reading | ALL | M | +10 / −0 (12.3.2, T16 note 2) | p.46-47 | V | exposure class: **yes** |
| IS456-COVER-COL | IS 456:2000 | 26.4.2.1 | column | cover ≥ 40 mm and ≥ φ; 25 mm allowed if min dim ≤ 200 and φ ≤ 12 | as stated | mm | b_min, φ, tape | ALL | M | +10 / −0 | p.46 | V | no |
| IS456-COVER-FOOT | IS 456:2000 | 26.4.2.2 | footing | cover ≥ 50 | as stated | mm | tape | ALL | M | +10 / −0 | p.46 | V | no |
| IS456-COVER-FIRE | IS 456:2000 | 26.4.3, Table 16A | beam/slab/column | cover for fire rating | 0.5-1 h: 20 mm beams/slabs, 40 columns; higher ratings larger (table OCR partial) | mm | fire_rating (default 1 h) | ALL | A | +10 / −0 | p.47 (OCR partial) | S | **yes** if rating > 1 h |
| IS456-BEAM-LINK-SMAX | IS 456:2000 | 26.5.1.5 | beam | max spacing of vertical stirrups | s ≤ min(0.75·d, 300); inclined 45°: ≤ d | mm | d, s_meas | ALL | M | 0 | p.47 | V | no |
| IS456-BEAM-LINK-MIN | IS 456:2000 | 26.5.1.6 | beam | minimum shear reinforcement | Asv/(b·sv) ≥ 0.4/(0.87·fy), fy ≤ 415 → sv ≤ Asv·0.87·fy/(0.4·b). 2L-8 (Asv=100.5), b=230, fy=415: sv ≤ 394 → governed by 0.75d/300 | mm | b, legs, φ_link, fy | ALL | M | 0 | p.47 | V | no |
| IS456-COL-TIE-PITCH | IS 456:2000 | 26.5.3.2(c)(1) | column | tie pitch ≤ least of (b_min, 16·φ_long_min, 300) | as stated | mm | b_min, φ_long_min | ALL | M | 0 | p.49 | V | no |
| IS456-COL-TIE-DIA | IS 456:2000 | 26.5.3.2(c)(2) | column | tie dia ≥ max(φ_long_max/4, 6) | as stated (OCR reads "16 mm"; standard value is 6 mm) | mm | φ_tie, φ_long_max | ALL | M | class step | p.49 | V (6 mm: S, OCR defect) | no |
| IS456-COL-LONG-MIN | IS 456:2000 | 26.5.3.1(a),(c),(d),(g) | column | ≥ 4 bars (rect), ≥ 6 (circ); φ ≥ 12; 0.8-6 % Ag; bars ≤ 300 c/c on periphery | as stated | - | n, φ, b, D | ALL | M | 0 | p.48 | V | no |
| IS456-BEAM-AST-MIN | IS 456:2000 | 26.5.1.1(a) | beam | As_min/(b·d) = 0.85/fy (Fe415: 0.205 %; Fe500: 0.17 %) | as stated | - | b, d, fy, bars | ALL | M | 0 | p.47 | V | no |
| IS456-BEAM-AST-MAX | IS 456:2000 | 26.5.1.1(b), 26.5.1.2 | beam | As ≤ 0.04·b·D (tension and compression each) | as stated | - | b, D, bars | ALL | M | 0 | p.47 | V | no |
| IS456-SLAB-AST-MIN | IS 456:2000 | 26.5.2.1 | slab | As ≥ 0.12 % of b·D (HYSD/welded fabric), 0.15 % (mild steel), each direction | e.g. D=125, 1 m: 150 mm²/m → 8 mm @ ≤ 335; D=150: 180 mm²/m → 8 mm @ ≤ 279 | - | D, φ, s | ALL | M | 0 | p.48 | V | no |
| IS456-SLAB-DIA-MAX | IS 456:2000 | 26.5.2.2 | slab | φ ≤ D/8 | D=125 → ≤ 15.6 (so 16 mm bars fail; 12 ok) | mm | D, φ | ALL | M | 0 | p.48 | V | no |
| IS456-LD | IS 456:2000 | 26.2.1, 26.2.1.1 | all | development length | Ld = φ·σs/(4·τbd); σs = 0.87·fy; τbd (plain) M20 1.2, M25 1.4, M30 1.5, M35 1.7, M40+ 1.9; ×1.6 for deformed bars (IS 1786); ×1.25 for compression. → Fe415/M20 **47φ**; Fe500/M20 57φ; Fe415/M25 40φ; Fe500/M25 49φ; Fe415/M30 38φ | mm | fy, fck, φ | ALL | M | - | p.42-43 | V | fck/fy per drawing |
| IS456-LAP-TENSION | IS 456:2000 (+Amd 3 for a) | 26.2.5.1(c) | beam/slab | lap in flexural tension ≥ max(Ld, 30φ); direct tension ≥ max(2·Ld, 30φ); straight lap ≥ max(15φ, 200). ×1.4 if top bar with cover < 2φ, ×1.4 if corner bar cover < 2φ or clear gap between laps < max(75, 6φ); both → ×2.0 | as stated; Fe415/M20 12 mm → 564 mm; 16 mm → 752 mm | mm | φ, fy, fck, position, tape reading | ALL | M | −25 mm tape band [U] | p.45 | V | no |
| IS456-LAP-COMP | IS 456:2000 | 26.2.5.1(d) | column | lap in compression ≥ max(Ld_comp, 24φ) | Fe415/M20: 37.6φ | mm | φ | ALL | M | −25 mm [U] | p.45 | V | no |
| IS456-LAP-LOCATION | IS 456:2000 (+Amd 3) | 26.2.5, 26.2.5.1(a),(b),(e) | all | laps away from max-stress sections; ≤ 50 % of bars lapped at a section; no lap splices > 32 mm (Amd 3; was 36); staggered if c/c ≥ 1.3·lap; smaller φ governs | as stated | - | lap positions, φ | ALL | M (A for "away from max stress") | - | p.44-45 | V | no |
| IS456-STIRRUP-ANCH | IS 456:2000 | 26.2.2.4(b) | beam/column | stirrup anchorage deemed provided if: 90° bend round a bar ≥ own φ + ≥ 8φ straight; or 135° + ≥ 6φ; or 180° + ≥ 4φ | hook_type + ext_meas ≥ {90: 8φ, 135: 6φ, 180: 4φ} | mm | hook angle, extension | ALL (overridden by IS13920-HOOK in 345) | M | −0 on extension; template band ±5 mm | p.43 | V | no |
| IS456-ANCH-VALUE | IS 456:2000 | 26.2.2.1(b) | main bars | anchorage value: 4φ per 45° of bend, max 16φ; standard U-hook = 16φ; hooks/bends to IS 2502 | info for lap/anchorage arithmetic | mm | - | ALL | A | - | p.43 | V | no |
| IS456-TOL-DEPTH | IS 456:2000 | 12.3.1 | beam/slab | effective-depth placement tolerance | ±10 mm (d ≤ 200), ±15 mm (d > 200), "unless otherwise specified by engineer-in-charge" | mm | d, top/bottom cover tape | ALL | M | as stated | p.21 | V | no |
| IS456-TOL-COVER | IS 456:2000 | 12.3.2 | all | cover tolerance | +10 / −0 from nominal; spacers same nominal size as cover | mm | tape | ALL | M | as stated | p.21 | V | no |
| IS456-CONGESTION | IS 456:2000 + Amd 3 | 26.1.1 note | all | congestion to be avoided | advisory | - | - | ALL | A | - | amendment slip | V | no |

### A3. IS 13920:2016 + Amd 1 (2017) + Amd 2 (2020)

| rule_id | code | clause | member | check | formula / limit | units | inputs | zones | M/A | default_tolerance | source | status | eng |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IS13920-SCOPE | IS 13920:2016 | 1.1.1 | building | applicability | "shall be adopted in all lateral load resisting systems of RC structures located in Seismic Zone III, IV or V. The standard is optional in Seismic Zone II." | - | zone (from Annex E town list or engineer), drawing flag | ALL | M in 345; A in II | - | archive text l.166-169 | V | zone for site: **yes** |
| IS13920-CONC | IS 13920:2016 | 5.2 | building | min concrete M20; M25 if > 15 m high in Zones III-V | info | - | fck, height | 345 | M | - | l.534-540 | V | no |
| IS13920-STEEL | IS 13920:2016 + Amd 2 | 5.3.1 | all | steel: elongation ≥ 14.5 %; UTS/YS 1.15-1.25; Fe415/500/550 only; IS 1786 | mill certificate, not a site check | - | brand/grade mark | 345 | M | - | Amd 2 p.1 | V | no |
| IS13920-BEAM-GEOM | IS 13920:2016 | 6.1.1-6.1.3 | beam | b/D > 0.3 (preferably); b ≥ 200; D ≤ clear span/4 | as stated | mm | b, D, L | 345 / 2adv | M (6.1.1 A) | 0 | l.627-636 | V | no |
| IS13920-BEAM-LONG-MIN | IS 13920:2016 | 6.2.1(a),(b) | beam | ≥ 2 bars of 12 mm top and bottom; ρ_min = 0.24·√fck/fy on any face (M20/Fe415 0.26 %; M25/Fe415 0.29 %; M20/Fe500 0.21 %) | as stated | - | n, φ, b, d, fck, fy | 345 / 2adv | M | 0 | l.695-711; IITGN ex.1 | V | no |
| IS13920-BEAM-LONG-MAX | IS 13920:2016 | 6.2.2 | beam | ρ_max = 0.025 on any face | as stated | - | bars | 345 / 2adv | M | 0 | l.712 | V | no |
| IS13920-BEAM-BOTTOM-HALF | IS 13920:2016 | 6.2.3, 6.2.4 | beam | bottom steel at column face ≥ ½ top steel there; any section ≥ ¼ of max top steel at column faces | as stated | - | bars at face, mid | 345 / 2adv | M | 0 | l.716-731 | V | no |
| IS13920-BEAM-ANCH | IS 13920:2016 | 6.2.5 | beam at exterior joint | anchorage beyond inner column face = Ld + 10φ − 90° bend allowance | as stated | mm | Ld, φ | 345 / 2adv | M | −25 mm [U] | l.732-737 | V | no |
| IS13920-BEAM-LAP | IS 13920:2016 | 6.2.6.1 | beam | lap: closed links over whole lap at ≤ 150 c/c; lap ≥ Ld of largest bar; no lap within joint, within 2d of column face, or within ¼ span of a hinge; ≤ 50 % of bars lapped at a section | as stated | mm | lap position, link spacing in lap, φ | 345 / 2adv | M | spacing 0; length −25 [U] | l.750-770 | V | no |
| IS13920-LINK-VERTICAL | IS 13920:2016 | 6.3.1 | beam | only vertical links (no inclined); hooks engage peripheral bars; cross-tie 90° hooks alternate sides (on slab side if slab one side) | as stated | - | close-up | 345 / 2adv | M | - | l.840-860 | V | no |
| IS13920-HOOK | IS 13920:2016 **+ Amd 1** | 6.3.1(a) (beam), 7.4.1 (column), Figs 4, 10 | beam/column links | closed link / U-link / cross-tie with **135° hook + extension ≥ 8φ and ≥ 75 mm** embedded in core (print: 6φ/65; Amd 1: 8φ/75; 1993: 10φ/75) | ext ≥ max(8·φ_link, 75) → 8 mm link: 75 mm; 10 mm: 80 mm | mm | hook angle, extension, φ_link | 345 / 2adv (drawing may require in II) | M | −0; template band ±5 mm; angle ±10° | Amd 1 p.1-2 | V | no |
| IS13920-LINK-DIA | IS 13920:2016 | 6.3.2 (beam); 7.4.2(a) (column) | beam/column | link φ ≥ 8 mm (column: 10 mm if long. bar > 32 mm) (1993: 6 mm, 8 mm if span > 5 m) | as stated | mm | φ_link | 345 / 2adv | M | class step | l.871; l.1270-1276 | V | no |
| IS13920-BEAM-END-SPACING | IS 13920:2016 **+ Amd 1** | 6.3.5(a)-(c) | beam, end zone 2d from column face (and 2d either side of a hinge) | s ≤ min(d/4, **6**·φ_long_min, 100) (print: 8·φ; Amd 1: 6·φ; 1993: 8·φ, "need not be less than 100") | 230×450, d≈410, 12 mm bars: min(102, 72, 100) = **72 mm**; 16 mm bars: min(102, 96, 100) = 96 | mm | d, φ_long_min, s_meas in zone | 345 / 2adv | M | 0 | l.986-1002; Amd 1 | V | no |
| IS13920-BEAM-FIRST-LINK | IS 13920:2016 | 6.3.5.1 | beam | first link ≤ 50 mm from joint face | x_first ≤ 50 | mm | position of first link from column face | 345 / 2adv | M | 0 (+band) | l.1003-1006 | V | no |
| IS13920-BEAM-ENDZONE-LEN | IS 13920:2016 | 6.3.5, 6.3.5.2 | beam | close spacing over 2d from each end (and 2d each side of a hinge section) | L_close ≥ 2·d | mm | d, link positions | 345 / 2adv | M | −50 [U] | l.986-1012 | V | no |
| IS13920-BEAM-MID-SPACING | IS 13920:2016 | 6.3.5.2 | beam, outside end zones | s ≤ d/2 (and IS 456 0.75d/300) | 230×450: ≤ 205 | mm | d, s_meas | 345 / 2adv | M | 0 | l.1007-1012 | V | no |
| IS13920-NO-CJ-IN-ENDZONE | IS 13920:2016 Amd 1 | 6.3.5.3; 7.4.2(e) | beam/column | no construction joint in close-spaced regions | advisory flag at capture | - | - | 345 / 2adv | M | - | Amd 1 | V | no |
| IS13920-COL-GEOM | IS 13920:2016 + Amd 1 | 7.1.1, 7.1.2 | column | min dimension ≥ max(20·φ_beam_bar, 300) (print: 15·φ in Fig 7; Amd 1: 20); aspect ratio ≥ 0.4 (Amd 1; print 0.45) | as stated; typical 230×300 self-built column **fails** 300 mm | mm | b, D, φ_beam_bar | 345 / 2adv | M | 0 | l.1044-1060; Amd 1 | V | no |
| IS13920-COL-LAP | IS 13920:2016 | 7.3.2.1 | column | lap: closed links at ≤ 100 c/c over lap; lap ≥ Ld of largest bar; only in central half of clear height, not in joint or within 2d of beam face; ≤ 50 % bars at a section; no lap > 32 mm | as stated | mm | lap position, link spacing | 345 / 2adv | M | spacing 0; length −25 [U] | l.1148-1204 | V | no |
| IS13920-COL-TIE-SPACING | IS 13920:2016 | 7.4.2(d) | column, outside lo | s ≤ ½ × least lateral dimension | 230 column → ≤ 115 | mm | b_min, s_meas | 345 / 2adv | M | 0 | l.1340-1345 | V | no |
| IS13920-COL-TIE-LEG | IS 13920:2016 | 7.4.2(b),(c) | column | parallel link legs ≤ 300 c/c; cross-tie if a side > 300 | as stated | mm | b, D | 345 / 2adv | M | 0 | l.1277-1300 | V | no |
| IS13920-CONF-LEN | IS 13920:2016 + Amd 1 (renumbered 8.1 → 7.6.1) | 7.6.1(a) | column (and beam) | special confining length lo from joint face ≥ max(larger lateral dim, clear span/6, 450) | 230×300 col, 3.0 m clear: max(300, 500, 450) = **500 mm** each end | mm | b, D, clear height | 345 / 2adv | M | −50 [U] | l.1419-1440; Amd 1 | V | no |
| IS13920-CONF-SPACING | IS 13920:2016 + Amd 1 | 7.6.1(b) | column within lo | **Amd 1 text:** s ≤ 6·φ_long_min. **2016 print:** s ≤ min(¼ b_min, 6·φ_long_min, 100). 1993 (7.4.6): ≤ ¼ b_min, 75 ≤ s ≤ 100 | app default: stricter set min(¼ b_min, 6·φ, 100); 230 col, 12 mm bars: min(57.5, 72, 100) = 57.5; flag | mm | b_min, φ_long_min, s_meas | 345 / 2adv | M | 0 | l.1441-1447; Amd 1 | V (conflict) | **yes** |
| IS13920-CONF-FOOTING | IS 13920:2016 | 7.6.2 (8.2 in print) | column at footing | confining reinforcement extends ≥ 300 mm into footing | as stated | mm | - | 345 / 2adv | M | - | l.1562 | V | no |
| IS13920-LAP-LINKS-ZONE-II | IS 13920:2016 | 10.8.4 (walls) | wall | in Zones II and III closed links around lapped bars > 16 mm, φ ≥ ¼ bar ≥ 8, ≤ 150 c/c | wall-only; noted because it is one of the few Zone II obligations | mm | - | II, III | M (walls) | 0 | l.2301-2307 | V | no |
| IS13920-GRAVITY-COL | IS 13920:2016 | 11.1.1 | gravity (non-frame) column | links full height ≤ min(6·φ_long_min, 150) | as stated | mm | φ, s | 345 | M | 0 | l.2334-2337 | V | no |

### A4. IS 1786:2008 (material; weigh test)

| rule_id | code | clause | member | check | formula / limit | units | inputs | zones | M/A | default_tolerance | source | status | eng |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IS1786-MASS | IS 1786:2008 | 6.2 Table 1; 7.2.2 Table 2 | bar sample | nominal mass/m: 6: 0.222; **8: 0.395; 10: 0.617; 12: 0.888; 16: 1.58; 20: 2.47; 25: 3.85** kg/m (area 28.3/50.3/78.6/113.1/201.2/314.3/491.1 mm²). Tolerance: ≤ 10 mm ±7 % batch, −8 % individual; 10 < φ ≤ 16 ±5 % batch, −6 % individual; > 16 ±3 % batch, −4 % individual. Density 0.00785 kg/mm²·m | m_meas/L ∈ [nominal·(1−tol_ind), nominal·(1+tol_batch)] | kg/m | scale reading (OCR), length | ALL | M | as stated | archive text l.1400-1700 | V | no |
| IS1786-DIA-BANDS | derived | - | bar sample | diameter class from kg/m: 8 → 0.363-0.423; 10 → 0.568-0.660; 12 → 0.835-0.932; 16 → 1.485-1.659; 20 → 2.371-2.544; 25 → 3.696-3.966 (individual −tol, batch +tol). Non-overlapping, so a 0.2 m offcut (length measured) on a 1 g kitchen scale classifies unambiguously | lookup | kg/m | same | ALL | M | - | derived from IS1786-MASS | V | no |
| IS1786-RIBS | IS 1786:2008 | 5.3-5.6 | bar | ribs: two longitudinal ribs + transverse ribs; bond via mean projected rib area, measured over ≥ 10φ | presence check only (camera); geometry not a site check | - | close-up | ALL | A | - | l.1209-1340 | V | no |
| IS1786-MARK | QCO 2024 (Steel and Steel Products (Quality Control) Order, 30 Aug 2024, in force 16 Jun 2025) | - | bar | ISI mark + licence no. + grade mark (Fe 500D etc.) rolled on bar | presence check (OCR of rolled mark) | - | close-up | ALL | A | - | agileregulatory.com; beaconfiling.com [S] | S | no |

### A5. Seismic zone lookup (IS 1893 Part 1:2016 Annex E)

| town | zone | Z | status |
|---|---|---|---|
| Bangalore (Bengaluru) | II | 0.10 | V |
| Chitradurga | II | 0.10 | V |
| Gulbarga (Kalaburagi) | II | 0.10 | V |
| Belgaum (Belagavi) | III | 0.16 | V |
| Bijapur (Vijayapura) | III | 0.16 | V |
| Dharwad | III | 0.16 | V |
| Mysuru | II | 0.10 | S (listed in Annex E; OCR lost the column) |
| Mangaluru | III | 0.16 | S (same) |
| Karwar | III | 0.16 | S (same) |
| Hyderabad, Chennai (for reference) | II, III | 0.10, 0.16 | V |

Code status: IS 1893 (Part 1):2016 + Amd 1 (2017) + Amd 2 (2020) in force; IS 1893:2025 withdrawn 3 Mar 2026 [S]. The app ships the Annex E list and lets the engineer override.

---

## B. rules.json (loadable; mirrors table A)

Conventions: `limit` is an expression over `inputs` and `params`; `op` is the comparison applied as `measured op limit`; `tol` is the placement tolerance added to the limit side (sign follows the rule); the measurement band `u` is supplied per measurement at runtime, never from this file. `zones`: `"ALL"`, `"345"` (mandatory III-V, advisory II), `"II,III"`. `severity`: `M` mandatory, `A` advisory. `verdicts` are always one of `within`, `outside`, `needs_tape`, `not_seen`, `rescan` (abstain).

```json
{
  "rulebook_version": "0.1.0",
  "date": "2026-10-07",
  "precedence": ["drawing", "IS456:2000+A3", "IS13920:2016+A1+A2"],
  "zone_policy": {"345": "mandatory", "II": "advisory_unless_drawing_or_engineer", "I": "advisory"},
  "zones_annexE": {"Bengaluru": "II", "Chitradurga": "II", "Gulbarga": "II", "Mysuru": "II", "Belgaum": "III", "Bijapur": "III", "Dharwad": "III", "Mangaluru": "III", "Karwar": "III"},
  "params_default": {"fy": 415, "fck": 20, "agg_max": 20, "exposure": "moderate", "fire_h": 1.0, "tol_spacing_mm": 10, "tol_spacing_frac": 0.05, "tol_local_mm": 25, "tol_len_mm": 50, "tol_tape_mm": 25, "tol_hook_mm": 5, "tol_hook_deg": 10},
  "cover_table16_mm": {"mild": 20, "moderate": 30, "severe": 45, "very_severe": 50, "extreme": 75},
  "bond_stress_plain": {"20": 1.2, "25": 1.4, "30": 1.5, "35": 1.7, "40": 1.9},
  "is1786_mass_kg_per_m": {"6": 0.222, "8": 0.395, "10": 0.617, "12": 0.888, "16": 1.58, "20": 2.47, "25": 3.85},
  "is1786_tol_pct": [{"max_dia": 10, "batch": 7, "individual_minus": 8}, {"max_dia": 16, "batch": 5, "individual_minus": 6}, {"max_dia": 99, "batch": 3, "individual_minus": 4}],
  "rules": [
    {"id": "DWG-COUNT", "code": "drawing", "clause": "-", "member": ["slab", "beam", "column"], "check": "count", "measured": "n_meas", "op": "==", "limit": "n_spec", "tol": 0, "units": "count", "inputs": ["n_spec", "n_meas", "coverage_ok"], "zones": "ALL", "severity": "M", "tier": 1, "status": "V", "engineer_confirm": false, "src": "drawing"},
    {"id": "DWG-SPACING-MEAN", "code": "drawing", "clause": "-", "member": ["slab", "beam", "column"], "check": "spacing_mean", "measured": "mean(s_meas)", "op": "<=", "limit": "s_spec", "tol": "max(tol_spacing_mm, tol_spacing_frac*s_spec)", "units": "mm", "inputs": ["s_spec", "s_meas[]", "zone_id"], "zones": "ALL", "severity": "M", "tier": 1, "status": "U", "engineer_confirm": true, "src": "own; cf. Japan dekigata ±phi"},
    {"id": "DWG-SPACING-LOCAL", "code": "drawing", "clause": "-", "member": ["slab", "beam", "column"], "check": "spacing_max_gap", "measured": "max(s_meas)", "op": "<=", "limit": "s_spec", "tol": "tol_local_mm", "units": "mm", "inputs": ["s_spec", "s_meas[]"], "zones": "ALL", "severity": "A", "tier": 1, "status": "U", "engineer_confirm": true, "src": "own; cf. ACI 117"},
    {"id": "DWG-DIA", "code": "drawing", "clause": "-", "member": ["slab", "beam", "column"], "check": "dia_class", "measured": "dia_class", "op": "==", "limit": "dia_spec", "tol": 0, "units": "mm", "inputs": ["dia_spec", "dia_class", "dia_conf", "kg_per_m"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "drawing; IS1786 T1"},
    {"id": "DWG-ENDZONE-LEN", "code": "drawing", "clause": "-", "member": ["beam"], "check": "endzone_length", "measured": "L_close_meas", "op": ">=", "limit": "L_spec", "tol": "-tol_len_mm", "units": "mm", "inputs": ["L_spec", "link_positions[]"], "zones": "ALL", "severity": "M", "tier": 1, "status": "U", "engineer_confirm": true, "src": "drawing; IS13920 6.3.5"},
    {"id": "DWG-HOOK", "code": "drawing", "clause": "-", "member": ["beam", "column"], "check": "hook_type", "measured": "hook_meas", "op": "==", "limit": "hook_spec", "tol": 0, "units": "enum", "inputs": ["hook_spec", "hook_meas"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "drawing"},

    {"id": "IS456-SLAB-MAIN-SMAX", "code": "IS456:2000", "clause": "26.3.3(b)(1)", "member": ["slab"], "check": "spacing_mean", "measured": "mean(s_meas)", "op": "<=", "limit": "min(3*d, 300)", "tol": 0, "units": "mm", "inputs": ["d", "s_meas[]"], "zones": "ALL", "severity": "M", "tier": 1, "status": "V", "engineer_confirm": false, "src": "https://archive.org/stream/gov.in.is.456.2000/is.456.2000_djvu.txt"},
    {"id": "IS456-SLAB-DIST-SMAX", "code": "IS456:2000+A3", "clause": "26.3.3(b)(2)", "member": ["slab"], "check": "spacing_mean", "measured": "mean(s_meas)", "op": "<=", "limit": "min(5*d, 300)", "tol": 0, "units": "mm", "inputs": ["d", "s_meas[]"], "zones": "ALL", "severity": "M", "tier": 1, "status": "V", "engineer_confirm": false, "src": "same; Amd 3 (2007) 450->300"},
    {"id": "IS456-BAR-MINCLEAR-H", "code": "IS456:2000", "clause": "26.3.2(a)", "member": ["beam", "slab"], "check": "clear_gap_min", "measured": "min(gap_meas)", "op": ">=", "limit": "max(dia_larger, agg_max+5)", "tol": 0, "units": "mm", "inputs": ["dia", "agg_max", "gap_meas[]"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS456-COVER-NOM", "code": "IS456:2000", "clause": "26.4.1;26.4.2;T16", "member": ["slab", "beam", "column"], "check": "cover", "measured": "cover_tape", "op": ">=", "limit": "max(cover_table16_mm[exposure] - (5 if exposure=='mild' and dia<=12 else 0), dia)", "tol": 0, "tol_plus": 10, "units": "mm", "inputs": ["exposure", "dia", "cover_tape"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": true, "src": "same"},
    {"id": "IS456-COVER-COL", "code": "IS456:2000", "clause": "26.4.2.1", "member": ["column"], "check": "cover", "measured": "cover_tape", "op": ">=", "limit": "25 if (b_min<=200 and dia<=12) else max(40, dia)", "tol": 0, "tol_plus": 10, "units": "mm", "inputs": ["b_min", "dia", "cover_tape"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS456-COVER-FOOT", "code": "IS456:2000", "clause": "26.4.2.2", "member": ["footing"], "check": "cover", "measured": "cover_tape", "op": ">=", "limit": "50", "tol": 0, "tol_plus": 10, "units": "mm", "inputs": ["cover_tape"], "zones": "ALL", "severity": "M", "tier": 3, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS456-BEAM-LINK-SMAX", "code": "IS456:2000", "clause": "26.5.1.5", "member": ["beam"], "check": "spacing_mean", "measured": "mean(s_meas)", "op": "<=", "limit": "min(0.75*d, 300)", "tol": 0, "units": "mm", "inputs": ["d", "s_meas[]"], "zones": "ALL", "severity": "M", "tier": 1, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS456-BEAM-LINK-MIN", "code": "IS456:2000", "clause": "26.5.1.6", "member": ["beam"], "check": "spacing_mean", "measured": "mean(s_meas)", "op": "<=", "limit": "legs*3.1416*dia_link^2/4*0.87*min(fy,415)/(0.4*b)", "tol": 0, "units": "mm", "inputs": ["legs", "dia_link", "fy", "b", "s_meas[]"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS456-COL-TIE-PITCH", "code": "IS456:2000", "clause": "26.5.3.2(c)(1)", "member": ["column"], "check": "spacing_mean", "measured": "mean(s_meas)", "op": "<=", "limit": "min(b_min, 16*dia_long_min, 300)", "tol": 0, "units": "mm", "inputs": ["b_min", "dia_long_min", "s_meas[]"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS456-COL-TIE-DIA", "code": "IS456:2000", "clause": "26.5.3.2(c)(2)", "member": ["column"], "check": "dia_class", "measured": "dia_link", "op": ">=", "limit": "max(dia_long_max/4, 6)", "tol": 0, "units": "mm", "inputs": ["dia_link", "dia_long_max"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same (6 mm: OCR reads 16; standard value 6)"},
    {"id": "IS456-COL-LONG-MIN", "code": "IS456:2000", "clause": "26.5.3.1", "member": ["column"], "check": "count_and_dia", "measured": "n_long,dia_long_min,perim_spacing", "op": "multi", "limit": "n>=4 (rect) or 6 (circ); dia>=12; 0.008<=As/Ag<=0.06; perim_spacing<=300", "tol": 0, "units": "mixed", "inputs": ["n_long", "dia_long_min", "b", "D", "shape"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS456-BEAM-AST-MIN", "code": "IS456:2000", "clause": "26.5.1.1(a)", "member": ["beam"], "check": "area_ratio", "measured": "As/(b*d)", "op": ">=", "limit": "0.85/fy", "tol": 0, "units": "ratio", "inputs": ["bars[]", "b", "d", "fy"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS456-BEAM-AST-MAX", "code": "IS456:2000", "clause": "26.5.1.1(b);26.5.1.2", "member": ["beam"], "check": "area_ratio", "measured": "As/(b*D)", "op": "<=", "limit": "0.04", "tol": 0, "units": "ratio", "inputs": ["bars[]", "b", "D"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS456-SLAB-AST-MIN", "code": "IS456:2000", "clause": "26.5.2.1", "member": ["slab"], "check": "area_per_m", "measured": "1000*3.1416*dia^2/4/mean(s_meas)", "op": ">=", "limit": "(0.0012 if hysd else 0.0015)*1000*D", "tol": 0, "units": "mm2/m", "inputs": ["dia", "s_meas[]", "D", "hysd"], "zones": "ALL", "severity": "M", "tier": 1, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS456-SLAB-DIA-MAX", "code": "IS456:2000", "clause": "26.5.2.2", "member": ["slab"], "check": "dia_class", "measured": "dia", "op": "<=", "limit": "D/8", "tol": 0, "units": "mm", "inputs": ["dia", "D"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS456-LD", "code": "IS456:2000", "clause": "26.2.1;26.2.1.1", "member": ["all"], "check": "derived", "measured": "-", "op": "=", "limit": "dia*0.87*fy/(4*bond_stress_plain[fck]*1.6) ; compression: /1.25", "tol": 0, "units": "mm", "inputs": ["dia", "fy", "fck"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same", "note": "Fe415/M20 = 47.0 dia; Fe500/M20 = 56.6 dia; Fe415/M25 = 40.3 dia"},
    {"id": "IS456-LAP-TENSION", "code": "IS456:2000", "clause": "26.2.5.1(c)", "member": ["beam", "slab"], "check": "lap_length", "measured": "lap_tape", "op": ">=", "limit": "max(Ld, 30*dia) * (1.4 if top_cover<2*dia else 1) * (1.4 if (corner_cover<2*dia or lap_gap<max(75,6*dia)) else 1)", "tol": "-tol_tape_mm", "units": "mm", "inputs": ["dia", "fy", "fck", "lap_tape", "top_cover", "corner_cover", "lap_gap"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same", "note": "straight lap >= max(15*dia, 200)"},
    {"id": "IS456-LAP-COMP", "code": "IS456:2000", "clause": "26.2.5.1(d)", "member": ["column"], "check": "lap_length", "measured": "lap_tape", "op": ">=", "limit": "max(Ld/1.25, 24*dia)", "tol": "-tol_tape_mm", "units": "mm", "inputs": ["dia", "fy", "fck", "lap_tape"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS456-LAP-LOCATION", "code": "IS456:2000+A3", "clause": "26.2.5;26.2.5.1(a),(b),(e)", "member": ["all"], "check": "lap_rules", "measured": "lap_frac_at_section,dia,stagger", "op": "multi", "limit": "lap_frac<=0.5; dia<=32; stagger c/c>=1.3*lap", "tol": 0, "units": "mixed", "inputs": ["lap_positions[]", "dia"], "zones": "ALL", "severity": "M", "tier": 3, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS456-STIRRUP-ANCH", "code": "IS456:2000", "clause": "26.2.2.4(b)", "member": ["beam", "column"], "check": "hook_ext", "measured": "hook_ext", "op": ">=", "limit": "{90: 8, 135: 6, 180: 4}[hook_angle] * dia_link", "tol": 0, "units": "mm", "inputs": ["hook_angle", "hook_ext", "dia_link"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same", "overridden_by": "IS13920-HOOK"},
    {"id": "IS456-TOL-DEPTH", "code": "IS456:2000", "clause": "12.3.1", "member": ["beam", "slab"], "check": "effective_depth", "measured": "d_meas", "op": "within", "limit": "d_spec", "tol": "10 if d_spec<=200 else 15", "units": "mm", "inputs": ["d_spec", "d_meas"], "zones": "ALL", "severity": "M", "tier": 3, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS456-TOL-COVER", "code": "IS456:2000", "clause": "12.3.2", "member": ["all"], "check": "cover", "measured": "cover_tape", "op": "within", "limit": "cover_nom", "tol": "+10/-0", "units": "mm", "inputs": ["cover_nom", "cover_tape"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},

    {"id": "IS13920-SCOPE", "code": "IS13920:2016", "clause": "1.1.1", "member": ["building"], "check": "applicability", "measured": "zone", "op": "in", "limit": "['III','IV','V']", "tol": 0, "units": "enum", "inputs": ["zone", "drawing_invokes_13920", "engineer_toggle"], "zones": "ALL", "severity": "M", "tier": 1, "status": "V", "engineer_confirm": true, "src": "https://archive.org/download/gov.in.is.13920.2016/IS13920%3A2016_djvu.txt", "quote": "shall be adopted in all lateral load resisting systems of RC structures located in Seismic Zone III, IV or V. The standard is optional in Seismic Zone II."},
    {"id": "IS13920-BEAM-GEOM", "code": "IS13920:2016", "clause": "6.1.2;6.1.3", "member": ["beam"], "check": "geometry", "measured": "b,D", "op": "multi", "limit": "b>=200; D<=L_clear/4", "tol": 0, "units": "mm", "inputs": ["b", "D", "L_clear"], "zones": "345", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS13920-BEAM-LONG-MIN", "code": "IS13920:2016", "clause": "6.2.1", "member": ["beam"], "check": "count_and_ratio", "measured": "n_top,n_bot,rho_face", "op": "multi", "limit": "n_top>=2 and n_bot>=2 with dia>=12; rho_face>=0.24*sqrt(fck)/fy", "tol": 0, "units": "mixed", "inputs": ["bars_top[]", "bars_bot[]", "b", "d", "fck", "fy"], "zones": "345", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS13920-BEAM-LONG-MAX", "code": "IS13920:2016", "clause": "6.2.2", "member": ["beam"], "check": "area_ratio", "measured": "rho_face", "op": "<=", "limit": "0.025", "tol": 0, "units": "ratio", "inputs": ["bars[]", "b", "d"], "zones": "345", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS13920-BEAM-BOTTOM-HALF", "code": "IS13920:2016", "clause": "6.2.3;6.2.4", "member": ["beam"], "check": "area_ratio", "measured": "As_bot_face/As_top_face, As_any/As_top_face_max", "op": "multi", "limit": ">=0.5 ; >=0.25", "tol": 0, "units": "ratio", "inputs": ["bars_top_face[]", "bars_bot_face[]", "bars_mid[]"], "zones": "345", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS13920-BEAM-LAP", "code": "IS13920:2016", "clause": "6.2.6.1", "member": ["beam"], "check": "lap_rules", "measured": "lap_link_spacing,lap_len,lap_pos,lap_frac", "op": "multi", "limit": "lap_link_spacing<=150; lap_len>=Ld(dia_max); lap not within joint, not within 2d of column face, not within L/4 of hinge; lap_frac<=0.5", "tol": 0, "units": "mixed", "inputs": ["link_positions[]", "lap_positions[]", "d", "dia_max"], "zones": "345", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS13920-HOOK", "code": "IS13920:2016+A1", "clause": "6.3.1(a);7.4.1;Fig4;Fig10", "member": ["beam", "column"], "check": "hook", "measured": "hook_angle,hook_ext", "op": "multi", "limit": "hook_angle==135 and hook_ext>=max(8*dia_link, 75)", "tol": 0, "tol_meas_mm": 5, "tol_meas_deg": 10, "units": "mm", "inputs": ["hook_angle", "hook_ext", "dia_link"], "zones": "345", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "https://archive.org/download/gov.in.is.13920.2016/zIS13920Amd.1%3A2017_djvu.txt", "history": {"1993": "10d >= 75", "2016 print": "6d >= 65", "2017 Amd1": "8d >= 75"}},
    {"id": "IS13920-LINK-DIA", "code": "IS13920:2016", "clause": "6.3.2;7.4.2(a)", "member": ["beam", "column"], "check": "dia_class", "measured": "dia_link", "op": ">=", "limit": "10 if (member=='column' and dia_long_max>32) else 8", "tol": 0, "units": "mm", "inputs": ["dia_link", "dia_long_max"], "zones": "345", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS13920-BEAM-END-SPACING", "code": "IS13920:2016+A1", "clause": "6.3.5(a)-(c)", "member": ["beam"], "zone_of_member": "end", "check": "spacing_mean", "measured": "mean(s_meas_end)", "op": "<=", "limit": "min(d/4, 6*dia_long_min, 100)", "tol": 0, "units": "mm", "inputs": ["d", "dia_long_min", "s_meas_end[]"], "zones": "345", "severity": "M", "tier": 1, "status": "V", "engineer_confirm": false, "src": "same + Amd1", "history": {"1993": "d/4, 8d, need not be < 100", "2016 print": "d/4, 8d, 100", "2017 Amd1": "d/4, 6d, 100"}},
    {"id": "IS13920-BEAM-FIRST-LINK", "code": "IS13920:2016", "clause": "6.3.5.1", "member": ["beam"], "check": "first_link_offset", "measured": "x_first", "op": "<=", "limit": "50", "tol": 0, "units": "mm", "inputs": ["x_first"], "zones": "345", "severity": "M", "tier": 1, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS13920-BEAM-ENDZONE-LEN", "code": "IS13920:2016", "clause": "6.3.5;6.3.5.2", "member": ["beam"], "check": "endzone_length", "measured": "L_close_meas", "op": ">=", "limit": "2*d", "tol": "-tol_len_mm", "units": "mm", "inputs": ["d", "link_positions[]"], "zones": "345", "severity": "M", "tier": 1, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS13920-BEAM-MID-SPACING", "code": "IS13920:2016", "clause": "6.3.5.2", "member": ["beam"], "zone_of_member": "mid", "check": "spacing_mean", "measured": "mean(s_meas_mid)", "op": "<=", "limit": "d/2", "tol": 0, "units": "mm", "inputs": ["d", "s_meas_mid[]"], "zones": "345", "severity": "M", "tier": 1, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS13920-COL-GEOM", "code": "IS13920:2016+A1", "clause": "7.1.1;7.1.2", "member": ["column"], "check": "geometry", "measured": "b_min,aspect", "op": "multi", "limit": "b_min>=max(20*dia_beam_bar_max, 300); aspect>=0.4", "tol": 0, "units": "mm", "inputs": ["b", "D", "dia_beam_bar_max"], "zones": "345", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same + Amd1"},
    {"id": "IS13920-COL-LAP", "code": "IS13920:2016", "clause": "7.3.2.1", "member": ["column"], "check": "lap_rules", "measured": "lap_link_spacing,lap_len,lap_pos,lap_frac", "op": "multi", "limit": "lap_link_spacing<=100; lap_len>=Ld(dia_max); lap within central half of clear height; lap_frac<=0.5; dia<=32", "tol": 0, "units": "mixed", "inputs": ["link_positions[]", "lap_positions[]", "H_clear", "dia_max"], "zones": "345", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS13920-COL-TIE-SPACING", "code": "IS13920:2016", "clause": "7.4.2(d)", "member": ["column"], "zone_of_member": "mid", "check": "spacing_mean", "measured": "mean(s_meas_mid)", "op": "<=", "limit": "0.5*b_min", "tol": 0, "units": "mm", "inputs": ["b_min", "s_meas_mid[]"], "zones": "345", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS13920-COL-TIE-LEG", "code": "IS13920:2016", "clause": "7.4.2(b),(c)", "member": ["column"], "check": "leg_spacing", "measured": "leg_cc_max,side_max", "op": "multi", "limit": "leg_cc_max<=300; side_max>300 requires cross-tie", "tol": 0, "units": "mm", "inputs": ["b", "D", "crosstie_present"], "zones": "345", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same"},
    {"id": "IS13920-CONF-LEN", "code": "IS13920:2016+A1", "clause": "7.6.1(a) (8.1(a) in print)", "member": ["column", "beam"], "check": "confining_length", "measured": "lo_meas", "op": ">=", "limit": "max(max(b,D), L_clear/6, 450)", "tol": "-tol_len_mm", "units": "mm", "inputs": ["b", "D", "L_clear", "link_positions[]"], "zones": "345", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "same + Amd1"},
    {"id": "IS13920-CONF-SPACING", "code": "IS13920:2016+A1", "clause": "7.6.1(b) (8.1(b) in print)", "member": ["column"], "zone_of_member": "end", "check": "spacing_mean", "measured": "mean(s_meas_end)", "op": "<=", "limit": "min(b_min/4, 6*dia_long_min, 100)", "limit_amd1_literal": "6*dia_long_min", "tol": 0, "units": "mm", "inputs": ["b_min", "dia_long_min", "s_meas_end[]"], "zones": "345", "severity": "M", "tier": 2, "status": "V-conflict", "engineer_confirm": true, "src": "same + Amd1", "history": {"1993 7.4.6": "<= b_min/4, 75..100", "2016 print 8.1(b)": "b_min/4, 6d, 100", "2017 Amd1": "6d only"}},
    {"id": "IS13920-GRAVITY-COL", "code": "IS13920:2016", "clause": "11.1.1", "member": ["column_gravity"], "check": "spacing_mean", "measured": "mean(s_meas)", "op": "<=", "limit": "min(6*dia_long_min, 150)", "tol": 0, "units": "mm", "inputs": ["dia_long_min", "s_meas[]"], "zones": "345", "severity": "M", "tier": 3, "status": "V", "engineer_confirm": false, "src": "same"},

    {"id": "IS1786-MASS", "code": "IS1786:2008", "clause": "6.2 T1; 7.2.2 T2", "member": ["bar"], "check": "mass_per_m", "measured": "kg_per_m", "op": "within", "limit": "is1786_mass_kg_per_m[dia_spec]", "tol": "-individual_minus% / +batch%", "units": "kg/m", "inputs": ["scale_kg", "length_m", "dia_spec"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "https://archive.org/download/gov.in.is.1786.2008/is.1786.2008_djvu.txt"},
    {"id": "IS1786-DIA-BANDS", "code": "derived", "clause": "-", "member": ["bar"], "check": "dia_from_mass", "measured": "kg_per_m", "op": "lookup", "limit": "{8:[0.363,0.423],10:[0.568,0.660],12:[0.835,0.932],16:[1.485,1.659],20:[2.371,2.544],25:[3.696,3.966]}", "tol": 0, "units": "kg/m", "inputs": ["scale_kg", "length_m"], "zones": "ALL", "severity": "M", "tier": 2, "status": "V", "engineer_confirm": false, "src": "derived from IS1786-MASS"},
    {"id": "IS1786-MARK", "code": "QCO-2024", "clause": "-", "member": ["bar"], "check": "mark_present", "measured": "mark_ocr", "op": "present", "limit": "ISI mark + licence no + grade", "tol": 0, "units": "enum", "inputs": ["close_up"], "zones": "ALL", "severity": "A", "tier": 3, "status": "S", "engineer_confirm": false, "src": "https://www.agileregulatory.com/blogs/bis-is-1786-high-strength-reformed-steel-bars"}
  ]
}
```

---

## C. Ambiguities an engineer must settle before Friday (10 Oct)

1. **Spacing placement tolerance (DWG-SPACING-MEAN / -LOCAL).** IS 456 gives none. Proposed defaults: mean spacing over a zone ≤ drawing + max(10 mm, 5 %); any single gap ≤ drawing + max(15 mm, 25 %) (advisory; equals +25 mm at 100 mm spacing, and scales for the half-scale demo props). Comparators: Japan MLIT/prefectural 出来形管理基準 for 鉄筋工: average spacing ±φ and cover ±φ [S: hkd.mlit.go.jp, pref.hyogo.lg.jp search hits]; MLIT 2023 image-measurement guideline: image-vs-tape agreement ±5 mm on spacing [V via research row 1]; ACI 117-10: spacing ±3 in (76 mm) but "total number of bars not fewer than specified", cover ±⅜ in for 4-12 in members [S: strand-co.com; fandr.com]; infralens.in checklist claims "±50 mm" for India [S, low trust]; BS EN 13670 Annex G values not retrievable (U). Decide: 10 mm or φ? Separate tolerance for slab vs. links?
2. **IS 13920 cl. 7.6.1(b) after Amd 1.** Literal amended text leaves only "6 × smallest longitudinal bar"; the app defaults to the stricter print set (¼ b_min, 6φ, 100). Confirm which to enforce in Zone III sites, and whether this matters in Bengaluru at all (Zone II, advisory).
3. **Zone II policy.** IS 13920 is "optional" in Zone II. Options: (a) off unless the drawing says "IS 13920" / "ductile"; (b) on as advisory with a different colour; (c) engineer toggle per project. Also: should 135° hooks be *recommended* in Zone II on every site? (IS 456 accepts 90° + 8φ.)
4. **Exposure class default.** Table 16: mild 20 / moderate 30 / severe 45. Bengaluru external members are usually "moderate" (30 mm); is 20 mm for slabs internal and 25 mm for beams (common on drawings) acceptable? The drawing wins, but the app needs a default when the drawing is silent.
5. **Effective depth d for slab rules.** 3d/300 and 5d/300 need d; from the drawing's D and cover (d ≈ D − cover − φ/2) or from a tape? Default: compute from D and nominal cover; mark "needs tape" if D unknown.
6. **End-zone definition for beams without a drawing length.** Default 2d from column face (IS 13920 6.3.5). Many self-built drawings say "600 mm" or "L/4". Which wins when the drawing is silent on length but gives two spacings?
7. **Lap-length verdict on the camera.** Lap length is a tape reading; confirm the −25 mm band and whether to flag laps at mid-span of beams (IS 456 "away from max stress" is a recommendation, IS 13920 6.2.6.1(c) is a prohibition within 2d / L/4).
8. **Hook measurement band.** Template close-up: angle ±10°, extension ±5 mm. Is "70 mm measured vs 75 required" a re-scan or outside?
9. **IS 1786 individual-sample tolerance.** The weigh test uses a 0.2 m offcut, length measured and entered (individual sample: −8 / −6 / −4 %). Confirm the app should not use the batch ±7/±5/±3 for a single piece, and the minimum offcut length (IS 1786 cl. 7.2.3.1 says "any individual sample"; propose ≥ 0.5 m, 1 g scale).
10. **Column tie minimum diameter.** The IS 456 scan reads "16 mm" for 26.5.3.2(c)(2); the standard value is 6 mm. Confirm from a clean copy.
11. **Typical fixture values (Section E).** Confirm the demo cage spec matches a drawing the engineer would actually sign: 230×450 beam, 2-16 bottom, 2-12 top, 8 mm 2L links @ 100 ends / 150 mid; 125 mm slab, 8 @ 150 both ways; 230×300 column, 4-12 (note: 230 fails IS 13920 7.1.1 ≥ 300 mm, which is a good Zone-II talking point).

---

## D. Tier-1 subset and verdict logic

Tier-1 checks: slab mesh **count** and **mean spacing** per patch (both directions); beam **link spacing by zone** (end, mid), **first-link offset**, **end-zone length**; the drawing-first comparisons plus the IS 456 ceilings and, when the zone or drawing invokes it, IS 13920 6.3.5.

Rules in Tier 1: DWG-COUNT, DWG-SPACING-MEAN, DWG-SPACING-LOCAL, DWG-ENDZONE-LEN, IS456-SLAB-MAIN-SMAX, IS456-SLAB-DIST-SMAX, IS456-SLAB-AST-MIN, IS456-BEAM-LINK-SMAX, IS13920-SCOPE, IS13920-BEAM-END-SPACING, IS13920-BEAM-FIRST-LINK, IS13920-BEAM-ENDZONE-LEN, IS13920-BEAM-MID-SPACING.

```text
ENUM Verdict = within | outside | rescan | needs_tape | not_seen

STRUCT Measurement:
    value        # e.g. mean spacing (mm) or count
    u            # half-width of the error band from the vision pipeline (mm); 0 for count when coverage proven
    coverage_ok  # bool: coverage map proves the whole zone was seen
    n_samples    # gaps / bars used

STRUCT Context:
    zone          # "II" | "III" | "IV" | "V" | ...
    apply_13920   # (zone in {III,IV,V}) or drawing_invokes_13920 or engineer_toggle
    params        # fy, fck, d, dia_long_min, s_spec_end, s_spec_mid, n_spec, L_end_spec ...
    tol           # tol_spacing_mm, tol_spacing_frac, tol_local_mm, tol_len_mm

FUNCTION compare(meas, op, limit, tol, u):
    # tol: placement tolerance written into the rule (engineer-set); u: measurement band.
    # Abstain when the band straddles the effective limit: the phone cannot say which side.
    IF NOT meas.coverage_ok:            RETURN not_seen
    IF op == "<=":
        L = limit + tol
        IF meas.value + u <= L:         RETURN within
        IF meas.value - u >  L:         RETURN outside
        RETURN rescan                   # |value - L| < u
    IF op == ">=":
        L = limit - tol                 # tol is positive magnitude here
        IF meas.value - u >= L:         RETURN within
        IF meas.value + u <  L:         RETURN outside
        RETURN rescan
    IF op == "==":                      # counts
        IF u == 0: RETURN within IF meas.value == limit ELSE outside
        RETURN rescan IF abs(meas.value - limit) <= u ELSE outside

FUNCTION check_slab_patch(patch, ctx):
    results = []
    FOR dir IN [main, dist]:
        m_count   = patch.count[dir]          # u = 0 if coverage proven, else 1
        m_spacing = patch.spacing_mean[dir]   # u from homography + segmentation error propagation
        results += (DWG-COUNT,        compare(m_count, "==", ctx.n_spec[dir], 0, m_count.u))
        tol_s = max(ctx.tol.tol_spacing_mm, ctx.tol.tol_spacing_frac * ctx.s_spec[dir])
        results += (DWG-SPACING-MEAN, compare(m_spacing, "<=", ctx.s_spec[dir], tol_s, m_spacing.u))
        m_gapmax = patch.spacing_max[dir]
        results += (DWG-SPACING-LOCAL, compare(m_gapmax, "<=", ctx.s_spec[dir], ctx.tol.tol_local_mm, m_gapmax.u))  # advisory
        IF ctx.d IS NULL: results += (IS456-SLAB-*-SMAX, needs_tape)   # need D (tape) to get d
        ELSE:
            lim = min(3*ctx.d, 300) IF dir == main ELSE min(5*ctx.d, 300)
            results += (IS456-SLAB-{MAIN|DIST}-SMAX, compare(m_spacing, "<=", lim, 0, m_spacing.u))
            As_per_m = 1000 * pi*dia^2/4 / m_spacing.value   # dia from drawing (Tier 1 trusts the spec; Tier 2 verifies)
            lim_As = (0.0012 if hysd else 0.0015) * 1000 * ctx.D
            results += (IS456-SLAB-AST-MIN, compare(Measurement(As_per_m, u=As_per_m*m_spacing.u/m_spacing.value), ">=", lim_As, 0, ...))
    RETURN results

FUNCTION check_beam(beam, ctx):
    results = []
    d = ctx.d                                     # from drawing: D - cover - link dia - bar dia/2; else needs_tape
    L_end = ctx.L_end_spec OR 2*d                 # drawing wins; default IS 13920 2d
    FOR end IN [left, right]:
        Z = beam.links_within(end, L_end)         # link positions measured along the strip fiducial
        m_end = Z.spacing_mean ; m_first = Z.first_offset ; m_len = beam.close_zone_length(end)
        # drawing-first
        tol_s = max(ctx.tol.tol_spacing_mm, ctx.tol.tol_spacing_frac * ctx.s_spec_end)
        results += (DWG-SPACING-MEAN[end], compare(m_end, "<=", ctx.s_spec_end, tol_s, m_end.u))
        results += (DWG-ENDZONE-LEN[end],  compare(m_len, ">=", L_end, ctx.tol.tol_len_mm, m_len.u))
        # IS 456 ceiling applies everywhere
        results += (IS456-BEAM-LINK-SMAX[end], compare(m_end, "<=", min(0.75*d, 300), 0, m_end.u))
        # IS 13920 only when applicable; advisory in Zone II
        IF ctx.apply_13920:
            sev = "M" IF ctx.zone IN {III,IV,V} ELSE "A"
            lim = min(d/4, 6*ctx.dia_long_min, 100)
            results += (IS13920-BEAM-END-SPACING[end], compare(m_end, "<=", lim, 0, m_end.u), sev)
            results += (IS13920-BEAM-FIRST-LINK[end],  compare(m_first, "<=", 50, 0, m_first.u), sev)
            results += (IS13920-BEAM-ENDZONE-LEN[end], compare(m_len, ">=", 2*d, ctx.tol.tol_len_mm, m_len.u), sev)
    M = beam.links_mid(L_end)
    m_mid = M.spacing_mean
    tol_s = max(ctx.tol.tol_spacing_mm, ctx.tol.tol_spacing_frac * ctx.s_spec_mid)
    results += (DWG-SPACING-MEAN[mid],      compare(m_mid, "<=", ctx.s_spec_mid, tol_s, m_mid.u))
    results += (IS456-BEAM-LINK-SMAX[mid],  compare(m_mid, "<=", min(0.75*d, 300), 0, m_mid.u))
    IF ctx.apply_13920:
        results += (IS13920-BEAM-MID-SPACING, compare(m_mid, "<=", d/2, 0, m_mid.u), sev)
    RETURN results

FUNCTION member_summary(results):
    # Never "PASS". Report counts by verdict and list every non-within rule with the number.
    n_within  = count(r.verdict == within)
    n_outside = count(r.verdict == outside AND r.severity == M)
    n_adv     = count(r.verdict == outside AND r.severity == A)
    n_rescan  = count(r.verdict == rescan)
    n_tape    = count(r.verdict == needs_tape)
    n_unseen  = count(r.verdict == not_seen)
    RETURN "{n_within} within limits, {n_outside} outside, {n_adv} advisory, {n_rescan} re-scan, {n_tape} need a tape reading, {n_unseen} not seen"

# Spoken fix (example): rule DWG-SPACING-MEAN[left] outside, measured 180 ± 6 vs spec 100 over 600 mm
#   extra_links = ceil(L_end / s_spec) - count_in_zone  -> "Beam B2, left end: links at 180, drawing says 100 for the first 600 mm. Add 4."
```

Worked numbers for the demo fixture (230 × 450 beam, cover 25, 8 mm links, 16 mm bottom bars → d ≈ 450 − 25 − 8 − 8 = 409):
- IS 456 ceiling: min(0.75 × 409, 300) = **306 → 300 mm**.
- IS 13920 end zone (Zone III+ or if invoked): min(409/4, 6 × 16, 100) = min(102, 96, 100) = **96 mm**; with 12 mm bars: **72 mm**. Mid: ≤ **204 mm**. End-zone length ≥ **818 mm**. First link ≤ 50 mm.
- Drawing 100 c/c ends / 150 mid with tol 10 mm: outside above 110 (ends) / 160 (mid); re-scan if the band straddles.
- Slab 125 mm, 8 @ 150: d ≈ 125 − 20 − 4 = 101 → main ≤ min(303, 300) = **300**; dist ≤ **300** (Amd 3); As_min 0.12 % × 125 × 1000 = **150 mm²/m** → 8 mm spacing ≤ **335 mm**. So the code ceilings are far looser than the drawing; the drawing is the binding limit on nearly every Tier-1 check, which is why the spacing tolerance (C1) matters more than any clause.

---

## E. Typical self-built G+1/G+2 values for the fixture (all S unless noted)

| item | typical | source |
|---|---|---|
| slab | 100-150 mm thick; 8 mm @ 150 c/c main, 8 mm @ 150-200 distribution; sometimes 10 mm @ 125-150 on longer spans; cover 20 | scribd G+1 roof slab drawing (metadata only) [S]; comaron.com [S]; IS 456 minima: 8 @ ≤ 335 for D=125 [V] |
| beam | 230 × 300-450; 2-16 or 2-12 bottom, 2-12 top; 8 mm 2-legged links @ 150 typical, 100 at supports (seismic), 200 on light upper floors | comaron.com [S]; scribd worked example "230×450, 2Y20 bottom, 2Y16 top, Y8 @ 200" [S] |
| column | 230 × 230 to 230 × 380; 4-12 or 4-16, 6-12; 8 mm ties @ 150-200, 100 near joints; 10 mm ties with 20 mm bars | comaron.com [S] |
| IITGN example (Zone V, engineered) | 300 × 600 beam, 10 mm 2L links @ 95 over 1064 mm, 8 mm @ 105 elsewhere; 400 × 500 column, 8 mm confining links @ 55 over lo = 500 | EQ06.pdf [V] |
| steel | Fe 500 / Fe 500D now dominant; Fe 415 on older drawings | IS 1786 grades [V]; market S |
| concrete | M20 (IS 456 min for RCC moderate exposure), M25 on engineered drawings | IS 456 Table 5 [S, not re-read] |

Fixture recommendation: beam 230 × 450, 2-16 bottom + 2-12 top, 8 mm links @ 100 (0-600) / 150 (mid), 135° hooks on one end and 90° on the other (for the hook demo); slab patch 1.0 × 1.0 m, 8 @ 150 both ways with one gap at 225 (sabotage); column stub 230 × 300, 4-12, 8 mm ties @ 150 with a lap at the bottom (sabotage: lap in lower quarter, IS 13920 7.3.2.1).

---

## F. Edition history relevant to the app (all V)

| item | IS 13920:1993 | IS 13920:2016 print | Amd 1 (Sep 2017) | Amd 2 (Nov 2020) |
|---|---|---|---|---|
| scope | Zone IV, V; Zone III if I > 1, industrial, or > 5 storeys | Zones III-V; optional in II | - | - |
| hook extension | 135° + 10d ≥ 75 | 135° + 6d ≥ 65 | **135° + 8d ≥ 75** | cl. 3.5 definitions → 8d |
| beam end-zone link spacing | d/4, 8d, "need not be less than 100" | d/4, 8d, 100 | d/4, **6d**, 100 | - |
| first link | ≤ 50 | ≤ 50 | - | - |
| mid-span | ≤ d/2 | ≤ d/2 | + 6.3.5.3 no construction joint in end zone | - |
| min link dia | 6 (8 if span > 5 m) | 8 | - | - |
| beam lap | - | links ≤ 150 over lap; not within 2d / L/4; ≤ 50 % | couplers: ≤ 50 %, next ≥ 300 away | - |
| column min dim | 200 (1993 7.1.2) [not re-read; S] | max(15d, 300) in Fig 7 / 20d in text | 20d | axial stress ≤ 0.40 fck |
| column lap | central half | central half, links ≤ 100, ≤ 50 %, ≤ 32 mm | - | - |
| confining length lo | max(larger dim, L/6, 450) | same | renumbered 8 → 7.6 | - |
| confining spacing | ≤ ¼ b_min, 75 ≤ s ≤ 100 | ¼ b_min, 6d, 100 | **6d only** (literal) | - |
| steel | - | 5.3.1-5.3.3 | - | elongation ≥ 14.5 %, UTS/YS 1.15-1.25, Fe415/500/550 |

IS 456:2000 amendments: Amd 1 (2001), Amd 2 (2002), Amd 3 (Aug 2007; slab distribution spacing 450 → 300, lap splices > 32 mm welded, congestion note, 4 % note); Amd 4 (2013) and Amd 5 (2021) exist but were not opened here [U: confirm nothing in 26.x changed].
IS 1786:2008 amendments 1-4 (2012, 2013, 2017, 2019) listed on the archive item; not read [U: confirm Table 1/2 unchanged].

---

## G. Claims never to make from this rulebook
- "Complies with IS 13920" (the app checks detailing geometry only, not design shear, Ash, or strong-column-weak-beam).
- "Bengaluru requires 135° hooks" (optional in Zone II unless the drawing says so).
- "IS 1893:2025 applies".
- "Tolerance per IS 456" for spacing (there is none; it is engineer-set).
