# Sariya assigned build issues

Control: [CONTROL.md](CONTROL.md)

22 baseline issues, 3 optional issues and 1 post-event product issue. All start open/unverified.

| Issue | Owner | Phase | Focused hours | Dependencies |
|---|---|---|---:|---|
| [B01: Bootstrap the event app and freeze the three-lane contracts](B01.md) | Melvin0070 | CP1 | 1.5 | — |
| [B02: Deliver a verified rebar model and prove its on-phone runtime](B02.md) | NarayanaSabari | CP1 | 1.5 | [B01](B01.md) |
| [B03: Build the spec form and scan UI against fixture contracts](B03.md) | AlwinSunil | CP1 | 1.5 | [B01](B01.md) |
| [B04: Capture calibrated frames and detect card S with stream-aware gates](B04.md) | NarayanaSabari | CP1 | 2 | [B01](B01.md) |
| [B05: Implement versioned rules and deterministic correction actions](B05.md) | Melvin0070 | CP1 | 2 | [B01](B01.md) |
| [B06: Extract and track live bar lines in card coordinates](B06.md) | NarayanaSabari | CP1 | 2.5 | [B02](B02.md), [B04](B04.md) |
| [B07: Render live lines, Lock states and an early manual-marking fallback](B07.md) | AlwinSunil | CP1 | 2.5 | [B01](B01.md), [B03](B03.md) |
| [B08: Lock measurements with honest uncertainty and pass the tape gate](B08.md) | NarayanaSabari | CP1 | 2.5 | [B04](B04.md), [B06](B06.md) |
| [B09: Show findings, physical readings and a spoken Hindi correction](B09.md) | AlwinSunil | CP1 | 2 | [B03](B03.md), [B05](B05.md) |
| [B10: Integrate and freeze the first real mesh loop on all three phones](B10.md) | Melvin0070 | CP1 | 1.5 | [B02](B02.md), [B03](B03.md), [B04](B04.md), [B05](B05.md), [B06](B06.md), [B07](B07.md), [B08](B08.md), [B09](B09.md) |
| [B11: Measure beam stirrup positions and drawing zones from strip_300](B11.md) | NarayanaSabari | CP2 | 2 | [B08](B08.md), [B05](B05.md) |
| [B12: Persist and sign immutable capture evidence with enrolled device keys](B12.md) | Melvin0070 | CP2 | 3 | [B01](B01.md), [B05](B05.md), [B08](B08.md) |
| [B13: Build the engineer review desk and Office Kit file handoff UX](B13.md) | AlwinSunil | CP2 | 2 | [B01](B01.md), [B09](B09.md) |
| [B14: Round-trip an Office Kit pack and countersign with the engineer key](B14.md) | Melvin0070 | CP2 | 2.5 | [B12](B12.md) |
| [B15: Add offline voice spec entry with confirmation and keypad recovery](B15.md) | AlwinSunil | CP2 | 2 | [B03](B03.md), [B09](B09.md) |
| [B16: Reject duplicate approvals without blocking legitimate rescans](B16.md) | Melvin0070 | CP3 | 1.5 | [B12](B12.md), [B14](B14.md) |
| [B17: Validate lower-layer measurements and sustained device behavior](B17.md) | NarayanaSabari | CP3 | 2 | [B08](B08.md), [B11](B11.md) |
| [B18: Expose the bench error table, scan history and truthful numbers](B18.md) | AlwinSunil | CP3 | 1.5 | [B01](B01.md), [B12](B12.md) |
| [B19: Prepare the demo scripts, deck and real backup recording](B19.md) | AlwinSunil | CP3 | 2 | [B10](B10.md), [B14](B14.md) |
| [B20: Freeze, verify and package the release candidate](B20.md) | Melvin0070 | CP3 | 2 | [B10](B10.md), [B11](B11.md), [B12](B12.md), [B13](B13.md), [B14](B14.md), [B16](B16.md), [B17](B17.md), [B18](B18.md), [B19](B19.md), [B25](B25.md) |
| [B21: Import a confirmed drawing schedule through the Office Kit file picker](B21.md) | Melvin0070 | Stretch | 1.5 | [B14](B14.md) |
| [B22: Probe optional ARCore anchoring without changing measurement scale](B22.md) | NarayanaSabari | Stretch | 0.5 | [B10](B10.md) |
| [B23: Add Kannada output or constrained LLM wording only after the core ships](B23.md) | AlwinSunil | Stretch | 2 | [B15](B15.md) |
| [B24: Validate the product on real sites with an engineer before a pilot](B24.md) | Melvin0070 | Post-event | TBD | [B20](B20.md) |
| [B25: Integrate beam and signed review, then freeze CP2](B25.md) | Melvin0070 | CP2 | 0.75 | [B10](B10.md), [B11](B11.md), [B12](B12.md), [B13](B13.md), [B14](B14.md) |
| [B26: Rehearse the final APK, verify submission and hand back loaners](B26.md) | NarayanaSabari | CP3 | 1.5 | [B20](B20.md) |
