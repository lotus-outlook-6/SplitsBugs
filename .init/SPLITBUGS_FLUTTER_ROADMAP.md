# SplitBugs — Flutter (Android) Conversion Roadmap

This document covers the plan for eventually shipping SplitBugs as a native
Android app in Flutter, built on top of the same backend as the web (Astro)
version.

---

## Phase 0 — Architecture decision (do this now, while building the web app)

The balance engine, auth, and data storage must live in a backend that both
Astro and Flutter can talk to — not embedded inside Astro server code. Given
prior Firebase experience (ProteoPredict Pro, PulseML), Firebase is the
natural fit:

- **Firestore** for groups / expenses / balances
- **Firebase Auth** (email + Google) — one auth backend, both platforms
- **Cloud Functions** for the balance-simplification logic, so the math lives
  in one place instead of being duplicated in JS for web and Dart for mobile
- **Firebase Storage** for settle-up payment proof images

If built this way, "converting to Flutter" later is a new UI layer on an
existing backend — not a rewrite.

---

## Phase 1 — Environment & foundation

- Install Flutter SDK, set up Android Studio / VS Code with Flutter + Dart
  plugins
- `flutterfire configure` to connect the same Firebase project used for the
  web app
- Pick state management (Riverpod is the current sane default) and `go_router`
  for navigation
- Recreate the design tokens from `DESIGN.md` as a Flutter `ThemeData` —
  colors, type scale, radius — so the app visually matches the web brand

---

## Phase 2 — Auth + core data layer

- Firebase Auth (email/password + Google Sign-In) — should be close to
  drop-in since it's the same backend
- Data models (Group, Expense, Balance) as Dart classes mirroring the
  Firestore schema
- Riverpod providers wrapping Firestore streams for real-time updates

---

## Phase 3 — Core screens (mirror the MVP order from the web build)

1. Groups list + create group + shareable invite link (deep linking via
   `app_links`)
2. Add expense screen — split method selector, no caps
3. Balance/summary screen — pull from the same Cloud Function used by web
4. Settle-up flow with proof upload — `image_picker` + Firebase Storage
5. Activity feed — chronological, date-grouped

---

## Phase 4 — Mobile-native additions the web version doesn't need

- Push notifications via FCM (new expense added, settle-up reminder, someone
  confirmed a payment)
- Offline support — cache recent group data locally (Hive or `sqflite`) so
  the app isn't dead with no signal
- Home screen widget or quick-add shortcut (optional, later)

---

## Phase 5 — Polish & release prep

- App icon + adaptive icon (SplitBugs mascot, simplified for a launcher icon)
- Splash screen
- Play Store requirements: privacy policy (mandatory since it touches
  payment-related data), data safety form, signed release build (`keytool` +
  `key.properties`)

---

## Phase 6 — Play Store launch

- Internal testing track → closed testing → production rollout
- ASO basics: title/description with "split bill," "expense tracker,"
  "roommate bills" type keywords; screenshots showing the settle-up-with-proof
  flow since that's the differentiator

---

## Pre-conversion checklist — confirm ALL of these before starting the Flutter build

Going from web to Android goes smoothly only if these are true of the web app
first. Don't start Phase 1 until you can check every box.

- [ ] **No business logic lives inside Astro components.** The balance
      engine, split calculations, and settle-up rules run as Cloud Functions
      or API routes — not as client-side JS embedded in `.astro` files. If
      any of this logic is still in the frontend, port it to Cloud Functions
      before touching Flutter, or you'll write it twice.
- [ ] **Firestore schema is stable.** Group, Expense, Balance, and User
      documents have a settled shape you're not actively restructuring.
      Changing the schema after the Flutter app exists means updating two
      clients instead of one.
- [ ] **Auth is fully on Firebase Auth**, not a custom session system —
      `flutterfire` assumes Firebase Auth on the other end.
- [ ] **Security rules are written and tested**, not left on permissive
      defaults. Firestore rules are what actually protect user data once a
      second client (the Android app) can read/write directly — the web
      app's own request handling won't cover you anymore.
- [ ] **Image/proof uploads go through Firebase Storage**, not a
      web-specific upload route, so the same storage bucket works for both
      clients.
- [ ] **The brand system (`DESIGN.md`) is finalized** — colors, type scale,
      spacing, mascot usage rules — so there's a single source of truth to
      translate into Flutter's `ThemeData` instead of guessing from the live
      site.
- [ ] **You have a Google Play Developer account** (one-time $25 fee) set up
      in advance, since account verification can take a few days and
      shouldn't block your launch timeline.
- [ ] **A privacy policy page exists and is publicly hosted** (can live on
      the web app itself) — required by Play Store before you can even submit
      for review, given the app touches payment-related data.

---

## Updated web-app creation prompt (Firebase-backed, Flutter-ready)

```
I have initialized a new Astro project. Use the Astro docs MCP, the tailwind-4-docs
skill, and the web-design-guidelines skill while building this. Follow @DESIGN.md
for all visual decisions — keep the aesthetic in the spirit of vercel.com: clean,
minimal, generous whitespace, restrained color, sharp typography. Do NOT reference
or copy any layout, component, or visual pattern from Splitwise — this must look
and feel like an original product.

STEP 1 — PLAN FIRST, DO NOT BUILD YET:
Before writing any code, read this entire brief and produce a plan. Do not
scaffold pages, components, or install anything beyond what's already set up.
The plan should include:
  a. A proposed information architecture (pages/routes and what lives on each)
  b. The build order for the MVP feature list below, with reasoning if you'd
     sequence it differently than listed
  c. A suggested design theme for the website — propose a specific direction
     (color palette with hex values, font pairing, spacing/radius scale, and
     how the SplitBugs mascot fits into that system) that fits the "vercel.com
     spirit" brief above. Give 1 primary direction plus 1 brief alternative,
     and state which you'd recommend and why.
  d. Any open questions or ambiguities in this brief you need resolved before
     building
Present this plan and STOP. Wait for me to say "proceed" (or give feedback/
changes) before writing any code. If I ask for changes, revise the plan and
wait again — do not start building until I explicitly confirm.

STEP 2 — ONLY AFTER I CONFIRM:
Proceed with the approved plan, building in the agreed order. If anything in
the plan needs to change mid-build (a blocker, a better approach you find),
pause and flag it before deviating rather than silently changing direction.

PROJECT: SplitBugs — a free group expense-splitting web app.

FUTURE-PROOFING REQUIREMENT (IMPORTANT):
This web app will later be rebuilt as a Flutter Android app sharing the same
backend. Because of this:
- ALL business logic — the balance-simplification engine, split calculations,
  settle-up/confirmation rules — MUST live in Firebase Cloud Functions, never
  as client-side logic inside Astro components. Astro should only call these
  functions and render results.
- Use Firebase Auth (email/password + Google) for authentication, not a
  custom session system.
- Use Firestore for all data (groups, expenses, balances, users) with a
  schema you're confident is stable — treat schema changes as expensive.
- Use Firebase Storage for settle-up payment proof uploads.
- Write real Firestore security rules (not permissive defaults) since a
  second client (the future Android app) will read/write this data directly
  and won't go through Astro's request handling at all.
- Keep `DESIGN.md` as the single source of truth for the brand system (colors,
  type scale, spacing, mascot usage) so it can be translated into a Flutter
  theme later without guessing from the live site.

BRAND IDENTITY:
- Name is a play on "split bucks" — the mascot is a simple, geometric bug
  (beetle/ladybug style) holding a coin or a tiny receipt. Keep the mark simple
  enough to read clearly at favicon size (16x16) — no multi-bug scenes, no
  heavy illustration detail.
- One accent color for the bug/mark, used consistently across favicon, app icon,
  and any marketing surfaces. Don't rainbow it.
- Tone: friendly and light, but the actual UI (numbers, balances, settle-up flow)
  should stay clean and serious — the mascot carries the personality, not the app
  chrome.

CORE PROBLEM WE'RE SOLVING:
Splitwise is the market leader but has become hostile to its own users:
- Free accounts are capped at 3 transactions/day
- Receipt scanning, currency conversion, and expense charts are locked behind a
  $4.99/mo "Pro" tier
- Because splitting is a group activity, one unpaid member breaks the experience
  for the whole group
- There's no way to prove a "settled" debt was actually paid
- The UI becomes cluttered and hard to parse once a group has a long shared history

SplitBugs' positioning: everything above is free, with no artificial limits, and
settling up includes real proof.

MVP FEATURE SET (build in this order unless your plan proposes otherwise):
1. Auth — email/password + Google sign-in (Firebase Auth)
2. Groups — create a group, invite via shareable link (no forced signup required
   to view a group's balance, only to add expenses)
3. Add expense — description, amount, who paid, split method (equal / exact
   amounts / percentages / shares) — no daily cap, ever
4. Balance engine (Cloud Function) — auto-simplify group debts so the minimum
   number of payments settle everyone up (this is Splitwise's signature
   feature — match it)
5. Settle up with proof — when someone marks a debt paid, the other party gets a
   one-tap confirm; optionally attach a payment screenshot/UPI reference (stored
   in Firebase Storage). A debt only clears when BOTH sides confirm, not just one.
6. Activity feed — clean, chronological, per-group, with clear visual separation
   by date so long histories stay readable (this directly fixes Splitwise's
   "gets messy over time" complaint)
7. Multi-currency support — free, not paywalled
8. Simple charts (spend by category, spend by person) — free, not paywalled

EXPLICITLY DO NOT:
- Add any paid tier, transaction limit, or artificial delay in the MVP
- Copy Splitwise's color palette, iconography, or layout structure
- Over-illustrate the mascot into the core app UI — keep it to logo/favicon/empty
  states only, not scattered through every screen
- Put balance/split logic in Astro components instead of Cloud Functions
- Skip Step 1 — do not start building before I've approved the plan

TECH:
- Astro + Tailwind v4, deployed to Vercel
- Firebase (Auth, Firestore, Cloud Functions, Storage) as the backend
- Use shadcn-style components only where they fit @DESIGN.md, not by default
```
