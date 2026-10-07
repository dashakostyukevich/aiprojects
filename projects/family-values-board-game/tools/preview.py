#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Постраничная визуальная проверка макета.

  python3 tools/preview.py 2 7 10      -> скриншоты страниц 2, 7, 10

Результат кладётся в dist/preview/page-NN.png
"""

import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML = os.path.join(ROOT, "print", "index.html")
OUT_DIR = os.path.join(ROOT, "dist", "preview")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

PREVIEW_HTML = """<!doctype html><html lang="ru"><head><meta charset="utf-8">
<style>
  html,body{{margin:0;padding:0;background:#9aa3ac;}}
  .page{{margin:0 !important;}}
  .page:not(:nth-of-type({n})){{display:none !important;}}
</style>
<link rel="stylesheet" href="../../print/styles.css">
</head><body>
{body}
</body></html>
"""


def count_pages(path):
    txt = open(path, encoding="utf-8").read()
    return txt.count('<div class="page')


def main():
    if len(sys.argv) < 2:
        print("usage: preview.py <page numbers>")
        return
    os.makedirs(OUT_DIR, exist_ok=True)
    src = open(HTML, encoding="utf-8").read()
    body = src[src.index("<body>") + 6: src.rindex("</body>")]

    total = count_pages(HTML)
    print("всего .page в разметке:", total)

    for n in sys.argv[1:]:
        n = int(n)
        prev = os.path.join(OUT_DIR, "_p%d.html" % n)
        open(prev, "w", encoding="utf-8").write(PREVIEW_HTML.format(n=n, body=body))
        png = os.path.join(OUT_DIR, "page-%02d.png" % n)
        subprocess.run([
            CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
            "--force-device-scale-factor=1.3",
            "--window-size=794,1123",
            "--screenshot=" + png,
            "file://" + prev,
        ], capture_output=True, timeout=120)
        print("→", png, os.path.exists(png))


if __name__ == "__main__":
    main()