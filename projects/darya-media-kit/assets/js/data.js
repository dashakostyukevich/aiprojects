/* ==========================================================================
   Shipped default content — the fallback.
   The editable copy lives in content/content.json and is what the CMS writes.
   This file only loads if that fetch fails, so the site never renders empty:
   a fresh clone, a broken path or a failed request still shows a full page.
   Keep it in sync with content.json when you edit content by hand.
   ========================================================================== */

// The scalar fields sit on `window` flat under their own names. main.js reads
// them from here when content/content.json is missing, so they cover the same
// names the nested groups in the JSON hold.
window.name = "Daryas.diary";
window.monogram = "DK";
window.title = "Daryas.diary — Media Kit";
window.description =
  "Media kit for Darya K. — UGC creator producing video and photography for beauty, fashion, tech and lifestyle brands.";
window.email = "darya.ksts@gmail.com";
window.instagram = "https://www.instagram.com/daryas.diary/";
window.tiktok = "https://www.tiktok.com/@daryas.diary";
window.youtube = "https://www.youtube.com/@daryas.diary";
window.basedIn = "Poland — shooting worldwide, remote or on location.";
window.languages = "Languages: EN / PL / RU";
window.footerCopyright = "Darya’s Diary";

window.heroTitle = "darya k.";
window.heroScript = "media kit";
window.heroArc = "FREELANCE LIFESTYLE ✦ TRAVEL CONTENT CREATOR ✦ UGC";
window.heroArcFallback = "Freelance lifestyle · travel · content creator · UGC";
window.heroBottomLabel = "blog: @daryas.diary";

window.aboutEyebrow = "Why me?";
window.aboutHeading = "I create the kind of content";
window.aboutHeadingEm = "i’d love to watch myself";

window.statsInstagramFollowers = "1385";
window.statsInstagramEngagement = "6.47";
window.statsTiktokFollowers = "443";
window.statsTiktokEngagement = "14.29";
window.statsAudienceHeading = "Audience";
window.statsAudienceLines =
  "73% Female\n50% Ages 25–34 and 28% ages 18–24\n17.3% Poland, 13% USA, 8% UK, 5% Canada";
window.statsUpdated = "last update: September 2026";
window.footerNote = "Stats last updated September 2026";
window.statsNote = "I’m just getting started — but my audience already listens";

// --- UGC video, grouped into the categories the filters read ---------------
window.WORK = [
  {
    name: "Beauty",
    items: [
      { brand: "L'oreal Paris", format: "Product Demo", yt: "ayAS3Qbi8KE", cover: "assets/work/l-oreal-paris-8.avif" },
      { brand: "garnier olia", format: "TikTik Style", yt: "e2m9iN1Xj5Y", cover: "assets/work/garnier-olia-1.avif" },
      { brand: "Anua", format: "Product Demo", yt: "GJByFXXU1DQ", cover: "assets/work/anua-2.avif" },
      { brand: "L'oreal Paris", format: "Lifestyle video", yt: "fbmeBgLXkDE", cover: "assets/work/l-oreal-paris-3.avif" },
      { brand: "COSRX", format: "Skincare", yt: "67pEMqKIQdg", cover: "assets/work/cosrx-4.avif" },
      { brand: "skin1004", format: "Skincare", yt: "eXUYCZCbIfc", cover: "assets/work/skin1004-5.avif" },
      { brand: "pantene", format: "Product Review", yt: "cw0I3jfakLg", cover: "assets/work/pantene-6.avif" },
      { brand: "cosrx", format: "Product Demo", yt: "U6z4LuALfAI", cover: "assets/work/cosrx-7.avif" },
    ],
  },
  {
    name: "Fashion",
    items: [
      { brand: "", format: "GRWM", yt: "-uTGBY7SHNY", cover: "assets/work/selfshot-15.avif" },
      { brand: "", format: "OGL", yt: "1WuncxXV0PY", cover: "assets/work/selfshot-16.avif" },
      { brand: "", format: "OGL", yt: "VyKY7-cOVOU", cover: "assets/work/selfshot-17.avif" },
      { brand: "VIVAIA", format: "Product Review", yt: "qnX7V5V2ROo", cover: "assets/work/vivaia-1.webp" },
      { brand: "VIVAIA", format: "TikTok Style", yt: "BCMow_rZXUc", cover: "assets/work/vivaia-2.avif" },
      { brand: "", format: "TikTok Style", yt: "v1TMb1wCx3s", cover: "assets/work/selfshot-3.avif" },
      { brand: "", format: "Outfit Chek", yt: "nAaPoIahd_4", cover: "assets/work/selfshot-4.avif" },
      { brand: "", format: "TikTok Style", yt: "h-8Be515Rf8", cover: "assets/work/selfshot-5.avif" },
      { brand: "Adidas", format: "Unpacking", yt: "NjgG7KV0tCE", cover: "assets/work/adidas-6.avif" },
      { brand: "", format: "GRWM", yt: "7HFORJphCYk", cover: "assets/work/selfshot-7.webp" },
      { brand: "", format: "Outfit Check", yt: "Q1v-oSzhA8k", cover: "assets/work/selfshot-8.webp" },
      { brand: "Firmoo", format: "Unpacking", yt: "aIEba6z9jhY", cover: "assets/work/firmoo-9.avif" },
    ],
  },
  {
    name: "Tech",
    items: [
      { brand: "RecipeJar", format: "Problem / Solution", yt: "8ESLtf0dhi8", cover: "assets/work/recipejar-10.avif" },
      { brand: "Brighty", format: "App Review", yt: "jeyk0g9vE00", cover: "assets/work/brighty-11.avif" },
      { brand: "Firsty", format: "e-SIM", yt: "ccnz6kliz8Y", cover: "assets/work/firsty-12.avif" },
      { brand: "Firsty", format: "Vlog", yt: "USprNGhqv5o", cover: "assets/work/firsty-13.avif" },
      { brand: "Firsty", format: "Problem / Solution", yt: "l7Sls0usLHw", cover: "assets/work/firsty-14.avif" },
    ],
  },
  {
    name: "Food & Beverage",
    items: [
      { brand: "Sourdough bread", format: "Tik-Tok Style", yt: "5aCb-TyclGY", cover: "assets/work/sourdough-bread-1.avif" },
      { brand: "Intro roasters", format: "CONCEPT VIDEOGRAPHY", yt: "Xz2bcaaeZD4", cover: "assets/work/intro-roasters-2.avif" },
      { brand: "coffee plant", format: "CONCEPT VIDEOGRAPHY", yt: "1zWd116pqJc", cover: "assets/work/coffee-plant-3.avif" },
    ],
  },
  {
    name: "Hotels & Airbnb",
    items: [
      { brand: "", format: "Airbnb Example", yt: "qBSH_JEuVnE", cover: "assets/work/selfshot-1.avif" },
      { brand: "Mozart Hotel milan", format: "Hotel Review", yt: "itt1_Tfd5HU", cover: "assets/work/mozart-hotel-milan-2.avif" },
      { brand: "", format: "Glamping Tago", yt: "Wiq5EQJJmcU", cover: "assets/work/glamping-tago-3.webp" },
      { brand: "Unite Hostel Barcelona", format: "Hostel Review", yt: "3ZsDo9otLgY", cover: "assets/work/unite-hostel-barcelona-4.avif" },
    ],
  },
  {
    name: "Places",
    items: [
      { brand: "ancymon cafe", format: "Café review", yt: "Y_zs1X8mHLc", cover: "assets/work/ancymon-cafe-1.webp" },
      { brand: "Moja Gruzja", format: "Khinkali Cooking Class", yt: "UJYYO8M3WzQ", cover: "assets/work/moja-gruzja-2.avif" },
    ],
  },
  {
    name: "Home / Interior",
    items: [
      { brand: "Musso", format: "Concept Videography", yt: "pDU1pWVKNBc", cover: "assets/work/musso-1.avif" },
      { brand: "scretch map", format: "Product Demo", yt: "zwY9lrEmcfQ", cover: "assets/work/scretch-map-2.avif" },
      { brand: "lenor", format: "Product Demo", yt: "_VnInyNPe5c", cover: "assets/work/lenor-3.avif" },
    ],
  },
];

// --- UGC photography ------------------------------------------------------
// Categorised by what the shot actually is, so a brand can self-select.
window.PHOTOS = [
  { src: "assets/photo-04.avif", cat: "Beauty & Product", tag: "Skincare set" },
  { src: "assets/photo-12.avif", cat: "Beauty & Product", tag: "SPF flat lay" },
  { src: "assets/photo-10.avif", cat: "Beauty & Product", tag: "Sheet mask" },
  { src: "assets/photo-09.avif", cat: "Beauty & Product", tag: "Nails & detail" },
  { src: "assets/photo-06.webp", cat: "Beauty & Product", tag: "Accessories" },

  { src: "assets/photo-01.avif", cat: "Tech & Objects", tag: "Audio flat lay" },
  { src: "assets/photo-03.avif", cat: "Tech & Objects", tag: "Light study" },

  { src: "assets/photo-05.avif", cat: "Food & Still Life", tag: "Breakfast" },
  { src: "assets/photo-07.avif", cat: "Food & Still Life", tag: "Coffee gear" },

  { src: "assets/photo-02.avif", cat: "Lifestyle & Places", tag: "On location" },
  { src: "assets/photo-08.avif", cat: "Lifestyle & Places", tag: "Interior" },
  { src: "assets/photo-11.avif", cat: "Lifestyle & Places", tag: "Golden hour" },
  { src: "assets/photo-14.avif", cat: "Lifestyle & Places", tag: "Hospitality" },
  { src: "assets/photo-15.avif", cat: "Lifestyle & Places", tag: "Interiors" },
  { src: "assets/photo-13.avif", cat: "Lifestyle & Places", tag: "Texture" },
];

// --- Brands worked with ---------------------------------------------------
window.BRANDS = [
  { name: "Garnier", cat: "Beauty & Hair" },
  { name: "Anua", cat: "Beauty & Hair" },
  { name: "L'Oréal Paris", cat: "Beauty & Hair" },
  { name: "COSRX", cat: "Beauty & Hair" },
  { name: "skin1004", cat: "Beauty & Hair" },
  { name: "Pantene", cat: "Beauty & Hair" },
  { name: "Lenor", cat: "Beauty & Hair" },
  { name: "Adidas", cat: "Fashion" },
  { name: "VIVAIA", cat: "Fashion" },
  { name: "Firmoo", cat: "Fashion" },
  { name: "Brighty", cat: "Tech & Apps" },
  { name: "Firsty", cat: "Tech & Apps" },
  { name: "RecipeJar", cat: "Tech & Apps" },
  { name: "Kärcher", cat: "Tech & Apps" },
  { name: "Musso", cat: "Tech & Apps" },
  { name: "Scratch Map", cat: "Tech & Apps" },
];

// --- Packages -------------------------------------------------------------
// All tiers are presented equally — no highlighted package.
// `amount` is omitted on the barter tier; the renderer shows `amountLabel`
// instead of a figure.
window.PACKAGES = [
  {
    name: "Single video",
    amount: "100",
    unit: "per video",
    desc: "One finished vertical video, ready for organic or paid use.",
    features: [
      "15–45 sec edit, 9:16",
      "1 revision round",
      "3 hook options to choose from",
      "30-day usage rights",
      "Delivery in 5 days",
    ],
    cta: "Book a single",
  },
  {
    name: "Bundle",
    amount: "240",
    unit: "3 videos",
    desc: "Enough to A/B test a concept and find what actually converts.",
    features: [
      "3 vertical videos",
      "2 revision rounds each",
      "Raw footage included",
      "Organic + 60-day paid usage",
      "Whitelisting-ready files",
      "Delivery in 7 days",
    ],
    cta: "Book a bundle",
  },
  {
    name: "Retainer",
    amount: "600",
    unit: "per month",
    desc: "Ongoing content for brands that need a steady pipeline.",
    features: [
      "10–30 videos per month",
      "Creative strategy & scripting",
      "Concept ideation each cycle",
      "Unlimited usage rights",
      "Dedicated Slack channel",
      "One spot per month open for commission work",
    ],
    cta: "Talk about a retainer",
  },
  {
    name: "Barter collab",
    amountLabel: "Barter",
    desc: "Product or access in exchange for content. Good fit for launches I already love.",
    features: [
      "1–3 vertical videos",
      "Your product, my aesthetic",
      "Concept agreed upfront",
      "Organic posting on my channels",
      "30-day usage rights",
      "One revision round",
    ],
    cta: "Propose a collab",
  },
];

window.ADDONS = [
  { label: "Extra revision round", price: "+$12" },
  { label: "Script writing (per video)", price: "+$20" },
  { label: "Voice-over / script read", price: "+$16" },
  { label: "Product / UGC photography (10 shots)", price: "+$48" },
  { label: "Additional hook variants", price: "+$8" },
  { label: "Raw footage", price: "+$16" },
  { label: "Crossposting / collab post", price: "+$24" },
  { label: "Whitelisting setup", price: "+$20" },
  { label: "Extended usage (per month)", price: "+6%" },
  { label: "Rush delivery (48h)", price: "+12%" },
];
