/* ==========================================================================
   Motion
   Vanilla JS. No libraries, no build step.

   Loaded after main.js, because it decorates markup that main.js renders from
   content.json — the work grid, photo grid and package cards do not exist in
   the HTML until the fetch resolves.

   The contract with motion.css:
     - `motion` is added by a one-line inline script in <head>, before paint,
       so nothing flashes;
     - `motion-off` cancels every hidden state, and is added here on failure
       plus by a failsafe timer in <head> if this file never runs.
   Hidden states are keyed on `html.motion:not(.motion-off)`, so if this file
   fails the page is simply unanimated rather than blank.

   Reads like the CSS: entrances are IntersectionObserver-driven, scroll-linked
   movement is a single rAF loop, and nothing here touches layout properties.
   ========================================================================== */

(function () {
  "use strict";

  const root = document.documentElement;
  const $ = (sel, r = document) => r.querySelector(sel);
  const $$ = (sel, r = document) => Array.from(r.querySelectorAll(sel));

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STAGGER = 70;

  // Intro timing. Declared here rather than beside startLoader() because
  // boot() runs before that point in the file: `const` lives in the temporal
  // dead zone until its declaration is evaluated, so a startLoader() defined
  // below would throw a ReferenceError on the very first line it reads.
  const MIN_MS = 620;
  const MAX_MS = 1250;

  // Elements already handed to an observer, so the post-render pass can tell
  // new nodes from old ones instead of observing everything twice.
  //
  // Declared before boot() runs. These are `const`/`let`, and calling into
  // them from a hoisted function above the declaration throws a temporal-dead-
  // zone ReferenceError — invisible in review, and it silently disables the
  // whole layer at runtime.
  const seen = new WeakSet();
  let revealIo = null;
  let mediaIo = null;
  let heroStarted = false;
  let introRunning = false;
  // The hero waits for the content to land before it plays, so its words are
  // masked when they move. `heroPending` holds the delay whichever of the two
  // callers asked first, and the other one is ignored.
  let contentReady = false;
  let heroPending = null;

  // If anything below throws, drop the gate so motion.css reveals everything.
  // This is the whole point of the two-key contract.
  try {
    boot();
  } catch (err) {
    console.error("motion: setup failed, showing all content", err);
    clearMotion();
  }

  function boot() {
    // Tell the failsafe timer in <head> that the motion layer is alive, so it
    // stands down instead of cancelling every hidden state three and a half
    // seconds in. Stamped first, before anything that could throw.
    root.dataset.motionAlive = "1";

    // The intro owns the first moment, so it runs before anything else. It
    // calls startHero() itself when it lifts.
    startLoader();

    splitHeadings();
    wireReveals();
    wireFilterMotion();

    // main.js renders the grids from content.json, which resolves after this
    // file runs. Wait for its signal before touching anything runtime-built.
    document.addEventListener("content:rendered", onContentRendered);

    // If that signal never arrives — an older main.js, or a fetch that fell
    // back to the built-in defaults without dispatching — do the pass anyway
    // on a timer so nothing is left stranded in its hidden state.
    setTimeout(onContentRendered, 2500);

    // One rAF loop for every scroll-linked layer on the page.
    wireScroll();
  }

  function onContentRendered() {
    document.removeEventListener("content:rendered", onContentRendered);

    // Split again, after the content has landed. main.js writes the CMS
    // strings in with textContent, which replaces the word spans wholesale —
    // so a split done at boot is thrown away the moment the hero title is
    // filled in from content.json. Re-splitting here is what actually gets the
    // words masked. splitHeadings skips anything still marked as done, so the
    // headings the CMS did not touch are left alone.
    splitHeadings();

    markMedia();
    observeNew();

    // The hero is on screen right now and its words have just been masked, so
    // this is the moment to play it.
    contentReady = true;
    if (!heroStarted) startHero(heroPending === null ? 0 : heroPending);
  }

  /**
   * Undoes the gate on failure. `motion-off` cancels every hidden state in
   * motion.css, and the loader is torn down, because a half-finished intro
   * sitting over the page would be the exact blank-screen failure the whole
   * design exists to prevent.
   */
  function clearMotion() {
    root.classList.remove("motion");
    root.classList.add("motion-off");
    root.classList.remove("is-loading");
    delete root.dataset.motionAlive;
    const loader = $(".mloader");
    if (loader) loader.remove();
  }

  /* ------------------------------------------------------------- the intro */

  /**
   * A short "cut along the line" intro, in the spirit of the reference: the
   * monogram rises, a red rule draws out while a counter runs 0 to 100, then
   * the whole panel lifts off the top of the screen.
   *
   * Returns the extra delay the hero should sit out, or null when there is no
   * intro to wait for. Three ways it declines to run, all of which must leave
   * the page completely ordinary:
   *   - the visitor asked for reduced motion;
   *   - they have already seen it this session;
   *   - storage is unavailable, where a repeat visit cannot be detected.
   *
   * It is also hard-capped: MAX_MS of running time whatever the network does,
   * and it lifts as soon as the page has loaded past a short minimum.
   */
  function startLoader() {
    if (reduced) return;

    try {
      if (window.sessionStorage.getItem("ml-intro-seen")) return;
      window.sessionStorage.setItem("ml-intro-seen", "1");
    } catch (err) {
      // Private mode, blocked storage: an intro the visitor cannot skip past
      // on their next visit is worse than no intro at all.
      return;
    }

    const monogram = $("[data-site='monogram']");

    const loader = document.createElement("div");
    loader.className = "mloader";
    loader.setAttribute("aria-hidden", "true");
    loader.innerHTML =
      '<div class="mloader__inner">' +
      '<span class="mloader__mark"></span>' +
      '<div class="mloader__line"><i></i></div>' +
      '<span class="mloader__count">0</span>' +
      "</div>";
    if (monogram) $(".mloader__mark", loader).textContent = monogram.textContent;

    const line = $(".mloader__line i", loader);
    const count = $(".mloader__count", loader);

    document.body.appendChild(loader);
    root.classList.add("is-loading");
    introRunning = true;

    const start = performance.now();
    let loaded = document.readyState === "complete";
    let done = false;

    const easeInOut = (p) =>
      p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

    function finish() {
      if (done) return;
      done = true;
      introRunning = false;
      window.removeEventListener("load", onLoad);
      loader.classList.add("is-out");
      root.classList.remove("is-loading");
      // The hero waits out the lift, not the whole intro.
      startHero(80);
      setTimeout(() => loader.remove(), 1200);
    }

    function onLoad() {
      loaded = true;
    }

    window.addEventListener("load", onLoad);

    function frame(now) {
      if (done) return;
      const elapsed = now - start;
      const p = Math.min(elapsed / MAX_MS, 1);

      // One value drives both the rule and the number, so the number can never
      // reach 100 with the line still half drawn.
      const eased = easeInOut(p);
      line.style.setProperty("--p", eased.toFixed(4));
      count.textContent = String(Math.round(eased * 100));

      if (loaded && elapsed >= MIN_MS) finish();
      else requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);

    // Belt and braces: if the loop above is starved somehow, the page still
    // opens. This is also the path the <head> failsafe timer takes over from.
    setTimeout(finish, MAX_MS + 700);
  }

  /**
   * Plays the hero entrance. Called by the intro when it lifts, or directly
   * when there is no intro. Guarded so the two paths cannot both fire.
   */
  function startHero(delay) {
    // Asked for before the content has landed: remember the delay and let
    // onContentRendered() fire the actual entrance once the words are masked.
    if (!contentReady) {
      heroPending = delay;
      return;
    }
    if (heroStarted) return;
    heroStarted = true;
    requestAnimationFrame(() => {
      setTimeout(() => {
        root.classList.add("is-split-in");
        // The hero's own elements get `is-in` as well as the page-level key,
        // so they release through the same rule as everything else.
        $$(".hero [data-motion-hero]").forEach((el) => el.classList.add("is-in"));
      }, delay);
    });
  }

  /* ------------------------------------------------------------ media tags */

  /**
   * Marks the boxes that get a clip wipe. Chosen here rather than in the HTML
   * because three of these selectors are generated by main.js at runtime, so
   * attributes in the markup would not survive a content change.
   *
   * `.about__photo-in` is the frame inside the collage photo, not the photo
   * box itself: the box's transform belongs to the resting tilt and the scroll
   * fan, and marking it here would hand that same element a clip wipe and an
   * arrival of its own. The frame is a plain, unclipped box the observer can
   * measure, and it carries the image straight below it, so the existing
   * `[data-motion-media] > img` rules apply to it unchanged.
   *
   * A box with no area is skipped. Below 700px the third about photo is
   * `display: none`, and a zero-size target can never intersect — so marking
   * it would leave its image clipped and waiting for a callback that cannot
   * arrive.
   */
  function markMedia() {
    $$(".card__media, .photo, .why__card--photo, .about__photo-in").forEach((el) => {
      if (!el.getClientRects().length) return;
      el.setAttribute("data-motion-media", "");
    });
  }

  /* ---------------------------------------------------------- line masking */

  /**
   * Wraps each line of a heading so it can rise into place out of a blur.
   *
   * A "line" here is a direct child of the heading — a bare text node or an
   * element. That is the level the heading is already authored at, and it is
   * what makes the stagger read line by line rather than word by word. The
   * heading's own nested markup travels inside the line, so "Pick a starting
   * point, <span class=script>we'll scope the rest</span>" keeps its italic and
   * its accessible name; nothing rewrites text content.
   *
   * Two spans per line, not one: the outer clips, the inner moves. A transform
   * on the clipping element itself moves the clip along with it, so the mask
   * would do nothing and the blur would bleed past the line's edges.
   */
  function splitHeadings() {
    const targets = $$(".hero__title, .h-section, .hero__arc-fallback");

    targets.forEach((el) => {
      // The test is "are the lines already masked", not a flag on the element.
      // main.js rewrites the CMS strings with textContent, which silently
      // destroys the spans a previous split created — so a flag set at boot
      // would stop the second pass from ever repairing them, and the heading
      // would sit there unmasked. Looking for the spans themselves is the only
      // check that stays true after the content lands.
      if (el.querySelector(".line")) return;

      // Collect before moving anything: the loop below pulls nodes out from
      // under el.childNodes as it goes.
      const lines = [];
      Array.prototype.forEach.call(el.childNodes, (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          lines.push(node);
        } else if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
          // Whitespace-only nodes are left where they are: between two block
          // lines they collapse to nothing, and indenting the markup would
          // otherwise push a line off centre.
          lines.push(node);
        }
      });
      if (!lines.length) return;

      lines.forEach((line, i) => {
        const mask = document.createElement("span");
        mask.className = "line";

        const inner = document.createElement("span");
        inner.className = "line-i";
        // One step per line. Written on the inner because the delay rides the
        // animation, and an animation reads its delay from its own element.
        inner.style.setProperty("--line-delay", i * 150 + "ms");

        // Pull the line into the inner span first, which takes it out of the
        // heading, and only then put the mask where it used to be. Appending
        // first and replacing second fails on the second pass: the node is no
        // longer a child of the heading by the time replaceChild runs, and the
        // whole boot throws.
        line.parentNode.insertBefore(mask, line);
        inner.appendChild(line);
        mask.appendChild(inner);
      });
    });
  }

  /* -------------------------------------------------------------- reveals */

  /**
   * One observer for every entrance on the page. Stagger is derived from the
   * element's position among its siblings, so a grid of cards cascades in
   * reading order instead of all firing on the same frame.
   */
  function wireReveals() {
    if (reduced || !("IntersectionObserver" in window)) {
      // Nothing to observe — show everything now. The hidden states are keyed
      // on `motion:not(.motion-off)`, and no observer is coming to add `is-in`
      // to any of them, so they have to be cancelled outright rather than
      // waited on. Cancelling the gate also cancels every transition, so the
      // page appears complete in one frame.
      root.classList.add("motion-off");
      root.classList.add("is-split-in");
      heroStarted = true;
      return;
    }

    revealIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          revealIo.unobserve(el);
          seen.add(el);

          el.style.setProperty("--m-delay", staggerFor(el));

          el.classList.add("is-in");
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    mediaIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          mediaIo.unobserve(entry.target);
          seen.add(entry.target);
          entry.target.style.setProperty("--m-delay", staggerFor(entry.target));
          entry.target.classList.add("is-in");
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    observeNew();

    // The hero is already on screen, so it is driven by load rather than by
    // the observer. It waits for the intro to lift when there is one, and a
    // short beat lets the video poster settle when there is not — which stops
    // the title appearing over a flash of empty background.
    if (!heroStarted && !introRunning) startHero(260);
  }

  /**
   * How long this element should wait before it arrives. Children of a
   * [data-motion-group] cascade off their position in that group; everything
   * else off its position among its siblings. Both are capped, so a long list
   * does not leave its last item waiting a second and a half.
   */
  function staggerFor(el) {
    const siblings = el.parentElement ? el.parentElement.children : null;
    const i = siblings ? Array.prototype.indexOf.call(siblings, el) : 0;
    return Math.min(Math.max(i, 0), 8) * STAGGER + "ms";
  }

  /**
   * Observes anything not already handed to an observer.
   *
   * Each element goes to exactly one observer, and the two lists are disjoint
   * by construction: an element is a media wipe if it carries
   * `data-motion-media`, and the reveal observer never claims it — even when it
   * also has `.reveal`, as the photography tiles and the full-bleed why card
   * do. Claiming such an element for both used to strand it permanently: the
   * first observer marked it seen, the second skipped it, and since only
   * `is-in` clears the clip, the tile stayed wiped out for the whole visit.
   */
  function observeNew() {
    if (!revealIo) return;

    // `.h-section` is observed in its own right, not only through whatever
    // `.reveal` wrapper holds it: the word masks need a target of their own to
    // hang off, so a heading below the fold reveals when it is scrolled to
    // rather than on page load.
    $$(".reveal, [data-motion-group] > *, .h-section").forEach((el) => {
      if (seen.has(el) || el.classList.contains("is-in")) return;
      if (el.hasAttribute("data-motion-media")) return;
      seen.add(el);
      revealIo.observe(el);
    });

    $$("[data-motion-media]").forEach((el) => {
      if (seen.has(el) || el.classList.contains("is-in")) return;
      seen.add(el);
      mediaIo.observe(el);
    });
  }

  /* --------------------------------------------------------------- filters */

  /**
   * Re-runs a short entrance on whatever a category filter has just brought
   * back into view. Without it the grid snaps between sets, which is the one
   * place on the page where a hard cut is most obvious.
   *
   * The listener is on the document rather than on each chip row because the
   * chips are rebuilt from content.json whenever the page renders.
   */
  function wireFilterMotion() {
    if (reduced) return;

    document.addEventListener("click", (e) => {
      const chip = e.target.closest(".filter");
      if (!chip) return;

      const row = chip.closest(".filters");
      const grid = row && row.parentElement
        ? row.parentElement.querySelector(".work-grid, .photo-grid")
        : null;
      if (!grid) return;

      // One frame after the click: main.js has toggled is-hidden by then.
      requestAnimationFrame(() => {
        Array.prototype.forEach.call(grid.children, (el, i) => {
          if (el.classList.contains("is-hidden")) return;

          el.style.setProperty("--m-delay", Math.min(i, 10) * 45 + "ms");

          // The animation only replays if the attribute is removed and the
          // element is re-read between the two writes.
          el.removeAttribute("data-motion-filtered");
          void el.offsetWidth;
          el.setAttribute("data-motion-filtered", "");

          el.addEventListener(
            "animationend",
            function once() {
              el.removeAttribute("data-motion-filtered");
              el.removeEventListener("animationend", once);
            },
            { once: true }
          );
        });
      });
    });
  }

  /* ----------------------------------------------------- scroll-linked layers */

  /**
   * Scroll-linked movement, all of it in one rAF loop.
   *
   * The scroll listener only records that something changed — it never reads
   * layout. Each frame reads geometry once per section, so cost does not scale
   * with the number of elements on the page. Layers that are off screen are
   * skipped entirely, which is what keeps this cheap on a long page.
   */
  function wireScroll() {
    if (reduced) return;

    const layers = $$("[data-motion-parallax]");
    const aboutSection = $(".about__track");
    const aboutCards = aboutSection ? $$(".about__photo", aboutSection) : [];

    if (!layers.length && !aboutCards.length) return;

    let ticking = false;

    /* The collage's resting tilt, read once from the stylesheet.

       fanAbout writes `--fan-y` / `--fan-rot` back onto the card every frame,
       so reading them from getComputedStyle inside the loop would read the
       value written a frame earlier and add to it again — sixty times a
       second the photo walks further from where it started. On a fast scroll
       that ends with the band a couple of hundred pixels off the page. Read
       them once, here, before anything has been written. */
    const rest = new Map();
    aboutCards.forEach((card) => {
      const cs = getComputedStyle(card);
      rest.set(card, {
        y: parseFloat(cs.getPropertyValue("--fan-y")) || 0,
        rot: parseFloat(cs.getPropertyValue("--fan-rot")) || 0,
        depth: parseFloat(cs.getPropertyValue("--par-depth")) || 0,
      });
    });

    function update() {
      ticking = false;
      const vh = window.innerHeight;

      layers.forEach((layer) => {
        const rect = layer.getBoundingClientRect();

        // Skip anything off screen. Without this the loop does layout reads
        // for the entire document height on every frame.
        if (rect.bottom < 0 || rect.top > vh) return;

        // -1 above the viewport, +1 below it, pivoting on the middle of the
        // screen so a layer is still while it is centred.
        const progress =
          (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);

        const depth = parseFloat(layer.dataset.motionParallax) || 0.12;
        layer.style.setProperty("--mp-y", (-progress * depth * 100).toFixed(2) + "px");
      });

      if (aboutSection && aboutCards.length) fanAbout(aboutSection, aboutCards, vh);
    }

    /**
     * The three about photos drift out of their resting fan as the section
     * comes up the screen and settle back into it as it leaves — the one piece
     * of continuous scroll motion on the page, and the thing that carries the
     * visitor from the hero into the story.
     *
     * On top of the fan, each photo also travels a little vertically against
     * the band as the section passes (`--par-depth`), at a different depth
     * from its neighbours. That is what keeps the collage alive under the
     * pointer without the arrangement ever losing its shape.
     *
     * Writes custom properties only. The transform that reads them is declared
     * in style.css, so a card can never end up with two transforms fighting.
     */
    function fanAbout(section, cards, vh) {
      const rect = section.getBoundingClientRect();

      // Off screen: put the cards back to their resting tilt. They would be
      // invisible either way, but returning them means the fan is already
      // closed when the section comes back into view, instead of the visitor
      // arriving to find three cards frozen mid-open.
      if (rect.bottom < 0 || rect.top > vh) {
        cards.forEach((card) => {
          card.style.removeProperty("--fan-y");
          card.style.removeProperty("--fan-rot");
          card.style.removeProperty("--fan-scale");
          card.style.removeProperty("--par-y");
        });
        return;
      }

      // Openness is a window on the section's own travel through the screen:
      // full while it is comfortably in view, falling to zero as it leaves by
      // the top or the bottom. Anchoring to the section rather than to the
      // photos matters — the section is much taller than the photo row, so the
      // row is centred well before the section is halfway past.
      const RANGE = vh * 0.6;
      const openness = Math.min(
        Math.max((rect.bottom - vh) / RANGE + 1, 0),
        Math.max((vh - rect.top) / RANGE + 1, 0),
        1
      );
      const settle = openness * openness * (3 - 2 * openness); // smoothstep
      const open = 1 - settle;

      // Signed travel of the section through the screen: -1 above the viewport,
      // +1 below it, pivoting on the middle of the screen so the band is still
      // while it is centred. The same measure the parallax layers use, so the
      // collage and the rest of the page move together.
      const progress =
        (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);

      cards.forEach((card, i) => {
        // Resting values were read once when the loop was wired — see above.
        const base = rest.get(card) || { y: 0, rot: 0, depth: 0 };

        // Each card drifts against its neighbours rather than fanning open from
        // the centre: the collage's whole character is its resting arrangement,
        // so the scroll motion only has to keep it alive, not rewrite it. The
        // middle card leans one way and the outer two the other, which reads as
        // depth in the overlap rather than as the cards separating.
        const dir = i === 1 ? 1 : -1;

        card.style.setProperty(
          "--fan-y",
          (base.y + open * dir * 10).toFixed(2) + "px"
        );
        card.style.setProperty(
          "--fan-rot",
          (base.rot + open * dir * 2).toFixed(2) + "deg"
        );
        // A two-percent settle, not the five it used to be: the collage is
        // meant to hold its shape, and a visible shrink undercuts that.
        card.style.setProperty("--fan-scale", (0.98 + settle * 0.02).toFixed(3));
        // Rounded to whole pixels: this is a slow drift, so sub-pixel writes
        // would only cost the compositor something to re-rasterise each frame.
        card.style.setProperty(
          "--par-y",
          (-progress * base.depth).toFixed(0) + "px"
        );
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }
})();
