/* ==========================================================================
   Darya's Diary — Media Kit
   Vanilla JS. No build step, no dependencies.

   Content comes from content/content.json, which the CMS at /admin writes.
   assets/js/data.js holds a copy of the same data and is the fallback, so a
   failed fetch still renders a complete page. Load order in index.html keeps
   data.js ahead of this file.
   ========================================================================== */

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -------------------------------------------------------------- content */

  /**
   * Escapes text before it goes into innerHTML. Content is now typed by a
   * human in a web form, so it is treated as untrusted: a stray `<` in a brand
   * name should render as a character, not as markup.
   */
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    );

  const DEFAULTS = {
    SITE: window.SITE || {},
    WORK: window.WORK || [],
    PHOTOS: window.PHOTOS || [],
    BRANDS: window.BRANDS || [],
    PACKAGES: window.PACKAGES || [],
    ADDONS: window.ADDONS || [],
  };

  /**
   * Fetches the editable content file. Any failure — offline, 404, malformed
   * JSON, or a missing key — falls back to the shipped defaults key by key,
   * so a partially broken file still renders as much as it can.
   */
  async function loadContent() {
    try {
      const res = await fetch("content/content.json", { cache: "no-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return {
        SITE: { ...DEFAULTS.SITE, ...(data.SITE || {}) },
        WORK: Array.isArray(data.WORK) ? data.WORK : DEFAULTS.WORK,
        PHOTOS: Array.isArray(data.PHOTOS) ? data.PHOTOS : DEFAULTS.PHOTOS,
        BRANDS: Array.isArray(data.BRANDS) ? data.BRANDS : DEFAULTS.BRANDS,
        PACKAGES: Array.isArray(data.PACKAGES) ? data.PACKAGES : DEFAULTS.PACKAGES,
        ADDONS: Array.isArray(data.ADDONS) ? data.ADDONS : DEFAULTS.ADDONS,
      };
    } catch (err) {
      console.warn("content/content.json not loaded, using built-in defaults:", err);
      return DEFAULTS;
    }
  }

  /* ----------------------------------------------------------------- boot */

  // The nav is wired straight away: it is on screen before the content lands,
  // and a slow network should not leave the menu button dead.
  wireNav();

  loadContent().then(render).catch((err) => {
    console.error(err);
    render(DEFAULTS);
  });

  /* ------------------------------------------------------------------- nav */

  function wireNav() {
    const nav = $("#nav");
    const navToggle = $("#navToggle");
    const mobileMenu = $("#mobileMenu");

    const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      mobileMenu.classList.toggle("is-open", !open);
    });

    function closeMenu() {
      navToggle.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("is-open");
    }

    $$("a", mobileMenu).forEach((a) => a.addEventListener("click", closeMenu));

    // Escape closes the menu, matching the lightbox behaviour.
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
        closeMenu();
        navToggle.focus();
      }
    });

    // Tapping outside the open menu dismisses it.
    document.addEventListener("click", (e) => {
      if (!mobileMenu.classList.contains("is-open")) return;
      if (nav.contains(e.target)) return;
      closeMenu();
    });

    // The menu is hidden at >=1000px; drop the open state so returning to a
    // narrow viewport does not find it still expanded.
    window.matchMedia("(min-width: 1000px)").addEventListener("change", (e) => {
      if (e.matches) closeMenu();
    });

    // Scroll-spy for the desktop nav
    const navLinks = $$(".nav__link");
    const spyTargets = navLinks
      .map((link) => ({ link, section: $(link.getAttribute("href")) }))
      .filter((x) => x.section);

    if ("IntersectionObserver" in window && spyTargets.length) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((l) => l.classList.remove("is-active"));
            const match = spyTargets.find((t) => t.section === entry.target);
            if (match) match.link.classList.add("is-active");
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      spyTargets.forEach(({ section }) => spy.observe(section));
    }
  }

  /* ---------------------------------------------------------------- render */

  function render(data) {
    applySite(data.SITE);
    renderWork(data.WORK);
    renderPhotos(data.PHOTOS);
    renderBrands(data.BRANDS);
    renderPackages(data.PACKAGES, data.SITE.email);
    renderAddons(data.ADDONS);
    wireLightbox();
    setupAboutPhotos();
    initReveal();
    initCountUp(data.SITE);
    $("#year").textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------- site fields */

  /**
   * Writes the SITE strings into their markup slots. Every element carrying
   * data-site already holds the default text in index.html, so this only
   * overwrites what the CMS changed — an empty field leaves the default.
   */
  function applySite(site) {
    $$("[data-site]").forEach((el) => {
      const value = site[el.dataset.site];
      if (value === undefined || value === null || value === "") return;
      // <title> and the meta tags need the attribute, not the text.
      if (el.tagName === "META") el.setAttribute("content", value);
      else el.textContent = value;
    });

    // Multi-line fields (the audience breakdown) become one <br> per line.
    $$("[data-site-lines]").forEach((el) => {
      const value = site[el.dataset.siteLines];
      if (!value) return;
      el.innerHTML = String(value)
        .split("\n")
        .filter((line) => line.trim())
        .map(esc)
        .join("<br>");
    });

    // Every mailto on the page follows the one address in the CMS.
    if (site.email) {
      $$("[data-site-email]").forEach((el) =>
        el.setAttribute("href", `mailto:${site.email}`)
      );
    }
    $$("[data-site-email-text]").forEach((el) => {
      if (site.email) el.textContent = site.email;
    });

    // Social links. A field cleared to empty hides the link rather than
    // leaving a dead anchor behind.
    $$("[data-site-link]").forEach((el) => {
      const url = site[el.dataset.siteLink];
      if (url) el.setAttribute("href", url);
      else el.closest("li, div")?.remove?.() ?? el.remove();
    });
  }

  /* ------------------------------------------------------------ filter row */

  /**
   * Wires a row of filter chips to a grid of items.
   * Each item carries data-cat; the first chip is "All" by convention.
   */
  function setUpFilters(chipRowSel, gridSel, itemSel, allLabel) {
    const chipRow = $(chipRowSel);
    const grid = $(gridSel);
    if (!chipRow || !grid) return;

    const items = $$(itemSel, grid);
    const cats = [];
    items.forEach((item) => {
      const c = item.dataset.cat;
      if (c && !cats.includes(c)) cats.push(c);
    });

    const chips = [{ label: allLabel, value: "all", count: items.length }]
      .concat(cats.map((c) => ({
        label: c,
        value: c,
        count: items.filter((i) => i.dataset.cat === c).length,
      })))
      .map(({ label, value, count }) =>
        `<button class="filter" type="button" data-filter="${esc(value)}"
                 aria-pressed="${value === "all"}">
           ${esc(label)}<span class="filter__count">${count}</span>
         </button>`
      )
      .join("");

    chipRow.innerHTML = chips;

    chipRow.addEventListener("click", (e) => {
      const chip = e.target.closest(".filter");
      if (!chip) return;

      $$(".filter", chipRow).forEach((c) =>
        c.setAttribute("aria-pressed", String(c === chip))
      );

      const value = chip.dataset.filter;
      items.forEach((item) => {
        item.classList.toggle(
          "is-hidden",
          value !== "all" && item.dataset.cat !== value
        );
      });
    });
  }

  /* ----------------------------------------------------------------- work */

  const PLAY = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.75 5.44 18.26 11.57a.8.8 0 0 1 0 1.38L7.75 19.1a.8.8 0 0 1-1.2-.7V6.14a.8.8 0 0 1 1.2-.7Z"/></svg>`;

  function renderWork(work) {
    $("#workGrid").innerHTML = work
      .flatMap((group) =>
        (group.items || []).map(
          (item) => `
      <article class="card" data-cat="${esc(group.name)}">
        <a class="card__media js-video" href="https://www.youtube.com/shorts/${esc(item.yt)}"
           target="_blank" rel="noopener" data-yt="${esc(item.yt)}"
           aria-label="Watch ${esc(item.brand || item.format)}">
          <img src="${esc(item.cover)}" alt="${esc(item.brand || "UGC video")} — ${esc(item.format)}"
               loading="lazy" decoding="async" />
          <span class="card__play"><span>${PLAY}</span></span>
        </a>
        <div class="card__body">
          ${item.brand ? `<span class="card__brand">${esc(item.brand)}</span>` : ""}
          <span class="card__format">${esc(item.format)}</span>
          <span class="card__tag">${esc(group.name)}</span>
        </div>
      </article>`
        )
      )
      .join("");

    setUpFilters("#workFilters", "#workGrid", ".card", "All");
  }

  /* --------------------------------------------------------- photography */

  function renderPhotos(photos) {
    // Intrinsic dimensions are declared so the grid reserves space before the
    // images decode — without them the whole section reflows on load.
    $("#photoGrid").innerHTML = photos
      .map(
        (p, i) => `
    <figure class="photo reveal${i === 0 ? " photo--feature" : ""}" data-cat="${esc(p.cat)}">
      <img src="${esc(p.src)}" alt="${esc(p.tag)} — ${esc(p.cat)}"
           width="720" height="960" loading="lazy" decoding="async" />
      <figcaption class="photo__tag">${esc(p.tag)}</figcaption>
    </figure>`
      )
      .join("");

    setUpFilters("#photoFilters", "#photoGrid", ".photo", "All");
  }

  /* -------------------------------------------------------------- brands */

  function renderBrands(brands) {
    $("#brandsGrid").innerHTML = brands
      .map(
        (b) => `
    <div class="brand">
      <span class="brand__name">${esc(b.name)}</span>
      <span class="brand__cat">${esc(b.cat)}</span>
    </div>`
      )
      .join("");

    // Marquee: duplicate the list so the -50% translate loops seamlessly.
    const names = brands.map((b) => `<span>${esc(b.name)}</span>`).join("");
    $("#brandsTrack").innerHTML = names + names;
  }

  /* ------------------------------------------------------------ packages */

  function renderPackages(packages, email) {
    // Every tier renders identically — no highlighted tier.
    $("#packagesGrid").innerHTML = packages
      .map(
        (p) => `
    <article class="plan reveal">
      <div class="plan__top">
        <h3 class="plan__name">${esc(p.name)}</h3>
        <div class="plan__price">
          ${
            p.amount
              ? `<span class="plan__amount">$${esc(p.amount)}</span>
                 <span class="plan__unit">${esc(p.unit)}</span>`
              : /* The barter tier has no figure — show the word instead of a
                   price, sized down so it does not out-shout the paid tiers. */
                `<span class="plan__amount plan__amount--label">${esc(p.amountLabel)}</span>`
          }
        </div>
        <p class="plan__desc">${esc(p.desc)}</p>
      </div>
      <ul class="plan__list">
        ${(p.features || []).map((f) => `<li>${esc(f)}</li>`).join("")}
      </ul>
      <a class="btn btn--ghost"
         href="mailto:${esc(email)}?subject=${encodeURIComponent(
           p.name + " — enquiry"
         )}">${esc(p.cta)}</a>
    </article>`
      )
      .join("");
  }

  function renderAddons(addons) {
    $("#addonsList").innerHTML = addons
      .map((a) => `<li><span>${esc(a.price)}</span>${esc(a.label)}</li>`)
      .join("");
  }

  /* ------------------------------------------------------------ lightbox */

  function wireLightbox() {
    const lightbox = $("#lightbox");
    const lightboxFrame = $("#lightboxFrame");
    const lightboxClose = $("#lightboxClose");
    let lastFocused = null;

    const embedFor = (id) =>
      `<iframe src="https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0"
         title="UGC video" allow="autoplay; encrypted-media; fullscreen"
         allowfullscreen></iframe>`;

    function openLightbox(id) {
      lastFocused = document.activeElement;
      lightboxFrame.innerHTML = embedFor(id);
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightboxFrame.innerHTML = "";
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    document.addEventListener("click", (e) => {
      const trigger = e.target.closest(".js-video");
      if (!trigger) return;
      e.preventDefault();
      openLightbox(trigger.dataset.yt);
    });

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });

    // The hero background video should not autoplay on a phone trying to
    // save data — the poster frame still shows.
    const bgVideos = $$(".hero__bg video, .cta__bg video");
    if (window.matchMedia("(max-width: 767px)").matches) {
      bgVideos.forEach((v) => v.removeAttribute("autoplay"));
    }
  }

  /* -------------------------------------------------- why-me photos */
  /* Static by design: the three photos sit side by side in the flex row and
     keep a fixed tilt. The original Webflow build fanned them out on scroll;
     that motion was removed, so no scroll listener drives these cards. */
  function setupAboutPhotos() {
    const aboutPhotos = $("[data-about-photos]");
    if (!aboutPhotos) return;

    const rest = [
      { y: 6, rot: 3, z: 1 },
      { y: -2, rot: -1.5, z: 3 },
      { y: 6, rot: -3, z: 2 },
    ];

    $$(".about__photo", aboutPhotos).forEach((card, i) => {
      card.style.zIndex = String(rest[i].z);
      card.style.transform =
        `translate3d(0, ${rest[i].y}px, 0) rotate(${rest[i].rot}deg)`;
    });
  }

  /* ---------------------------------------------------- reveal on scroll */

  function initReveal() {
    const revealables = $$(".reveal");
    if (reduced || !("IntersectionObserver" in window)) {
      revealables.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          // Small stagger so siblings cascade rather than pop together.
          const siblings = Array.from(entry.target.parentElement.children);
          const i = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    revealables.forEach((el) => io.observe(el));
  }

  /* ----------------------------------------------------------- count up */

  function initCountUp(site) {
    const counters = $$("[data-stat], [data-count]");

    counters.forEach((el) => {
      // A figure edited in the CMS arrives on data-stat as a plain number; it
      // is copied onto data-count so the counter animates to the edited value.
      if (!el.dataset.stat) return;
      const value = site[el.dataset.stat];
      if (value !== undefined && value !== null && value !== "") {
        el.dataset.count = value;
      }
    });

    if (reduced || !("IntersectionObserver" in window)) {
      counters.forEach((el) => {
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        el.textContent =
          parseFloat(el.dataset.count).toFixed(decimals) + (el.dataset.suffix || "");
      });
      return;
    }

    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          co.unobserve(el);

          const target = parseFloat(el.dataset.count);
          if (Number.isNaN(target)) return;
          const decimals = parseInt(el.dataset.decimals || "0", 10);
          // Kept outside the suffix so "%" never counts up as part of a number.
          const suffix = el.dataset.suffix || "";
          const duration = 1200;
          const start = performance.now();

          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * eased).toFixed(decimals) + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target.toFixed(decimals) + suffix;
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => co.observe(el));
  }
})();
