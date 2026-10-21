#!/usr/bin/env python3
"""
Local dev server for the media kit.

Plain `python3 -m http.server` sends no Cache-Control header, so Chrome falls
back to heuristic caching and will reuse a stale style.css or a stale font
without revalidating. That makes an edited stylesheet look like it "didn't
work" when it did — the exact confusion that hid the PP Editorial New swap.

This serves the same files with `no-store`, so every reload is the truth.
Production caching is a separate concern and is set in netlify.toml.

    ./dev.py            # http://localhost:8912
    ./dev.py 3000       # a different port
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = __import__("pathlib").Path(__file__).resolve().parent


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # `no-store` beats `no-cache`: it stops the response being written to
        # the disk cache at all, rather than just forcing revalidation on read.
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        # Quieter than the default one-line-per-request spam, but still enough
        # to see whether a file was actually requested after an edit.
        sys.stderr.write("  %s\n" % (fmt % args))


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8912
    handler = partial(NoCacheHandler, directory=str(ROOT))
    with ThreadingHTTPServer(("", port), handler) as httpd:
        print(f"media kit dev server → http://localhost:{port}")
        print(f"serving {ROOT}")
        print("ctrl-c to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nstopped")


if __name__ == "__main__":
    main()