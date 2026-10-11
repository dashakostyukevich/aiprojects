# aiprojects

A container for many independent projects. It is not a project itself.

```
aiprojects/
  AGENTS.md                  <- workspace rules for OpenCode (the only instruction file)
  README.md                  <- this file
  OpenCode Here.command      <- Finder launcher, starts OpenCode at the root
  projects/                  <- the only place project folders go
    <project-slug>/          <- one folder per project, all siblings
```

## One git repo for the whole workspace

`~/aiprojects` is the **only** git repo here. Every project under `projects/` is tracked by it as
plain files. This is deliberate: Dasha asked for one global repo instead of per-project ones.

Commit from the root, and name the project in the message so the log stays readable:

```sh
git add projects/<slug>
git commit -m "one-button-site: add heading"
```

### Why not one repo per project

Both are defensible for independent projects. One root repo was chosen for the simpler setup:

|                     | One root repo                         | Per-project repos      |
| ------------------- | ------------------------------------- | ---------------------- |
| Setup               | none                                  | one `git init` per project |
| Change across two projects | one commit                 | a commit in each repo  |
| History for one project | filtered by path (`git log projects/<slug>`) | standalone      |
| Clone               | the whole workspace                   | just the one you want  |

The costs of the root repo are repo size and a workspace-wide `git log`. Both are acceptable at this
scale. If that ever changes, converting a project out is easy — deleting its `.git` and re-initialising
carries the files across but drops that project's history, so do it deliberately.

### The one trap

**Never run `git init` inside `projects/<slug>/`.** A nested repo makes the project invisible to the
root repo: git records the folder as a single opaque `160000` gitlink, so `git add` captures only a
pointer to the nested repo, never the files. `git status` then shows one `projects/` entry and the
project's real contents never land in the root history.

To absorb a project that already has its own repo:

```sh
rm -rf projects/<slug>/.git
git add projects/<slug>
git commit -m "<slug>: import into workspace repo"
```

Verify there are no nested repos at any time:

```sh
find projects -maxdepth 2 -name .git          # should print nothing
git ls-files -s | awk '$1=="160000"'         # should print nothing
```

A project's own `.gitignore` (`node_modules`, `dist`, `*.local`) still works — gitignore rules are
per-directory regardless of which repo is running — so keep those files.

## Projects

Each project documents itself in its own `README.md`: commands, architecture, and the quirks worth
knowing before editing it. There is no index here on purpose — `projects/` is the list.

## Environment

Verified on this machine, recorded in `AGENTS.md` with more detail:

- Node 24.20.0, npm 11.19.0. No `pnpm`, no `bun`.
- `python3` is Apple's system 3.9.6 — use a per-project venv, never the system interpreter.
- git 2.50.1 on macOS, so BSD userland tools: `sed -i` and `grep -P` behave unlike Linux.
- No `opencode.json` and no MCP servers are wired up here.