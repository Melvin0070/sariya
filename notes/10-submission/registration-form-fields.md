# Finale registration and Phase 1 idea form: actual fields

Captured 2026-10-04. The form sits behind a login (https://iqoo.reskilll.com/register?city=finale redirects to /login). The agent did not sign in or create an account. The fields below were read from the site's public front-end code (the JavaScript the login page itself loads: `assets/index-C_hxNPZz.js`, `BattleDashboard-CfXtAY5v.js`, `Register-C4g_gAo7.js`, `Onboarding-N_axuWIl.js`, `constants-C1Ds92mA.js`). They are what the browser renders after login; server-side checks may differ slightly [U]. The user should confirm on screen.

## Deadline (verified in the site code)
- Finale `submissionDeadline`: **2026-10-05T23:59:59+05:30** (5 Oct 2026, 23:59 IST). Venue string: "TBA, Bengaluru". No shortlist-announcement time is set for the Finale.
- The idea can be edited and re-saved until the deadline. After it, an un-submitted team does not go forward.

## Flow
1. Sign up (full name, email, password) and verify email.
2. Profile, once: I am a Student / Working professional; mobile number; gender; organisation or college; passing-out year (students) or role/designation and years as a working professional; city; state; LinkedIn URL (optional, "helps shortlisting"); GitHub URL; how did you hear about us; agree to terms.
3. Register: tick Grand Finale; tick "I can attend" (48 hours on site, overnight); confirm.
4. Dashboard `/dashboard/iqoo-finale`, three steps:
   - Step 1 Team: 1-3 builders; create a team (name 3-30 characters, letters, digits and spaces only), go solo, or join by 6-character code. No mixing students and working professionals.
   - Step 2 Problem statement: pick one (each has a track, title and description). Only the leader can lock it. Changeable until submissions lock.
   - Step 3 Submit your idea (leader only).

## Step 3 fields (exact labels)
| Field | Type | Limit / rule | Required |
|---|---|---|---|
| Idea title | text; placeholder "A short, punchy name" | 5 to 200 characters | Yes |
| Description | textarea; hint "What are you building, for whom, and how?" | 50 to 2,000 characters | Yes |
| Video walkthrough URL | URL | none stated | Optional |
| Prototype URL | URL; "live demo / repo" | none stated | Optional |
| Deck / document * | upload PDF or PPT (max 25 MB) or paste a link | one file or link | Yes |
| Android proficiency | select: No Android experience / Basic / Intermediate / Expert / shipped apps | | Yes (defaults to first) |
| LLM proficiency | select: No LLM experience / Cloud APIs only / Experimented with local LLMs / Deployed local LLMs on-device | | Yes (defaults to first) |
| Prior builds & hackathons | textarea; hint: won hackathons, shipped products, open-sourced work; "Helps shortlisting" | sent as pre-existing-product description, cut at 1,000 characters | Optional |
| What makes you and your team stand out? | textarea; hint: skills, domain edge, prior collaboration, why this problem; "Helps shortlisting" | cut at 1,000 characters | Optional |
| Checkbox | "I confirm this idea is our team's original work and any pre-existing components are disclosed." | must be ticked | Yes |

Other rules in the code: the "<" character (and "javascript:" or "on...=" patterns) is rejected in title and description: write "under 200 ms", not "<200 ms". Whatever is typed in "Prior builds & hackathons" also sets a `preExistingProduct: yes` flag on the submission [U: how reviewers see that flag].
