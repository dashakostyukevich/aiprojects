#!/usr/bin/env bash
#
# Deploy the media kit to Netlify.
#
#   ./deploy.sh              # production deploy
#   ./deploy.sh --draft      # draft URL, not the live site
#   ./deploy.sh --msg "..."  # attach a commit message to the deploy
#
# The site is static HTML/CSS/JS with no build step, so there is nothing to
# compile — this just checks the tooling, then hands the folder to the CLI.

set -euo pipefail

SITE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_URL="https://darya-media-kit.netlify.app"
CONTEXT="--prod"
MESSAGE="Deploy $(date '+%Y-%m-%d %H:%M')"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --draft)   CONTEXT="--draft"; shift ;;
    --prod)    CONTEXT="--prod";  shift ;;
    --msg)     MESSAGE="$2"; shift 2 ;;
    --msg=*)   MESSAGE="${1#*=}"; shift ;;
    -h|--help) sed -n '2,11p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $1 (try --help)" >&2; exit 1 ;;
  esac
done

cd "$SITE_DIR"

# 1. The CLI has to be on PATH — it is not a project dependency.
if ! command -v netlify >/dev/null 2>&1; then
  echo "error: netlify-cli not found. Install it with:" >&2
  echo "  npm i -g netlify-cli" >&2
  exit 1
fi

# 2. The folder must be linked to a site, or the CLI has nothing to publish to.
if [[ ! -f .netlify/state.json ]]; then
  echo "error: this folder is not linked to a Netlify site." >&2
  echo "Run 'netlify login' then 'netlify link' from $SITE_DIR." >&2
  exit 1
fi

# 3. Publishing is outward-facing, so surface uncommitted work rather than
#    silently shipping whatever is on disk.
if ! git diff --quiet -- . 2>/dev/null || ! git diff --cached --quiet -- . 2>/dev/null; then
  echo "note: you have uncommitted changes in this folder."
  echo "      They will be deployed. Commit them first if that is not what you want."
  echo
fi

echo "Deploying $SITE_DIR -> $SITE_URL"
netlify deploy "$CONTEXT" --dir . --message "$MESSAGE"

if [[ "$CONTEXT" == "--prod" ]]; then
  echo
  echo "Done. $SITE_URL is live."
else
  echo
  echo "Draft deployed. The live site at $SITE_URL is unchanged —"
  echo "re-run with --prod once you are happy with it."
fi