# Workstream 11: name and optics (7 Oct 2026)

Tags: **V** opened; **S** snippet; **U** unverified or inferred. Hindi and Kannada strings below were drafted by us and must be read by a native speaker before they go in the UI (owner: the speech-llm workstream).

## 1. "Sariya": trademark and collision check

**What the word is.** सरिया (sariya, also saria) is the everyday Hindi word for a reinforcing bar; the trade press uses it as a commodity name ("saria gains Rs 200 per tonne", Business Standard [S]). It is therefore **generic for steel bars** and strong-ish for software.

| Check | Result | Tag | Source |
|---|---|---|---|
| Indian trademark registry (tmrsearch.ipindia.gov.in) | Public search now needs an OTP login (email or mobile) plus a captcha; no URL search. **Not run.** Do it by hand before 15 Oct (5 min) for "SARIYA" and "SARIYA CHECK" in classes 9, 42, 37 and 6 | V (page read) | https://tmrsearch.ipindia.gov.in/tmrpublicsearch/ |
| Third-party registry index (RegisterKaro) | Exact "SARIYA" in classes 9/42: none surfaced in search. Closest: **"JDS 550SD Max Grip Sariya"**, app. no. 6965722, class 6 (TMT bars etc.), status "Formalities Chk Pass", applicant a sole proprietorship. It uses "sariya" descriptively, which supports our reading that the word is generic in class 6. "SAVARIYA CABLE" (class 9, 2023) and "SARHM" (class 42) are the nearest sounds in our classes | S | https://www.registerkaro.in/trademark-search/jds-550sd-max-grip-sariya-6965722 ; https://www.registerkaro.in/trademark-search/savariya-cable-6176954 |
| Google Play | No construction, steel or inspection app named Sariya. Found: "Sariya College, Suriya", "sariya dekho", "SARIYA Bus Tracker Sri Lanka", "Sariyas Sip n bite", "Sariya ko mun?". A "saria tmt" search returns rebar calculators and "Goel TMT" but nothing named Saria/Sariya | V | https://play.google.com/store/search?q=sariya&c=apps |
| App Store | "SKSSF JARIYA" (unrelated) is the nearest; no Sariya app found by search | S | https://apps.apple.com/mx/app/id6745172362 |
| GitHub | 147 repos match "sariya"; all personal-name repos, top one has 2 stars; nothing in construction or rebar | V | https://api.github.com/search/repositories?q=sariya |
| **sariya.in** | **Taken**: registered 12 Jan 2016 (GoDaddy); an active saree e-commerce shop in Surat. Different sector, but the same word in the same country | V (whois + site) | https://sariya.in/ |
| sariya.com | Taken since 15 Aug 2004 (Network Solutions); content not checked | V (whois) | |
| sariya.app, sariya.co.in | WHOIS returned no parseable record from our shell; treat as **unknown** | U | |
| **getsariya.com** | **Available** (no match) | V (whois) | |
| **sariyacheck.com** | **Available** (no match) | V (whois) | |
| MCA company names | "SIDHBALI SARIYA LIMITED" (Kanpur ROC, 2018, public, active; a steel trader by name) [S]. "Moira Sariya" is a TMT brand of Jaideep Ispat, Indore [S]. No software company named Sariya found | S | https://www.registrationwala.com/company/sidhbali-sariya-limited/U51909UP2018PLC103167 ; https://m.indiamart.com/jiapvtltd/profile.html |
| Products named Sariya/Saria in construction software | None found (English searches only; Hindi-script and store-internal searches not done) | U | |
| Hackathon field | No other rebar team known (IDEA.md §2: ~1-3%) | U | |

**Collision risk: LOW-MEDIUM.**
- Low for the app stores, GitHub and software trademarks.
- Medium for the word itself: it is generic in steel, so we can never own "Sariya" for bars, and a steel trader (Sidhbali Sariya) and a saree shop (sariya.in) already use it. A brand partner's lawyers may also dislike a product named after the commodity.
- A real steel-brand objection is more likely about *their* marks than ours; nothing we found is a blocker.

**Recommendation: keep "Sariya" as the product name; use the qualifier "Sariya Check" wherever a name must be unique** (app-store listing, domain, trademark filing, repo). Reasons: the word says what it is to every mason and engineer in Hindi; the jury will remember it; nothing in our classes collides.
- File "SARIYA CHECK" (word) in classes 9 and 42 after the event; a plain "SARIYA" in class 42 may also be allowed but expect a descriptiveness objection [U].
- Register **sariyacheck.com** and **getsariya.com** now (both free on 7 Oct, under ₹1,500 each). Check sariya.app by hand.
- Kannada rendering for the UI: ಸರಿಯಾ (transliteration). The Kannada word for the bar itself is ಸರಳು (saraḷu) or ಕಬ್ಬಿಣದ ಸರಳು; use it in the spoken fix, not as the brand [U, native check].
- Never style it "Saria Check" (the spelling the trade press uses), to keep one spelling across stores, domain and filing.

**Three alternatives, if the trademark hand-search finds a hard collision** (score 1-5; availability as of 7 Oct):

| Name | Hindi meaning | Kannada meaning | Pronounceable (jury, mason) | Availability | Total /15 | Note |
|---|---|---|---|---|---|---|
| **Saralu** (ಸರಳು) | None directly; sounds like सरल "simple" (4) | ಸರಳು = rod, bar; ಸರಳ = simple (5) | 4 | GitHub/Play not checked; likely free as a product name [U] (4) | **17/20** | The Kannada twin of Sariya; a double meaning (rod, simple) in Kannada, "simple" in Hindi. Best fallback for a Bengaluru-first product |
| **Dhalai** (ढलाई) | Casting, the pour itself (5) | Not a Kannada word; ಢಾಲಾಯಿ unknown to masons (2) | 4 | "TAJ DHALAI+" is a cement SKU (Taj Cement) [S]; Play has no Dhalai app found [U] (3) | 14/20 | Names the moment, not the steel. Hindi-belt only |
| **Pre-Pour** / "PrePour" | English; Hindi speakers say "slab se pehle" (2) | English (2) | 5 | Generic English; domains likely taken [U] (2) | 11/20 | Clear to an engineer and a jury; cold to the mason |

Rejected: *Kavach* (Indian Railways' train-protection system; hard collision), *Jaali* (जाली also means "fake" in Hindi), *Tanka* (an AI product), *Mauka* (the sibling idea's name).

## 2. Optics: wording rules

**Principle.** Sariya is a measuring instrument with a record. It measures what is visible, states the error, abstains when unsure, and lets a named engineer sign. It never judges a building. Every sentence in the UI, the pitch and the report must survive the question "would a lawyer read this as a safety certificate?"

### 2.1 Allowed and banned phrases

| | English | Hindi | Kannada |
|---|---|---|---|
| **Allowed: result states** | within limits · outside limits · needs a tape reading · not seen · re-scan | सीमा के अंदर · सीमा के बाहर · फीते से नापें · दिखा नहीं · फिर से स्कैन करें | ಮಿತಿಯೊಳಗೆ · ಮಿತಿ ಮೀರಿದೆ · ಟೇಪ್‌ನಿಂದ ಅಳೆಯಿರಿ · ಕಾಣಲಿಲ್ಲ · ಮತ್ತೆ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ |
| **Allowed: what it does** | measures · counts · records · compares with the drawing · error ± N mm · the engineer reviewed and signed | नापता है · गिनता है · रिकॉर्ड करता है · ड्रॉइंग से मिलाता है · त्रुटि ± N मिमी · इंजीनियर ने जाँचकर हस्ताक्षर किए | ಅಳೆಯುತ್ತದೆ · ಎಣಿಸುತ್ತದೆ · ದಾಖಲಿಸುತ್ತದೆ · ಡ್ರಾಯಿಂಗ್‌ನೊಂದಿಗೆ ಹೋಲಿಸುತ್ತದೆ · ದೋಷ ± N ಮಿಮೀ · ಇಂಜಿನಿಯರ್ ಪರಿಶೀಲಿಸಿ ಸಹಿ ಮಾಡಿದ್ದಾರೆ |
| **Allowed: the fix** | add N stirrups between A and B · move this bar to 150 mm · tie cover blocks here | A और B के बीच N रिंग और लगाएँ · यह सरिया 150 मिमी पर रखें · यहाँ कवर ब्लॉक बाँधें | A ಮತ್ತು B ನಡುವೆ N ರಿಂಗ್ ಸೇರಿಸಿ · ಈ ಸರಳನ್ನು 150 ಮಿಮೀಗೆ ಸರಿಸಿ · ಇಲ್ಲಿ ಕವರ್ ಬ್ಲಾಕ್ ಕಟ್ಟಿ |
| **Banned** | safe · certified · pass / PASS · approved · pour permit · OK to pour · tamper-proof · guaranteed · replaces the engineer · the building is sound · the mason cheated | सुरक्षित · प्रमाणित · पास · मंज़ूर · ढलाई की अनुमति · ढलाई कर सकते हैं · छेड़छाड़-रोधी · गारंटी · इंजीनियर की ज़रूरत नहीं · इमारत मज़बूत है · मिस्त्री ने धोखा दिया | ಸುರಕ್ಷಿತ · ಪ್ರಮಾಣೀಕೃತ · ಪಾಸ್ · ಅನುಮೋದಿತ · ಢಾಲಾಯಿ ಅನುಮತಿ · ಢಾಲಾಯಿ ಮಾಡಬಹುದು · ತಿರುಚಲಾಗದ · ಗ್ಯಾರಂಟಿ · ಇಂಜಿನಿಯರ್ ಬೇಕಿಲ್ಲ · ಕಟ್ಟಡ ಗಟ್ಟಿಯಾಗಿದೆ · ಮೇಸ್ತ್ರಿ ಮೋಸ ಮಾಡಿದರು |
| **Banned in the pitch** | "prevents collapses" · "would have saved [place]" · "first in the world" · "one pixel is under 0.1 mm" · "the 2025 seismic code is in force" · any partner name before they agree | | |

Rules of thumb:
- A green colour is allowed for "within limits" but never with a tick icon alone; always with the number and its error.
- "Outside limits" is red text with the measured value, the limit and the clause, for example "stirrups 150 mm; limit 100 mm; IS 13920 cl. 6.3.5".
- The report header says "Pre-pour measurement record", never "inspection certificate".
- The signature line says "Reviewed and signed by [name], [registration no.]"; the app never signs for a person.
- Avoid "fake" for steel: say "unit mass outside the IS 1786 band" or "rib marks do not match the invoice".

### 2.2 On-screen disclaimer (two lines, shown on the record and the sign-off screen)

- EN: *This record states what the phone measured, with its error, and what was entered by hand. It is not a safety certificate; the signing engineer is responsible for the review.*
- HI: *यह रिकॉर्ड बताता है कि फ़ोन ने क्या नापा, कितनी त्रुटि के साथ, और क्या हाथ से भरा गया। यह सुरक्षा प्रमाणपत्र नहीं है; जाँच की ज़िम्मेदारी हस्ताक्षर करने वाले इंजीनियर की है।*
- KN: *ಈ ದಾಖಲೆ ಫೋನ್ ಏನನ್ನು ಅಳೆಯಿತು, ಎಷ್ಟು ದೋಷದೊಂದಿಗೆ, ಮತ್ತು ಏನನ್ನು ಕೈಯಿಂದ ತುಂಬಲಾಯಿತು ಎಂಬುದನ್ನು ಹೇಳುತ್ತದೆ. ಇದು ಸುರಕ್ಷತಾ ಪ್ರಮಾಣಪತ್ರವಲ್ಲ; ಪರಿಶೀಲನೆಯ ಹೊಣೆ ಸಹಿ ಮಾಡುವ ಇಂಜಿನಿಯರ್‌ದು.*

### 2.3 Referring to the mason

The person who tied the steel is skilled labour and the listener of the fix, never the accused. Use the trade title, with the respectful form.

| | Written / UI | Spoken fix (address) | Never |
|---|---|---|---|
| English | mason · bar bender · site team | "Mestri, please add two rings here" | labourer · worker (as a label) · cheat · culprit |
| Hindi | मिस्त्री · राजमिस्त्री · सरिया मिस्त्री (bar bender) | "मिस्त्री जी, यहाँ दो रिंग और लगा दीजिए" (always आप / जी, never तुम or तू) | मज़दूर (as a label) · धोखेबाज़ · गलती करने वाला |
| Kannada | ಮೇಸ್ತ್ರಿ · ಕಟ್ಟಡ ಕೆಲಸಗಾರರು · ಕಬ್ಬಿಣ ಕಟ್ಟುವವರು (bar bender) | "ಮೇಸ್ತ್ರಿಯವರೇ, ಇಲ್ಲಿ ಎರಡು ರಿಂಗ್ ಸೇರಿಸಿ" (always ನೀವು and the -ಇ imperative, never ನೀನು) | ಕೂಲಿ (as a label) · ಮೋಸಗಾರ · ತಪ್ಪು ಮಾಡಿದವ |

The record stores corrections as "fixed by the site team at HH:MM", credited, not as faults. If a mason work history is ever built (IDEA.md roadmap), it lists corrections made, never errors found.

## 3. To do before 9 Oct
- [ ] Hand-run tmrsearch for SARIYA and SARIYA CHECK in classes 6, 9, 37, 42 (OTP login needed).
- [ ] Register sariyacheck.com and getsariya.com; check sariya.app.
- [ ] Native-speaker pass on every Hindi and Kannada string above (the speech-llm workstream owns the voice lines).
- [ ] Add §2.1 banned list to the demo script's "words we never say" card (WS8).

## Sources
- Trade Mark Registry public search (OTP + captcha): https://tmrsearch.ipindia.gov.in/tmrpublicsearch/
- JDS 550SD Max Grip Sariya, class 6 [S]: https://www.registerkaro.in/trademark-search/jds-550sd-max-grip-sariya-6965722
- SAVARIYA CABLE, class 9 [S]: https://www.registerkaro.in/trademark-search/savariya-cable-6176954
- Google Play search: https://play.google.com/store/search?q=sariya&c=apps and https://play.google.com/store/search?q=saria%20tmt&c=apps
- GitHub search API: https://api.github.com/search/repositories?q=sariya
- sariya.in (saree shop): https://sariya.in/
- Sidhbali Sariya Ltd [S]: https://www.registrationwala.com/company/sidhbali-sariya-limited/U51909UP2018PLC103167
- Moira Sariya (Jaideep Ispat) [S]: https://m.indiamart.com/jiapvtltd/profile.html
- "Saria" as a commodity word [S]: https://www.business-standard.com/article/pti-stories/saria-gains-rs-200-per-tonne-on-increased-offtake-114062700547_1.html
- TAJ DHALAI+ cement [S]: https://thenewsmill.com/2016/10/taj-cement-extends-support-digital-india-make-india-initiatives/
- WHOIS run from the shell on 7 Oct 2026 for sariya.in, sariya.com, getsariya.com, sariyacheck.com (sariya.app and sariya.co.in returned no parseable record).
