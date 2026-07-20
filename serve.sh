#!/usr/bin/env bash
# Local test. localhost counts as a secure context, so the camera works.
# Open http://localhost:8000 in Chrome on this machine.
set -e
PORT="${1:-8000}"
echo "serving on http://localhost:$PORT  (ctrl-c to stop)"
python3 -m http.server "$PORT"
