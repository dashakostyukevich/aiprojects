#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Проверка вёрстки: ищет страницы, содержимое которых выходит за край листа A4.

Копия index.html делается рядом с оригиналом, иначе не подхватится styles.css.

  python3 tools/check_overflow.py
"""

import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PRINT_DIR = os.path.join(ROOT, "print")
PROBE_HTML = os.path.join(PRINT_DIR, "_probe.html")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

PROBE = """
<script>
window.addEventListener('load', function(){
  var out = [];
  document.querySelectorAll('.page').forEach(function(p, i){
    var pr = p.getBoundingClientRect();
    var maxB = 0, worst = '';
    p.querySelectorAll('*').forEach(function(el){
      var b = el.getBoundingClientRect().bottom - pr.top;
      if (b > maxB) { maxB = b; worst = (el.className || el.tagName) + ''; }
    });
    var over = maxB - pr.height;
    out.push('стр.' + (i+1) + '  низ=' + Math.round(maxB) + ' из ' + Math.round(pr.height) +
             (over > 1 ? '  ПЕРЕПОЛНЕНИЕ +' + Math.round(over) : '  ок') +
             '  [' + worst.slice(0, 30) + ']');
  });
  var d = document.createElement('pre');
  d.id = 'PROBE';
  d.textContent = out.join('\\n');
  document.body.appendChild(d);
});
</script>
"""


def main():
    src_path = os.path.join(PRINT_DIR, "index.html")
    if not os.path.exists(src_path):
        print("Сначала запустите: python3 tools/generate.py --no-pdf")
        return 1
    src = open(src_path, encoding="utf-8").read()
    open(PROBE_HTML, "w", encoding="utf-8").write(src.replace("</body>", PROBE + "</body>"))

    res = subprocess.run([
        CHROME, "--headless=new", "--disable-gpu",
        "--window-size=794,1123",
        "--dump-dom", "--virtual-time-budget=4000",
        "file://" + PROBE_HTML,
    ], capture_output=True, text=True)

    m = re.search(r'<pre id="PROBE">(.*?)</pre>', res.stdout, re.S)
    os.remove(PROBE_HTML)
    if not m:
        print("PROBE не отработал")
        return 1
    report = m.group(1)
    print(report)
    return 0 if "ПЕРЕПОЛНЕНИЕ" not in report else 2


if __name__ == "__main__":
    sys.exit(main())