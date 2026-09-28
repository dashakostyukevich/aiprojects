// Swap these placeholders for your real details. Everything on the page reads
// from here, so editing this file is usually all you need.

export const profile = {
  // The one place the name is written. Everything else reads it: the nav's home
  // aria-label, the footer copyright, the About portrait alt text, the runtime
  // document title (`useDocumentMeta`), and every per-route title, description
  // and JSON-LD block written at build time by `scripts/prerender.mjs`. The
  // literals in `index.html` are the template's placeholder values and are
  // overwritten by that script, so they are not a second source of truth.
  name: 'Darya Kastsiukevich',
  role: 'Product Designer',
  // Hero headline, first screen. One paragraph read as an inline flow, with
  // `em` for the emphasised spans. The line count is emergent from the measure
  // rather than hardcoded.
  //
  // This used to carry a `{ chip: 'icon' }` part — the asterisk dropped into
  // the word slot after "useful interfaces". It is gone, and the reason is
  // worth keeping: SplitReveal renders every word as its own `inline-block`
  // mask, and a browser will break a line between two adjacent inline-blocks
  // whether or not there is whitespace between them. So the asterisk reliably
  // orphaned onto the start of the next line, reading as a stray glyph rather
  // than as punctuation. Binding it to the preceding word would mean changing
  // how SplitReveal groups units, which is not worth it for one decorative
  // mark. The asterisk is now standalone punctuation — nav logo, About, the end
  // of the services list — and never sits inside a sentence. See §3 of design.md.
  headline: [
    { text: 'I design calm, ' },
    { text: 'useful interfaces ', em: true },
    { text: ' for ' },
    { text: 'complex products ', em: true },
    { text: 'that people actually enjoy using.' },
  ],
  // The §3 statement band ("Structure first, personality on top.") used to sit
  // here as a two-line array. It has been removed from the page along with its
  // component, because the hero headline already carries the same position and a
  // second full-bleed claim further down repeated it. The hero is now the only
  // place the design argues its case.
  tagline: 'I design calm, useful interfaces for complex products.',
  // The personal aside at the top of the hero. A plain string, not the
  // `[{ text, em }]` shape the headline and bio use: this is a throwaway line of
  // small print, and the highlighter treatment that earns its keep on the
  // headline and the editorial About column would be shouting at 15px.
  //
  // It reads *before* the headline, not after. It started below the role line on
  // the reasoning that the headline and "Product Designer · Gdansk" are one
  // nameplate that a paragraph should not split; putting the aside on top leaves
  // that pair intact directly under the h1, so nothing is split and the order
  // becomes a person, then a claim, then who is making it.
  aside:
    'Besides my job, I enjoy traveling, experimenting with baking, and organizing my home. I also love going for walks and taking photos—I really enjoy that!',
  location: 'Gdansk, Poland',
  email: 'darya.kasts@gmail.com',
  availability: 'Open to new projects, 2026',
  // The About section is a centred editorial column, so the bio is the only
  // place on the page that gets to be read slowly. Set it as two paragraphs of
  // segments rather than two plain strings: `em` marks a phrase for the accent
  // highlighter, `italic` for a real slanted cut, and everything else is
  // ordinary copy. The markup lives in the component, not here.
  //
  // No invented numbers. The previous first paragraph read "Placeholder bio. I
  // am a product designer with X years of experience", which is a literal
  // template artefact. Say what the work is, not how long you have done it.
  bio: [
    [
      { text: 'I am a product designer. I turn ' },
      { text: 'ambiguous, half-specified problems', em: true },
      { text: ' into software people can pick up and use without a tutorial.' },
    ],
    [
      { text: 'I work end to end: research and framing, flows and wireframes, high-fidelity UI, then shipping alongside engineers, measuring ' },
      { text: 'what happens after launch', em: true },
      { text: '. I like the work to be ' },
      { text: 'clear first and unmistakably mine', italic: true },
      { text: ' second.' },
    ],
  ],
  // Portrait for the About section. Null renders a labelled slot that already
  // reserves the exact box, so dropping a file in public/ and setting the path
  // here changes nothing about the layout. It is rendered black and white —
  // remove the `grayscale` class in AboutEditorial.jsx to keep colour.
  portrait: null,
  portraitAlt: null,
  // Footer links. One entry, LinkedIn, pointing at the real profile.
  //
  // The `Email` entry that used to be first here was removed earlier: the
  // footer rendered the same address as a button directly above this row, so it
  // was a second control for one intent. Dribbble and GitHub were removed
  // after that, because both still pointed at bare domain roots — the footer
  // renders whatever is in this array, so they were live links that went
  // nowhere useful. A row of placeholder destinations is worse than a row of
  // one: it reads as "there are more places to find me" and then does not
  // deliver. If they come back they need real profile URLs, and the row will
  // need its `flex-wrap` and spacing re-checked at three entries.
  links: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/darya-kastsiukevich/' }],
}

// Nav is the §5 pill/outline variant: three outlined pills on the right, a bare
// icon mark on the left with no wordmark. Not sticky, per the first-screen spec.
export const nav = [
  ['Projects', '/#work'],
  ['About', '/#about'],
  ['Contact', '/#contact'],
]

// The objects scattered around the hero. They are here to say something about
// the person before a word of the bio has been read, which is why they are
// labelled like a shelf rather than captioned like a portfolio.
//
// `x` and `y` are percentages of the 1200px composition box, measured from its
// top-left, and are the *centres* of each object. They are chosen, not
// generated: six positions picked by eye, deliberately uneven in count per side
// and in distance from the edge, because a scatter that is even left/right and
// even top/bottom stops reading as a scatter. `size` picks a drawn size and
// `tilt` a resting rotation of a few degrees — six identical objects at six
// irregular positions look like a grid that gave up, not like a desk.
//
// The rule the positions have to respect: nothing may land inside the
// introduction. `HeroVibes.jsx` caps the headline's measure at 58% of the box so
// the clear band down the middle is 21%–79% at every width, which is what lets
// these numbers stay honest from 1024px up without recomputing per breakpoint.
//
// These used to be line drawings from `Doodle.jsx` and are now photographs. The
// `doodle` key is gone from every entry; `doodle` still works, so an entry can
// name a drawing instead of a file, but nothing here uses it now. `Doodle.jsx`
// has no callers left other than this fallback.
//
// The files are in `public/hero/`, downscaled to a 480px long edge. The
// originals in `hero/` are 8.5MB in total and render at 120–136px, so shipping
// them unchanged would have put roughly 8MB of PNG on the critical path for the
// first screen. 480px is still about 3.5x the largest rendered size, so they
// stay sharp on a 2x display.
//
// Order matters and is not alphabetical. Entry 1, 3 and 4 are the three the
// phone layout picks (`HeroVibes.jsx` takes indices 0, 2, 3), chosen for
// silhouette: a round cup, a boxy camera, and a wide laptop. The other three
// are deliberately the awkward shapes — a tall baking dish and a wide diagonal
// plane — because they are the ones that can take a position no doodle could.
//
// Two of the six are captioned with baking language, at two scales. The labels
// are not a description of the photographs and are not meant to be read as one.
//
// The positions were re-picked when these became photographs. They used to be
// the line drawings' coordinates, and two of them broke: the laptop and the star
// overlapped, and the plane at `x: 74` pushed its right edge to 956px, eight
// pixels inside the 948px clear band the headline is capped to. Photographs are
// wider and taller than the drawings they replaced, so the gaps have to be
// re-measured rather than inherited. The rule is unchanged and still holds —
// nothing lands inside 21%–79% of the box, and nothing shares a baseline.
//
// `drift` is the object's character in the pointer reaction, and these six values
// are as hand-picked as the coordinates above. Read by `useHeroDrift`:
//
//   scale  the distance at which this object is at half strength, as a fraction
//          of the section's width. This is a falloff width, not a trigger: the
//          hook's curve is `1 / (1 + (d/scale)²)` plus a floor, so the object
//          always reacts and `scale` only decides how sharply it commits as the
//          cursor arrives. A small `scale` is a twitchy object that jumps when
//          the cursor comes near; a large one drifts lazily.
//   gain   how far it travels at full strength, as a multiple of the hook's base.
//          This is what stops the six from moving as one object.
//   spin   degrees of extra rotation at full strength, on top of `tilt`. Small,
//          and signed, so the pair reads as recoil rather than as a wobble.
//
// The spread is deliberate: `scale` from 0.13 to 0.26 and `gain` from 0.7 to 1.4
// means the baking dish is the twitchy one that jumps at a passing cursor while
// the star barely stirs until the cursor is nearly on it. Six identical values
// would be a group of objects rather than a collection of them.
//
// These were `reach` values, and the rename is not cosmetic. `reach` was a hard
// cutoff — past it the object was written to exactly zero and stayed there — so
// "responds to the cursor anywhere on the page" was impossible no matter how the
// listener was attached. `scale` describes the same spread of characters as a
// curve parameter rather than a boundary.
export const heroVibes = [
  { image: '/hero/coffee.png', label: 'First coffee', x: 7.9, y: 11.3, size: 'sm', tilt: -6, drift: { scale: 0.2, gain: 1.0, spin: -2 } },
  { image: '/hero/baking.png', label: 'Weekend baking', x: 11.4, y: 79.8, size: 'sm', tilt: 4, drift: { scale: 0.16, gain: 1.35, spin: 3 } },
  { image: '/hero/camera.png', label: 'Film camera', x: 7.5, y: 42.9, size: 'lg', tilt: -3, drift: { scale: 0.26, gain: 0.8, spin: -1.5 } },
  // The label reads "Weekdays baking" on a photograph of a laptop, which is
  // deliberately not a description of the object. Two entries now carry baking
  // language — this one and "Weekend baking" on the dish below it — so the shelf
  // says the thing twice at two scales, once as a weekday habit and once as a
  // weekend project. If that redundancy is not wanted, the label here is the one
  // to change: the coordinates, size and drift were picked for a wide object in
  // the top-right corner, and a baking photo needs re-measuring before it could
  // take this slot.
  { image: '/hero/laptop.png', label: 'Weekdays baking', x: 91.2, y: 21.1, size: 'md', tilt: 5, drift: { scale: 0.15, gain: 1.15, spin: 2.5 } },
  { image: '/hero/star.png', label: 'Smiley days', x: 89.4, y: 90.2, size: 'sm', tilt: -4, drift: { scale: 0.24, gain: 0.7, spin: -3 } },
  { image: '/hero/plane.png', label: 'Red-eye flights', x: 94.8, y: 55.1, size: 'lg', tilt: 3, drift: { scale: 0.13, gain: 1.4, spin: 1.5 } },
]

export const services = [
  {
    title: 'Product Design',
    body: 'I design digital products from early concepts to polished, developer-ready interfaces. I work on user flows, information architecture, interaction design, responsive UI, prototyping, and design systems, with a focus on making complex products simple and intuitive.',
  },
  {
    title: 'Webflow Development',
    body: 'I turn Figma designs into responsive, production-ready websites in Webflow. I build scalable components, CMS-powered pages, interactions, and animations while keeping the design accurate, accessible, and easy to maintain.',
  },
  {
    title: 'UX & Design Systems',
    body: 'I improve existing digital products by identifying usability issues, simplifying user flows, and creating consistent UI systems. From UX audits and iterative improvements to components, variants, and UI guidelines, I help products become clearer, more scalable, and easier to use.',
  },
]

export const experience = [
  {
    company: 'Upwork',
    role: 'Freelance Product / Web Designer',
    period: 'Nov 2021 – Present',
    notes: 'Designed 100+ web and digital product interfaces for SaaS, FinTech, and data-driven businesses, covering user flows, UX/UI, responsive design, prototyping, and design systems. Collaborated closely with clients and developers throughout the design and implementation process, using Figma and AI-assisted workflows to explore, iterate, and deliver developer-ready solutions.',
  },
  {
    company: 'MyStudio',
    role: 'Webflow Designer',
    period: 'Jan 2026 – Sep 2026',
    notes: 'Designed and developed responsive websites in Webflow, translating Figma concepts into polished, production-ready digital experiences. Worked with reusable components, CMS, interactions, and responsive layouts while collaborating with clients and developers to refine designs and solve implementation challenges.',
  },
  {
    company: 'LinguaTrip',
    role: 'Web Designer',
    period: 'Mar 2021 – Sep 2025',
    notes: 'Designed user flows and interfaces for an education mobile app, focusing on onboarding, course discovery, and improving the overall user experience. Used analytics, testing, and user feedback to iterate on designs, contributing to an increase in conversion from 18% to 22%.',
  },
  {
    company: 'Wizart',
    role: 'Web Designer',
    period: 'Jun 2022 – Feb 2023',
    notes: 'Designed and tested product features and interface concepts to validate product hypotheses and improve user experiences. Collaborated with analytics teams to interpret A/B test results and used data-driven insights to refine UX and product decisions.',
  },
]

// Each project has a `slug` that becomes its URL: /work/<slug>
// `summary`, `outcome` and `tags` are used on the work grid; the rest is the
// long-form case study shown on the project page.
export const projects = [
  {
    slug: 'arastelle',
    title: 'ARASTELLE',
    year: '2026',
    summary:
      'Communicating complex technology through a clear digital experience. A marketing site for tethered drone systems, designed in Figma and built in Webflow.',
    outcome: 'Designed and shipped: Figma to responsive Webflow',
    tags: ['Web design', 'Interaction design', 'Webflow', 'Brand site'],
    // First grid slot. Takes the 7-column span, so the next project has to be
    // narrow for the row to close. See the note on `size` in the array below.
    size: 'wide',
    ratio: 'landscape',
    drop: null,
    // Was a brand card rather than a photo, on the grounds that the site had no
    // public imagery. It does now: these are screenshots of the live site at
    // 1440px, so the card can show the work instead of the client's name.
    //
    // The card is `landscape` (4:3) and centre-crops.
    kind: 'photo',
    fill: 'navy',
    lockup: 'ARASTELLE',
    // Its own crop, not the section screenshot the case study uses. A 4:3
    // centre-crop of a 16:9 section catches the seam between the two columns and
    // a half-cut heading; this is the product frame on its own, which is what
    // survives the crop and what a 673px card has room to show.
    image: '/arastelle/card.jpg',
    imageAlt: 'The BASTION ISR tethered station, the product at the centre of the ARASTELLE site',
    imageLabel: 'ARASTELLE — BASTION ISR',
    // The cover is the device mockup rather than a screenshot of the page. A
    // flat screenshot says "here is a website"; this says "here is a website,
    // running, on hardware" — which is the thing a marketing site is for and the
    // thing a screenshot cannot show.
    //
    // It is 4:3 in a 16:9 / 21:9 band, so `object-cover` crops the top and
    // bottom. Checked at both: the laptop sits centre and slightly low in the
    // frame, so a centred crop keeps the screen and the base at 16:9 and only
    // trims empty wall at 21:9. There is no `object-position` override here
    // because none is needed — adding one would only be a guess at a crop that
    // measurably works.
    //
    // `hero.jpg` is kept in `public/arastelle/` and can go back in here if that
    // ever stops being true. It is the same site, unframed.
    cover: '/arastelle/cover.jpg',
    coverAlt:
      'A laptop showing the ARASTELLE homepage — the tethered station on a rooftop under the headline Unlimited Aerial Surveillance',
    coverLabel: 'ARASTELLE — the shipped site, running',
    meta: {
      role: 'Product / Web Designer — UX/UI, interaction design, Webflow development',
      timeline: 'Ongoing project',
      team: 'ARASTELLE, with a development partner',
      platform: 'Webflow, responsive web',
      status: 'Shipped / under NDA',
    },
    intro: [
      'ARASTELLE develops tethered drone systems designed to extend the capabilities of micro-UAS for professional and institutional users. The website needed to communicate a highly technical product in a way that felt clear, credible, and engaging.',
      'Because the project is under NDA, this case study focuses only on the publicly available product and the design work I can share.',
    ],
    sections: [
      {
        heading: 'The challenge',
        body: [
          'The product itself is technically complex, while the website needed to make its value understandable quickly. The experience had to communicate:',
          {
            list: [
              'what the technology does',
              'why tethered drones matter',
              'how the solution works',
              'where it can be used',
              'what makes the system different',
            ],
          },
          'At the same time, the brand needed to feel technical, reliable, and modern rather than like a traditional defense-industry website.',
          {
            note: 'Because the project is under NDA, this case study focuses only on the publicly available product and the design work I can share.',
          },
        ],
      },
      {
        heading: 'Turning complex technology into a clear story',
        // The image block that opened this section was a placeholder with no
        // `src`, so it rendered a labelled "Image needed" slot above the prose.
        // It has been removed. The progression it was going to illustrate is
        // carried by the `note` line below, which is the same sequence in text,
        // so the section still makes its point without the empty box.
        body: [
          'I approached the website as a storytelling experience rather than simply a collection of product pages. The information was structured around a simple progression:',
          { note: 'What is it? → How does it work? → What makes it different? → Where can it be used? → How can I learn more?' },
          'This allowed visitors to gradually understand the technology without being overwhelmed by technical information.',
        ],
      },
      {
        heading: 'Designing the product experience',
        body: [
          {
            sub: {
              number: '01',
              heading: 'Product first',
              body: [
                {
                  image: {
                    src: '/arastelle/solution.jpg',
                    caption:
                      'The product and its specifications in one screen. Unlimited flight time, 100 m height and 30-second deployment are the three numbers a buyer actually decides on, so they sit above the fold of this section rather than on a separate specs page.',
                    label: 'The BASTION ISR hero — product visuals, value proposition, key specifications',
                    alt: 'The BASTION ISR section on the ARASTELLE website, showing the tethered station beside its specifications',
                  },
                },
                'The BASTION ISR solution is introduced early, with the core value proposition and key specifications immediately visible. Instead of hiding technical information deeper in the page, I combined product visuals, concise messaging, and specifications to create a quick understanding of the solution.',
                'The public site communicates key attributes such as unlimited flight time, 100 m operating height, 30-second deployment, and its compatibility with multiple micro-UAS platforms.',
              ],
            },
          },
          {
            sub: {
              number: '02',
              heading: 'Making multiple use cases easy to explore',
              body: [
                {
                  image: {
                    src: '/arastelle/usecase.jpg',
                    caption:
                      'The explorer with a scenario selected — border security. Choosing a use case redraws the map from that station’s field of view and writes the scenario beside it, so the claim and the picture of it arrive together.',
                    label: 'The use-case explorer — select a scenario to see how the technology applies',
                    alt: 'The use-case explorer on the ARASTELLE website, with the border security scenario selected and the station’s coverage drawn over the map',
                  },
                },
                'ARASTELLE’s technology can be applied across different scenarios, including defense, public safety, private security, event security, first response, crisis management, and critical infrastructure protection.',
                'Rather than presenting these as a long list, I designed the experience around use-case exploration. Visitors can select a scenario and discover how the technology applies to that specific context. This creates a more relevant experience for different audiences while keeping the overall page structure simple.',
              ],
            },
          },
          {
            sub: {
              number: '03',
              heading: 'Combining technical information with visual storytelling',
              body: [
                {
                  image: {
                    src: '/arastelle/interop.jpg',
                    caption:
                      'Interoperability told as four places rather than a compatibility table: the same station and tether against desert, forest, farmland and harbour, each labelled with the airframe it works with.',
                    label: 'Product imagery, motion, and interactive sections',
                    alt: 'The interoperability section on the ARASTELLE website, showing the tethered station in four environments with the supported airframes named',
                  },
                },
                'For a highly technical product, visuals are important for helping people understand the technology before they read every detail. I used:',
                {
                  list: [
                    'large-scale product imagery',
                    'motion and video',
                    'interactive sections',
                    '3D/visual representations',
                    'progressive disclosure of information',
                  ],
                },
                'The result is an experience that feels closer to a technology product presentation than a conventional corporate website.',
              ],
            },
          },
        ],
      },
      {
        heading: 'Interaction & visual direction',
        body: [
          {
            image: {
              src: '/arastelle/about.jpg',
              caption:
                'The About band, where the visual language is easiest to read: an all-caps display line at two weights, a hairline-ruled three-column grid, and one accent colour used only for the way in. Nothing here is decoration — it is what "engineered for reliability" looks like.',
              label: 'The visual language — precision, technology, reliability, mission focus',
              alt: 'The About section on the ARASTELLE website, showing the typographic hierarchy and the hairline-ruled three-column grid',
            },
          },
          'The visual language was built around the characteristics of the product itself:',
          {
            sub: {
              heading: 'Precision',
              body: ['Structured layouts and strong typographic hierarchy.'],
            },
          },
          {
            sub: {
              heading: 'Technology',
              body: ['Dark visual environments, motion, product renders, and interactive elements.'],
            },
          },
          {
            sub: {
              heading: 'Reliability',
              body: ['Clear specifications, restrained UI, and direct communication.'],
            },
          },
          {
            sub: {
              heading: 'Mission focus',
              body: ['Large imagery and contextual use cases that demonstrate the technology in action.'],
            },
          },
          'The goal was to make the interface feel advanced without sacrificing clarity.',
        ],
      },
      {
        heading: 'From Figma to Webflow',
        body: [
          {
            image: {
              src: '/arastelle/responsive.jpg',
              caption:
                'The same section at 1440 and at 390. The two-column split becomes one column with the specifications first and the product image beneath it — the order a phone reader needs, because the numbers are the argument and the render is the confirmation.',
              label: 'The responsive build in Webflow',
              alt: 'The BASTION ISR section on the ARASTELLE website shown side by side at desktop and mobile widths',
            },
          },
          'I designed the experience in Figma and translated the final design into a responsive Webflow website. The implementation included:',
          {
            list: [
              'responsive layouts',
              'interactive sections',
              'animated transitions',
              'product showcases',
              'use-case interactions',
              'CMS/content structures where needed',
              'responsive behavior across screen sizes',
            ],
          },
          'The focus throughout development was keeping the visual experience from the design intact while making the interactions feel natural on the live website.',
        ],
      },
      {
        heading: 'The result',
        body: [
          'The final website gives ARASTELLE a digital experience that combines technical credibility with visual storytelling. It helps visitors understand the product, explore its applications, and move naturally toward learning more or requesting a demo.',
          'The public website now communicates the company’s core proposition — persistent aerial observation through tethered drone technology — while giving different audiences a way to explore relevant use cases.',
        ],
      },
      {
        heading: 'NDA',
        body: [
          'Some project details, including internal strategy, research, business requirements, and project discussions, cannot be shared publicly due to an NDA. This case study therefore focuses on the publicly available product and the design and development work I am permitted to show.',
        ],
      },
    ],
    pullquote:
      'The goal was to make the interface feel advanced without sacrificing clarity.',
    pullquoteBy: 'A guiding principle for this project',
  },
  {
    slug: 'groshi',
    title: 'Groshi',
    // TODO: the copy does not state when this work ran. Set the real year.
    year: '2025',
    summary:
      'Bringing clarity to complex personal finances. Product architecture, a scalable category system, budgeting from scratch, and a rebuilt onboarding — all shipped.',
    // The product is still ongoing, so there is no honest conversion number to
    // put here. This reads as a claim about the work, not a metric.
    outcome: 'Structure before scale: researched, tested, and implemented',
    tags: ['Product design', 'UX research', 'Information architecture', 'Fintech'],
    // Second grid slot. Narrow, so it pairs with ARASTELLE's 7-column card
    // above it and closes the row. Carries a drop so it hangs lower than
    // ARASTELLE, which is what makes the row read as staggered.
    size: 'narrow',
    ratio: 'square',
    drop: 'lg',
    // A product screenshot is the honest card for a shipped product. The card is
    // square, so it centre-crops a 16:10 screen: `categories.jpg` survives that
    // because its chart and year-over-year comparison sit in the middle third.
    kind: 'photo',
    fill: 'sky',
    lockup: null,
    image: '/groshi/categories.jpg',
    imageAlt: 'The Groshi categories screen, with a category selected and its year-over-year chart',
    imageLabel: 'Groshi — categories, with a selected category and its trend',
    // The cover is a 16:9 / 21:9 band, so it takes the widest, busiest screen:
    // the categories view reads as the product at a glance even once the band
    // has cropped away its top and bottom.
    cover: '/groshi/budget.jpg',
    coverAlt:
      'The Groshi budget view — planned against actual for income and expenses, with money left to spend',
    coverLabel: 'Groshi — the shipped product, monthly budget against actual',
    meta: {
      role: 'Product Designer — UX/UI, research, UX audit, information architecture, feature design, design system',
      timeline: 'Ongoing product',
      team: 'Client, Product Manager, technical team',
      platform: 'Web app, multi-account and multi-currency',
      status: 'Implemented / ongoing',
    },
    intro: [
      'Managing money becomes complicated when it is spread across multiple accounts, banks, currencies, and sources of income. Groshi was designed to bring everything into one place and help people understand, plan, and control their finances with more confidence.',
      'I joined the product while it was already in development. My challenge was not simply to design new screens, but to bring structure to an evolving product, improve existing experiences, and introduce new functionality without making the experience more complicated.',
    ],
    sections: [
      {
        heading: 'The challenge',
        body: [
          'Personal finances are becoming increasingly fragmented. People may have several bank accounts, credit cards, savings accounts, different currencies, and multiple sources of income. When all of this information lives in different places, it becomes difficult to understand the bigger picture.',
          'The research behind Groshi highlighted several recurring needs:',
          {
            list: [
              'seeing a complete financial picture',
              'understanding where money is going',
              'managing budgets and financial goals',
              'reducing the amount of manual tracking',
              'working with multiple accounts and currencies',
              'feeling confident that financial information is organized and understandable',
            ],
          },
          'The product needed to make this complexity feel manageable rather than overwhelming.',
        ],
      },
      {
        heading: 'I joined an existing product — but there was no architecture',
        body: [
          'When I joined Groshi, the product already had screens and design decisions, but it did not yet have a clear information architecture. This quickly became a problem.',
          'With multiple accounts, transactions, categories, reports, budgets, and other features, designing screens individually made it difficult to create coherent user flows. Before expanding the product, I needed to understand how all these pieces fit together.',
          'So I created the product architecture and used it as a foundation for subsequent UX decisions. The goal was to establish a structure that could scale as new features were introduced, while keeping the relationship between accounts, transactions, categories, analytics, and budgets clear.',
        ],
      },
      {
        heading: 'Research: understanding what users actually struggle with',
        body: [
          'Rather than relying only on assumptions about personal finance, I collected qualitative feedback from discussions and reviews of finance products. I organized the feedback by feature and sentiment to identify recurring patterns and areas where users were experiencing friction.',
          {
            image: {
              src: '/groshi/research-board.jpg',
              caption:
                'The feedback board, grouped by feature and coloured by sentiment. The note text is deliberately small here — what the image shows is the shape of the research: how much of it there was, and how much of it repeated.',
              label: 'Qualitative feedback grouped by feature and sentiment',
              alt: 'A board of research notes grouped into rows by sentiment — positive, negative and neutral — across finance app features',
              ratio: 'aspect-16/9',
            },
          },
          'Several themes emerged:',
          {
            sub: {
              number: '01',
              heading: 'The need for a complete picture',
              body: [
                'Users wanted to understand their overall financial situation rather than look at isolated transactions or accounts.',
              ],
            },
          },
          {
            sub: {
              number: '02',
              heading: 'Too much information can become overwhelming',
              body: [
                'Financial products often contain a lot of data. Simply adding more information does not necessarily make the experience more useful.',
              ],
            },
          },
          {
            sub: {
              number: '03',
              heading: 'Budgeting is valuable, but needs to feel approachable',
              body: [
                'Budgeting can help users plan their finances, but the experience needs to make the first step obvious.',
              ],
            },
          },
          {
            sub: {
              number: '04',
              heading: 'Onboarding matters',
              body: [
                'A complex financial product needs to explain itself. Users need guidance to understand what they can do and why the product is useful.',
              ],
            },
          },
          {
            sub: {
              number: '05',
              heading: 'Flexibility and consistency matter',
              body: [
                'With multiple accounts and currencies, users need flexibility without having to learn different rules in different parts of the product.',
              ],
            },
          },
          'These insights became the foundation for the product goals I proposed to the client.',
        ],
      },
      {
        heading: 'From research to product goals',
        body: [
          'Based on the research and the original product brief, I defined three core goals:',
          {
            list: [
              'Create a sense of control — help users understand what is happening with their money.',
              'Reduce financial stress — make complex financial information easier to understand and manage.',
              'Help users work toward financial goals — turn financial data into something users can act on through budgeting and planning.',
            ],
          },
          'These goals helped shift the design process from simply improving individual screens to thinking about the experience as a connected financial management system.',
        ],
      },
      {
        heading: 'Competitive research',
        body: [
          'I looked at both direct finance products and products with useful patterns that could inform the experience.',
          {
            table: {
              head: ['Product', 'What I looked at'],
              rows: [
                ['Revolut', 'UI quality and account organization'],
                ['Monarch Money', 'Similar feature set and user flows'],
                ['YNAB', 'Budgeting experience'],
                ['HomeMoney', 'Managing multiple user accounts'],
                ['Notion / Mint', 'Broader patterns and indirect inspiration'],
              ],
            },
          },
          {
            image: {
              src: '/groshi/competitors.jpg',
              caption:
                'Part of the comparison matrix — market, audience, pricing, bank connectivity, multi-currency and analytics, scored per product. Multi-currency and multi-account support is where Groshi’s closest competitors diverge, and it decided where the architecture had to bend.',
              label: 'The competitive comparison matrix behind the research',
              alt: 'A comparison matrix of finance products across market, audience, pricing, bank connectivity, multi-currency support and analytics',
            },
          },
          'The goal was not to copy existing solutions. I used competitors to understand how established products solve similar problems, identify familiar interaction patterns, and find opportunities to make the Groshi experience clearer.',
        ],
      },
      {
        heading: 'Designing a scalable financial structure',
        body: [
          {
            image: {
              src: '/groshi/ia.jpg',
              caption:
                'The architecture map: what each of the four core areas holds, and the flows between them.',
              label: 'Groshi information architecture — accounts, transactions, categories, analytics, budgets',
              alt: 'Information architecture map for Groshi, showing the Dashboard, Accounts, Transactions and New transaction areas and the flows between them',
            },
          },
          'The architecture became the foundation for the rest of the product. I organized the experience around the major objects users need to manage:',
          { note: 'Accounts → Transactions → Categories → Analytics → Budgets' },
          'This made it possible to think about features as parts of one system rather than independent screens. It was particularly important because Groshi supports multiple accounts and currencies: a decision made in one part of the product could affect reports, transactions, categories, and budgets elsewhere.',
        ],
      },
      {
        heading: 'Making financial data easier to understand',
        body: [
          {
            image: {
              src: '/groshi/chart-before-after.jpg',
              caption:
                'The original chart above, the redesign below: same twelve months, but the redesign adds inflow, outflow and balance on hover instead of asking the user to read them off the shape.',
              label: 'Redesigned financial chart — selecting a month reveals the exact figures',
              alt: 'The original Groshi income and expenses chart above the redesigned version, which reveals exact figures for the selected month',
            },
          },
          'One of the existing experiences I redesigned was the financial chart. The original chart communicated information primarily through visual elements — columns and a line — but users had limited contextual information when looking at a particular month.',
          'I redesigned the interaction so that selecting a month also revealed the relevant figures. Instead of asking users to estimate values from the visualization, the interaction provided the exact numbers alongside the visual trend.',
          { note: 'The principle: visual overview → contextual detail.' },
          'The chart could communicate the overall trend while still allowing users to investigate a specific point when they needed more precise information. I also refined the visual hierarchy and interaction patterns to make the analytics experience more consistent with the rest of the product.',
        ],
      },
      {
        heading: 'Building a category system that could scale',
        body: [
          {
            image: {
              src: '/groshi/categories.jpg',
              caption:
                'The categories screen: a nested tree on the left, the selected category’s year-over-year comparison and its transactions on the right. One structure, read the same way everywhere.',
              label: 'Category management — creating, editing, and nesting categories',
              alt: 'The Groshi category management interface, with a nested category tree beside the selected category’s chart and transactions',
            },
          },
          'Categories initially looked like a relatively simple feature. But once I considered the product as a whole, the challenge became much bigger. Groshi needed categories to work consistently across:',
          {
            list: [
              'multiple accounts',
              'transactions',
              'reports',
              'budgets',
              'multiple currencies',
            ],
          },
          'The main UX challenge was hierarchy and nesting. If categories are structured differently depending on where the user encounters them, the product quickly becomes difficult to understand.',
          'I therefore designed a more complete category management experience, including creating, editing, and organizing categories while maintaining consistency throughout the product.',
          {
            note: 'A feature should not only work on its own. It needs to work as part of the entire product system.',
          },
        ],
      },
      {
        heading: 'Designing budgeting from scratch',
        body: [
          {
            image: {
              src: '/groshi/budget.jpg',
              caption:
                'The budget view as it shipped: planned against actual for every category, and a single figure for how much is left to spend.',
              label: 'Budget creation flow — prototyping in Figma and Lovable',
              alt: 'The Groshi budget view, showing planned against actual for income and expenses with money left to spend',
            },
          },
          'Budgeting was a completely new part of the product. Because Groshi was still developing its MVP, we had to balance research insights with business priorities and move quickly.',
          'Rather than trying to build an advanced budgeting system immediately, we focused on creating a basic experience that could validate the core concept. I explored the flows using Figma and Lovable, which allowed us to prototype and iterate quickly before moving toward implementation.',
          'The core flow allowed users to create budgets for their income and expenses.',
        ],
      },
      {
        heading: 'Testing the budgeting experience',
        // The placeholder image block that opened this section has been removed;
        // it had no `src` and rendered an "Image needed" slot. The finding it
        // was going to illustrate is in the prose directly below.
        body: [
          'Before finalizing the flow, I tested it with 3 users. The task was simple:',
          { note: 'Create a budget category for expenses and income from the first screen.' },
          'All three users successfully completed the task. However, the test revealed an important usability issue — 2 out of 3 users were confused by the first screen.',
          'They were not immediately sure what they were supposed to do or where they should go next. It took them some time to understand the entry point into the budgeting flow.',
          'This was valuable because the test showed that task completion alone was not enough. The flow technically worked, but the starting point was not immediately discoverable. That finding informed the way I thought about entry points and guidance in the broader product experience.',
        ],
      },
      {
        heading: 'Rebuilding onboarding from scratch',
        body: [
          'Onboarding was another area where the product needed more structure. Instead of simply introducing users to the interface, I designed the onboarding experience from the ground up. The new experience had two important parts.',
          {
            sub: {
              number: '01',
              heading: 'Understand the user',
              // The placeholder image block that opened this sub-section has
              // been removed; it had no `src` and rendered an "Image needed"
              // slot.
              body: [
                'At the beginning, we introduced a short form to understand who the user was and what they were looking for. This gave the product an opportunity to make onboarding more relevant to the user’s needs instead of presenting everyone with the same generic introduction.',
              ],
            },
          },
          {
            sub: {
              number: '02',
              heading: 'Guide users through setup',
              // Placeholder image block removed, as above.
              body: [
                'I created a step-by-step account setup flow that broke the process into manageable stages. Rather than asking users to understand the whole product immediately, onboarding gradually introduced the information needed to get started.',
                'The result was a more guided entry into a product that could otherwise feel complex from the first interaction.',
              ],
            },
          },
        ],
      },
      {
        heading: 'Working within and extending the design system',
        body: [
          'I inherited an existing design system when I joined the project. Rather than replacing it, I worked within the established visual language and extended it as the product evolved. I added:',
          {
            list: [
              'new components',
              'forms',
              'interaction states',
              'patterns required for new features',
            ],
          },
          'This allowed new functionality — including budgeting, categories, and onboarding — to feel like part of the same product rather than separate additions. For a growing product, consistency was not only a visual concern: it also helped establish predictable interactions across different parts of the experience.',
        ],
      },
      {
        heading: 'From design to a real product',
        body: [
          'One important aspect of the project is that the work did not stop at prototypes. The features I designed were implemented. The product evolved to include improvements and new functionality across:',
          {
            list: [
              'onboarding',
              'accounts',
              'categories',
              'analytics and charts',
              'budgeting',
              'merchant tracking',
              'shared access',
              'multi-account and multi-currency experiences',
            ],
          },
          'The design system was also extended to support the growing product.',
          'Because the product is still ongoing, there are not reliable quantitative product metrics I can use to claim specific improvements in conversion, retention, or revenue. Instead, the most concrete evidence from the design process comes from the implemented product and the usability testing.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          'The project moved from an evolving collection of screens toward a more structured product experience. My contribution helped establish:',
          {
            sub: {
              heading: 'A scalable product architecture',
              body: [
                'A clearer relationship between accounts, transactions, categories, analytics, and budgets.',
              ],
            },
          },
          {
            sub: {
              heading: 'A more understandable financial analytics experience',
              body: [
                'Charts became more informative by combining visual trends with contextual data.',
              ],
            },
          },
          {
            sub: {
              heading: 'A consistent category system',
              body: [
                'Categories could work across accounts, transactions, reports, and budgets.',
              ],
            },
          },
          {
            sub: {
              heading: 'A new budgeting experience',
              body: [
                'A previously nonexistent feature was researched, prototyped, tested, and implemented.',
              ],
            },
          },
          {
            sub: {
              heading: 'A new onboarding experience',
              body: [
                'A step-by-step setup flow and initial user discovery helped create a more guided entry into the product.',
              ],
            },
          },
          {
            sub: {
              heading: 'An evolving design system',
              body: [
                'New components, forms, and states were added without breaking the existing visual language.',
              ],
            },
          },
        ],
      },
      {
        heading: 'What I learned',
        body: [
          'Joining a product in the middle of development taught me that Product Design is not always about starting with a blank canvas. Sometimes the challenge is understanding what already exists, identifying what is missing, and making new decisions fit into an evolving system.',
          'The biggest lesson from Groshi was the importance of structure before scale. Without a clear architecture, adding more features only makes a product harder to navigate. Establishing the underlying structure first made it easier to design new experiences while keeping the product coherent.',
          'I also learned to treat usability testing as a way to discover unexpected problems, not simply to confirm that a design works. In the budgeting test, every participant completed the task — but two still struggled with the first step. That distinction helped me look beyond successful task completion and pay more attention to discoverability and confidence.',
          'If I were continuing the project, I would involve stakeholders earlier in defining the overall product structure, and map the complete user journey before expanding individual feature areas.',
          'For me, Groshi became less about designing a finance dashboard and more about learning how to bring structure, clarity, and consistency to a complex product as it grows.',
        ],
      },
    ],
    pullquote:
      'The biggest lesson from Groshi was the importance of structure before scale. Without a clear architecture, adding more features only makes a product harder to navigate.',
    pullquoteBy: 'What I learned',
  },
  {
    slug: 'noxs',
    title: 'NOXS',
    year: '2025',
    summary:
      'Turning a complex AI product into a clear B2B experience. A conversion-focused landing page for an AI delivery assistant, including an A/B test on the hero.',
    // The one project here with a measured result rather than a description of
    // the work, so it is worth leading with on the card.
    outcome: 'A/B test: the direct, benefit-led hero won',
    tags: ['Web design', 'UX', 'Conversion', 'A/B testing'],
    // Third grid slot. Wide, pairing with Groshi's 5-column card to close row
    // two, so the three cards tile 7+5 then 5+7.
    size: 'wide',
    ratio: 'landscape',
    drop: 'md',
    kind: 'photo',
    fill: 'sky',
    lockup: null,
    // The card is `landscape` (4:3) and centre-crops. It takes the full hero
    // rather than either variant on its own: the two variants are only 566px
    // wide, so the card at 673px would have to upscale one, and the side-by-side
    // comparison has its own slot further down where it belongs.
    image: '/noxs/hero.jpg',
    imageAlt:
      'The NOXS landing page: the AI Delivery Assistant hero, with the product visual beside it and the Confluence, Jira, GitLab and GitHub integrations below',
    imageLabel: 'NOXS — the landing page, direct hero variant',
    // The cover is a 16:9 / 21:9 band out of a 1320×821 hero, so it keeps the
    // middle band: headline, paragraph, both CTAs and the top of the product
    // visual. The nav and the integration row fall outside it, which is the
    // right loss — neither is the argument.
    cover: '/noxs/hero.jpg',
    coverAlt:
      'The NOXS landing page hero — “AI Delivery Assistant” with the product visual, a Book a Demo button and a How it works button',
    coverLabel: 'The NOXS landing page — hero section, variant B',
    meta: {
      role: 'UX/UI and Web Designer',
      timeline: '1 month',
      team: 'With product and marketing',
      platform: 'Webflow-ready design',
      status: 'Shipped',
    },
    intro: [
      'NOXS is an AI-powered virtual assistant for technical teams. It connects with tools such as Slack, Jira, Confluence, and Notion to help teams monitor delivery, detect blockers, automate routine tasks, and turn fragmented project data into actionable information.',
      'The challenge was to turn a technically complex B2B SaaS product into a website that visitors could understand quickly — and ultimately convince them to book a demo.',
    ],
    sections: [
      {
        heading: 'The challenge',
        body: [
          {
            image: {
              src: '/noxs/stack.jpg',
              caption:
                'The integration row and the primary CTA, in one crop. NOXS does not ask the team to move — the four tools they already live in are named under the button that asks for the demo, so the pitch and the proof are the same object.',
              label: 'The tool stack NOXS sits on top of — Slack, Jira, Confluence, Git',
              alt: 'The Book a Demo and How it works buttons above the Confluence, Jira, GitLab and GitHub integration logos',
              // 2:1 rather than the 16:9 default. The crop is 2.2:1 and the gap
              // between the CTAs and the logo row is real whitespace, not
              // something to crop into — at 16:9 the cover would clip the left
              // edge of the Book a Demo button.
              ratio: 'aspect-2/1',
            },
          },
          'Technical teams already work across many tools: Slack for communication, Jira for tasks, Confluence for documentation, Git for development. NOXS was designed to connect these fragmented sources and provide an additional layer of intelligence without forcing teams to adopt another complicated interface.',
          'The website needed to answer three questions almost immediately:',
          { note: 'What is NOXS? How does it fit into my existing workflow? Why should I care?' },
          'The goal was to create a clear, persuasive landing page that could explain the product, build trust, and generate new leads.',
        ],
      },
      {
        heading: 'From a complex product to a simple story',
        // This section previously opened with a placeholder image block and no
        // `src`, reserved on the grounds that a seven-step narrative cannot be
        // shown with one screenshot and reusing the hero would say nothing about
        // the progression. That reasoning was about whether to *fill* the slot;
        // it was not an argument for showing a reader an empty labelled box. The
        // block is gone. The sequence it was standing in for is the `note` line
        // below, which carries the same seven steps in text.
        body: [
          'I started by understanding the product positioning and its audience: developers, project managers, and digital leads.',
          'The core challenge was translating a technical B2B SaaS concept into a visual story that could be understood without requiring visitors to understand the underlying technology first. I structured the experience around a progressive narrative:',
          { note: 'Problem → Product → How it works → Features → Use cases → Outcomes → Conversion' },
          'Instead of starting with technical details, the page first established the problem — delivery chaos, fragmented data, missed blockers, and inefficient processes — and then positioned NOXS as the solution.',
        ],
      },
      {
        heading: 'Making the value proposition obvious',
        body: [
          'The product offered a lot of functionality:',
          {
            list: [
              'blocker and technical debt detection',
              'sprint planning and efficiency insights',
              'real-time KPIs',
              'smart search across tools',
              'automated reporting',
              'historical delivery insights',
            ],
          },
          'The challenge was not to show everything at once. It was to create a hierarchy that allowed visitors to understand the value first and explore the functionality second. The design therefore combined concise messaging with visual demonstrations and progressive information disclosure.',
          {
            note: 'Don’t make users understand the technology before they understand the benefit.',
          },
        ],
      },
      {
        heading: 'Designing for conversion',
        // Placeholder image block removed, as above. CTA placement is a claim
        // about the whole page, and the prose below now carries it alone.
        body: [
          'Because NOXS is a B2B SaaS product, the website wasn’t just an informational experience. It was also part of the acquisition funnel.',
          'I designed the information flow to move visitors from problem awareness, through understanding, trust, and interest, to a demo booking. Primary and secondary CTAs were placed throughout the experience so that users could take action once they had enough context.',
          'The page also used concrete outcomes and use cases to make the product’s value more tangible.',
        ],
      },
      {
        heading: 'Testing the first impression',
        body: [
          {
            image: {
              src: '/noxs/variants.jpg',
              caption:
                'The whole test, in one frame. Everything below the headline is identical; what changed is the framing and the second button. A visitor who already knows the category gets “intelligence layer above your tech infrastructure” from A, and everyone else gets “AI Delivery Assistant” from B — and the second one is the one that shipped.',
              label: 'Variant A (conceptual) against variant B (direct) — same page, two hero framings',
              alt: 'The two NOXS hero variants side by side: variant A reading Intelligence layer above your tech infrastructure, variant B reading AI Delivery Assistant',
              // Close to the image's own 2.8:1. At the 16:9 default this would
              // scale to fit the height and then crop 720px off the sides, which
              // is most of both variants — the comparison is the whole point of
              // the image and cropping either half destroys it.
              ratio: 'aspect-[2.8/1]',
            },
          },
          'The hero section was particularly important. For a lead-generation landing page, the first screen needs to communicate the product’s value quickly and give visitors a clear next step.',
          'Instead of relying only on intuition, I tested two different approaches:',
          {
            sub: {
              number: 'A',
              heading: 'Conceptual',
              body: [
                'Positioned NOXS as a strategic technology layer and introduced the product more conceptually.',
              ],
            },
          },
          {
            sub: {
              number: 'B',
              heading: 'Direct',
              body: [
                'Explained what NOXS does more explicitly and focused on the immediate benefit.',
              ],
            },
          },
          'Both variants used the same supporting paragraph, but differed in headline framing, CTA hierarchy, and supporting elements.',
        ],
      },
      {
        heading: 'What the data showed',
        body: [
          'I used Google Analytics to track conversion behavior and Hotjar to analyze scroll depth and interaction through heatmaps. The direct, benefit-oriented version performed better in overall engagement and conversion.',
          'The testing also revealed several useful patterns:',
          {
            list: [
              'a shorter, action-oriented headline improved clarity for new visitors',
              'users interacted more with the main section in the direct version',
              'adding a secondary CTA increased views',
              'communicating monetary benefits increased interest in booking a demo',
            ],
          },
          {
            note: 'For a complex B2B product, clarity can be more persuasive than sophistication.',
          },
        ],
      },
      {
        heading: 'Visual direction',
        body: [
          {
            image: {
              src: '/noxs/visual.jpg',
              caption:
                'The product visual doing the explaining: a gradient field, a release-notes action, a task marked approved and the sprint board it came from. It is the only part of the page that shows the product doing something, and it sits beside the headline rather than below it.',
              label: 'The NOXS visual system — clarity, technology, structure, trust',
              alt: 'The NOXS product visual — a gradient field with a release-notes action, an approved task notification and a sprint board',
              // 16:10, matching the crop's own 1.63:1. At the 16:9 default the
              // sides trim ~4%, which is nothing; this is only set so the box
              // does not crop the notification and the release-notes action out
              // of frame at narrower widths where the default pulls harder.
              ratio: 'aspect-16/10',
            },
          },
          'The visual system was designed to communicate the same qualities the product promised:',
          {
            sub: {
              heading: 'Clarity',
              body: ['Clean hierarchy and concise information.'],
            },
          },
          {
            sub: {
              heading: 'Technology',
              body: ['Modern UI patterns and product-focused visuals.'],
            },
          },
          {
            sub: {
              heading: 'Structure',
              body: ['Organized layouts that make complex information easier to scan.'],
            },
          },
          {
            sub: {
              heading: 'Trust',
              body: [
                'Concrete capabilities, integrations, use cases, and outcomes rather than abstract AI messaging.',
              ],
            },
          },
          'The result was a landing page designed to feel sophisticated without becoming difficult to understand.',
        ],
      },
      {
        heading: 'Designed for implementation',
        body: [
          'The final layouts were prepared with responsive behavior and Webflow development in mind. The design system and page structure were built to support:',
          {
            list: [
              'responsive layouts',
              'reusable components',
              'interactive sections',
              'clear CTA patterns',
              'feature and use-case sections',
              'conversion-focused content hierarchy',
            ],
          },
          'This allowed the visual design to translate into a practical marketing website rather than remaining a static concept.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          'The project resulted in a B2B SaaS landing page that combined product storytelling, visual design, and conversion experimentation.',
          'More importantly, the design decisions weren’t based entirely on subjective preference. The A/B test demonstrated that visitors responded better to a more direct explanation of the product and its benefits. This gave the team a clearer direction for future iterations of the website.',
        ],
      },
      {
        heading: 'What I learned',
        body: [
          {
            sub: {
              heading: 'Clarity beats complexity',
              body: [
                'When the product itself is technically complex, the website doesn’t need to be. The testing showed that first-time visitors responded better when the product’s value was communicated directly rather than conceptually.',
              ],
            },
          },
          {
            sub: {
              heading: 'Design decisions should be testable',
              body: [
                'The A/B test turned a subjective question — which hero feels better? — into a measurable product question.',
              ],
            },
          },
          {
            sub: {
              heading: 'Product and marketing need to work together',
              body: [
                'For B2B SaaS, the website sits between product understanding and business goals. Working closely with product and marketing helped balance technical accuracy with a clear commercial proposition.',
              ],
            },
          },
        ],
      },
    ],
    pullquote:
      'For a complex B2B product, clarity can be more persuasive than sophistication.',
    pullquoteBy: 'What the A/B test showed',
  },
]

// The `testimonials` array lived here and has been removed with the "Words from"
// section that rendered it. It held two quotes attributed to a named person at
// a named company. Nothing else in the app referenced it.

export function getProject(slug) {
  return projects.find((p) => p.slug === slug)
}

export function getAdjacentProjects(slug) {
  const i = projects.findIndex((p) => p.slug === slug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: projects[(i - 1 + projects.length) % projects.length] ?? null,
    next: projects[(i + 1) % projects.length] ?? null,
  }
}
