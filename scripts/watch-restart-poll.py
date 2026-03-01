#!/usr/bin/env python3
import sys
import time
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'src'
WATCH_DIRS = [SRC, SRC / 'assets']

def take_snapshot():
    snap = {}
    for d in WATCH_DIRS:
        if not d.exists():
            continue
        for p in d.rglob('*'):
            if p.is_file():
                try:
                    snap[str(p.resolve())] = p.stat().st_mtime
                except Exception:
                    pass
    return snap

def changed(prev, curr):
    if prev.keys() != curr.keys():
        return True
    for k, v in curr.items():
        if prev.get(k) != v:
            return True
    return False

def start_server():
    # If a server is already running on the port, try to kill it first to avoid crash
    try:
        import subprocess as _sp
        _kill_cmd = ["bash","-lc","lsof -i :3000 -sTCP:LISTEN -P -n | awk '{print $2}' | tail -n +2"]
        out = _sp.check_output(_kill_cmd, text=True).strip()
        if out:
            for pid in out.splitlines():
                try:
                    _sp.call(["kill", "-9", pid])
                except Exception:
                    pass
    except Exception:
        pass
    return subprocess.Popen([sys.executable, '-m', 'http.server', '3000'], cwd=str(SRC))

def main():
    snap = take_snapshot()
    proc = start_server()
    print(f"[watch] Server started, pid={proc.pid}")
    try:
        while True:
            time.sleep(1)
            curr = take_snapshot()
            if changed(snap, curr):
                print("[watch] Change detected. Restarting server...")
                try:
                    proc.terminate()
                    proc.wait(5)
                except Exception:
                    try:
                        proc.kill()
                    except Exception:
                        pass
                proc = start_server()
                print(f"[watch] Server restarted, pid={proc.pid}")
                snap = curr
    except KeyboardInterrupt:
        print("[watch] Stopping server...")
        try:
            proc.terminate()
            proc.wait(5)
        except Exception:
            pass

if __name__ == '__main__':
    main()
