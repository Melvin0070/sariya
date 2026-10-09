# Mauka: idea as of 30 Sep 2026 (from shared/PRODUCT-LENS §3-5)

This is the working spec. Edit it as the session improves the idea, and log each change in STATE.md.

> **1 Oct 2026, WS1 red team:** all three reviewers rate this spec WOUNDED. Fact errors below are corrected inline. Three proposed reframes (R1 scene-time anchor + identity-latency ledger instead of "planted-vehicle detector"; R2 measurement layer for eSakshya/eDAR; R3 ground-reference multi-view instead of plate-only homography) are in `notes/ws1-synthesis.md` and await a decision before this spec is rewritten.

## 3. Product-first design in Mobility: **Mauka**

### 3.1 Candidates considered

| Candidate | Why not |
|---|---|
| 2W gig-fleet rider co-pilot / black box | Collides with Rakshak (Hyderabad field) and Driver Guardian (our old ledger). Netradyne and LightMetrics own fleet video; Zendrive/CMT own phone telematics. Forward-collision warning in Indian traffic false-alarms constantly. |
| Crowd-sensed railway track health from passengers' phones | Needs consumer-app distribution we don't have; Google's Where is my Train could do it overnight; can't be demoed. |
| Automated driving-licence test on a phone | Microsoft Research's HAMS already did it (deployed at RTOs); ADTT tracks are being built. |
| **Mauka: the measured, signed crash-scene record** | **Picked.** Explained below. |

### 3.2 The product

> **The first 24 hours after an Indian road crash decide three things:**
> - whether the victim's cashless treatment gets paid;
> - who pays compensation;
> - who is criminally liable.
>
> **All three rest on a hand-drawn site plan and a few photos, which is why insured vehicles get "planted"
> into claims. Mauka turns the first responder's phone into a measured, signed, 3-D record of the scene in
> 90 seconds.**

Name: *mauka* as in *naksha mauka*, the police site plan, and *mauka-e-vardaat*, the scene of occurrence.

### 3.3 Why now (verified this session)

**The Supreme Court ordered pan-India SITs into fraudulent motor-accident claims in *Oriental Insurance v. Tuni Pati*, judgment 17 Aug 2026.** It also recommended a common claims portal joining VAHAN, SARATHI, eDAR and the IRDAI portal.
- The case began with "whether the vehicle stated to have caused a motor accident was in fact the vehicle involved".
- The Court found an organised pattern: insured vehicles "planted" into claims, and **the same vehicle shown in multiple accidents**.
- Insurers are now directed to route fraud rejections to state SITs and report action taken.

**PM-RAHAT (cashless treatment, launched 13 Feb 2026; built on the 2025 cashless scheme): the police must confirm the accident on eDAR within 24 h (48 h if life-threatening).** Otherwise the victim drops out of the ₹1.5 lakh cashless cover. The police duty is a yes/no confirmation, not a site plan; ~20% of cashless requests were rejected by police (Parliament, Dec 2025, S).

**eDAR/iRAD is the national accident record.**
- MoRTH runs it with World Bank funding; IIT Madras designed it and NIC built it, in consultation with insurers.
- It feeds MACT claims.
- Today it holds form fields plus photos and video. A PWD engineer is supposed to visit later to record road design.

**Scale:**
- 4,87,707 accidents and **1,77,175 deaths in 2024**; two-wheeler riders are ~44% of deaths.
- Motor insurance premium was ₹99,093 cr in FY25, with an incurred claims ratio of ~85.5%.

**Tech that became possible in 2026:**
- Feed-forward multi-view 3-D reconstruction (MASt3R/VGGT class) that can be distilled for NPUs.
- Real-time on-device detection and OCR.
- Indic ASR offline.
- Standardised scale references at many scenes: **HSRP plates are 500×120 mm (cars), 200×100 mm (2W/3W rear) and 285×45 mm (2W front)**, and lane markings follow IRC:35. Only ~29% of Karnataka's pre-2019 vehicles had HSRP (Mar 2025, S), and a plate scales itself, not the road plane (see WS1).

### 3.4 Users and buyers
- **User:** the police investigating officer or highway patrol at the scene. Secondary users: insurers' claim investigators, fleet drivers (self-capture), and later 2W riders.
- **Buyers:**
  1. **General insurers**, per scene record used in a third-party claim. Motivated by fraud savings and the SC's reporting directions.
  2. **State police / MoRTH**, as an eDAR capture module, since the eDAR SLA is theirs.
  3. **Fleets** (bus, truck, cab, 2W delivery), as a defence against false claims.

### 3.5 Capabilities (full product, no time limit)
1. **Guided capture, any Android:** a 60-90 s walkaround with live coverage feedback ("walk to the far side of the truck").
   - Faces and injuries are blurred on-device by default.
   - Capture is attested (Key Attestation + Play Integrity), hash-chained and time-stamped (GNSS offline, RFC 3161 when online).
   - Works offline and queues until there's signal.
2. **Metric reconstruction:** a ground-plane site plan and a 3-D scene.
   - Scale comes from HSRP plates, lane-marking standards, an optional folding scale bar in patrol kits, and the IMU.
   - Measured outputs: vehicle rest positions, debris field, skid and scuff marks, road width, lanes, sight distance.
   - **Every number carries its uncertainty.**
3. **Vehicle binding and consistency:**
   - plate OCR (and the HSRP laser PIN when close);
   - make, model and colour;
   - a damage map per vehicle (panel + height band).
   - **Contact-geometry check:** do the striking vehicle's bumper/impact height and profile match the victim vehicle's damage? If not, the pairing is flagged "unexplained, human review". This is the direct answer to planted vehicles.
4. **Cross-scene fingerprints:** plate + damage signature across scenes flags "same vehicle, multiple accidents". That is the SC's exact pattern, delivered as an SIT and insurer tool.
5. **Deterministic physics, with abstention:**
   - skid-to-stop speed ranges only when marks exist and the vehicle has no ABS;
   - sight-line and visibility checks;
   - never a fault determination.
6. **Voice-first forms:** the IO dictates in Kannada, Hindi or Tamil; on-device ASR fills structured eDAR fields; the app reads them back for confirmation. Witness statements are recorded with consent.
7. **Integrations:**
   - eDAR API (irad.parivahan.gov.in/edarapi);
   - the PM-RAHAT victim ID inside the 24 h window;
   - insurer claim systems;
   - an auto-drafted certificate for electronic records under BSA 2023 s.63 (verify the format with a lawyer).
8. **Road engineering:** aggregated measured scenes support black-spot diagnosis for PWD/NHAI, replacing the engineer's follow-up visit where possible.

### 3.6 Moat
- **The evidence standard.** If a state writes "Mauka capture within 1 h" into its SOP, the product becomes infrastructure.
- **The cross-scene fingerprint database**, a network effect: fraud detection improves with every scene.
- **The Indian crash-scene dataset:** night, rain, crowds, 2W-heavy.
- **Integrations and partnerships:** eDAR/PM-RAHAT, insurers, and the IIT Madras RBG Labs team behind iRAD.

---

## 4. Product red team (hostile, no hackathon)

| # | Attacker | Attack | Answer | Residual risk |
|---|---|---|---|---|
| 1 | Police SHO | "My IO arrives late, vehicles are already moved, there's a crowd and a victim to handle." | It takes 90 s and **removes** work: it pre-fills the eDAR the IO must file within 24 h under PM-RAHAT. A disturbed scene is still recorded, marked "disturbed". | **High.** Adoption needs a state SOP. Pilot one district (Bengaluru Traffic Police and Tamil Nadu are the iRAD pioneers). |
| 2 | Defence lawyer / reconstructionist | "Phone monocular measurements won't survive cross-examination; your speed is junk." | Publish error against a total station on staged scenes. Report ranges and abstain. It's documentation, not expert opinion, and the raw video is preserved and sealed. | Medium. Needs one published validation study. |
| 3 | Insurer claims head | "We already buy Inspektlabs/Roadzen/Tractable for fraud." | They see the *car* days later. Mauka sees the *scene* at the hour, which is the only moment planting can be prevented. Partner with them: our scene record goes into their damage models. | Medium. Insurers don't control police capture, so the data path must run through eDAR. |
| 4 | Government-channel sceptic | "NIC owns eDAR and can clone you." | 3-D metric reconstruction plus on-device AI isn't NIC's competence. Ship as an eDAR capture module, co-designed with IIT Madras RBG Labs. | **High.** Government sales cycles. Hedge with fleets and insurer investigators as early revenue. |
| 5 | Privacy / ethics | "Victims' bodies, bystanders' faces, DPDP." | Blur on device by default; the raw record is sealed and access-logged; purpose-limited retention; no public sharing. | Medium. |
| 6 | CV engineer | "Night, rain, a crowd blocking the view, a phone overheating on a highway shoulder." | Torch plus multi-frame capture; a per-scene quality score; a documentation-only mode when geometry is unreliable. Heavy reconstruction can run at the station PC or in the cloud later, and the capture never depends on it. | Medium-high. The peak crash window is 6-9 pm (20.4% of accidents, MoRTH 2022), dusk into dark, so night performance decides the product. |
| 7 | Fraudster / complicit IO | "Stage the scene and capture it with Mauka to legitimise the fraud." | Capture-time attestation; the gap between hospital TMS time and capture time is flagged; contact-geometry and cross-scene checks run anyway. | Medium. No tool beats a fully complicit chain; it raises the cost. |
| 8 | VC | "A slow government market." | Wedge: fleets (self-capture defence) → insurer investigators (fatal TP claims) → police SOP. The SC's SIT order makes insurers urgent *now*. | Medium. |

**Kill criteria**, tested in a pilot:
- Pilot IOs capture in fewer than 50% of eligible cases even when it saves form time.
- Site-plan error above ±5% of the distance at night.
- No insurer will pay for scene records in TP claims after seeing 50 cases.

**Verdict:** a real product at **57/90** on the §1 scale:

| Pain | Payer | Mkt | Dist | Moat | Space | Feas | TTV | Risk |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 9 | 7 | 8 | 4 | 7 | 7 | 5 | 5 | 5 |

Its weakest point is distribution through government. That is **4 points below Sariya's 61**, where the self-built home market can be reached through steel and cement brands' existing mason networks without government. **Track favourability doesn't make Mauka the best single idea.**

---

## 5. Applying the hackathon: Mauka modded for the Finale

**Mods (what changes versus the product):**
1. **Track: Mobility.** It fits naturally, not by framing.
2. **Lead with the SC's Aug 2026 order (*Tuni Pati*) and the PM-RAHAT 24 h clock.** It is the freshest dated trigger of any idea we have.
3. **Cut to four tiers.**
   - **Tier 1:** capture with coverage feedback; ground-plane site plan via plate-scaled homography (the road is planar); plate OCR; damage localisation; voice-to-eDAR in Kannada/Hindi; signed evidence pack.
   - **Tier 2:** the contact-geometry "planted vehicle" flag.
   - **Tier 3:** laptop-side multi-view 3-D over Office Kit.
   - **Tier 4:** cross-scene fingerprints.
4. **Office Kit becomes the "police station PC".** The phone does perception and signing. The laptop runs heavier reconstruction (iQOO's own "deeper compute via Office Kit" pitch), renders the site plan, and holds the eDAR form. The SHO's approval is a remote-control click.
5. **Demo, in two parts:**
   - During eval rounds: a real scene in the venue parking with two scooters, chalk skid marks and a judge who places them.
   - For the final pitch: a 1:10 table scene on a printed IRC-scale road mat, with scaled HSRP plates.
   - **The judge "plants" a different vehicle with no matching damage**, and the phone flags the pairing as unexplained. The judge tapes one distance and it matches the site plan. Airplane mode throughout.
6. **Numbers slide:** site-plan error on staged scenes against a tape or total station, capture-to-eDAR time (paper vs Mauka), and night-scene quality.

**Estimated after mods:**
- Screen **42/50**: Novelty 9, Tech 9, Problem 9, Scope 6, Phone-first 9.
- On-site **~82**. Big-league **8/10**.

**Still weaker than Sariya on stage** in three ways:
1. Toy scale versus real steel.
2. There are no real crash scenes to collect before 9 Oct; Sariya can photograph 20 real sites this week.
3. "Accident" ideas sit next to crash-detection entries in the field (Rakshak), so a screener may lump them together.

---

