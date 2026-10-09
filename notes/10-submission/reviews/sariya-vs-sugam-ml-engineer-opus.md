## Sariya vs Sugam for shortlisting - AI/ML engineer, chip-maker dev-rel
| | Sariya | Sugam |
|---|---|---|
| Novelty /10 | 8 | 5 |
| Tech impact /10 | 8 | 5 |
| Problem choice /10 | 7 | 9 |
| Scope fit /10 | 5 | 8 |
| Phone-first fit /10 | 9 | 8 |
| Screening total /50 | 37 | 35 |
| Best track to declare | Open Innovation (local model at the core) | Community App (but its "AI at the core" requirement is weak here) |
| One-sentence read (what a screener takes away in 10 seconds) | A phone and a printed card measure rebar count and spacing before the concrete pour, offline on the NPU, and say "re-scan" when unsure. | Lay the phone on a ramp and it tells you whether a wheelchair can use it, then puts the result on a community map. |
| Reason a screener says no | Thin-bar segmentation plus metric stirrup zones, voice, two-key signing and Office Kit is a lot for 48 h. Fine-tuning at the event is unproven, and construction is niche. | The core is an accelerometer and a lookup table; face blur, ASR and Gemma are decoration. Slope apps and accessibility maps already exist and are a common hackathon theme. The Jev/Laya detour reads as noise. |
| Shortlist chance (your rough estimate, %) | 45 | 33 |
| On-site rubric estimate /100 (tie-breaker) | 72 | 73 |

**(1)** Submit Sariya: it is the only one of the two where an on-device model does the core measuring, and it overlaps with neither the 24 winners nor typical entries. Sugam is easier to build, but from my seat the model is decoration.

**(2) Three changes to Sariya's title and description**
1. **Retitle around the measured claim:** "Sariya: on-device rebar check before the concrete pour". The first line of the description should name the pipeline: INT8 rebar segmentation on the Snapdragon NPU, card homography, spacing to ± X mm, abstains near the limit. Right now the model sits several clicks deep.
2. **Cut the description to the Tier-1 build:** count, spacing, stirrup end zones, the IS 456/13920 rulebook and the Hindi fix. Name the public base weights and say what gets fine-tuned on site. Drop the two-key signing, anti-reuse hashing, brand payers and the roadmap. This answers "can they build it" and the open question about pre-trained weights.
3. **Add one real number and one honest boundary:** a pre-event bench or site result (for example "spacing error ±N mm at 50 cm against tape, on M photos"), plus "measures and records; the engineer certifies". Leave out unmeasured figures like "~3 ms segmentation".

**(3) Verified**
- Japan's MLIT issued draft guidelines in 2023 for digital rebar measurement (spacing and diameter from mono or stereo cameras, with markers). Sariya's "Japan already does this" answer holds, so novelty rests on India, phone-only, offline. https://jp.ibtimes.com/kajima-cuts-osaka-rebar-inspection-time-70-mobile-ai-system-104355 ; https://www.kentem.jp/ict/rebar-deg-measurement/ ; https://www.datalabs.jp/en/modely
- On 8 Nov 2024 the Supreme Court ruled in Rajive Raturi v. Union of India and ordered mandatory accessibility rules. Sugam's claim is true. https://indiankanoon.org/doc/98908321/
- An app that measures ramp slope and gives a standard-based accessible/not verdict already existed in 2014 (Access Slope Mini-Tool). This undercuts Sugam's novelty claim that clinometer apps "know no standard". https://www.resna.org/sites/default/files/conference/2014/JEA/Tomashek.html
- Not verified: Sariya's ~3 ms NPU segmentation figure, the NCRB numbers and the CRISIL numbers.
