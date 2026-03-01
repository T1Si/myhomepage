#!/usr/bin/env bash
set -euo pipefail

# Simple watcher to auto-restart the local static server when source files change.
# Runs from project root. Assumes server runs from src/ with port default 3000.

PORT=${1:-3000}
ROOT_DIR="$(pwd)/src"
LOG="/tmp/httpserver_watch.log"

start_server() {
  echo "[watch] Starting server on port $PORT in $ROOT_DIR" >&2
  cd "$ROOT_DIR"
  python3 -m http.server "$PORT" &> "$LOG" &
  echo $! > /tmp/httpserver_watch.pid
  sleep 0.3
}

stop_server() {
  if [[ -f /tmp/httpserver_watch.pid ]]; then
    PID=$(cat /tmp/httpserver_watch.pid)
    if ps -p "$PID" > /dev/null; then
      echo "[watch] Stopping server (pid=$PID)" >&2
      kill "$PID" 2>/dev/null || true
      sleep 0.5
    fi
    rm -f /tmp/httpserver_watch.pid
  fi
}

restart_server() {
  stop_server
  start_server
}

if ! command -v fswatch >/dev/null 2>&1; then
  echo "[watch] fswatch not found. Install fswatch to use automatic restart. Or run this script manually after edits." >&2
  echo "Example: brew install fswatch" >&2
  exit 1
fi

trap 'stop_server' EXIT

start_server

echo "[watch] Watching src/** and assets/** for changes..."
fswatch -o src/** assets/** | while read change; do
  echo "[watch] Change detected: $change. Restarting server..." >&2
  restart_server
done
