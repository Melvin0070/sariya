## Sariya vs Sugam for shortlisting - Organiser's screener (developer-community programme manager)
| | Sariya | Sugam |
|---|---|---|
| Novelty /10 | 8 | 6 |
| Tech impact /10 | 8 | 6 |
| Problem choice /10 | 7 | 8 |
| Scope fit /10 | 5 | 7 |
| Phone-first fit /10 | 9 | 8 |
| Screening total /50 | 37 | 35 |
| Best track to declare | Open Innovation (local NPU model at the core) | Community App (but AI is not at the core of the verdict) |
| One-sentence read (what a screener takes away in 10 seconds) | "A phone checks a house's steel before the concrete covers it." It's new, it's visual and it uses the NPU. | "Lay your phone on a ramp to see if a wheelchair can use it." It's warm and clear, but it reads as a spirit-level app with a map. |
| Reason a screener says no | Can a team train and convert a thin-bar segmenter, do card metrology and run an IS-code rulebook in 48 h? The scope looks like a startup's, and "building safety" carries liability. | The core instrument is the accelerometer, which any phone has. AI sits at the edges (blur, notes). Accessibility mapping is a common hackathon theme, and ramp-slope apps already exist. |
| Shortlist chance (your rough estimate, %) | 45 | 38 |
| On-site rubric estimate /100 (tie-breaker) | 70 | 72 |

**(1)** Submit **Sariya**. It stands out most in a pile of hundreds. It shows off the camera, the NPU and Office Kit better than a tilt reading does, and a steel mesh on stage photographs well for the recap. Its weak spot is that a screener may doubt it can be built, and the description can fix that.

**(2) Three changes to the title and description:**
1. **Lead with a plain hook and drop the jargon.** Use a title like "Sariya: your phone checks the steel before concrete hides it". The first two lines should say who holds the phone, what it measures (bar count, spacing, stirrup end zones) and what it says. ChArUco, homography, IS 13920 clauses, the two keys and the perceptual hash can go to the deck.
2. **Name the sponsor stack in one line.** State that the segmentation runs live on the Snapdragon NPU, that the fix is spoken offline in Hindi or Kannada by an on-device model, and that the engineer signs off on the laptop over Office Kit. Then declare Open Innovation and say why a local model is the core.
3. **Prove it can be built in 48 h.** Give a short Tier-1 list: card-scaled count and spacing on a slab mesh, plus stirrup zones on one beam face. Say the model starts from public pretrained weights, attributed, and is fine-tuned at the event. Add that the team already has frames and tape readings from N Bengaluru sites, and that the demo uses a small tabletop mesh. Diameter, hooks, anti-reuse and the brand programmes should be called roadmap or dropped.

**(3) Verified:**
- The Supreme Court ruled on 8 Nov 2024 (Rajive Raturi v. Union of India) that the government must frame mandatory accessibility rules. Sugam's claim holds: https://indiankanoon.org/doc/98908321/
- Japan's MLIT published trial guidelines for camera-based rebar inspection, dated March 2023, so Sariya's prior-art line is accurate. Japanese companies also offer iPhone LiDAR and mobile AI rebar checks: https://www.mlit.go.jp/gobuild/content/001594736.pdf , https://ken-it.world/it/2023/04/rebar-check-by-iphone-lidar.html
- A ramp-slope app already gives an instant accessible / not-accessible verdict (Access Slope Mini-Tool, RESNA 2014). This weakens Sugam's novelty: https://www.resna.org/sites/default/files/conference/2014/JEA/Tomashek.html
