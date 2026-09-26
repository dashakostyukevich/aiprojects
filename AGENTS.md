# AI Projects Workspace

`~/aiprojects` is a container for many independent projects, not a project itself. It is a two-level
workspace: the root is only the container, and every project lives one level down in `projects/`.

```
aiprojects/
  AGENTS.md                  <- this file, the only instruction file
  OpenCode Here.command      <- Finder launcher, starts OpenCode at the root
  projects/                  <- the only place project folders go
    <project-slug>/          <- one folder per project, all siblings
```

The root holds nothing else. No project files, no `package.json`. It *is* the single git repo for
the whole workspace.

## First action of every session: route to the right project

1. Run `ls ~/aiprojects/projects` and read this file. Do this before writing or scaffolding
   anything.
2. Match the request against the existing folders in `projects/` (by name, and by that folder's
   `README.md` when the name is ambiguous).
3. Match found -> work inside `projects/<slug>/`. No match -> create `projects/<slug>/` first, then
   work inside it.

- Never create a second folder for a project that already exists. Extend the existing one.
- Never write project files at the workspace root or directly in `projects/`. The root is the
  container; `projects/` holds folders only, never loose files.
- Never nest a project inside another project. Siblings under `projects/`, one level deep.
- `OpenCode Here.command` is a launcher, not a project: leave it at the root and keep its executable
  bit set (`chmod +x`), or Finder double-click stops working. It deliberately keeps the terminal
  open after OpenCode exits, so a "hang" on exit is expected, not a bug.
- If a request touches two existing projects, make the change in the project that owns it and say
  which one you chose. Don't invent a combined folder.

## Creating a new project folder

- Create it at `~/aiprojects/projects/<slug>/`. The path is always exactly `projects/` plus the
  slug — no deeper nesting, no project folder at the root.
- Name it with a short lowercase kebab-case slug describing the thing: `cookie-jar-recipe-site`,
  `pixel-shooter`, `invoice-pdf-tool`. Not `project1`, `new-folder`, `test`, or a date.
- Scaffold with the framework's own initializer (`npm create vite@latest`, `npm create next-app`)
  rather than hand-writing config.
- No shared `package.json`, lockfile, or `node_modules` at the root or in `projects/`. Each project
  installs its own dependencies.
- Don't run `git init` inside a project folder. The root repo already tracks everything; see
  **Git: one repo for the whole workspace** below.

## Git: one repo for the whole workspace

`~/aiprojects` is the only git repo here. Every project under `projects/` is tracked by it as plain
subdirectory files. This is deliberate — Dasha asked for one global repo instead of per-project
ones.

- **Never** `git init` inside `projects/<slug>/`. A nested repo makes the project invisible: git
  treats that folder as an untracked gitlink, so `git status` shows a single opaque `projects/`
  entry and `git add` only records the nested repo pointer, never the files.
- Commit from the root, and name the project in the message so it stays readable from the root
  log: `git add projects/<slug>` then `git commit -m "one-button-site: add heading"`.
- A project's own `.gitignore` (`node_modules`, `dist`, `*.local`) still does its job, because
  gitignore rules are per-directory no matter which repo is running. Keep those files.
- To absorb a project that already has its own repo:

  ```sh
  rm -rf projects/<slug>/.git
  git add projects/<slug>
  git commit -m "<slug>: import into workspace repo"
  ```

  That drops the project's own history — its commits are not copied over. Fine for a fresh
  scaffold, worth flagging to Dasha if the history matters.

## Where project-specific knowledge goes

- Keep workspace-wide rules in this file only. **Do not add an `AGENTS.md` inside a project folder
  or in `projects/`.** OpenCode loads only the *nearest* `AGENTS.md` walking up from the working
  directory, so a per-project file silently shadows this one and these routing rules stop applying.
  Source of truth: `packages/opencode/src/session/instruction.ts` in the opencode repo — "The first
  project-level match wins so we don't stack AGENTS.md/CLAUDE.md from every ancestor."
- The extra `projects/` level does not break that: from `~/aiprojects/projects/<slug>/` the walk up
  finds this file at the root, so these rules still apply everywhere. Don't "fix" that by dropping a
  stub `AGENTS.md` into `projects/`.
- Record a project's own commands, architecture, and quirks in that folder's `README.md`, plus a
  short `PROJECT.md` when there is more to keep. Read them when you start working in that project,
  and update them whenever you change how the project builds, runs, or is verified.

## Environment (verified on this machine)

- `python3` is Apple's system Python **3.9.6** at `/usr/bin/python3`, owned by root. Don't write
  3.10+ syntax (`match`, runtime PEP 604 `X | None`). Create a per-project venv and use it:
  `python3 -m venv .venv`, then `.venv/bin/pip` / `.venv/bin/python`. Never `pip install` into the
  system interpreter.
- Node **v24.20.0** and npm **11.19.0** are available. `pnpm` and `bun` are **not** installed — use
  `npm`, or install the tool first if a project genuinely needs it.
- `uv` and `ffmpeg` are **not** installed. Video and audio work needs `ffmpeg` installed up front
  rather than assumed.
- git 2.50.1 is available. This is macOS with BSD userland tools, so `sed -i`, `grep -P`, and other
  GNU-only flags behave differently than in a Linux container.
- No `opencode.json` exists in this workspace and no MCP resources are exposed, so treat Figma and
  other API/MCP integrations as unavailable: design work produces files and exports. Add an
  `opencode.json` here if an MCP server is wired up later.
