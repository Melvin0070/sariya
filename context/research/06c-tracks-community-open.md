# Area 6c: Track research, Community App and Open Innovation

Research date: 2026-10-03. Scope: pain points, incumbents, common approaches, why incumbents work or fail, and gaps that sources state. Research only. No product ideas.

## How to read this file

- `[U]` = not verified against a source I could open, or the sources disagree. Never treat a `[U]` number as a fact.
- **(opened)** = I opened the page and read the number there. **(snippet)** = the number came from a search-result summary of the cited URL; the page itself was not opened (blocked or not fetched). Snippet numbers are weaker.
- Rankings are my ordering of the evidence by three things: size of documented loss, how often it happens, and whether someone identifiable pays today. They are not taken from any single source.
- "Who pays" means who spends money or loses money today, not who would buy a new product.

## Method limits (read first)

- The session-wide WebSearch budget ran out after my first 47 searches (the cap is shared with other agents). All of Community App and Health/Fintech discovery used WebSearch. Education, Agriculture and Safety/Civic discovery used fallbacks: Brave Search by direct fetch (worked for 6 queries, then HTTP 429), Bing News by direct fetch (worked), and Google News RSS (titles only). Google, DuckDuckGo, Startpage and Mojeek showed bot challenges or blocks and were not bypassed.
- Blocked to direct fetch: pib.gov.in, thehindu.com, hindustantimes.com, indianexpress.com, moneycontrol.com, ndtv.com, yourstory.com, aninews.in, fortuneindia.com, some business-standard.com pages. The Hindu, Hindustan Times, Times of India, Deccan Herald, BusinessLine, Fortune India, Bangalore Mirror and New Indian Express pages were read with a headless browser instead. PIB, YourStory, ANI, Moneycontrol and NDTV stayed blocked; anything from them is (snippet).
- Primary PDFs (NFHS-5, NCRB volumes, RBI Annual Report, ASER report, NSS reports, IRDAI report) were not opened. Their numbers are quoted through press or explainer pages, which are named.
- Searches that found nothing are listed under each part and in the `[U]` list.

---

# Track 1: Community App

Organiser scope: "a community app (not specific to iQOO) that connects developers, professionals, or interest groups, with AI at the core, on-device preferred."

## 1.1 High pain points (ranked)

| # | Pain | Evidence of severity | Who feels it, how often | Who pays or loses today |
|---|---|---|---|---|
| 1 | Scams and spam arrive through the same group and chat channels communities live on | LocalCircles, 4 Feb 2026, 42,000+ responses, 324 districts: 96% of WhatsApp users get unsolicited commercial messages every day; 54% get 1-3 a day, 30% get 4-7, 11% get 8+; 59% block senders but spammers return on new numbers; many now come via WhatsApp Business (opened: https://www.localcircles.com/a/press/page/whatsapp-unsolicited-messages). LocalCircles, May 2025, 22,000+ respondents: 42% got fake job offers asking for payment; 35% said friends or family had been impersonated (snippet: https://www.business-standard.com/india-news/whatsapp-job-scams-survey-impersonation-fraud-localcircles-report-125052101713_1.html). MHA data: Rs 22,495 crore lost to cyber fraud in 2025 across 28.15 lakh complaints; investment fraud is 76% of losses (opened: https://theprint.in/india/cybercrime-saw-24-spike-in-2025-indians-lost-rs-22495-crore-mainly-in-investment-scams/2859930/). I4C advisory, July 2026: fake "VIP stock tip" groups on WhatsApp and Telegram push trading apps through private links (snippet: https://www.newindianexpress.com/india/2026/Jul/07/centres-i4c-warns-against-investment-scams-on-whatsapp-telegram) | Every group member, daily. Students and job seekers are named targets | Victims lose the money. Admins spend unpaid time removing posts. Platforms pay for enforcement |
| 2 | No cheap way to verify a person, an opportunity or a contribution | LinkedIn removed 80.6 million fake accounts in Jul-Dec 2024, up from 70.1 million in the prior half; fake "mentor" and recruiter schemes target Indian IT graduates; losses "a few hundred dollars to $25,000" globally (opened: https://restofworld.org/2025/linkedin-job-scams/). LinkedIn added new anti-fake-profile tools on 23 Sep 2026 (snippet: https://techcrunch.com/2026/09/23/linkedin-adds-new-tools-to-fight-fake-profiles-and-bogus-work-histories/). GitHub, 3 Feb 2026: maintainers spend "substantial time" on low-quality, often AI-generated pull requests; one maintainer says only "1 out of 10" AI-created PRs is legitimate; another calls it "a huge erosion of social trust" (opened: https://www.theregister.com/2026/02/03/github_kill_switch_pull_requests_ai/). curl ended its bug bounty in late Jan 2026 to cut a "torrent" of low-quality submissions, made worse by AI-generated reports (opened 2026-10-03: https://www.theregister.com/2026/01/21/curl_ends_bug_bounty/). GitHub shipped repo settings to disable PRs or restrict them to collaborators on 13 Feb 2026 (Codex check 2026-10-03, re-opened by Opus: https://github.blog/changelog/2026-02-13-new-repository-settings-for-configuring-pull-request-access/). Server-side ID checks leak: Discord's vendor breach exposed at least 70,000 government ID photos collected for age appeals (opened: https://techcrunch.com/2025/10/09/discord-suffers-data-breach-impacting-at-least-70000-users/) | Job seekers, students, open-source maintainers, community admins. Constant | Victims; maintainers (time); platforms (breach cost) |
| 3 | Knowledge is lost in chat scroll or locked in closed chat | Slack free plan hides messages older than 90 days (since 2022) and deletes data older than one year (since Aug 2024); in June 2025 the Kubernetes Slack (10,000+ monthly active members) got under a week's notice of losing its sponsored plan; export of private channels needs Business+ and Slack approval (opened, vendor blog of a competitor: https://blog.zulip.com/2025/07/24/who-owns-your-slack-history/ ; Slack's own page: https://slack.com/help/articles/27204752526611-Feature-limitations-on-the-free-version-of-Slack). Stack Overflow fell from 200,000+ questions a month in early 2014 to 3,862 in Dec 2025, down 78% year on year (opened: https://gigazine.net/gsc_news/en/20260108-stack-overflow-questions-drop/); 1,304 in July 2026 (snippet, weak source: https://www.kucoin.com/news/flash/stack-overflow-s-monthly-questions-drop-to-1-304-in-july-2026-down-99-from-2014) `[U]`. Discord content is not indexed by web search (developer complaints: https://news.ycombinator.com/item?id=39569843) (snippet). WhatsApp groups cap at 1,024 members and Communities at 2,000 (snippet: https://inviter.co/blog/whatsapp-community-member-limit) | Every member who asks a question already answered; every new joiner | Members (time); the wider public (answers no longer public) |
| 4 | Moderation and admin work falls on unpaid volunteers; burnout | Reddit moderators worked at least 466 hours a day in 2020, worth at least $3.4 million a year at $20/hour (snippet; page returned 403: https://cse.umn.edu/cs/news/unpaid-social-media-moderators-perform-labor-worth-least-34-million-year-reddit-alone ; paper: https://arxiv.org/pdf/2205.14529). 60% of open-source maintainers are unpaid and 60% have quit or considered quitting (Tidelift, snippet: https://dev.to/tidelift/60-of-maintainers-are-still-not-paid-for-their-work-35jo). CMX 2024: 16% of community programmes have no full-time staff; 37% of respondents were affected by layoffs (opened: https://www.cmxhub.com/community-industry-report-2024). 50% of community professionals reported high burnout (2019 data, old) (opened: https://communityroundtable.com/state-of-community-management/burn-out-risk-is-high-for-online-community-managers/). In India a WhatsApp admin can face criminal liability: the Madhya Pradesh High Court (2023) held an admin liable, the Bombay High Court (2021) held the opposite (snippets: https://www.medianama.com/2023/12/223-mp-hc-whatsapp-admin-objectionable-photos/ ; https://www.lexology.com/library/detail.aspx?g=64301589-8987-4e24-a37b-4352e3b4fd74) | Admins, moderators, maintainers, chapter organisers. Daily | Volunteers pay with time; companies get the labour free |
| 5 | Event no-shows | Free events see 40-60% no-shows against 10-20% for paid; community and meetup events see 55-65% attendance (snippets from event-software vendors, not independent studies: https://www.glueup.com/blog/fix-high-event-rsvp-no-show-rate ; https://venuera.com/event-no-show-rates-by-event-type/ ; https://www.nunify.com/blogs/event-attendance-rate). No Bengaluru-specific number was found `[U]` | Organisers of every free meetup | Organisers and sponsors (venue, food, seats denied to the waitlist) |
| 6 | Platform rent and rule changes outside the community's control | Meetup, bought by Bending Spoons in Jan 2024, tripled Meetup Pro pricing with under 30 days' notice and moved attendee lists behind Meetup+ (opened: https://andypiper.co.uk/2024/10/18/meetup-com-is-so-over/ ; https://news.ycombinator.com/item?id=40923752). Reddit API pricing in June 2023 led 8,000+ subreddits to go dark (snippets: https://techcrunch.com/2023/06/12/reddit-blackout-8000-subreddits-went-dark-protest-api/ ; https://en.wikipedia.org/wiki/Reddit_API_controversy). Slack case in row 3 | Organisers and admins, at each price or policy change | Organisers pay the fee or the migration cost |
| 7 | Most members lurk; engagement and retention are weak | The "90-9-1" rule: about 90% read, 9% contribute a little, 1% contribute most (https://en.wikipedia.org/wiki/Lurker); one vendor dataset disputes it for small communities (snippet: https://www.higherlogic.com/blog/90-9-1-rule-online-community-engagement-data/). CMX 2024: 34% of community teams struggle to engage members consistently (55% in 2020) (opened, URL above). leap.club closed at the end of May 2025 (announced 15 May 2025) although it had 25,000+ paid members because acquisition and retention numbers "didn't hold good" (opened: https://inc42.com/buzz/leap-club-halts-operations-due-to-funding-crunch-retention-challenges/) | Founders and community managers | The operator (acquisition cost with no retention) |
| 8 | Communities do not earn money or cannot prove value | CMX 2025: proving ROI is the top budget challenge at 40.7%; 26% got budget increases, 18% got cuts (snippet of the PDF: https://43963373.fs1.hubspotusercontent-na1.net/hubfs/43963373/2025%20CMX%20Community%20Industry%20Report.pdf). 14.6% of DevRel professionals were laid off in the 2024 survey year (snippet: https://www.stateofdeveloperrelations.com/2024devrelreport). Geneva earned zero revenue up to 30 Jun 2025 and was shut (opened: https://techcrunch.com/2025/09/18/bumble-bffs-revamped-app-is-here-focusing-on-friend-groups-and-community-building/) | Community operators, DevRel teams | Investors and employers; community staff lose jobs |
| 9 | Privacy and power imbalance in neighbourhood apps | Rest of World, 10 Aug 2023: MyGate (25,000+ complexes) and NoBrokerHood track domestic workers' entry and exit; residents can rate workers, workers cannot see or answer ratings and have no app interface; a researcher calls it "information asymmetry" (opened: https://restofworld.org/2023/home-monitoring-mygate-digital-bias/). Residents must use the app once the RWA adopts it; MyGate and NoBrokerHood filed police complaints against each other over data theft in June 2020 (snippet: https://www.thenewsminute.com/article/mygate-and-nobrokerhood-accuse-each-other-stealing-confidential-data-127609). Nextdoor dropped "Forward to Police" after racial-profiling criticism (snippet: https://gizmodo.com/nextdoor-drops-forward-to-police-feature-after-rampant-1844106727) | Domestic workers, guards, residents who did not choose the app | Workers (lost work, no recourse); residents (data) |
| 10 | Apartment association governance disputes (Bengaluru) | On 15 Jul 2026 Bengaluru apartment associations asked for changes to the proposed Karnataka Apartment (Ownership and Maintenance) Bill, 2026 on builder accountability, association elections, parking and dispute resolution; one representative said some owners refuse to sign Form B and then call the association illegal (opened via browser: https://www.thehindu.com/news/cities/bangalore/bengaluru-apartment-residents-seek-builder-accountability-parking-norms-in-new-bill/article71226952.ece). Parking disputes are "increasingly common" (snippet: https://www.hindustantimes.com/real-estate/bengaluru-parking-rules-explained-what-residents-of-housing-societies-rwas-and-vehicle-owners-should-know-101778739753359.html). No survey number on dispute frequency was found `[U]`. Related mandate: bulk-waste-generator duties on apartment associations, see `03-india-mandates.md` lead 1 | Association office-bearers and owners | Associations (legal cost); owners |

Searched and not found: a LocalCircles survey on RWA or society disputes with percentages; Bengaluru meetup no-show data; Indian hackathon organisers reporting fake or AI-generated submissions (two searches; only platform feature pages such as Devfolio's "Report Project" appeared: https://devfolio.co/blog/devfolios-stack-of-features/).

## 1.2 Existing solutions and incumbents

### Developer and professional communities

| Product | What it does | Price | Scale or traction (date) | Source |
|---|---|---|---|---|
| WhatsApp groups and Communities | Default chat for Indian groups | Free | Group cap 1,024; Community cap 2,000 (snippet). India user count not checked `[U]` | https://inviter.co/blog/whatsapp-community-member-limit |
| WhatsApp Message Summaries | AI summary of unread messages using "Private Processing" in a cloud confidential VM | Free | Launched 25 Jun 2025, US, English only; India availability not confirmed `[U]` | https://www.medianama.com/2025/06/223-whatsapp-rolls-out-ai-message-summaries-in-us-privacy-concerns/ (opened) |
| Telegram | Large groups and channels; AI summaries of long posts since Jan 2026 through its Cocoon network | Free | - | https://www.testingcatalog.com/telegram-adds-ai-summaries-powered-by-cocoon-network/ (snippet) |
| Discord | Servers with channels, voice, bots; beta AI conversation summaries | Free; Nitro for users | "200 million+" MAU and about $550M ARR per IPO tracker sites; filed confidentially for IPO in Jan 2026, no public S-1 by Sep 2026 (snippet, weak sources) `[U]`. 3 million+ accounts actioned for deceptive practices, Mar 2025-Mar 2026 (snippet) | https://www.techstackipo.com/ipo/discord ; https://moonlock.com/discord-scams |
| Slack | Workspace chat; AI recaps on paid tiers | Free with 90-day history; Pro about $7.25/user/month; Business+ $15 (snippet) | See 1.1 row 3 | https://blog.zulip.com/2025/07/24/who-owns-your-slack-history/ ; https://fast.io/resources/slack-ai-review-2026/ |
| Stack Overflow | Public Q&A | Free | Named by 84% of respondents as a community platform they used or plan to use (top of the list); 82% visit at least multiple times a month (2025 survey, 49,000+ respondents, 177 countries) (opened; wording corrected 2026-10-03). Question volume collapse in 1.1 row 3 | https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/ |
| Reddit | Topic forums, volunteer mods | Free | India audience estimates range from 30.8 million to 64.1 million across trackers (snippet) `[U]` | https://www.spreadthoughts.com/reddit-users-by-country/ |
| LinkedIn and LinkedIn Groups | Professional graph; groups are widely described as inactive and spam-filled in practitioner posts (opinion pieces, no data) | Free; Premium | India members 148 million or 161.5 million depending on tracker (snippet) `[U]` | https://connectsafely.ai/articles/linkedin-statistics-2026 ; https://www.trykondo.com/blog/linkedin-groups-moderation-tips |
| GitHub Discussions | Forum attached to a repo | Free | No usage data searched `[U]`. GitHub added controls to limit or disable outside PRs in 2026 (snippet) | https://www.theregister.com/2026/02/03/github_kill_switch_pull_requests_ai/ |
| Peerlist (Pune) | Proof-of-work profiles for builders | Free; paid tiers `[U]` | $1.12M raised (last round Jan 2023); revenue under Rs 10 crore FY25; 5 employees (Jun 2026); "about 500,000 users, 200,000 monthly" per a Grapevine post (snippet) `[U]` | https://inc42.com/company/peerlist/ ; https://tracxn.com/d/companies/peerlist/__OgKg5j2WF2Z5Oryve4GlMhlaPhBRcroO4Osd7g6TOog |
| Commudle (India) | Pages, events and forms for developer communities; hosts many GDG chapters | Free for communities `[U]` | "more than 200,000 developers" (own LinkedIn); GDG New Delhi page lists 58,121 members (snippet) | https://www.linkedin.com/company/commudle ; https://www.commudle.com/communities |
| Google Developer Groups | Volunteer-run chapters on gdg.community.dev (Bevy) | Free; Google-funded | 76 professional chapters in 53 Indian cities; GDG Hyderabad 11,954 members (snippet) | https://gdgindia.dev/ ; https://gdg.community.dev/gdg-hyderabad/ |
| Meetup | Group and event listings | Organiser subscription; Meetup+ for members | See 1.1 row 6 | https://andypiper.co.uk/2024/10/18/meetup-com-is-so-over/ |
| Luma | Event pages, approval and waitlist, reminders by email, SMS, push and WhatsApp, check-in | Free with 5% fee on paid tickets and 500 invites a week; Plus $59/month billed annually, 0% fee (opened via browser) | About 2 million event sign-ups a month (snippet, weak) `[U]`. Used by curated Bengaluru AI meetups, which spread by WhatsApp and Telegram first (snippet) | https://luma.com/pricing ; https://www.cityscope.media/article/how-to-hack-bengalurus-ai-meetup-scene-without-burning-out |
| KonfHub, Townscript, Hasgeek | Indian event registration and ticketing | Per-ticket fees `[U]` | Not checked `[U]` | https://konfhub.com/ |
| Unstop | Student competitions, hackathons, hiring challenges; employers pay | Free for students | 28 million users, 150+ enterprise customers; FY25 revenue Rs 33.1 crore, up 50.7%; $5M raised (2023) (snippet) | https://inc42.com/company/unstop/ ; https://yourstory.com/2025/12/unstopai-is-building-indias-largest-early-talent-hiring-engine |
| Devfolio | Hackathon applications, submissions, judging; has a "Report Project" flag for recycled work | Free for hackers | "33k+ developers, 500+ hackathons" per a Reskilll blog, a competitor (snippet) `[U]` | https://blogs.reskilll.com/top-7-hackathon-platforms-in-india-2026-a-complete-comparison/ |
| Reskilll | Runs this hackathon and others | - | No independent figures found `[U]` | https://reskilll.com/allHacks |
| Scaler | Paid cohort programmes with community hubs | Course fees | Cut about 150 staff (10%) in April 2024 (snippet) | https://entrackr.com/2024/04/tech-upskilling-startup-scaler-lays-off-150-employees/ |
| GrowthSchool | Cohort courses with community | - | Searched for layoffs or community data; nothing found `[U]` | - |

### Interest groups and local communities

| Product | What it does | Price | Scale or traction | Source |
|---|---|---|---|---|
| MyGate (Bengaluru) | Gate entry, visitor approval, society ERP, accounting, notices; calls itself "India's largest community platform" (opened via browser) | Per flat per month; two comparison sites give Rs 5-12 and Rs 40-60 `[U]` | 25,000+ complexes (Aug 2023, opened); 27,000-30,000 societies (snippet); $93.8M raised; "turned profitable" April 2025 (snippet) | https://mygate.com/ ; https://restofworld.org/2023/home-monitoring-mygate-digital-bias/ ; https://tracxn.com/d/companies/mygate/__8u1wE5l4_FM9nweHDS2BSo2b6dklMij0zVVdC5Cfm3s |
| NoBrokerHood, ADDA, ApnaComplex | Same category | Rs 4-15 per flat per month in one comparison (snippet) `[U]` | NoBrokerHood 25,000+ societies (snippet) | https://codingclave.com/blog/best-society-management-app-india-2026 |
| Nextdoor | Verified-address neighbourhood feed; ads | Free | FY2025 revenue $257.6M, net loss $54.2M; platform WAU 21.6M in Q3 2025, down 3% (snippet of SEC filings). Q4 2024: revenue $65.2M, WAU 45.9M (opened). Not operating in India (11 countries as of 2023, snippet) | https://www.sec.gov/Archives/edgar/data/1846069/000184606925000015/exhibit992-pressreleasexye.htm ; https://www.sec.gov/Archives/edgar/data/1846069/000184606925000135/exhibit992-pressreleasexq3.htm |
| Kutumb (Primetrace, Bengaluru) | Vernacular community groups for caste, trade and local associations | Free; paid features | "100M+" (own site); FY25 revenue Rs 147 crore; in talks to raise $50M at $500M (snippets) `[U]` | https://kutumb.app/ ; https://x.com/chandrarsrikant/status/2082698696236597521 |
| LocalCircles | Citizen circles and surveys | Free | Survey samples of 20,000-77,000 | https://www.localcircles.com/a/index/core?press= |
| Strava clubs | Activity feed, club events | Free; subscription | Clubs "nearly quadrupled" in 2025 to over 1 million; 180 million users (snippet). One directory lists 25 Bengaluru run clubs (snippet) | https://runningmagazine.ca/the-scene/stravas-year-end-trend-report-shows-run-clubs-are-in-nightclubs-are-out/ ; https://www.endorfin.run/run-clubs/bengaluru |
| Informal stack | WhatsApp group plus Google Form plus a spreadsheet plus a UPI QR | Free | Not measured `[U]` (general observation, no source) | - |

### Creator communities

| Product | Price (Oct 2026) | Source |
|---|---|---|
| Circle | Professional $89/month + 2% fee; Business $199 + 1%; Scale $419 + 1%; Plus custom + 0.5% (opened) | https://circle.so/pricing |
| Skool | Hobby $9/month + 10% fee; Pro $99/month + 2.9% (opened) | https://www.skool.com/pricing |
| Mighty Networks | $79, $179, $354 a month (snippet) | https://www.creatorstackclub.com/software/mighty-networks/pricing |

## 1.3 Common approaches

How products in this track are built:
- **Chat plus bots.** Communities sit on WhatsApp, Telegram, Discord or Slack and add bots for moderation (MEE6, Dyno), verification and summaries (https://pixelscan.net/blog/discord-spam-bots-how-they-work-5-best-anti-spam-tools/ snippet).
- **Feed plus profile.** A LinkedIn-style graph with a niche angle: proof of work (Peerlist), multi-role identity (Polywork), women professionals (leap.club), students (Bluelearn).
- **Events layer.** RSVP, approval, waitlist, reminders, QR check-in (Luma, Meetup, Commudle, KonfHub).
- **Access control plus ERP for a place.** Gate approval tied to accounting and notices (MyGate, NoBrokerHood, ADDA).
- **Paid membership shell.** Courses plus forum plus payments (Circle, Skool, Mighty Networks).
- **AI layer, 2025-26.** Unread-chat summaries (WhatsApp, Discord, Slack, Telegram), AI search over history (Slack Business+), and AI triage of contributions (one of several options GitHub said it was considering, Feb 2026; "triage tools, possibly AI-based", per The Register; not shipped as of the 13 Feb 2026 changelog). None of the four chat summarisers is described as running on the phone: Discord's was built with OpenAI, Telegram's runs on its Cocoon network, Slack's is a paid cloud feature, and WhatsApp's uses a confidential VM in Meta's cloud (https://www.medianama.com/2025/06/223-whatsapp-rolls-out-ai-message-summaries-in-us-privacy-concerns/).

What hackathon teams build here:
- Evidence from this hackathon is thin. In a pull of 578 public "iqoo" repos created after 15 Jul 2026 (GitHub search, 2026-10-03), almost none describe themselves as a community app. The four City Battles ran seven tracks (FinTech and Commerce, Smart Education, HealthTech, Productivity, Smart Living, Developer Tools, Open Innovation); Community App and Mobility are new at the Finale (organiser page saved in `notes/site-cities.txt`), so there is little precedent. The nearest clusters in `01-hackathon.md` section 3.2 are disaster/SOS/offline mesh (about 32 repos) and scam/fraud detection (about 37).
- One public Finale entry in this track: TrustLens, an "AI-powered community trust and investigation platform" for suspicious internships, job offers, events, recruiters and QR codes, motivated by a Rs 850 internship scam (https://github.com/Anjali112005/TrustLens-IQOO-HACKATHON).
- The usual clichés in this category, from my reading of the failed startups below and general hackathon experience, not from a counted source `[U]`: "LinkedIn for X", skill or mentor matching, an event-discovery feed, a chat-summary bot, a neighbourhood help board, an offline mesh chat. Each maps to a product that already exists or already failed (Polywork, Bluelearn, Geneva, Nextdoor, the four chat summarisers).

## 1.4 Why incumbents work

- **They are already installed and free.** Communities start on WhatsApp because every member has it. Polywork's founder said he saw no "viable path" to a very large business against LinkedIn after 3.5 years and $40M+ (snippet: https://x.com/multiplay3r/status/1873859669065978327).
- **Mandated use.** Once an RWA adopts a gate app, residents and staff have no choice (https://restofworld.org/2023/home-monitoring-mygate-digital-bias/). The buyer is the association, not the resident.
- **Integration with money and hardware.** Society apps combine gate, accounting, audit, vendors and notices in one ERP (https://mygate.com/), which is hard to replace piece by piece.
- **Someone else pays.** Google funds GDG chapters; employers pay Unstop (150+ enterprise customers) to reach students; sponsors pay for hackathons.
- **Free where rivals charge.** Discord keeps full history free while Slack hides it after 90 days; Luma is free for free events while Meetup charges organisers.
- **Search distribution.** 84% of surveyed developers name Stack Overflow as a community platform they used or plan to use, even as posting collapses (https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/).
- **Trust anchor.** Nextdoor verifies addresses; LinkedIn has employer history; these make identity cheaper to check than in an open chat group.

## 1.5 Why incumbents fail or frustrate

| Case | Date | What happened | Stated reason | Source |
|---|---|---|---|---|
| Polywork | Announced Dec 2024, closed 31 Jan 2025 | Shut, remaining capital returned; had raised $40M+ | Growth stalled; no path to a very large standalone business; a 2023 pivot to AI personal websites did not help | https://x.com/multiplay3r/status/1873859669065978327 ; https://x.com/businessposthq/status/1875104854881796185 (snippets). `[U]` Closing date and stated reason not confirmed by either reviewer on 2026-10-03 (X not readable; polywork.com no longer resolves) |
| Koo (Bengaluru) | 2-3 Jul 2024 | Shut after raising $60M+ | Partnership talks failed; funding winter; high cost of running a social app; acquirers "didn't want to deal with user generated content"; TechCrunch adds it struggled to grow users and revenue in its last two years | https://techcrunch.com/2024/07/02/indian-social-network-koo-to-shut-down/ (opened) |
| Bluelearn (Bengaluru, student community) | 22 Jul 2024 | Shut; returned 70% of capital; had raised $3.95M | Founders could not see it becoming a venture-scale, revenue-generating business | https://inc42.com/features/2024s-startup-graveyard-12-indian-startups-that-shut-down-this-year/ (opened) ; https://inc42.com/buzz/elevation-capital-backed-bluelearn-shuts-operations-to-return-70-money-to-investors/ (opened 2026-10-03) |
| leap.club (women professionals) | Announced 15 May 2025; halted end of May 2025 (corrected 2026-10-03; was "May 2024") | Halted; $2.3M raised; 25,000+ paid members | High acquisition cost, weak retention, a funding round that fell through; call-based sales did not scale; FY24 loss Rs 5.59 crore | https://inc42.com/buzz/leap-club-halts-operations-due-to-funding-crunch-retention-challenges/ (opened) |
| Geneva (group chat) | Bumble deal announced 20 May 2024, closed 1 Jul 2024 (https://www.geneva.com/blog/meant-to-bee, opened); app shutdown announced 18 Sep 2025 | Folded into Bumble BFF | Zero revenue as of 30 Jun 2025 | https://techcrunch.com/2025/09/18/bumble-bffs-revamped-app-is-here-focusing-on-friend-groups-and-community-building/ (opened) |
| Orbit (community analytics) | Acquired by Postman Apr 2024; closed Jul 2024 | Product sunset | Not stated on the closing page | https://orbitapp.io/ (snippet) |
| Threado (Bengaluru, community dashboard) | Pivoted to AI support agents; entity dissolved 28 Mar 2025 per one write-up | - | Community tooling stopped being the product | https://yespress.io/threado (snippet, weak) `[U]` |
| Meetup | Since Jan 2024 | Organiser price roughly tripled for Meetup Pro (the blog author's account); attendee list paywalled. Meetup's own help page confirms a June 2024 price change but shows plan- and location-dependent prices, not a universal tripling (Codex, 2026-10-03; page blocked to Opus) `[U]` for the multiplier | New owner's pricing | https://andypiper.co.uk/2024/10/18/meetup-com-is-so-over/ (opened) ; https://help.meetup.com/hc/en-us/articles/28677808413197-Organizer-Subscription-prices-overview |
| Stack Overflow | 2023-26 | Questions down 78% year on year by Dec 2025 | AI tools; also a culture seen as hostile to basic questions | https://gigazine.net/gsc_news/en/20260108-stack-overflow-questions-drop/ (opened) |
| Slack for communities | 2022-25 | History hidden, then deleted; sponsored plans withdrawn at short notice | Vendor policy | https://blog.zulip.com/2025/07/24/who-owns-your-slack-history/ (opened) |
| Reddit | Jun 2023 | API pricing; third-party apps closed; 8,000+ subreddits protested | Platform monetisation against moderators' tools | https://en.wikipedia.org/wiki/Reddit_API_controversy (snippet) |
| Discord | Oct 2025 | 70,000+ ID images exposed through a support vendor | Server-side collection of IDs | https://techcrunch.com/2025/10/09/discord-suffers-data-breach-impacting-at-least-70000-users/ (opened) |
| Nextdoor | 2025 | Net loss $54.2M on $257.6M revenue; restructuring to cut about $30M of annual cost; platform WAU falling | Ad-funded local feed has not reached profit | SEC links in 1.2 (snippet) |
| MyGate and peers | 2020-23 | Worker surveillance; cross-complaints of data theft | Buyer (RWA) and data subject (worker, resident) are different people | https://restofworld.org/2023/home-monitoring-mygate-digital-bias/ (opened) |
| curl bug bounty | Jan 2026 | Ended (run length "six years" not stated in the opened article `[U]`) | Load from a "torrent" of low-quality submissions, increasingly AI-generated | https://www.theregister.com/2026/01/21/curl_ends_bug_bounty/ (opened 2026-10-03) |
| Community-tool category | 2024-25 | CMX: 37% of respondents hit by layoffs; DevRel 14.6% laid off | ROI hard to prove | https://www.cmxhub.com/community-industry-report-2024 (opened) |

Pattern across the Indian shutdowns (Koo, Bluelearn, leap.club): each had users and praise but no revenue line that covered acquisition and running cost. Earlier precedent: Google closed its India neighbourhood Q&A app Neighbourly in 2020 (snippet: https://techcrunch.com/2020/04/01/google-to-shut-down-its-india-focused-qa-app-neighbourly).

## 1.6 Gaps stated by sources

| Gap, as the source states it | Source |
|---|---|
| Developers still want a human when AI fails: 75.3% say they would ask a person because they do not trust AI answers; 61.3% want to fully understand their code; 35% of respondents visit Stack Overflow after hitting problems with AI answers (corrected 2026-10-03: it is a share of respondents, not of visits); 46% distrust AI accuracy vs 33% who trust it; India shows the highest trust (56% high or some) | https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/ (opened) |
| Maintainers need triage tools and transparency about AI use; reviewers "can no longer assume authors understand or wrote the code"; a Mozilla.ai engineer says the community must find a way to keep knowledge sharing alive. Checked 2026-10-03: these are maintainers quoted by The Register (Microsoft Azure, GoCD, Mozilla.ai), not GitHub's own words; GitHub's product manager framed it as "a problem of PR volume that's been amplified by AI" | https://www.theregister.com/2026/02/03/github_kill_switch_pull_requests_ai/ (opened) |
| Blocking does not stop WhatsApp spam; senders return on new numbers and through WhatsApp Business | https://www.localcircles.com/a/press/page/whatsapp-unsolicited-messages (opened) |
| Chat summaries may be inaccurate for Indian languages because "we still lack rich and representative datasets" (a policy analyst quoted by Medianama, confirmed 2026-10-03); the feature launched 25 Jun 2025 in the US only; processing is in Meta's cloud, with experts noting the incentive to keep data | https://www.medianama.com/2025/06/223-whatsapp-rolls-out-ai-message-summaries-in-us-privacy-concerns/ (opened) |
| "Data that is never collected cannot be leaked"; privacy-respecting, decentralised verification standards do not yet exist at scale. The article does not name on-device checks specifically | https://proton.me/blog/discord-age-verfication-breach (opened) |
| Domestic workers have no interface, cannot see or contest ratings | https://restofworld.org/2023/home-monitoring-mygate-digital-bias/ (opened) |
| Communities on Slack do not own or cannot export their history | https://blog.zulip.com/2025/07/24/who-owns-your-slack-history/ (opened; competitor's blog) |
| Meetup organisers want attendee lists and fair pricing; they name Luma, Heylo, Discord, Mobilizon and others as exits | https://andypiper.co.uk/2024/10/18/meetup-com-is-so-over/ (opened) |
| Community teams cannot prove ROI (top budget challenge, 40.7%) | CMX 2025 PDF (snippet) |
| Apartment associations want clear election timelines, defined tenure and a dispute-resolution route in law | https://www.thehindu.com/news/cities/bangalore/bengaluru-apartment-residents-seek-builder-accountability-parking-norms-in-new-bill/article71226952.ece (opened via browser) |

Where sources point to on-device, offline or sensor needs:
- **Privacy.** WhatsApp chats are end-to-end encrypted, so Meta built a separate confidential-cloud path to summarise them. The phone is the only place the plaintext already sits. This is my inference from the Medianama description; no source says "must be on-device".
- **ID and verification data.** The Discord breach and the Proton article make the case against collecting ID images on servers.
- **Indian languages.** Medianama's source flags weak language data; the organiser lists Sarvam-class models for the event phone (`common.md`).
- I found no source saying community apps need offline use or phone sensors. The nearest is the apartment waste-segregation mandate in `03-india-mandates.md` (camera, basements with no signal).

## 1.7 Closing table: Community App

| Pain | Evidence of severity | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| Scam and spam in groups | 96% of WhatsApp users get daily unsolicited messages; Rs 22,495 crore cyber-fraud loss in 2025, 76% investment scams | Admin deletes; users block; 1930 helpline | Victims; admins' time | Blocking fails; spam via WhatsApp Business | https://www.localcircles.com/a/press/page/whatsapp-unsolicited-messages ; https://theprint.in/india/cybercrime-saw-24-spike-in-2025-indians-lost-rs-22495-crore-mainly-in-investment-scams/2859930/ |
| Verifying people, offers, contributions | 80.6M fake LinkedIn accounts removed in six months; "1 out of 10" AI PRs legitimate (one maintainer) | Manual checks; badges; asking around | Victims; maintainers | ID checks are server-side and leak (70,000 IDs) | https://restofworld.org/2025/linkedin-job-scams/ ; https://www.theregister.com/2026/02/03/github_kill_switch_pull_requests_ai/ ; https://techcrunch.com/2025/10/09/discord-suffers-data-breach-impacting-at-least-70000-users/ |
| Knowledge lost in chat | Slack hides after 90 days, deletes after a year; Stack Overflow questions down 78% year on year | Re-asking; pinned messages; manual FAQ docs | Members' time | History owned by vendor; chat not searchable from outside | https://blog.zulip.com/2025/07/24/who-owns-your-slack-history/ ; https://gigazine.net/gsc_news/en/20260108-stack-overflow-questions-drop/ |
| Volunteer moderation load | 466+ hours a day unpaid on Reddit (2020); 60% of maintainers considered quitting | Bots; more volunteer mods | Volunteers | Platforms rely on free labour; Indian admins carry legal risk | https://arxiv.org/pdf/2205.14529 ; https://dev.to/tidelift/60-of-maintainers-are-still-not-paid-for-their-work-35jo |
| Event no-shows | 40-60% for free events (vendor figures) | Over-booking; approval lists; reminders; deposits | Organisers, sponsors | Reminders do not change the cost of not coming | https://www.glueup.com/blog/fix-high-event-rsvp-no-show-rate |
| Platform rent and rule changes | Meetup Pro tripled; Reddit API; Slack downgrade notice | Migrate to Luma, Discord | Organisers | Community does not own its member list or history | https://andypiper.co.uk/2024/10/18/meetup-com-is-so-over/ |
| Lurkers, weak retention | 90-9-1; leap.club closed with 25,000 paid members | Contests, AMAs, manual nudges | Operator | Acquisition cost exceeds retained value | https://inc42.com/buzz/leap-club-halts-operations-due-to-funding-crunch-retention-challenges/ |
| No revenue or provable ROI | ROI top challenge 40.7%; Geneva zero revenue; Koo, Bluelearn shut | Sponsorships; employer-paid hiring | Investors; staff | Users will not pay; buyers want proof | https://techcrunch.com/2025/09/18/bumble-bffs-revamped-app-is-here-focusing-on-friend-groups-and-community-building/ |
| Privacy imbalance in society apps | 25,000+ complexes; workers rated with no access | None for workers | Workers; residents | Buyer is the RWA, not the data subject | https://restofworld.org/2023/home-monitoring-mygate-digital-bias/ |
| RWA governance disputes | Bill consultation, 15 Jul 2026; no frequency data `[U]` | WhatsApp arguments; lawyers | Associations, owners | Apps record transactions, not decisions or disputes | https://www.thehindu.com/news/cities/bangalore/bengaluru-apartment-residents-seek-builder-accountability-parking-norms-in-new-bill/article71226952.ece |

---

# Track 2: Open Innovation

Organiser scope: anything outside the other tracks, any domain, "with a local or open-source model at the core". This section covers the five domains named in the brief, 4-5 pain points each.

What entrants at the four City Battles already built in these domains (keyword clusters over 645 public repos, from `01-hackathon.md` section 3.2; rough counts):

| Domain | Clusters already crowded | Approx. repos |
|---|---|---|
| Education | Tutor, study, classroom | 50-60 |
| Health | Physio, rehab, posture, fitness | 40-60 |
| Health | Medication or prescription reading | about 15 |
| Health | Elderly companion; assistive for blind; sign language | about 11; 16; 7 |
| Fintech and commerce | Scam, fraud, UPI safety | about 37 |
| Fintech and commerce | Bill, receipt, form; kirana ledger or shelf | about 16; 13 |
| Safety and civic | Disaster, SOS, offline mesh | about 32 |
| Agriculture | No cluster large enough to list | - |

Of 24 City Battle winners, 7 were health or care projects and 3 were scam or fraud projects (`01-hackathon.md` section 3.1).

## 2A. Health

### (1) High pain points

| # | Pain | Evidence | Who pays |
|---|---|---|---|
| 1 | Insurance claims are cut, refused or slow | IRDAI FY24: Rs 15,100 crore of health claims disallowed and Rs 10,937 crore repudiated, together about Rs 26,000 crore, up 19.1%; 2.69 crore claims; 11% rejected; 6% pending (opened: https://www.businesstoday.in/personal-finance/insurance/story/health-insurance-claim-rejections-by-insurance-companies-went-up-by-1910-in-fy24-458593-2024-12-26). FY25: 3.26 crore claims, 87% settled, 8% repudiated (snippet: https://www.oquilia.com/news/irdai-claim-settlement-ratio-fy24-25-explained). LocalCircles, 7 Mar 2026, 54,000+ responses: over 4 in 10 claimants had a claim rejected or part-paid for reasons they call invalid; over 70% saw premiums rise 50-200% in three years; 5 in 10 waited 6-48 hours for approval and discharge (opened: https://www.localcircles.com/a/press/page/health-insurance-claim-survey) | Policyholder pays the gap; hospital bed is blocked |
| 2 | Out-of-pocket spending | Out-of-pocket share of total health spending was 39.4% in 2021-22, down from 62.6% in 2014-15 (64.2% in 2013-14) (National Health Accounts, released 25 Sep 2024) (opened 2026-10-03; base year corrected from "62.6% in 2013-14": https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2058791; Codex also confirmed 39.4% in the MoHFW NHA 2021-22 PDF). One analysis puts health-cost impoverishment at about 55 million people a year (snippet of a journal article; year of data not checked `[U]`) | Household |
| 3 | Large untreated chronic disease and anaemia burden | ICMR-INDIAB (Lancet Diabetes and Endocrinology, 2023): 101 million with diabetes, 136 million prediabetes, 315 million hypertension (snippet: https://www.thelancet.com/journals/landia/article/PIIS2213-8587(23)00119-5/fulltext). NFHS-5 (2019-21): anaemia in 57% of women 15-49 and 67.1% of children 6-59 months (snippet: https://www.downtoearth.org.in/health/nfhs-5-paints-an-anaemic-picture-of-child-health-and-nutrition-80512) | Household; public system |
| 4 | Mental health care is scarce | Treatment gap 70-92% (National Mental Health Survey 2015-16); 0.75 psychiatrists per lakh people (Economic Survey 2023-24) (snippets: https://www.business-standard.com/economy/news/eco-survey-quadruple-psychiatrists-integrate-mental-health-in-schools-124072200827_1.html). 170,746 suicides in 2024 (snippet: https://www.downtoearth.org.in/agriculture/farm-suicides-dipped-marginally-in-2024-but-continue-at-rate-of-one-every-hour-in-india-ncrb); 171,418 in 2023 (opened: https://www.downtoearth.org.in/health/ncrb-report-2023-approximately-one-farmer-took-their-own-life-every-day-shows-assessment) | Family; state |
| 5 | Rural specialist shortage and data burden on frontline workers | 79.5% shortfall of specialists at Community Health Centres (Health Dynamics of India 2022-23) (snippet: https://www.tribuneindia.com/news/nation/80-shortfall-of-specialists-in-rural-india-469835). ASHA workers use 7+ apps plus WhatsApp groups and spreadsheets and still fill paper registers; logins time out after 15 minutes with no save; mobile penetration "just 59%" in the rural areas where ASHAs work; a fixed stipend of nearly $40 plus task incentives, total pay put at $55-165 a month, while workers buy their own phones and data (opened, re-checked 2026-10-03; article dated 31 Mar 2026: https://newlinesmag.com/reportage/indias-digital-health-push-is-overworking-its-front-line-women/). A Meghalaya study counted about 90 overlapping reporting systems, 34 of them digital (snippet: https://www.sciencedirect.com/science/article/pii/S2949856225000765) | ASHA (own phone and data); state |

### (2) Existing solutions and incumbents

| Who | What | Scale (date) | Source |
|---|---|---|---|
| ABDM / ABHA | National health ID and record linking | 93.95 crore ABHA numbers; 105 crore+ records linked (10 Jul 2026) (snippet) | https://www.ibef.org/news/ayushman-bharat-digital-mission-crosses-93-95-crore-abha-ids-strengthens-india-s-digital-healthcare-ecosystem |
| eSanjeevani | Free government telemedicine | 43 crore consultations (2026) (snippet) | https://www.digitalhealthnews.com/esanjeevani-crosses-43-crore-consultations-as-india-strengthens-digital-health-network |
| Tele-MANAS (14416) | Free mental-health helpline | 32.84 lakh calls by 2 Feb 2026; 53 cells (snippet) | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2224522 |
| Practo | Doctor discovery; hospital lead generation | FY25 revenue Rs 234 crore; what worked was the hospital-facing lead product (snippet, analyst blog) | https://charugupta.substack.com/p/indias-consumer-health-tech-fifteen |
| PharmEasy | E-pharmacy | Valuation cut about 90% in a 2024 rights issue; FY24 loss Rs 2,533 crore (snippet) | https://en.wikipedia.org/wiki/PharmEasy |
| TPAs and hospital insurance desks; agents | Handle claims on paper and portals | 72% of claims go through TPAs (opened, Business Today link above) | - |
| Informal | Family WhatsApp, chemist advice, paper files | Not measured `[U]` | - |

### (3) Common approaches

Teleconsult marketplaces, e-pharmacy delivery, symptom chatbots, record lockers on ABDM, and camera-based screening. Hackathon staples at this event: posture and physio coaching, prescription and medication readers, elderly companions, retinopathy and stroke screening, PPG vitals (`01-hackathon.md` 3.2). These are the most crowded themes after tutoring.

### (4) Why incumbents work

Government services are free and pushed through the public system (ABHA, eSanjeevani). Practo earns because hospitals pay for patient leads. Insurers and TPAs sit on the payment path, so patients cannot route around them.

### (5) Why incumbents fail or frustrate

- Kenko Health shut in Aug 2024: ran out of money and could not get an IRDAI licence (IRDAI wanted a domestic lead investor, per Moneycontrol 23 Aug 2024, opened 2026-10-03). Nintee shut in Apr 2024: user retention and scaling; returned remaining capital (opened: https://inc42.com/features/2024s-startup-graveyard-12-indian-startups-that-shut-down-this-year/).
- PharmEasy: debt and discount-led growth (snippet above). A blog says Jivi AI and mfine have shut; not verified `[U]`.
- Frontline digitisation added work: the same data goes into paper and several apps (New Lines link above).
- Claims: one trade outlet reports the regulator could not explain why claims go unpaid (snippet, title only: https://www.insurancebusinessmag.com/asia/news/life-insurance/irdai-cannot-explain-why-health-insurance-claims-go-unpaid-583814.aspx) `[U]`.

### (6) Gaps stated by sources

- ASHA workers ask officials to see field conditions: Patil, quoted in the article, tells officials: "Try uploading information in poor network zones; try field visits and multiple digital entries same-day" (New Lines, re-opened 2026-10-03). The 15-minute timeout with no save and 59% rural mobile penetration are stated there, so poor-network operation is a source-stated need. Corrected 2026-10-03: New Lines does not mention OTP failures or an explicit request for fewer, non-duplicated entries; those may come from the ScienceDirect study, which returned 403 and stays `[U]`.
- LocalCircles: claimants want reasons for deductions and faster discharge approval.
- Medianama's point on weak Indian-language data (Track 1) applies to any health text or voice tool.

| Pain | Evidence | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| Claim cuts and delay | About Rs 26,000 crore disallowed or repudiated FY24; 4 in 10 claimants affected | TPA desk, agent, ombudsman | Policyholder | Opaque deductions; 6-48 hour discharge wait | https://www.localcircles.com/a/press/page/health-insurance-claim-survey |
| Out-of-pocket cost | 39.4% of health spend | Borrowing, savings | Household | Cover does not reach outpatient spend | https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2058791 |
| Chronic disease, anaemia | 101M diabetes; 57% of women anaemic | Camps, private labs | Household, state | Screening and follow-up gaps | https://www.thelancet.com/journals/landia/article/PIIS2213-8587(23)00119-5/fulltext |
| Mental health access | 70-92% treatment gap; 0.75 psychiatrists per lakh | Tele-MANAS, family | Family | Too few professionals | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2224522 |
| Frontline data burden | 7+ apps plus paper; 59% rural mobile penetration | Double entry, family help | ASHA | Apps need network and OTP; no single record | https://newlinesmag.com/reportage/indias-digital-health-push-is-overworking-its-front-line-women/ |

## 2B. Fintech and commerce

### (1) High pain points

| # | Pain | Evidence | Who pays |
|---|---|---|---|
| 1 | Cyber and payment fraud | 2025: Rs 22,495 crore lost, 28.15 lakh complaints (2024: Rs 22,845 crore, 22.68 lakh). Investment fraud 76% of losses; digital arrest 9% of losses; sextortion 19% of cases. I4C's suspect registry has blocked Rs 8,031.56 crore and flagged 24.67 lakh mule accounts (opened: https://theprint.in/india/cybercrime-saw-24-spike-in-2025-indians-lost-rs-22495-crore-mainly-in-investment-scams/2859930/). NCRB: 1,01,928 cybercrime cases in 2024, up 17%, 72.6% for fraud (opened via browser: https://www.thehindu.com/news/national/rise-in-cybercrime-but-overall-crime-rate-dropped-in-2024-says-latest-ncrb-report/article70948292.ece). LocalCircles, 26 Jun 2025, 32,000+ responses: 20% of families hit by UPI fraud in three years; 51% of victims filed no complaint (opened: https://www.localcircles.com/a/press/page/upi-fraud-complaint). Digital arrest: 1,23,672 cases and Rs 1,935.51 crore in 2024 per a Parliament reply; Supreme Court took suo motu notice and ordered a CBI probe (snippets: https://www.moneylife.in/article/fraud-alert-india-is-losing-over-22000-crore-a-year-in-cyber-scams-and-the-worst-is-yet-to-come/80612.html ; https://www.tribuneindia.com/news/cybercrimeindia/sc-tells-cbi-to-probe-pan-india-digital-arrest-scam-role-of-bank-staff) | Victim; banks |
| 2 | MSME credit gap and late payment | Credit gap about Rs 30 lakh crore, 24% of addressable demand; 35% for women-owned firms (SIDBI, May 2025) (snippet: https://www.businessworld.in/article/sidbi-pegs-msme-credit-gap-at-rs-30-lakh-cr-24-of-demand-556647). Delayed payments Rs 7.34 lakh crore at March 2024, 4.6% of GVA; micro firms wait about three times longer (opened: https://knnindia.co.in/news/newsdetails/msme/delayed-payments-to-msmes-decline-from-rs-10-lakh-cr-to-rs-7-lakh-cr-but-challenges-persist-game-fisme-report). Economic Survey 2025-26 cites Rs 8.1 lakh crore (snippet) | Small supplier |
| 3 | Dark patterns and hidden fees online | LocalCircles audit, Jun-Sep 2025, 77,000 responses: 97% of 290 platforms use dark patterns; 75% of users met drip pricing; only Meesho cleared every check; the CCPA guideline carries no automatic penalty (opened: https://www.medianama.com/2025/10/223-localcircles-e-commerce-platforms-dark-patterns-hidden-fees/). CCPA ordered self-audits on 5 Jun 2025; 26 platforms declared compliance (snippet: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2191948) | Consumer |
| 4 | Kirana stores losing to quick commerce | About 2 lakh kirana closures out of roughly 13 million, 45% in metros (AICPDF, a distributor lobby, Oct 2024) (opened: https://www.outlookbusiness.com/news/nearly-2-lakh-kirana-stores-close-as-battle-for-survival-against-quick-commerce-players-intensifies). ONDC retail orders fell from 6.5 million (Oct 2024) to 4.6 million (Feb 2025) as incentive caps fell from Rs 3 crore to about Rs 30 lakh (snippet: https://www.business-standard.com/companies/news/ondc-retail-decline-incentive-cuts-service-fee-growth-mobility-logistics-125032700419_1.html) | Shop owner |
| 5 | Banking and loan grievances | Over 13.34 lakh complaints were received under the RBI Ombudsman scheme in FY25 (CRPC and CMS portal), up 13.55%; ORBIOs handled 3.12 lakh of them; loans lead (opened 2026-10-03: https://www.livemint.com/money/personal-finance/rbi-ombudsman-saw-13-increase-in-consumer-complaints-in-fy25-heres-how-to-resolve-your-grievances-11764681127264.html). Reconciled 2026-10-03: the Addendum's "2.96 lakh" is the narrower count received at ORBIOs (RBI Annual Report), not a contradiction. RBI Annual Report FY25 (opened 2026-10-03, primary: https://www.rbi.org.in/scripts/AnnualReportPublications.aspx?Id=1436): Rs 36,014 crore across 23,953 frauds, but Rs 18,674 crore of it is 122 older cases reclassified after a Supreme Court ruling, so "nearly tripled" (https://www.medianama.com/2025/06/223-rbi-annual-report-2024-25-central-bank-agenda/) overstates new fraud; digital payments (card/internet) lead by count with 13,516 cases but only Rs 520 crore | Customer |

### (2) Existing solutions and incumbents

| Who | What | Scale | Source |
|---|---|---|---|
| UPI apps | Payments | 24.07 billion transactions worth Rs 29.37 lakh crore in Sep 2026; PhonePe 45.64% and Google Pay 32.26% of volume in Aug 2026 (snippets). NPCI: 24,508.96 million transactions and 752 live banks in Aug 2026 (Codex, 2026-10-03; NPCI page did not render for Opus) | https://entrackr.com/news/upi-transaction-volume-stays-above-24-bn-despite-18-m-o-m-dip-in-september-12611636 ; https://www.cxodigitalpulse.com/phonepe-crosses-11-billion-monthly-upi-transactions-in-august-google-pay-nears-8-billion/ |
| 1930 helpline, cybercrime.gov.in, I4C registry | Report and freeze | Rs 7,130 crore saved since 2021; 459 cyber police stations | ThePrint link above (opened) |
| RBI MuleHunter.ai; .bank.in domain | Mule-account detection; verified bank domains | Launched Dec 2024; Feb 2025. `[U]` dates: the Medianama page re-read on 2026-10-03 mentions MuleHunter.ai rollout plans but not these dates | Medianama link above (opened) |
| ONDC | Open commerce network | 15% of e-commerce users tried it in 2024-25; 54% found it hard to navigate (opened) | https://www.localcircles.com/a/press/page/ondc-consumer-experience |
| MSME Samadhaan, TReDS, ledger apps (Khatabook, OkCredit, Vyapar) | Payment claims, invoice discounting, bookkeeping | Not checked `[U]` | - |
| Informal | Paper khata, WhatsApp orders, local moneylender | Not measured `[U]` | - |

### (3) Common approaches

Scam-message and scam-call classifiers, payment-screen warnings, ledger and invoice apps, QR scanners, receipt OCR. At this hackathon about 37 repos are scam or UPI safety and three winners were in this theme (Kavach, Nazar, EdgePPG); about 13 are kirana tools (`01-hackathon.md`). One participant states the on-device rationale as: the bank sees the payment and the network sees the call, and only the phone sees both (https://github.com/abhinavyepuri/IQOO_Hackathon). That is a participant's claim, not an independent finding.

### (4) Why incumbents work

UPI is free, interoperable and on every shop counter; two apps hold about 78% of volume. Reporting is channelled to one number (1930). Kirana credit and neighbourhood trust keep the informal khata alive.

### (5) Why incumbents fail or frustrate

- Regulation ends business models quickly: on 31 Jan 2024 RBI barred Paytm Payments Bank from new deposits, credit transactions and top-ups from 29 Feb 2024, later extended to 15 Mar 2024 (opened 2026-10-03: https://techcrunch.com/2024/01/31/rbi-paytm-payments-bank-penalty/ ; RBI release of 16 Feb 2024: https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=57345). ZestMoney announced its wind-down on 5-6 Dec 2023 after PhonePe dropped a planned acquisition, amid a funding winter and "regulatory uncertainty" (RBI had stopped credit lines being loaded onto prepaid instruments); DMI bought its brand and technology in Jan 2024 (opened 2026-10-03: https://www.business-standard.com/companies/start-ups/fintech-startup-zestmoney-to-shut-down-to-lay-off-remaining-130-employees-123120600062_1.html ; https://techcrunch.com/2024/01/17/goldman-sachs-backed-zestmoney-once-valued-at-450-million-sold-to-dmi-in-fire-sale/). Muvin shut after RBI barred UPI in co-branded arrangements; GoldPe and Investmint could not find a working model (opened: Inc42 graveyard link in 2A). Real-money gaming: the Online Gaming Bill passed the Lok Sabha on 20 Aug 2025 and bars banks and financial institutions from processing real-money game transactions; the industry was valued at about $23 billion (opened 2026-10-03: https://techcrunch.com/2025/08/20/india-bans-real-money-gaming-threatening-a-23-billion-industry). Rajya Sabha passage (21 Aug) and assent (22 Aug 2025) are from Wikipedia only, and MeitY rules notified 22 Apr 2026 are from Codex (MeitY page blocked to Opus). "Removed a large payments customer base" is an inference, not a sourced figure.
- ONDC volume followed subsidies down; PhonePe's Pincode and Paytm left (LocalCircles ONDC page).
- Half of fraud victims never report (LocalCircles UPI page).

### (6) Gaps stated by sources

- LocalCircles: 51% of UPI fraud victims do not complain; 40% clicked a malicious link.
- I4C: scammers move victims to apps installed from private links outside app stores (NIE, July 2026).
- GAME-FISME: weak enforcement and unequal bargaining power keep payments late.
- Medianama/LocalCircles: dark-pattern rules have no automatic penalty (the CCPA guidelines omitted the clause linking violations to penalties; confirmed 2026-10-03).
- Added 2026-10-03 from the Addendum, confirmed by Opus in the RBI Annual Report 2024-25: RBI plans a near-real-time online dashboard on the availability of banks' digital services, phased in during 2025-26. This is a regulator-stated monitoring gap.
- On-device: see the participant claim in (3). No regulator document saying detection must be on-device was found `[U]`.

| Pain | Evidence | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| Cyber fraud | Rs 22,495 crore, 28.15 lakh complaints (2025) | 1930, bank freeze | Victim | Half do not report; money moves in minutes | https://theprint.in/india/cybercrime-saw-24-spike-in-2025-indians-lost-rs-22495-crore-mainly-in-investment-scams/2859930/ |
| MSME late payment | Rs 7.34 lakh crore (Mar 2024) | Follow-up calls, Samadhaan | Supplier | Enforcement slow | https://knnindia.co.in/news/newsdetails/msme/delayed-payments-to-msmes-decline-from-rs-10-lakh-cr-to-rs-7-lakh-cr-but-challenges-persist-game-fisme-report |
| Dark patterns | 97% of 290 platforms | Complaints, screenshots | Consumer | Self-audit only | https://www.medianama.com/2025/10/223-localcircles-e-commerce-platforms-dark-patterns-hidden-fees/ |
| Kirana squeeze | About 2 lakh closures (lobby estimate) | WhatsApp orders, ONDC | Shop owner | ONDC hard to use, subsidy-led | https://www.outlookbusiness.com/news/nearly-2-lakh-kirana-stores-close-as-battle-for-survival-against-quick-commerce-players-intensifies |
| Bank grievances | 13.34 lakh ombudsman complaints FY25 | Branch, ombudsman | Customer | Volume rising 13% a year | https://www.livemint.com/money/personal-finance/rbi-ombudsman-saw-13-increase-in-consumer-complaints-in-fy25-heres-how-to-resolve-your-grievances-11764681127264.html |

## 2C. Education

### (1) High pain points

| # | Pain | Evidence | Who pays |
|---|---|---|---|
| 1 | Children in school cannot read or do arithmetic at grade level | ASER 2024 (rural, released 28 Jan 2025), checked against the report PDF on 2026-10-03 (Tables 1-2, https://asercentre.org/wp-content/uploads/2022/12/ASER_2024_Final-Report_13_2_24-1.pdf): 27.1% of all rural Class 3 children can read a Class 2 text, so 72.9% cannot; 23.4% in government schools (16.3% in 2022) and 35.5% in private; 33.7% of Class 3 can do at least subtraction; 48.8% of Class 5 can read a Class 2 text; 30.7% of Class 5 can divide. Corrected 2026-10-03: the explainer page's "76.6% of all Class 3 cannot read" is the government-school complement, not all children (https://www.insightsonindia.com/2025/01/29/aser-report-2024/) | Child; parents (tuition) |
| 2 | Student distress | 14,488 student suicides in 2024, up 4.3% from 13,892, up 62.2% in ten years; 8.5% of all suicides (opened via browser: https://www.hindustantimes.com/india-news/14488-student-deaths-recorded-in-2024-rising-faster-than-overall-rate-ncrb-101778416840680.html ; https://www.newindianexpress.com/india/2026/May/09/students-account-for-85-of-suicides-in-india-ncrb snippet) | Family |
| 3 | Cost of coaching and private schooling | 27% of students were taking or had taken private coaching in the year (MoSPI Comprehensive Modular Survey: Education, 26 Aug 2025) (snippet: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2160863). Private schooling costs nearly nine times government schooling (headline: https://factly.in/private-schooling-costs-nearly-9-times-more-than-government-education-nss-survey/) | Household |
| 4 | Thin staffing and connectivity in schools | 1,04,125 single-teacher schools in 2024-25, 1,00,843 in 2025-26; 64.7% of schools had computers and 63.5% internet in 2024-25; 67.4% internet in 2025-26 (snippets: https://www.indiatoday.in/education-today/news/story/udise-2024-25-report-india-crosses-1-crore-teachers-internet-access-in-schools-rises-2778259-2025-08-28 ; https://indianexpress.com/article/education/internet-reaches-67-4-schools-one-in-three-still-without-connectivity-udise-10838173/) | State; child |
| 5 | Graduates not job-ready | India Skills Report 2026: 56.35% of tested youth employable, so about 44% are not (snippet: https://www.ndtv.com/education/india-skills-report-2026-employability-rises-to-56-35-india-emerges-as-global-talent-hub-9615876/amp/1). Youth unemployment 9.9% for ages 15-29, PLFS 2025, per a coaching-site summary `[U]` | Graduate; employer |

### (2) Existing solutions and incumbents

| Who | What | Status | Source |
|---|---|---|---|
| PhysicsWallah | Low-price test prep, online plus centres | IPO Nov 2025; Q1 FY26 revenue Rs 847 crore, loss Rs 127 crore (snippet) | https://economictimes.indiatimes.com/tech/startups/physicswallah-grows-33-in-q1fy26-but-losses-widen/articleshow/125132217.cms |
| Byju's | K-12 app | In insolvency; founder sentenced to six months for contempt by a Singapore court, May 2026 (snippets) | https://www.ndtv.com/business-news/byjus-founder-raveendran-sentenced-singapore-court-crisis-timeline-india-edtech-11552723 |
| upGrad, Unacademy | Upskilling; test prep | Described as a possible combined entity (headline) `[U]` | https://inc42.com/features/why-indias-edtech-sector-looks-like-a-two-horse-race/ |
| Unstop | Competitions and hiring | See Track 1 | - |
| DIKSHA, PM eVidya, Khan Academy | Free content | Not checked `[U]` | - |
| Private tutors, coaching centres, YouTube, WhatsApp study groups | Informal | 27% of students in coaching | PIB link above |

### (3) Common approaches

Recorded and live video classes, doubt-solving chat, test series, AI tutors, handwriting and answer checking. This is the most crowded hackathon theme at this event: 50-60 tutor, study or classroom repos (`01-hackathon.md`).

### (4) Why incumbents work

Exam stakes make parents pay; PhysicsWallah wins on price and teacher brand; offline centres add trust and supervision.

### (5) Why incumbents fail or frustrate

- Edtech equity funding fell from $4.3 billion (2021) to $265 million (2023) and $214 million in the first eight months of 2026; Byju's took 94% of 2023 funding (opened via browser: https://www.fortuneindia.com/business-news/indias-edtech-sector-enters-model-led-phase-as-funding-falls-listings-and-acquisitions-rise-tracxn/157357).
- Bluelearn shut (no venture-scale revenue). Stoa shut; Inc42 attributes it to refusing to go offline (opened: Inc42 graveyard link). Scaler cut 10% of staff in 2024.
- The sector moved to offline centres and institutional deals (snippet: https://www.newindianexpress.com/business/2026/Sep/04/edtech-sector-shifts-focus-as-funding-falls-consolidation-grows).

### (6) Gaps stated by sources

- ASER: 89% of rural 14-16 year olds have smartphone access but 57% use it for study and 76% for social media (insightsonindia page). Access is not the constraint; use is.
- UDISE+: about a third of schools have no internet, a stated offline condition.
- Experts quoted by Hindustan Times ask for early identification and counselling systems in institutions.

| Pain | Evidence | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| Foundational learning | 72.9% of rural Class 3 cannot read Class 2 text (76.6% in government schools) | Tuition, remedial camps | Parents, state | Content apps assume the child can read | https://www.insightsonindia.com/2025/01/29/aser-report-2024/ |
| Student distress | 14,488 suicides (2024) | Helplines, counsellors | Family | Weak support systems | https://www.hindustantimes.com/india-news/14488-student-deaths-recorded-in-2024-rising-faster-than-overall-rate-ncrb-101778416840680.html |
| Coaching cost | 27% in coaching | Cheaper online prep | Household | Price pressure; losses | https://www.pib.gov.in/PressReleasePage.aspx?PRID=2160863 |
| School staffing and internet | 1 lakh single-teacher schools; a third offline | Multigrade teaching | State | Online tools need connectivity | https://indianexpress.com/article/education/internet-reaches-67-4-schools-one-in-three-still-without-connectivity-udise-10838173/ |
| Employability | About 44% not employable (one test-based report) | Bootcamps, competitions | Graduate | Courses without jobs | https://www.ndtv.com/education/india-skills-report-2026-employability-rises-to-56-35-india-emerges-as-global-talent-hub-9615876/amp/1 |

## 2D. Agriculture

### (1) High pain points

| # | Pain | Evidence | Who pays |
|---|---|---|---|
| 1 | Low income and debt | Average agricultural household income Rs 10,218 a month (2018-19); 50.2% indebted; average loan Rs 74,121 (NSS 77th round, 2019; old) (snippets: https://www.pib.gov.in/PressReleasePage.aspx?PRID=1753856 ; https://economictimes.indiatimes.com/news/india/over-50-per-cent-agricultural-families-in-debt-with-average-loan-of-rs-74121-in-2019-survey/articleshow/86098176.cms). A new survey was announced in Aug 2025; results not found `[U]` | Farm household |
| 2 | Farm-sector suicides | 10,546 in 2024, 6.2% of all suicides (snippet: https://www.downtoearth.org.in/agriculture/farm-suicides-dipped-marginally-in-2024-but-continue-at-rate-of-one-every-hour-in-india-ncrb; Codex confirmed 2026-10-03 via Times of India: 4,633 farmers or cultivators and 5,913 agricultural labourers, of 170,746 suicides: https://timesofindia.indiatimes.com/india/10546-farm-suicides-in-2024-2-dip-from-previous-year-data/articleshow/130932171.cms). 2023: 10,786 (4,690 farmers, 6,096 labourers); Maharashtra and Karnataka lead (opened: https://www.downtoearth.org.in/health/ncrb-report-2023-approximately-one-farmer-took-their-own-life-every-day-shows-assessment) | Family |
| 3 | Post-harvest loss | About Rs 1.5 lakh crore a year; about 74 million tonnes of food; 6-15% of fruit and 5-12% of vegetables (opinion article citing government-commissioned data, 27 Jun 2026) (opened via browser: https://www.thehindubusinessline.com/economy/agri-business/why-post-harvest-loss-is-a-farmer-income-story-not-just-a-food-security-one/article71151214.ece). The NABCONS 2022 primary study was not opened `[U]` | Farmer |
| 4 | Crop-insurance claims arrive late or not at all | Vijayanagara, Karnataka: crop-cutting experiments done seven months earlier, claims still pending; farmers cite errors in forms, Aadhaar and bank details; some now refuse to pay premiums (opened via browser: https://timesofindia.indiatimes.com/city/hubballi/vijayanagara-farmers-await-crop-insurance-claims/amp_articleshow/132142794.cms). PMFBY covered 27.3 million farmers in Kharif 2026 (snippet). No national pending-claims figure found `[U]` | Farmer |
| 5 | Spurious seed and pesticide; thin advisory | Centre plans a tougher Seeds Bill to replace the 1966 Act (Sep 2026); arrests for spurious Bt cotton seed in Telangana (snippets: https://www.theweek.in/news/india/2026/09/10/new-seeds-bill-farmer-protection.html ; https://www.thehindu.com/news/cities/Hyderabad/four-arrested-for-transporting-spurious-bt-3-cotton-seeds-in-hayathnagar/article71006227.ece). No national loss figure found `[U]` | Farmer |

Over 85% of farmers are smallholders (BusinessLine article above). Agriculture Census 2021-22 results were searched for and not found; the 2015-16 figure of 1.08 hectares average holding is from memory `[U]`.

### (2) Existing solutions and incumbents

| Who | What | Scale | Source |
|---|---|---|---|
| Bharat-VISTAAR | Government AI advisory, voice-first. Corrected 2026-10-03: it is multi-channel, not phone-only: phone line 155261, a voice AI chatbot, a ministry web portal and a downloadable app; voice and IVRS access exist "for non-smartphone users"; the phone line needs no internet. Mandi prices, pest and scheme advice; 10 central schemes integrated; Hindi and English at launch, 4 more languages within 3 months and 5 more within 6 months planned; integrates AgriStack, ICAR, IMD | Phase I launched 17 Feb 2026 in Jaipur; Rs 150 crore allocated in Union Budget 2026-27 (opened 2026-10-03, PIB 13 Mar 2026: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2239788&lang=1&reg=3; Codex found the same) | https://www.freepressjournal.in/tech/bharat-vistaar-agriculture-ai-tool-launched-in-india-heres-all-you-need-to-know (opened) |
| DeHaat | Inputs, advisory, produce aggregation | FY25 operating revenue Rs 3,009.9 crore; reported net profit Rs 369 crore only because of a Rs 576.1 crore non-cash fair-value gain, so about Rs 207 crore loss without it; claims EBITDA breakeven in Q1 FY26 (checked 2026-10-03 by both reviewers; https://inc42.com/buzz/dehaat-posts-inr-369-cr-profit-in-fy25-on-back-of-non-cash-gains/); 13 million+ farmers; about 80% of revenue from produce trading | https://inc42.com/features/inside-dehaats-inr-3000-cr-scale-and-its-long-road-to-profitability/ (opened) |
| PMFBY | Subsidised crop insurance | 27.3 million farmers, Kharif 2026 (snippet) | https://www.cnbctv18.com/india/fasal-bima-yojana-coverage-crop-insurance-farmers-rodtep-extension-20000845.htm |
| PM-KISAN, e-NAM, Kisan Call Centre, Plantix | Income support; market; helpline; disease photo app | Not checked `[U]` | - |
| Input dealers, commission agents | Advice, credit, sale | Sector is about 94% informal (Inc42 DeHaat article) | - |

### (3) Common approaches

Leaf-photo disease detection, mandi-price and weather bots, voice advisory in local languages, input marketplaces, satellite-based credit and insurance scoring. At this hackathon agriculture is rare: no cluster in the repo scan, and one winner (Pune Tree Rakshak) is tree-related. The general clichés (disease-from-photo, price bot) are my characterisation, not a counted source `[U]`.

### (4) Why incumbents work

The local dealer bundles advice, credit and purchase. Government schemes are free. Middlemen run with lower overhead than a company (analyst quoted by Inc42).

### (5) Why incumbents fail or frustrate

- DeHaat has scale without operating profit; trading margins are thin (Inc42).
- Greenikk (agri-fintech) shut in 2024: no product-market fit, borrower defaults (Inc42 graveyard).
- Insurance: yield assessment and data mismatches delay claims (Times of India).
- Two searches for 2025-26 agritech shutdowns returned nothing usable `[U]`.

### (6) Gaps stated by sources

- BusinessLine author: no affordable storage near village clusters; farmers do not know the price difference between a mandi 20 km away and one 40 km away before loading; last-mile logistics missing.
- The government's advisory is voice-first and started with two languages. The ministry itself says the voice and IVRS channel exists "to ensure accessibility for small and marginal farmers" who do not have smartphones (PIB, 13 Mar 2026, opened 2026-10-03). The Free Press Journal page does not state this as a gap. Corrected 2026-10-03: there is also an app and a web portal, so the service is not "no app" only.
- Times of India: farmers want insurers to fix form, Aadhaar and bank-detail errors and explain assessments.

| Pain | Evidence | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| Low income, debt | Rs 10,218 a month; 50.2% indebted (2019) | Informal credit | Household | Data is seven years old | https://www.pib.gov.in/PressReleasePage.aspx?PRID=1753856 |
| Suicides | 10,546 (2024) | Relief schemes | Family | - | https://www.downtoearth.org.in/agriculture/farm-suicides-dipped-marginally-in-2024-but-continue-at-rate-of-one-every-hour-in-india-ncrb |
| Post-harvest loss | About Rs 1.5 lakh crore a year | Distress sale at harvest | Farmer | Storage and price information out of reach | https://www.thehindubusinessline.com/economy/agri-business/why-post-harvest-loss-is-a-farmer-income-story-not-just-a-food-security-one/article71151214.ece |
| Insurance delay | 7+ months pending in one district | Protests, grievance meetings | Farmer | Assessment opaque; data mismatch | https://timesofindia.indiatimes.com/city/hubballi/vijayanagara-farmers-await-crop-insurance-claims/amp_articleshow/132142794.cms |
| Spurious inputs, thin advice | New Seeds Bill planned; no loss figure `[U]` | Trust in dealer | Farmer | 1966 law; advisory in two languages | https://www.theweek.in/news/india/2026/09/10/new-seeds-bill-farmer-protection.html |

## 2E. Safety and civic

### (1) High pain points

| # | Pain | Evidence | Who pays |
|---|---|---|---|
| 1 | Road deaths | About 183,400 deaths and 513,474 crashes in 2025, provisional e-DAR data in a Lok Sabha reply. Reconciled 2026-10-03: HT (31 Jul 2026) gives 183,434 in its projection paragraph and 183,382 in its ten-year comparison; both come from the same e-DAR series, the 52-death gap is unexplained, so use "about 183,400". About 177,500 projected for 2026. Up to 27 Jul 2026: 296,447 crashes and 101,139 deaths; 24,446 pedestrian deaths; Karnataka 24,929 crashes (corrected 2026-10-03: this is the Jan-27 Jul 2026 count, not a 2025 total); over-speeding the largest violation (46,075 in 2026). Deaths up 25.5% since 2015 (146,133) (re-opened 2026-10-03: https://www.hindustantimes.com/india-news/road-crash-fatalities-likely-to-decline-in-2026-up-sees-highest-road-deaths-govt-101785472551699.html). Official series disagree: for 2024, MoRTH counts 177,175 deaths, NCRB's ADSI 175,142 and Crime in India 162,500, which the minister attributes to state reporting methods (opened 2026-10-03, HT 12 Aug 2026: https://www.hindustantimes.com/india-news/why-road-accident-death-figures-differ-in-govt-reports-gadkari-tells-rajya-sabha-101786549657863.html) | Families; insurers; hospitals (see `03-india-mandates.md` lead 6) |
| 2 | Crimes against women; cybercrime | 4.41 lakh crimes against women in 2024 (4.48 lakh in 2023), rate 64.6 per lakh women; 58.8 lakh cognisable crimes in total (opened via browser: https://timesofindia.indiatimes.com/india/murders-in-india-dropped-2-4-in-2024-crimes-against-women-1-5-ncrb-data/articleshow/130874785.cms). Cybercrime in 2B | Victims |
| 3 | Dog bites and rabies | "Over 37 lakh" dog-bite cases nationally (snippet, year not confirmed: https://www.ndtv.com/india-news/why-supreme-courts-stray-dog-order-is-an-operational-nightmare-11523788) `[U]`. Tamil Nadu: 2.63 lakh bites and 17 rabies deaths in four months of 2026; Kerala: 2.18 lakh bites and 14 deaths in 2026 to late September (snippets: https://www.thehindu.com/news/national/tamil-nadu/in-four-months-tamil-nadu-records-263-lakh-dog-bites-17-deaths/article70947531.ece ; https://www.newindianexpress.com/states/kerala/2026/Sep/25/218l-bite-cases-14-rabies-deaths-stray-dogs-continue-to-hound-kerala). Supreme Court directions: `03-india-mandates.md` lead 2 | Victims; municipal bodies |
| 4 | Bengaluru civic complaints: garbage, potholes | Sahaaya portal: 7.81 lakh grievances from Jan 2023 to 13 Jun 2026; the corporation-wise table shows about 7.5 lakh marked resolved and about 30,000 awaiting action (my sums of the published table); garbage and road maintenance generate most pending and reopened complaints; officials blame cross-agency dependence and staff shortage (opened via browser: https://www.thehindu.com/news/cities/bangalore/garbage-potholes-top-781-lakh-complaints-on-gbas-sahaaya-portal/article71118034.ece). GBA told the High Court 1,02,022 potholes were identified up to April 2026 with about 2,600 pending; the PIL dates from 2015; a pillion rider died in Hebbagodi avoiding a pothole (opened via browser: https://bangaloremirror.indiatimes.com/bangalore/others/pothole-repairs-reach-74-2600-still-pending-citywide/articleshow/133250624.cms) | Residents; city |
| 5 | Bengaluru congestion | Average 26.5 minutes per 10 km, 39.3 minutes at peak (154% over free flow) per WRI India; TomTom ranks Bengaluru second most congested in the world (opened via browser: https://www.deccanherald.com/india/karnataka/bengaluru/the-toll-of-snarls-frayed-nerves-falling-productivity-4070766). Covered by the Mobility track research | Commuters, employers |

Also relevant: Namma 112 in Bengaluru handled 1,725 suicide-related calls from 2025 to July 2026; in 2025, 224 of 1,031 callers could not be traced (opened via browser: https://www.newindianexpress.com/cities/bengaluru/2026/Jul/26/namma-112-thwarts-571-suicides-in-bengaluru-this-year).

### (2) Existing solutions and incumbents

| Who | What | Scale | Source |
|---|---|---|---|
| Sahaaya (GBA) | Civic grievance portal and app | 7.81 lakh complaints in 3.5 years | The Hindu link above |
| Namma 112 / 112 India | Emergency response; multilingual AI call handling added in 2026 | 1,725 suicide-related calls, 2025 to Jul 2026 | https://www.telegraphindia.com/india/bengaluru-police-rolls-out-ai-powered-multilingual-support-for-112-emergency-response/cid/2158348 (snippet) |
| Pothole Reporter (individual engineer, Bengaluru) | Detects potholes from a phone or dashcam, finds the contractor from tender data, drafts the complaint | Press coverage Aug-Sep 2026 | https://www.businesstoday.in/technology/artificial-intelligence/story/bengaluru-engineer-builds-ai-system-that-detects-potholes-and-prepares-complaints-549579-2026-08-17 (snippet) |
| CPGRAMS, Swachhata app, Fix My Street, Janaagraha's I Change My City, LocalCircles | Grievance and civic reporting | Not checked `[U]` | - |
| WhatsApp ward groups, calls to corporators, posts on X | Informal | Not measured `[U]` | - |

### (3) Common approaches

Photo-and-GPS complaint apps, SOS buttons that message contacts, crowd maps of hazards, dashcam detection. Hackathon staples: disaster, SOS and offline mesh (about 32 repos at this event), women-safety SOS, pothole detection. CivicFix placed second at Reskilll's Oct 2024 Llama hackathon (`04-winning-traits.md`). A pothole-detection app by a local engineer was in the Bengaluru press this week.

### (4) Why incumbents work

Official channels are the only ones that create a ticket an engineer must close. Police integration gives 112 authority no private app has.

### (5) Why incumbents fail or frustrate

- Complaints depend on other agencies and pile up; citizens reopen tickets (The Hindu).
- The High Court noted GBA had already been given a final chance to file its affidavit on potholes (Bangalore Mirror).
- Emergency callers cannot always be located (New Indian Express).
- Official road-death counts differ between reports: 177,175 vs 175,142 vs 162,500 for 2024 (Hindustan Times, opened 2026-10-03).

### (6) Gaps stated by sources

- The Hindu: pending complaints accumulate where one department depends on another; road complaints suffer from staff shortage and irregular works.
- New Indian Express: 224 untraceable callers in a year, a stated location problem.
- A search for a LocalCircles survey on civic complaint resolution returned nothing `[U]`.

| Pain | Evidence | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| Road deaths | About 183,400 (2025, provisional) | Enforcement, cameras | Families | Data mismatch; speeding | https://www.hindustantimes.com/india-news/road-crash-fatalities-likely-to-decline-in-2026-up-sees-highest-road-deaths-govt-101785472551699.html |
| Crimes against women | 4.41 lakh cases (2024) | 112, helplines | Victims | - | https://timesofindia.indiatimes.com/india/murders-in-india-dropped-2-4-in-2024-crimes-against-women-1-5-ncrb-data/articleshow/130874785.cms |
| Dog bites | 37 lakh+ `[U]`; state counts in lakhs | Vaccination, court orders | Victims, municipal bodies | No standard record (see `03`) | https://www.thehindu.com/news/national/tamil-nadu/in-four-months-tamil-nadu-records-263-lakh-dog-bites-17-deaths/article70947531.ece |
| Civic complaints | 7.81 lakh on Sahaaya; 1.02 lakh potholes | Sahaaya, X posts, PIL | Residents | Closure depends on other agencies | https://www.thehindu.com/news/cities/bangalore/garbage-potholes-top-781-lakh-complaints-on-gbas-sahaaya-portal/article71118034.ece |
| Congestion | 39.3 min per 10 km at peak | Metro, WFH | Commuters | - | https://www.deccanherald.com/india/karnataka/bengaluru/the-toll-of-snarls-frayed-nerves-falling-productivity-4070766 |

---

# [U] items

Community App
1. Stack Overflow's July 2026 figure of 1,304 questions: one weak aggregator page; not confirmed.
2. Discord MAU (200M+), ARR (about $550M) and IPO status: IPO-tracker sites only.
3. Reddit and LinkedIn India audience sizes: trackers disagree (30.8M to 64.1M; 148M to 161.5M).
4. Peerlist's 500,000 users and 200,000 monthly users: second-hand.
5. Devfolio's "33k+ developers": from a competitor's blog; looks low.
6. MyGate and NoBrokerHood price per flat: two comparison sites differ by 5-10x. Current society counts are vendor claims.
7. Event no-show rates: vendor blogs only; no Indian or Bengaluru data found.
8. Whether WhatsApp Message Summaries is live in India or in Indian languages as of Oct 2026: not confirmed.
9. Polywork and Threado shutdown reasons: read from search summaries of X posts and one write-up, pages not opened. Still unconfirmed after the 2026-10-03 check.
10. Whether Indian hackathon organisers report fake or AI-generated submissions as a problem: two searches, nothing found.
11. Frequency of RWA disputes: no survey found. Status of the Karnataka Apartment Bill after the 15 Jul 2026 consultation: not checked.
12. The hackathon cliché list for community apps is my characterisation, not a count.
13. GitHub Discussions usage, GrowthSchool, Reskilll scale, Hasgeek/KonfHub/Townscript pricing: not researched or nothing found.
14. Reddit moderator labour figure and the Tidelift maintainer figures are from search summaries (the UMN page returned 403).

Open Innovation
15. (NHA 39.4%: confirmed 2026-10-03.) NFHS-5 anaemia, ICMR-INDIAB counts, NMHS treatment gap, CHC specialist shortfall, ABHA and eSanjeevani totals, Tele-MANAS calls: all read from search summaries of PIB, journal or press pages; primaries not opened.
16. "55 million pushed into poverty a year by health costs": source year not checked.
17. Jivi AI and mfine shutdown: one blog, unverified.
18. ~~RBI Annual Report FY25 figures~~ Resolved 2026-10-03: confirmed in the RBI Annual Report; Rs 18,674 crore of the Rs 36,014 crore is reclassified older cases.
19. (RBI Ombudsman 13.34 lakh: confirmed 2026-10-03.) SIDBI Rs 30 lakh crore gap, ONDC order counts, digital-arrest counts, Supreme Court CBI order, UPI volumes and app shares: search summaries.
20. AICPDF's 2 lakh kirana closures is a trade-lobby estimate with no published method.
21. ~~ASER 2024 figures~~ Resolved 2026-10-03: checked in the report PDF; the "76.6% of all Class 3" figure was wrong (72.9% for all; 76.6% for government schools). Class 5: 48.8%. The smartphone figures (89%, 57%, 76%) are still from the explainer only.
22. CMS:E 27% coaching, UDISE+ counts, India Skills Report 56.35%, PLFS youth unemployment 9.9%: search summaries; PLFS figure from a coaching site.
23. Agriculture Census 2021-22 results: not found. The 1.08 hectare figure is from memory.
24. NABCONS 2022 post-harvest loss study: primary not opened; the Rs 1.5 lakh crore figure is quoted from an opinion article.
25. National PMFBY pending-claims amount; national loss from spurious seed or pesticide; agritech shutdowns in 2025-26: searched, not found.
26. ~~Bharat-VISTAAR launch date~~ Resolved 2026-10-03: 17 Feb 2026 per PIB.
27. National dog-bite total of 37 lakh: headline snippet, year not confirmed.
28. 2025 road deaths: the same Hindustan Times article gives both 183,434 and 183,382. Reconciled 2026-10-03 as "about 183,400", provisional e-DAR; the 52-death gap is unexplained.
31. Added 2026-10-03: ScienceDirect ASHA study (Meghalaya, about 90 reporting systems; OTP and sync failures) returned 403; `[U]`.
32. Added 2026-10-03: the Meetup "tripled" multiplier is one blogger's account; Meetup's help page shows plan- and location-dependent prices.
29. Sahaaya "resolved" and "awaiting action" totals are my sums of the table in The Hindu article; the article's own "7,228 pending, 796 reopened" refers to a subset I could not identify from the extracted text.
30. CPGRAMS, Swachhata, Fix My Street, I Change My City, Truecaller, Sanchar Saathi, Khatabook, OkCredit, TReDS, DIKSHA, Plantix, e-NAM, Kisan Call Centre: named as incumbents from general knowledge; current scale not researched.

---

## Addendum (2026-10-03): independent second pass (Codex, gpt-5.6-terra, medium effort)

Written by a second model with its own live web search, without sight of the report above. Status of each row: unchecked unless the "Addendum source check" table at the end says otherwise.

Raw notes: notes/codex-area6c.md

## Area 6 — Community App and Open Innovation research

Research date: 3 October 2026. Scope follows the organiser’s published tracks. This is a market/problem note, not a product proposal. `[U]` means the point was not verified against a source.

### Community App

#### 1. High pain points (initial evidence)

| Provisional rank | Pain and affected group | Severity / frequency | Who bears the cost | Source |
|---:|---|---|---|---|
| 1 | Online financial fraud and unsafe community communication; Indian internet users, especially vulnerable residents | The Enforcement Directorate’s 2024–25 annual report says I4C recorded ₹1,750 crore lost in the first four months of 2024 and that 85% of cyber-complaints were online financial fraud. | Victims; banks and public enforcement systems also incur recovery/investigation cost. | [ED annual report](https://www.enforcementdirectorate.gov.in/media/5y2bfhhj/annual_report_24-25.pdf) |
| 2 | Resident/tenant conflict in managed housing communities | MyGate’s survey reports 51% of communities face tenant-related conflict; 14.4% report it frequently and 34.6% occasionally. Its listed triggers include rule non-compliance (32.3%) and payment defaults (24.7%). This is vendor survey evidence, not a representative national estimate. | Residents, owners, management committees and security staff. | [MyGate survey](https://mygate.com/dispatch/analysis/51-of-communities-face-tenant-related-conflicts-reveals-mygate-survey/) |
| 3 | Developers need reliable, comprehensible answers while adopting AI tools | Stack Overflow’s 2025 survey says 84% use or plan to use AI tools; 46% distrust AI accuracy. India had the highest reported combined high/some trust (56%) among the survey’s top-ten respondent countries. | Developers and employers pay in verification/debugging time; the exact India time cost is [U]. | [Survey AI results](https://survey.stackoverflow.co/2025/ai), [India finding](https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/) |

#### 2. Existing solutions and incumbents (initial)

| Incumbent / workaround | What it addresses | Public scale, price or constraint | Source |
|---|---|---|---|
| National Cyber Crime Reporting Portal and 1930 | Reporting cybercrime; the portal offers categories for women/child-related and other cybercrime. | Government service. I4C’s portal says complaints are routed to relevant State/UT authorities. | [NCRP FAQ](https://www.cybercrime.gov.in/Webform/FAQ.aspx), [I4C portal description](https://cyberpolice.nic.in/) |
| MyGate | Managed-housing security, communication, finances and grievances. | Pricing/verified active-community count not established in the sources reviewed: [U]. | [MyGate’s conflict survey](https://mygate.com/dispatch/analysis/51-of-communities-face-tenant-related-conflicts-reveals-mygate-survey/) |
| Stack Overflow plus AI coding tools | Peer-vetted technical Q&A and AI-assisted developer help. | Stack Overflow says 84% of surveyed developers use or plan to use AI tools; survey sampling limits apply. | [2025 survey](https://survey.stackoverflow.co/2025/ai) |

#### 3. Common approaches

Community products commonly centralise identity/profile, feeds or groups, direct messaging, event/member directories, moderation/reporting, notifications and reputation or voting. Specific hackathon-team patterns are [U] pending evidence.

#### 4. Why incumbents work

Government reporting has institutional routing: I4C says NCRP complaints are automatically assigned to the pertinent State/UT. Stack Overflow’s survey describes community-vetted guidance as a reason respondents use it. These are distribution/trust mechanisms, not proof that every user is satisfied. [I4C](https://cyberpolice.nic.in/) [Survey discussion](https://stackoverflow.blog/2026/09/30/getting-ready-for-2026-results-a-look-back-on-developer-survey-findings/)

#### 5. Why incumbents fail or frustrate

AI-assisted developer help has a documented verification problem: 46% of surveyed developers said they distrust AI output accuracy in 2025. The source does not establish a causal product failure for any particular community service. [Stack Overflow 2025](https://survey.stackoverflow.co/2025/ai)

#### 6. Gaps stated by sources

The National Cyber Crime portal itself exists because victims need a route to report cybercrime; it permits anonymous reports for certain online sexually explicit content. The primary source does not claim that a particular sensor, offline mode, voice interface or on-device model is required. [NCRP FAQ](https://www.cybercrime.gov.in/Webform/FAQ.aspx)

Data handling is a live constraint: the notified Digital Personal Data Protection Rules, 2025 require a clear, standalone notice and specify staged commencement; rules 3 and 5–16, 22 and 23 take effect 18 months after the 13 November 2025 Gazette notification. [MeitY Gazette, 13 Nov 2025](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf)

| Pain | Evidence of severity | Current workaround | Who pays | Incumbent weakness evidenced so far | Source URL |
|---|---|---|---|---|---|
| Cyber-fraud coordination | ₹1,750 crore loss in first four months of 2024; 85% of complaints online-financial fraud | NCRP/1930 | Victims, enforcement | No service-quality gap verified yet | [ED](https://www.enforcementdirectorate.gov.in/media/5y2bfhhj/annual_report_24-25.pdf) |
| Housing conflict | 51% in vendor survey; 14.4% frequent | Management/community processes; MyGate | Residents/owners/managers | Conflict remains despite category tools; causality [U] | [MyGate](https://mygate.com/dispatch/analysis/51-of-communities-face-tenant-related-conflicts-reveals-mygate-survey/) |
| Trustworthy developer help | 46% distrust AI accuracy | AI tools plus human forums | Developers/employers | Accuracy distrust | [SO](https://survey.stackoverflow.co/2025/ai) |

### Open Innovation

The organiser permits domains outside named tracks. Per request, this section will cover health, fintech and commerce, education, agriculture, safety and civic problems, with 4–5 pain points per domain. Evidence gathering continues below.

#### Health

##### 1. High pain points

| Rank | Pain | Evidence and affected people | Who pays | Source |
|---:|---|---|---|---|
| 1 | Household medical spending | Out-of-pocket spending was 39.4% of total health expenditure in 2021–22, down from 62.6% in 2014–15 but still a large household burden. The cited 2024–25 ministry report does not provide a newer OOP share. | Patients and households. | [MoHFW Annual Report 2024–25](https://mohfw.gov.in/sites/default/files/Final%20Printed%20English%20AR%202024-25.pdf) |
| 2 | Access to reliable care/navigation | [U] for a national 2024–26 severity metric in the sources reviewed. | Patients and carers; public/private providers. | [U] |
| 3 | Health-data privacy/consent | Health apps processing personal data will face the DPDP Rules’ notice and consent requirements on the notified timeline. This is a compliance need, not a measured consumer harm. | Data fiduciaries and users. | [MeitY Gazette](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf) |
| 4 | Disease surveillance and continuity | [U] for a 2024–26 evidence item retrieved so far. | Patients and public-health systems. | [U] |

##### 2–6. Solutions, approaches, mechanisms and gaps

Public and private care delivery, insurance and telemedicine are existing solution categories; the reviewed sources do not establish a comparable 2024–26 India price/traction table for named services, so details are `[U]`. A documented structural constraint is personal-data consent: the 13 November 2025 Rules require clear standalone notices and stage many operational provisions to 18 months after notification. No reviewed source explicitly says health workflows structurally require phone camera, voice, offline use, or on-device AI. [MeitY Gazette](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf)

| Pain | Evidence of severity | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| Household medical spending | OOP 39.4% of total expenditure, 2021–22 | Public/private care, insurance [U] | Households | Specific failure evidence [U] | [MoHFW](https://mohfw.gov.in/sites/default/files/Final%20Printed%20English%20AR%202024-25.pdf) |

#### Fintech and commerce

##### 1. High pain points

| Rank | Pain | Evidence and affected people | Who pays | Source |
|---:|---|---|---|---|
| 1 | Financial fraud, especially digital-payment fraud | RBI says digital payments (card/internet) account for the largest number of reported frauds, and the ED reports ₹1,750 crore lost in the first four months of 2024. | Consumers; banks, payment firms and enforcement also bear prevention/recovery costs. | [RBI Annual Report 2024–25](https://www.rbi.org.in/scripts/AnnualReportPublications.aspx?Id=1436), [ED](https://www.enforcementdirectorate.gov.in/media/5y2bfhhj/annual_report_24-25.pdf) |
| 2 | Banking and digital-banking complaint burden | RBI Ombudsman offices received 2.96 lakh complaints in 2024–25; RBI says most related to loans/advances and digital-banking products. | Customers, regulated entities and RBI redressal. | [RBI Annual Report 2024–25](https://www.rbi.org.in/scripts/AnnualReportPublications.aspx?Id=1436) |
| 3 | Consumer/e-commerce grievance resolution | The National Consumer Helpline averaged 107,966 dockets/month from April–June 2024, up from 102,976 in FY2023–24. It receives e-commerce, banking, digital-payment and other complaints. | Consumers and businesses; government runs intake/redressal infrastructure. | [Department of Consumer Affairs, 24 Jul 2024](https://consumeraffairs.nic.in/sites/default/files/24-July-2024_1.pdf) |
| 4 | Payment-service resilience | RBI describes digital channels as important customer-service channels and set a 2025–26 goal to develop a near-real-time uptime analytics dashboard. This demonstrates a stated operational gap, but not a published outage total. | Customers and regulated entities. | [RBI Annual Report 2024–25](https://www.rbi.org.in/scripts/AnnualReportPublications.aspx?Id=1436) |

##### 2. Existing solutions and incumbents

UPI is an incumbent payment rail; RBI describes it as real-time and reports the 2024–25 system context. For redressal, NCH offers telephone, WhatsApp, SMS, email, app, web and UMANG submission in 17 languages; RBI’s Ombudsman system is a formal path for regulated-entity complaints. [RBI](https://www.rbi.org.in/scripts/AnnualReportPublications.aspx?Id=1436) [NCH](https://consumeraffairs.nic.in/sites/default/files/24-July-2024_1.pdf)

##### 3–6. Approaches, incumbency and frustration

Typical financial products rely on regulated rails, bank/payment-provider integrations, KYC, transaction alerts and a formal complaint path. The incumbents work through interoperability, bank distribution and regulation. Friction is documented in the continuing volume of complaints and fraud. RBI’s own 2025–26 agenda says it intends to create a dynamic digital-service uptime dashboard, explicitly identifying a monitoring need. No reviewed source explicitly requires on-device AI, voice, camera, sensors or offline operation for these gaps. [RBI](https://www.rbi.org.in/scripts/AnnualReportPublications.aspx?Id=1436)

| Pain | Evidence of severity | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| Digital fraud | Digital payment frauds largest by count; ₹1,750cr/4 months | Bank controls, NCRP/1930 | Consumers/banks/state | Fraud remains material | [RBI](https://www.rbi.org.in/scripts/AnnualReportPublications.aspx?Id=1436) |
| Consumer complaints | 107,966 NCH dockets/month | NCH multi-channel intake | Consumers/businesses/state | High intake volume | [NCH](https://consumeraffairs.nic.in/sites/default/files/24-July-2024_1.pdf) |

#### Education

##### 1. High pain points

| Rank | Pain | Evidence and affected people | Who pays | Source |
|---:|---|---|---|---|
| 1 | Foundational reading deficit in rural India | ASER 2024 finds 27.1% of all rural Std III children could read a Std II-level text; this means 72.9% could not, under the assessment definition. | Children, families, schools and future employers/society. | [ASER 2024](https://asercentre.org/wp-content/uploads/2022/12/ASER_2024_Final-Report_13_2_24-1.pdf) |
| 2 | Foundational arithmetic deficit | Only 33.7% of rural Std III children could do at least subtraction; 30.7% of Std V children could do division. | Same groups. | [ASER 2024](https://asercentre.org/wp-content/uploads/2022/12/ASER_2024_Final-Report_13_2_24-1.pdf) |
| 3 | Unequal learning outcomes by school type | In ASER’s rural sample, 23.4% of Std III government-school pupils versus 35.5% private-school pupils could read at Std II level. This is descriptive, not causal. | Families and public education systems. | [ASER 2024](https://asercentre.org/wp-content/uploads/2022/12/ASER_2024_Final-Report_13_2_24-1.pdf) |
| 4 | Measurement/visibility of learning | ASER operates a nationwide household survey because enrolment alone does not measure learning; its 2024 fieldwork covered 605 districts, 17,997 villages and 649,491 children (method/report). | Learners, households and education systems. | [ASER 2024](https://asercentre.org/wp-content/uploads/2022/12/ASER_2024_Final-Report_13_2_24-1.pdf) |

##### 2–6. Solutions, approaches, mechanisms and gaps

Government FLN programmes and school instruction are the primary existing routes; ASER attributes recent improvement to a national focus on FLN but does not evaluate individual apps or establish app prices/traction. The report says learning levels had been stagnant or declining before recent recovery, which documents the scale of unresolved need. No reviewed source explicitly says phone sensors/camera/voice/offline/on-device AI is structurally required. [ASER 2024](https://asercentre.org/wp-content/uploads/2022/12/ASER_2024_Final-Report_13_2_24-1.pdf)

| Pain | Evidence of severity | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| Reading | 27.1% of rural Std III read Std II text | School/FLN programmes | Children/families/state | Large remaining gap | [ASER](https://asercentre.org/wp-content/uploads/2022/12/ASER_2024_Final-Report_13_2_24-1.pdf) |
| Arithmetic | 33.7% Std III subtraction; 30.7% Std V division | School/FLN programmes | Children/families/state | Large remaining gap | [ASER](https://asercentre.org/wp-content/uploads/2022/12/ASER_2024_Final-Report_13_2_24-1.pdf) |

#### Agriculture

##### 1. High pain points

| Rank | Pain | Evidence and affected people | Who pays | Source |
|---:|---|---|---|---|
| 1 | Post-harvest losses, especially perishables | NABCONS’ 2022 study (reference years 2020–22; reported by government in 2025) estimates loss of 6.02–15.05% for fruit and 4.87–11.61% for vegetables. | Farmers, traders, consumers and food system. | [MoFPI / PIB, 25 Jul 2025](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2148529&lang=2&reg=3) |
| 2 | Commodity losses in absolute quantities | Government’s 2025 reply gives estimates including 11.97m tonnes vegetables and 7.36m tonnes fruits lost under the NABCONS study. | Supply-chain participants and consumers. | [MoFPI / PIB, 1 Aug 2025](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2151371&lang=2&reg=3) |
| 3 | Infrastructure, technology and skills gaps across the value chain | The NABCONS study explicitly identified gaps in infrastructure development, technology infusion and skills; it assessed 54 commodities across 292 districts and 15 agro-climatic zones. | Farmers, aggregators/processors, governments. | [MoFPI / PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2148529&lang=2&reg=3) |
| 4 | Food inflation and food security pressure | MoFPI’s 2024–25 annual report calls food inflation and food security major policy concerns despite large-scale production. This is not a causal estimate assigned solely to post-harvest loss. | Consumers, farmers and government. | [MoFPI Annual Report 2024–25](https://www.mofpi.gov.in/sites/default/files/mofpi_annual_report_2024-25_english_21.08.2025.pdf) |

##### 2–6. Solutions, approaches, mechanisms and gaps

Government schemes include the Integrated Cold Chain & Value Addition Infrastructure component under PMKSY; the Ministry says it targets stronger value chains and lower losses. The stated gaps are infrastructure, technology and skills, rather than a source-endorsed particular app mechanism. No reviewed source specifically requires camera, voice, offline operation or on-device AI. [MoFPI / PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2151371&lang=2&reg=3)

| Pain | Evidence of severity | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| Perishable loss | Fruit 6.02–15.05%; veg 4.87–11.61% | Cold-chain/value-addition scheme | Farmers/supply chain/consumers | Study states infrastructure, technology and skills gaps | [MoFPI](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2148529&lang=2&reg=3) |

#### Safety

##### 1. High pain points

| Rank | Pain | Evidence and affected people | Who pays | Source |
|---:|---|---|---|---|
| 1 | Road injury and death in Bengaluru | Bengaluru Traffic Police’s 2024 reporting records 4,784 crashes, 871 fatal crashes and 893 deaths. | Victims/families, insurers, health system and city. | [BTP 2024 press note](https://data.opencity.in/dataset/03d4d85b-7743-4af8-bc08-2155705688f3/resource/9ecd5c73-045e-4b39-93b9-0c5c9e1378b7/download/92622f36-6abd-4ac7-a0cb-1b096eaeaa7f.pdf) |
| 2 | Online abuse affecting women and children | I4C says cyberstalking, bullying, harassment, CSAM and rape content are increasing rapidly with cyberspace use. This is an official qualitative statement; a verified 2024–26 national count was not retrieved. | Victims, families, platforms and police. | [I4C online-safety guidance](https://cytrain.ncrb.gov.in/staticpage/safety_Tips.php) |
| 3 | Financial cybercrime | ED reports ₹1,750 crore losses in the first four months of 2024; 85% of cyber complaints were online-financial fraud. | Individuals and financial institutions. | [ED](https://www.enforcementdirectorate.gov.in/media/5y2bfhhj/annual_report_24-25.pdf) |
| 4 | Victims need a report-and-track path and adequate evidence | NCRP’s guidance asks tracked-report complainants for identity/contact and incident/supporting details; it says this lets law enforcement contact them. The burden itself is documented; completion or response metrics are [U]. | Victims and police. | [I4C reporting guidance](https://cytrain.ncrb.gov.in/staticpage/pdf/report_cyber_crimes.pdf) |
| 5 | General personal-safety incidence beyond these categories | [U] — no sufficiently current, comparable primary metric retrieved. | [U] | [U] |

##### 2. Existing solutions and incumbents

Bengaluru Traffic Police is the formal road-safety authority. NCRP and 1930 provide national cybercrime reporting; I4C also operates Cyber Dost safety material and CyTrain, a training MOOC for law enforcement. These work because they are institutional channels, not because the sources demonstrate comprehensive resolution. [BTP](https://data.opencity.in/dataset/03d4d85b-7743-4af8-bc08-2155705688f3/resource/9ecd5c73-045e-4b39-93b9-0c5c9e1378b7/download/92622f36-6abd-4ac7-a0cb-1b096eaeaa7f.pdf) [I4C](https://cytrain.ncrb.gov.in/staticpage/r0.php)

##### 3–6. Approaches, incumbency and gaps

Typical safety systems pair alert/report intake with dispatch, case tracking, evidence capture, education and enforcement. Incumbency derives from statutory authority, emergency/service routing and police evidence needs. The cited safety sources explicitly identify increasing online harm and retained reporting/evidence requirements; they do not state that camera, voice, sensors, offline use or on-device AI is structurally necessary. [I4C](https://cytrain.ncrb.gov.in/staticpage/safety_Tips.php) [I4C reporting](https://cytrain.ncrb.gov.in/staticpage/pdf/report_cyber_crimes.pdf)

| Pain | Evidence of severity | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| Bengaluru crashes | 4,784 crashes; 893 deaths in 2024 | Traffic-police enforcement | Victims/city | Deaths remain high despite a year-on-year decline | [BTP](https://data.opencity.in/dataset/03d4d85b-7743-4af8-bc08-2155705688f3/resource/9ecd5c73-045e-4b39-93b9-0c5c9e1378b7/download/92622f36-6abd-4ac7-a0cb-1b096eaeaa7f.pdf) |
| Online abuse | I4C: threats increasing rapidly | NCRP, Cyber Dost, CyTrain | Victims/platforms/state | Quantified response outcomes [U] | [I4C](https://cytrain.ncrb.gov.in/staticpage/safety_Tips.php) |

#### Civic problems

##### 1. High pain points

| Rank | Pain | Evidence and affected people | Who pays | Source |
|---:|---|---|---|---|
| 1 | Road safety as a city-system problem | The Bengaluru 2024 crash/death count is 4,784/893. | Residents, health services and city. | [BTP](https://data.opencity.in/dataset/03d4d85b-7743-4af8-bc08-2155705688f3/resource/9ecd5c73-045e-4b39-93b9-0c5c9e1378b7/download/92622f36-6abd-4ac7-a0cb-1b096eaeaa7f.pdf) |
| 2 | Municipal grievance access | BBMP provides a citizen-service grievance entry point. Public 2024–26 volume, closure time and satisfaction data were not retrieved: [U]. | Residents and BBMP. | [BBMP Citizen Services](https://site.bbmp.gov.in/citizenservice.html) |
| 3 | Wastewater/environmental complaint handling | A 2025 CPCB filing records KSPCB directing Bengaluru authorities to redirect sewage flow in a named matter, evidencing a live sewage-management issue; citywide prevalence is [U]. | Residents, BWSSB/BBMP and environment. | [CPCB filing to NGT](https://www.greentribunal.gov.in/sites/default/files/news_updates/REPLY%20BY%20CPCB%20IN%20OA%20NO.%201219%20of%202024%20News%20Item%20titled%20KPSCB%20directs%20BBMP%20to%20redirect%20sewage%20flow%20in%20Kodichikkanahalli.pdf) |
| 4 | Public participation needs usable mobile access | MoSPI’s 2025 telecom survey reports 97.1% of 15–29 year olds used a mobile phone in the preceding three months; it is not an estimate of civic-app adoption. | Residents and service agencies. | [MoSPI CMS: Telecom 2025](https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=2132330&lang=2&reg=3) |
| 5 | Water, waste and air service performance at city scale | [U] — no current primary citywide severity metric retrieved within the search budget. | Residents and municipal/state services. | [U] |

##### 2–6. Solutions, approaches, mechanisms and gaps

BBMP’s grievance service is the formal municipal route. Common civic-tech approaches are issue intake, geo/location data, photos/documents, routing to departments, status updates and public dashboards; this describes prevalent product architecture, not a jury recommendation. Government channels have mandated institutional ownership, while problems can span agencies (e.g., municipal and water/sewerage bodies). The reviewed sources do not explicitly mandate on-device AI or offline/sensor use; the phone-access statistic supports mobile reach, not a technical requirement. [BBMP](https://site.bbmp.gov.in/citizenservice.html) [MoSPI](https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=2132330&lang=2&reg=3)

| Pain | Evidence of severity | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| Civic grievance | Formal BBMP grievance entry exists; volume [U] | BBMP citizen service | Residents/BBMP | Outcome data not public in reviewed source | [BBMP](https://site.bbmp.gov.in/citizenservice.html) |
| Sewage/environment | Regulator direction in named Bengaluru matter | Regulatory/municipal process | Residents/agencies | Citywide performance [U] | [NGT filing](https://www.greentribunal.gov.in/sites/default/files/news_updates/REPLY%20BY%20CPCB%20IN%20OA%20NO.%201219%20of%202024%20News%20Item%20titled%20KPSCB%20directs%20BBMP%20to%20redirect%20sewage%20flow%20in%20Kodichikkanahalli.pdf) |

---

### Community App — expanded assessment

#### 1. High pain points (ranked)

| Rank | Pain | Severity/frequency, population and payer | Source |
|---:|---|---|---|
| 1 | Cyber-enabled financial harm in social/community contexts | ₹1,750 crore lost in Jan–Apr 2024; 85% of cyber complaints online-financial fraud. Individuals lose money; banks and government bear prevention/recovery costs. | [ED](https://www.enforcementdirectorate.gov.in/media/5y2bfhhj/annual_report_24-25.pdf) |
| 2 | Harassment, stalking, bullying and CSAM/rape-content exposure | I4C says these harms against women and children are increasing rapidly. A recent national count from an official primary source is [U]. Victims and families bear direct harm; platforms/police bear response cost. | [I4C](https://cytrain.ncrb.gov.in/staticpage/safety_Tips.php) |
| 3 | Housing-community conflict | Vendor survey: 51% of communities encounter tenant conflict; 14.4% frequent. Residents/owners/management staff bear the cost. | [MyGate](https://mygate.com/dispatch/analysis/51-of-communities-face-tenant-related-conflicts-reveals-mygate-survey/) |
| 4 | Rule/payment disputes in housing groups | MyGate’s same survey lists rule non-compliance (32.3%) and payment defaults (24.7%) among conflict causes. Representativeness beyond the respondent base is [U]. | [MyGate](https://mygate.com/dispatch/analysis/51-of-communities-face-tenant-related-conflicts-reveals-mygate-survey/) |
| 5 | Developer verification of AI-generated answers | 46% of Stack Overflow 2025 respondents did not trust AI output accuracy; users/employers pay through review/debugging. India scored 56% combined some/high trust among the survey’s top-ten countries, so use/trust are not uniform. | [SO survey](https://survey.stackoverflow.co/2025/ai), [India result](https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/) |
| 6 | Fragmented developer context/tooling | Stack Overflow’s 2026 retrospective says almost one in five respondents navigates more than ten systems, with context-switching/maintenance friction. It is global developer-survey evidence, not an India-only estimate. | [Stack Overflow](https://stackoverflow.blog/2026/09/30/getting-ready-for-2026-results-a-look-back-on-developer-survey-findings/) |
| 7 | Loneliness/social isolation | WHO’s 2025 global report says loneliness is most common among adolescents/young adults at about one in five, and nearly one in four in lower-income countries. It is global context, not an India prevalence estimate. | [WHO, 30 Jun 2025](https://www.who.int/groups/commission-on-social-connection) |
| 8 | Data consent in member/community platforms | DPDP Rules have notified staged requirements for data notices/consent. This is a compliance/cost burden; scale of incidents is [U]. | [MeitY Gazette](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf) |
| 9 | Access across varied languages and digital literacy | India’s consumer helpline supports 17 languages, indicating the public-service need for language access; no community-app-specific prevalence measure was retrieved. | [NCH](https://consumeraffairs.nic.in/sites/default/files/24-July-2024_1.pdf) |
| 10 | Sustaining a new social network against entrenched platforms | Koo closed in July 2024 after sale/partnership talks failed; its founders cited a difficult funding environment. TechCrunch additionally reported trouble expanding users and revenue. | [Founder account reported by TechCrunch](https://techcrunch.com/2024/07/02/indian-social-network-koo-to-shut-down/), [founder retrospective](https://echai.ventures/failcode/a/koo-mayank-bidawatka-celebrating-failures) |

#### 2. Existing solutions and incumbents

| Solution/incumbent or workaround | What it does | Scale/price evidence | Why users adopt it |
|---|---|---|---|
| WhatsApp/large social platforms | Informal groups, broadcast and messaging | Exact India community scale/price within reviewed primary sources: [U]. | Existing contacts and low learning cost [U]. |
| MyGate | Managed-housing communication/conflict-adjacent operations | Active communities and price: [U]. | Administration/security integration [U]. |
| Stack Overflow | Community-vetted developer Q&A | It surveys a large developer community; specific current MAU not established here. | Respondents cite community-vetted answers for reliable guidance. [Stack Overflow](https://stackoverflow.blog/2026/09/30/getting-ready-for-2026-results-a-look-back-on-developer-survey-findings/) |
| AI assistants | Conversational technical answers and coding help | 84% of SO 2025 respondents use or plan to use AI tools. | Speed/convenience; accuracy skepticism remains. [SO](https://survey.stackoverflow.co/2025/ai) |
| NCRP/1930 | Formal reporting of online harm and fraud | Government service; 31 lakh+ complaints and 66,000+ FIRs reported in I4C/BPRD’s July 2024 account. | Statutory police routing. [BPRD](https://bprd.nic.in/uploads/pdf/Cyber%20Crime-%20Vigilant%20India%2C%20%28%201-15%20July%2C2024%29%20Year-2%2C%20Volume%20No-7%20Low%20file.pdf) |

#### 3. Common approaches

Across communities, products normally use member identity/onboarding, topic or locality groups, feeds/chat, discovery, moderation/reporting, notifications, events and reputation/voting. Professional communities layer profiles, portfolio/job discovery, Q&A and mentorship. Housing systems layer visitor/service-provider access, dues and grievances. Hackathon-specific clichés are `[U]`: no reliable source was retrieved that systematically records them.

#### 4. Why incumbents work

Network effects and existing contact graphs are plausible but unverified in the sources retrieved: `[U]`. Documented mechanisms include I4C’s automatic State/UT routing of reports; Stack Overflow’s community-vetted answers; and institutional/regulated operation of public channels. UPI illustrates how strong distribution/integration works elsewhere: NPCI reports 24.509 billion UPI transactions in August 2026 across 752 live banks, but this is a fintech comparison, not a community-app metric. [I4C](https://cyberpolice.nic.in/) [Stack Overflow](https://stackoverflow.blog/2026/09/30/getting-ready-for-2026-results-a-look-back-on-developer-survey-findings/) [NPCI](https://www.npci.org.in/product/upi/product-statistics)

#### 5. Why incumbents fail or frustrate

Koo is the most relevant documented Indian social-platform shutdown: founders said the funding winter constrained it; reported talks with larger companies did not reach an outcome. This supports the conclusion that capital and revenue/user growth are a risk, not that every community app will fail for the same reason. AI answers also frustrate users on accuracy: 46% distrust output. In managed housing, the persistence of reported tenant conflict is a problem signal, but it does not prove MyGate caused or failed to resolve it. [Koo](https://techcrunch.com/2024/07/02/indian-social-network-koo-to-shut-down/) [SO](https://survey.stackoverflow.co/2025/ai) [MyGate](https://mygate.com/dispatch/analysis/51-of-communities-face-tenant-related-conflicts-reveals-mygate-survey/)

#### 6. Gaps stated by sources

I4C explicitly says online harms against women and children are increasing rapidly and maintains both reporting and hygiene resources. RBI’s 2024–25 report identifies an operational need for a near-real-time digital-service uptime dashboard. Stack Overflow’s survey documents accuracy distrust. MoSPI’s telecom survey shows broad youth mobile use (97.1% age 15–29), but it does not establish an offline/on-device AI requirement. Sources retrieved did not explicitly state a Community App must use phone sensors, camera, voice or on-device AI; any assertion beyond this would be `[U]`. [I4C](https://cytrain.ncrb.gov.in/staticpage/safety_Tips.php) [RBI](https://www.rbi.org.in/scripts/AnnualReportPublications.aspx?Id=1436) [MoSPI](https://www.pib.gov.in/Pressreleaseshare.aspx?PRID=2132330&lang=2&reg=3)

| Pain | Evidence of severity | Current workaround | Who pays | Incumbent weakness | Source URL |
|---|---|---|---|---|---|
| Fraud/harm | ₹1,750cr lost / 4 months; 85% complaints financial fraud | NCRP/1930 | Victims/banks/state | Fraud remains significant | [ED](https://www.enforcementdirectorate.gov.in/media/5y2bfhhj/annual_report_24-25.pdf) |
| Housing conflict | 51% in vendor survey | MyGate/management processes | Residents/owners | Frequent/occasional conflicts persist | [MyGate](https://mygate.com/dispatch/analysis/51-of-communities-face-tenant-related-conflicts-reveals-mygate-survey/) |
| Developer accuracy trust | 46% distrust AI output | AI + human Q&A | Developers/employers | Verification burden | [SO](https://survey.stackoverflow.co/2025/ai) |
| Social-platform sustainability | Koo shutdown, July 2024 | Entrenched platforms | Operators/users | Capital, growth and revenue risk | [Koo](https://techcrunch.com/2024/07/02/indian-social-network-koo-to-shut-down/) |

---

## Source check (2026-10-03, independent reviewers)

Reviewers: Opus (direct page reads with WebFetch, curl and a headless browser) and Codex (live web search; raw verdicts in `notes/codex-verify-06c.md`). Opus re-opened 10 of Codex's corrected or surprising verdicts before using them: Bharat-VISTAAR, Geneva, GitHub settings, DeHaat, ZestMoney/DMI, Paytm, Kenko, health-claims survey, Meetup, gaming Act. Rows below marked "corrected" changed the body above. No source-check table from the stopped earlier checker was found. Any in-place edits it made cannot be told apart from the original text; the rows below re-check the claims directly.

| Claim | Checked by | Source | Verdict | Note |
|---|---|---|---|---|
| LocalCircles WhatsApp spam: 96% daily, 42,000+ responses, 324 districts, 59% block | Opus direct (Codex could not find it) | localcircles.com/a/press/page/whatsapp-unsolicited-messages | confirmed | 4 Feb 2026 |
| Rs 22,495 cr lost in 2025, 28.15 lakh complaints, 76% investment fraud | Opus direct (Codex could not find primary) | ThePrint, 21 Feb 2026 | confirmed (press, citing MHA/I4C) | No MHA primary found by either reviewer |
| LinkedIn 80.6M fake accounts Jul-Dec 2024 | Opus direct | Rest of World 2025 | confirmed (secondary) | Codex could not read LinkedIn's own report |
| GitHub maintainer quotes ("1 out of 10", "erosion of social trust", "can no longer assume") | Opus direct | The Register, 3 Feb 2026 | confirmed | Speakers are maintainers, not GitHub; AI triage was one option GitHub was considering |
| GitHub added disable/restrict-PR settings | both | github.blog changelog 13 Feb 2026 | confirmed | |
| curl ended bug bounty, Jan 2026, AI reports | Opus direct | The Register | confirmed; "six years" could not verify | |
| Discord vendor breach, ~70,000 ID photos | both | TechCrunch 9 Oct 2025; AP | confirmed | |
| Slack free 90-day history; deletion after 1 year from Aug 2024 | Codex search | slack.com help | confirmed | |
| Kubernetes Slack, under a week's notice | Opus direct | Zulip blog | confirmed | 10,000+ MAU figure not seen |
| Stack Overflow 3,862 questions Dec 2025, -78% | Opus direct | Gigazine | confirmed (secondary) | Codex could not reproduce from the primary data |
| SO 2025: 84% "still use it" | Opus direct | stackoverflow.co press page | corrected | 84% name it as a community platform used or planned; 82% visit several times a month |
| SO 2025: "35% of visits follow an AI problem" | Opus direct | same | corrected | 35% of respondents, not of visits |
| SO 2025: 75.3%, 61.3%, 46% distrust, India 56% trust | Opus direct | survey.stackoverflow.co/2025/ai; press page | confirmed | |
| CMX 2024: 16% no staff, 37% layoffs, 34% engagement | Opus direct | cmxhub.com | confirmed | DevRel 14.6% is from a different survey, not checked |
| Meetup Pro price tripled | both | andypiper.co.uk; Meetup help page | could not verify | Blog states it; Meetup page shows a June 2024 increase without a single multiplier |
| Koo shut Jul 2024, $60M+, reasons | both | TechCrunch 2 Jul 2024 | confirmed | Added: weak user and revenue growth |
| Bluelearn shut 22 Jul 2024, returned 70%, venture-scale reason | both | Inc42 (two pages); Moneycontrol | confirmed | |
| leap.club halted May 2024 | Opus direct | Inc42, published 15 May 2025 | corrected | It was May 2025; reasons and Rs 5.59 cr FY24 loss confirmed |
| Geneva bought May 2024, zero revenue to 30 Jun 2025, shut Sep 2025 | both | TechCrunch 18 Sep 2025; geneva.com blog | confirmed | Codex marked revenue unverifiable; Opus found "had not generated any revenue as of June 30" in TechCrunch. Deal closed 1 Jul 2024 |
| Polywork closed 31 Jan 2025, no viable path | both | X posts | could not verify | X unreadable; domain no longer resolves |
| Kenko shut Aug 2024, no IRDAI licence | both | Inc42 graveyard; Moneycontrol 23 Aug 2024 | confirmed | |
| Nintee shut 2024, retention | Opus direct | Inc42 graveyard | confirmed | April 2024; capital returned |
| Muvin shut after RBI UPI co-brand rule | Opus direct | Inc42 graveyard | confirmed | |
| ZestMoney shut Dec 2023 | both | Business Standard 6 Dec 2023; TechCrunch 17 Jan 2024 | confirmed, context added | Failed PhonePe deal, funding winter, regulatory uncertainty; DMI bought brand and tech |
| Paytm Payments Bank stopped Jan 2024 | both | TechCrunch; RBI release 16 Feb 2024 | corrected | Ordered 31 Jan; effective 29 Feb, extended to 15 Mar 2024 |
| Real-money gaming ban, Aug 2025 | both | TechCrunch 20 Aug 2025; MeitY (Codex) | confirmed | Lok Sabha 20 Aug and bank-processing bar opened by Opus; assent date and Apr 2026 rules not opened by Opus |
| Medianama: Indian-language data gap; US-only launch 25 Jun 2025 | Opus direct | Medianama Jun 2025 | confirmed | Quote is from a policy analyst |
| WhatsApp Summaries live in India | Codex search | Meta newsroom | could not verify | Stays `[U]` |
| Rest of World: workers rated, cannot see ratings, no interface | Opus direct | RoW 10 Aug 2023 | confirmed | "Information asymmetry" is Srinivas Kodali |
| Proton: "Data that is never collected cannot be leaked" | Opus direct | proton.me | confirmed | Does not mention on-device checks |
| IRDAI FY24 Rs 15,100 cr disallowed + Rs 10,937 cr repudiated | both | Business Today 26 Dec 2024; IRDAI | confirmed | |
| LocalCircles Mar 2026: 4 in 10 claims cut, 70% premium rise, 6-48 h wait | Opus direct | localcircles.com | confirmed | Codex flagged it "corrected" by citing a different May 2024 survey (43%); verdict rejected |
| OOP 39.4% (2021-22) from 62.6% (2013-14) | both | PIB 25 Sep 2024; MoHFW NHA | corrected | 62.6% is 2014-15; 2013-14 was 64.2% |
| ASHA: 7 apps, 15-min timeout, 59%, ~$40 stipend | Opus direct | New Lines, 31 Mar 2026 | confirmed, context added | Total pay $55-165 incl. incentives |
| ASHA gap: OTP failures, fewer entries requested | Opus direct | New Lines; ScienceDirect (403) | corrected / could not verify | Not in New Lines; study unreadable |
| UPI fraud: 20% families, 51% no complaint, 40% clicked links | Opus direct | LocalCircles 26 Jun 2025 | confirmed | Codex searched a different source |
| ONDC 15% tried, 54% cumbersome, 6.5M to 4.6M orders, Pincode and Paytm exits | Opus direct | LocalCircles 1 May 2025 | confirmed | |
| Dark patterns: 97% of 290, 75% drip pricing, Meesho, no penalty clause | Opus direct | Medianama Oct 2025 | confirmed | |
| MSME delayed payments Rs 7.34 lakh cr, 4.6% GVA, micro 3x | Opus direct | KNN India | confirmed | |
| RBI Ombudsman 13.34 lakh vs Addendum 2.96 lakh | Opus direct | Mint 2 Dec 2025; RBI Annual Report | confirmed, reconciled | Scheme-wide intake vs ORBIO receipts |
| RBI FY25 frauds Rs 36,014 cr, 13,516 digital cases, Rs 520 cr | Opus direct | RBI Annual Report 2024-25 | confirmed, context added | Rs 18,674 cr is reclassified older cases |
| RBI digital-uptime dashboard plan (Addendum) | Opus direct | RBI Annual Report | confirmed | Added to 2B gaps |
| NPCI Aug 2026: 24,508.96M txns, 752 banks (Addendum) | Codex search | npci.org.in | confirmed (Codex only) | Page did not render for Opus |
| ASER 2024: 76.6% of all Class 3 cannot read | Opus direct | ASER 2024 report PDF, Tables 1-2 | corrected | 72.9% all rural; 76.6% is government schools |
| ASER 2024 (Addendum): 27.1%, 33.7%, 30.7%, 23.4% vs 35.5% | both | ASER PDF | confirmed | Class 5 reading 48.8% |
| Student suicides 14,488 (2024), 8.5% | both | Hindustan Times 11 May 2026 | confirmed | |
| Farm-sector suicides 10,546 (2024), 6.2% | Codex search | Times of India | confirmed | 4,633 farmers, 5,913 labourers |
| NSS 77th: 50.2% indebted, Rs 74,121 | Codex search | MoSPI report 587 | confirmed | Rs 10,218 income not exposed |
| Bharat-VISTAAR: phone-only, no app; 17 or 18 Feb | both | PIB 13 Mar 2026 | corrected | 17 Feb 2026; phone, voice bot, web and app; IVRS for non-smartphone users; Rs 150 cr |
| DeHaat FY25 Rs 3,000 cr revenue, Rs 207 cr operating loss | both | Inc42 27 Sep 2025 and 30 Oct 2025 | confirmed, context added | Reported Rs 369 cr net profit from a non-cash gain |
| Road deaths 2025: 183,434 vs 183,382 | Opus direct | HT 31 Jul 2026 | reconciled | Both from the same e-DAR series; use about 183,400 |
| Karnataka 24,929 crashes | Opus direct | HT 31 Jul 2026 | corrected | Jan-27 Jul 2026, not a full year |
| Official road-death series differ | Opus direct | HT 12 Aug 2026 | confirmed | 2024: 177,175 / 175,142 / 162,500 |
| Crimes against women 4.41 lakh, 64.6 rate (2024) | Opus direct | Times of India 7 May 2026 | confirmed (press) | Codex could not reach the NCRB table |
| Sahaaya 7.81 lakh grievances (Jan 2023-13 Jun 2026) | Opus direct | The Hindu 19 Jun 2026 | confirmed | |
| 1,02,022 potholes; 2,600 pending; final chance in July | both | Bangalore Mirror 15 Aug 2026; Indian Express | confirmed | |
| Namma 112: 1,725 calls; 224 of 1,031 untraced (2025) | Opus direct | New Indian Express 26 Jul 2026 | confirmed | |
| PharmEasy valuation cut | Codex search | third-party | could not verify | |
| MuleHunter.ai Dec 2024; .bank.in Feb 2025 | Opus direct | Medianama | could not verify | Dates not on the page |
| Addendum items not checked by either reviewer: ED Rs 1,750 cr (Jan-Apr 2024); MyGate 51% tenant-conflict survey; BTP 893 Bengaluru deaths (2024); NCH 107,966 dockets a month; NABCONS loss ranges; WHO loneliness; MoSPI 97.1% | - | Addendum links | could not verify | Treat as `[U]` |
