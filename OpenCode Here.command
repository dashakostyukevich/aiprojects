#!/bin/zsh
# Double-click this file in Finder to open a Terminal window in this folder
# and start OpenCode here.
#
# Terminal.app sets the working directory to the folder containing this file,
# but we cd explicitly so the script also behaves if run from a shell or a
# "Open with -> Terminal" style launcher from somewhere else.

emulate -L zsh

cd -- "${0:A:h}" || exit 1

# Resolve OpenCode: prefer the PATH, fall back to the known install location.
OPENCODE_BIN="${commands[opencode]:-$HOME/.opencode/bin/opencode}"

if [[ ! -x "$OPENCODE_BIN" ]]; then
  print -u2 "OpenCode not found."
  print -u2 "Looked for it on PATH and at $HOME/.opencode/bin/opencode."
  print -r -- ""
  print -r -- "Press Enter to close this window."
  read -r
  exit 1
fi

print "OpenCode starting in: $PWD"
print -r -- ""

"$OPENCODE_BIN" "$@"
# Not `status`: that is a read-only special parameter in zsh (alias for $?).
exit_code=$?

# Clear the UI churn so the window ends on a clean, readable screen.
clear

print "OpenCode exited (status ${exit_code})."
print -r -- "Press Enter to close this window."
read -r
