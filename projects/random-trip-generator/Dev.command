#!/bin/zsh
# Double-click this file in Finder to start the Where Should I Go dev server.
# Press Ctrl+C, or just close the window, to quit.
#
# Terminal.app sets the working directory to the folder containing this file,
# but we cd explicitly so the script also behaves if run from a shell.

emulate -L zsh

cd -- "${0:A:h}" || exit 1

# Finder launches apps with a minimal PATH, so a Node installed under
# ~/.local/node/bin would not be found without this line.
export PATH="$HOME/.local/node/bin:$PATH"

PORT=5173

pause() {
  # Only wait when there is a real terminal to read from, so this script also
  # behaves when it is run from a script or a background job.
  [[ -t 0 ]] || return 0
  print -r -- ""
  print -n "Press Enter to close this window. "
  read -r
}

fail() {
  print -u2 -r -- "$1"
  pause
  exit 1
}

command -v node >/dev/null || fail "Node not found. Install it, then try again."
command -v npm  >/dev/null || fail "npm not found. It ships with Node."

print "Node $(node -v), npm $(npm -v)"

if [[ ! -d node_modules ]]; then
  print ""
  print "Installing dependencies, this takes a moment..."
  npm install || fail "npm install failed. See the output above."
fi

# Vite would otherwise fall back to another port, and the URL it prints would
# not match the one in the README. Reclaim the port from a previous run.
#
# -sTCP:LISTEN matters: without it lsof also returns clients connected to the
# port, such as an open Chrome tab, and we would kill the browser.
# The second filter makes sure we only ever stop a dev server for this project.
here=${0:A:h}
stale=$(
  lsof -ti "tcp:$PORT" -sTCP:LISTEN 2>/dev/null |
    while read -r pid; do
      ps -o command= -p "$pid" 2>/dev/null | grep -qF "$here" && print -r -- "$pid"
    done
)
if [[ -n "$stale" ]]; then
  print ""
  print "Stopping the dev server still running on port $PORT (pid ${stale//$'\n'/ })."
  kill ${(f)stale} 2>/dev/null
  sleep 1
fi

print ""
print "Starting the dev server. Press Ctrl+C to quit."
print ""

# Ignore Ctrl+C here so the script survives it, prints its goodbye, and only
# the dev server is interrupted. Without this the window closes abruptly.
trap '' INT

npm run dev
code=$?

print ""
print "Dev server stopped (status $code)."
pause
