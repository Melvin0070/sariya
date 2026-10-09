# Pre-pour rebar check against the drawing

- Source: Claude (independent brainstorm, Session B, 2026-10-04)
- Status: SHORTLISTED
- Track: Smart Living / Open Innovation
- Named user, doing a task they already must do: Project-management consultant's site engineer signing the pour card before concrete is poured on a slab.
- What the capability plugs into: The pour-card / reinforcement checklist in the developer's QA system.
- Payer and budget owner: Developer's QA head or the PMC (paid to check the contractor); structural defect liability under RERA.
- Why now (dated, verifiable): [U] needs a dated 2025-26 trigger (collapse inquiry, RERA order or BIS code revision).
- What the phone does on-device and why it must be local: Photo of the rebar mat with a reference frame; on-device vision counts bars, measures spacing and bar diameter class, compares with the bar-bending schedule, signs the record. Local because rafts and basements have no signal and the pour is waiting.
- The physical act a judge can watch or check: A mock rebar grid on a table with a reference marker. A judge removes or shifts one bar; the check fails and shows where.
- Oh-wow moment: The phone spots the one bar the judge moved by 3 cm.
- Physics check: Planar reference: spacing error about 3% (5 mm on 150 mm). Telling 10 mm from 12 mm bars needs about 1 mm accuracy, plausible at 1 m with 50 MP but unproven; two rebar layers are not coplanar.
- Kill criteria for a first pilot: Spacing error above 10 mm; cannot tell bar diameters apart; engineers will not carry the reference frame.
- Unverified [U]: Japanese rebar-inspection systems and any Indian equivalent [U].

## Collision test (2026-10-04)
| Test | Finding | Evidence URL |
|---|---|---|
| Hackathon collision | Low. "Machine / site / structural inspection" cluster has about 9 repos (SiteSweep_Live, safetyeye-live), which are safety or defect walkthroughs; none checks rebar against a schedule. No city winner overlaps. | research/01-hackathon.md section 3.2 |
| Device-maker collision | None. No phone maker ships it. Relevant gap: iPhone/iPad Pro LiDAR is what the leading phone-based product uses; the iQOO 15 has no ToF/LiDAR and is not on the ARCore list. | https://ken-it.world/it/2023/04/rebar-check-by-iphone-lidar.html |
| Funded-startup collision | Japan is mature and crowded; India appears empty. Japan: DataLabs Modely (iPhone/iPad LiDAR point cloud, pitch and cover, auto report; rated A in an MLIT regional trial); Sumitomo Mitsui Construction with Hitachi Solutions "Raku Camera" / GeoMation (tablet plus depth camera: count, spacing, diameter, handles double layers); CONSAIT Eye (AI plus three-lens camera, adopted by 21 general contractors in 2024); KENTEM SiteRebar (stereo-camera terminal); BAIAS (AR); Kajima (stereo camera, 2018); IHI Infrastructure consortium (ordinary camera, phone or drone photos: diameter, spacing, count, 40% less labour). China: many phone apps count bar ends in bundles for stock-taking (about 99% count accuracy claimed); none found for spacing against drawings. India: no product found; Powerplay and Inkers (Kael) do project management and site intelligence, not rebar checks. One open-source repo matches site photos to drawings. | https://www.smcon.co.jp/topics/2025/01101300/ ; https://built.itmedia.co.jp/bt/articles/2405/02/news160.html ; https://www.kentem.jp/product-service/siterebar/ ; https://ken-it.world/success/2022/05/automatic-rebar-check.html ; https://sj.qq.com/appdetail/com.iseely.counting ; https://github.com/nnee8122/rebaranalysis-v2026-ai-qc |
| Default-LLM collision | No. B2B 1 (site safety inspector) and 20 (property condition report) are different acts. | notes/default-llm-brainstorm.md |
| Physics check | Passes for one layer with a planar reference; fails for what the Japanese systems use depth for. Spacing on a single coplanar mat with a marker frame: about 1-3% (2-5 mm on 150 mm), so a 30 mm shift is detectable. Diameter class: at 1 m the 50 MP main camera gives roughly 0.15-0.2 mm per pixel, so 10 vs 12 mm is a 10-13 pixel difference; ribs, rust, shadows and tie wire make the realistic error about plus/minus 1-1.5 mm, enough for 10 vs 16 mm, marginal for 10 vs 12 mm. Two-layer mats, cover depth and lap length need metric depth; with relative-only depth the lower layer's spacing error grows by the height ratio (about 10-15% for a 150 mm layer gap at 1 m) unless it gets its own reference. Every Japanese product except IHI's uses stereo, depth camera or LiDAR for this reason. | research/DIGEST.md section 4 ; https://www.smcon.co.jp/topics/2025/01101300/ |

Why-now check: Not verified; the file has no trigger and none was confirmed. Search summaries mention Delhi building collapses in 2026 and a Delhi order for periodic structural audits, but these concern old or unauthorised buildings, not pre-pour inspection, and I did not open a primary source. RERA's five-year structural defect liability (section 14(3)) is standing law from 2016-17, not a 2025-26 trigger. Treat the why-now as [U]. https://www.devdiscourse.com/article/headlines/3973507-delhi-government-enforces-structural-safety-audits-post-building-collapse
Closest competitors: Modely (DataLabs); Raku Camera / GeoMation; CONSAIT Eye; SiteRebar; BAIAS; IHI consortium system. None found selling in India.
Space left (0-10): 6 in India (1 in Japan). A Japanese vendor could enter, but their hardware-bound kits are priced for Japanese general contractors.
Queries run (with languages): Japanese: 配筋検査 システム AI スマホ 鉄筋 本数 間隔 径 自動計測; 配筋検査 iPhone iPad LiDAR アプリ Modely. Chinese: 钢筋间距 检测 手机 app AI 钢筋验收 隐蔽工程 钢筋计数. English/India: rebar inspection AI smartphone India startup; India construction AI rebar inspection pour card bar bending schedule; India building collapse 2025-26 inquiry RERA.
Still [U]: any dated Indian trigger; whether Indian PMCs would pay per pour; diameter-class accuracy on real ribbed TMT bars; whether the Finale phone has ARCore; pricing of the Japanese systems.
