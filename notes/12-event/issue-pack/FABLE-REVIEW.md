# Independent issue workflow review — 10 Oct 2026

Claude Fable 5.1, high effort. Review of the initial B01–B24 draft; parent dispositions and added integration/rehearsal gates appear in TEAM-BUILD.md.

Review complete. No circular dependencies in the 24-issue graph. Ten actionable gaps, ranked:

1. **CP1 critical path does not fit the window.** Sabari's chain is B01 (1.5h) → B02/B04 (2h parallel) → B06 (2.5h) → B08 (2.5h) = 8.5h from 00:35, so B08 finishes ~09:00 at best. B10's "if core not reliable by 06:00" decision and its 08:30 freeze both precede B08's earliest completion, and BUILD-PLAN has Sabari asleep 06:00-08:00. Make B07 manual marking the planned CP1 path, with B08 automatic Lock as an upgrade only if G1 passes by a stated time (~07:00). Move B10's decision time to match.

2. **No CP2 integration/freeze issue exists.** B10 covers CP1, B20 covers the CP3 release. Nothing owns merging B11/B13/B14/B15 into one APK, the 18:15 CP2 freeze, and three 90-second CP2 runs. Add a B10b for Melvin and give it a slot, since Melvin's CP2 chain B12 (3h) → B14 (2.5h) already runs from 13:00 to 18:30 after the CP1 presentation and sleep.

3. **Ownership load is skewed.** Melvin holds B01, B05, B10, B12, B14, B16, B20, B21 plus all merges (about 15h). Sabari has 4h total across CP2 and CP3 (B11, B17). Move B16 (duplicate policy) or the QR-verify half of B14 to Sabari, or B21 if it survives.

4. **Four screens have no UI owner.** Melvin's and Sabari's issues forbid ui/ edits, yet no Alwin issue covers: the key-enrolment flow (show own key QR, scan the other device, confirm) required by B12; the P3 QR verification screen required by B14; the beam zone overlay and ticks for B11; and the tape ground-truth entry that feeds B08's bench ledger and B18's table. Add them to B13/B18 or a new Alwin issue, and give B11 a UI counterpart.

5. **B13 is blocked on contracts nobody freezes early.** B13 says "build against B12/B14 fake adapters first" and its tests list eight record states (unsigned, capture valid, unknown signer, corrupt, pending, cancelled biometric, approved, already processed), but B12 only delivers fake view models as its last task of a 3h issue, and B01's frozen contracts omit verification/approval/transfer states. Add those enums and the pack-transfer states to B01's freeze, or add a 30-minute B12 stub ahead of B13.

6. **B19 is overscoped and mis-sequenced.** Two hours for deck, backup video, three scripts, three full rehearsals and six failure drills is not credible. It depends only on B10 but the rehearsal loop needs B14, B16, B18, and B20 depends on B19, so the graph makes rehearsing on the final APK impossible. Split into assets (deck, video, scripts; deps B10, B14) and final rehearsal (after the B20 candidate freeze, before submission). BUILD-PLAN had Melvin on the deck; reassign deliberately.

7. **G1 pass criterion in B08 can be satisfied by a wide band.** "Tape inside its band on 8/10" passes trivially if the band is 20 mm, and then the F2/F4 "outside" beats still fail. Add a band cap to the pass condition (B08 already implies ≤7 mm for F4 discriminability) and record the G1 outcome with timestamp and band in the control issue.

8. **The stream-versus-4K-still Lock decision has no deadline or owner-visible output.** It is task 4 of B04, but B06's transforms, B07's frozen evidence frame and B08's recompute-on-still path all branch on it. Make it a named decision due at B01's contract freeze (does LockResult carry a still reference or not), recorded in the control issue before Alwin builds the Lock UX.

9. **"Request another view" has no transport.** B13 offers the engineer a request re-scan/new view action, but B14 defines only the capture pack and the approval return. Either add a request artifact to the pack format in B14, or mark it in B13 as a local-only state so Alwin does not build a button that goes nowhere.

10. **Hard-coded clock times inside issues will conflict with the rebased schedule.** B10 (06:00, 08:30), B14 (17:30), B20 (01:00 Sun, 11:30) and B15's timebox embed BUILD-PLAN times that the parent is about to rebase. Replace them with references to the epic's gate table so the issues stay true after rebasing.

Not flagged: the retained voice input as gated CP2, ARCore as 20-minute optional, and the Opus-review items, which the drafts do address.
