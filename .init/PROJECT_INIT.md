# PROJECT_INIT.md — Agent Runbook

Read this file before running any command. It tells you exactly what to run, what
prompts will appear, and how to respond to each one. Do not skip steps or guess at
answers — follow the exact sequence below.

---

## Step 0 — Environment check (MANDATORY, do this first)

Run:
```
node --version
```

- **Required version: `v24.18.1`**
- If the output does NOT exactly match `v24.18.1`:
  - **STOP. Do not run any further commands.**
  - Tell the user: "Node version mismatch. Expected v24.18.1, found `<actual version>`.
    Please switch to v24.18.1 (e.g. via `nvm use 24.18.1` or your version manager of
    choice) and re-run this file."
  - Do not proceed until the user confirms the correct version is active.

Once confirmed, also run (informational only, does not block progress):
```
npm --version
```
Expected around `11.16.0`. If npm later prints a "new major version available"
notice, ignore it — do not upgrade npm mid-setup.

---

## Step 1 — Scaffold the Astro project

Run:
```
npm create astro@latest .
```

Respond to prompts exactly as follows:
| Prompt | Response |
|---|---|
| `Need to install create-astro... Ok to proceed?` | `y` |
| `How would you like to start your new project?` | `A basic, helpful starter project` |
| `Install dependencies?` | `Yes` |
| `Initialize a new git repository?` | `Yes` |

**Known quirk:** dependency install may time out (`error Error: Timeout` /
`Dependencies failed to install`) even though the project still initializes
successfully. If you see this:
- Do not treat it as a fatal error.
- After the command finishes, run `npm install` manually to install the
  dependencies before continuing.

Expected result: project scaffolded with `astro.config.mjs`, `package.json`,
`src/`, `public/`, `.vscode/`, git initialized.

---

## Step 2 — Install design reference (Vercel design guidelines)

Run:
```
npx getdesign@latest add vercel
```

Respond:
| Prompt | Response |
|---|---|
| `Ok to proceed?` | `y` |

Expected result: creates `DESIGN.md` in the project root. This file is a UI/design
reference — read it before writing any UI code, and treat it as the visual style
source of truth for this project.

---

## Step 3 — Install web-design-guidelines skill

Run:
```
npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines
```

Respond to prompts:
| Prompt | Response |
|---|---|
| `Which agents do you want to install to?` | Press **Enter** to accept the default (all listed agents) — do not select a subset unless the user explicitly asks for one |
| `Installation scope` | `Project` |
| `Proceed with installation?` | `Yes` |
| `Install the find-skills skill? (one-time prompt)` | `Yes` |

Expected result: `.agents/skills/web-design-guidelines/` created, plus
`.agents/skills/find-skills/` from the follow-up prompt. `skills-lock.json` and
`AGENTS.md` / `CLAUDE.md` pointer files appear or update in the project root.

---

## Step 4 — Install Tailwind v4 docs skill

Run:
```
npx skills add Lombiq/Tailwind-Agent-Skills
```

Respond to prompts:
| Prompt | Response |
|---|---|
| `Which agents do you want to install to?` | Press **Enter** to accept the default |
| `Installation scope` | `Project` |
| `Proceed with installation?` | `Yes` |

Expected result: `.agents/skills/tailwind-4-docs/` created.

---

## Step 5 — Verify final project structure

After all steps complete, the project root should contain:

```
Project/
├── .agents/
├── .vscode/
├── public/
├── src/
├── .gitignore
├── AGENTS.md
├── astro.config.mjs
├── CLAUDE.md
├── DESIGN.md
├── package.json
├── README.md
├── skills-lock.json
└── tsconfig.json
```

If any of these are missing, re-check the corresponding step above rather than
improvising a fix — the missing item usually means a prompt was answered
incorrectly or a command was skipped.

---

## General rules for the agent running this file

- Run steps strictly in order: 0 → 1 → 2 → 3 → 4 → 5.
- Never skip Step 0's version check, even if the user seems in a hurry.
- Never auto-upgrade npm, node, or any tool version mid-setup unless the user asks.
- When a prompt offers a multi-select agent list, default to Enter/accept-all unless
  told otherwise — don't narrow the list on your own judgment.
- If any command errors in a way not described above, stop and report the exact
  error to the user rather than guessing a fix.
