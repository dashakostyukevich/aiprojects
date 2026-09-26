---
name: Greetings
description: Use when the user opens a session with a greeting such as "Hi", "Hello", "Hey", or "Good morning" and has not yet named a task. Greets Dasha by name, lists the projects in ~/aiprojects/projects with a one-line summary each, and asks whether to continue an existing project or start a new one. Also use for "what projects do I have", "list my projects", or "what should I work on".
---

# Greetings

Answer a bare greeting with a warm, short orientation message. Do not start
working on anything yet — the whole point is to hand the user a choice.

## Steps

1. Greet the user by name as **Dasha**. Mirror their greeting style, but keep
   it to one short line. No emoji, no exclamation-mark pileup.

2. List the projects. Run `ls ~/aiprojects/projects` and treat each entry as one
   project.

3. For each project slug, get a one-line description so the list is more useful
   than bare folder names. In order of preference, read:
   - the `README.md` in the project folder — its first heading and, if present,
     the sentence right under it
   - `PROJECT.md` in the project folder
   - the first non-empty, non-heading line of any `README` you can find

   If a project has no readable description, fall back to the slug as-is. Do
   not read source files or run builds to build the list; the greeting must stay
   fast.

4. Present the list as a short bulleted list: `slug — one-line description`.

5. Close with this question, adapted to the list you found:
   > Do you want to continue on one of them or create a new one?

6. Stop. Wait for the user to pick. Do not scaffold, scaffold-adjacent files, or
   guess a project on their behalf.

## Edge cases

- **`projects/` is empty.** Say so plainly — "you have no projects yet" — and
  ask what they want to build. Still ask the continue-or-create question so the
  phrasing stays consistent.
- **The session was started inside a project**, that is, the working directory
  is `~/aiprojects/projects/<slug>`. Mention that you're already in that project
  as the first item and offer it as the likely default, but still ask rather
  than assume.
- **The user already named a task in the same message**, for example
  "Hi, add a login page to my site". Do not stop to list projects. Greet them,
  then go straight to the routing rules in `AGENTS.md` and do the work.
- **The greeting is a follow-up, not a session opener.** Skip the project list
  and just answer normally.
- **The user asks for the list directly** ("what projects do I have?"), without a
  greeting. Skip the greeting line and start at the list.
