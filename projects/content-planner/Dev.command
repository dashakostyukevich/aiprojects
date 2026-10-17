#!/bin/bash
# Double-click in Finder to start the dev server and open the app.
cd "$(dirname "$0")" || exit 1

echo "Starting content-planner at http://localhost:5173/"
npm run dev &
DEV_PID=$!

( sleep 2; open http://localhost:5173/ ) &

echo
echo "Press Ctrl+C to stop."
wait $DEV_PID
