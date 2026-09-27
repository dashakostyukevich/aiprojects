// Swap these placeholders for your real details. Everything on the page reads
// from here, so editing this file is usually all you need.

export const profile = {
  name: 'Alex Morgan',
  role: 'Product Designer',
  // Hero headline, first screen. One paragraph read as an inline flow, with
  // `em` for italic spans and `chip` for the inline elements. Chips sit in a
  // word slot, so the line count is emergent: three lines at the spec's ~780px
  // measure. A part is either { text, em? } or { chip, ...props }.
  headline: [
    { text: 'I design calm, ' },
    { text: 'useful interfaces ', em: true },
    { chip: 'icon' },
    { text: ' for ' },
    { chip: 'photo', src: null, alt: 'Field research, week two' },
    { text: 'complex products', em: true },
    { chip: 'block', colors: ['accent', 'sky'] },
    { text: ' that people actually enjoy using.' },
  ],
  // §3 text-display-xl statement. Each line stays on one row and bleeds off an
  // edge, so the second half reads as an intentional crop rather than a wrap.
  statement: ['Structure first,', 'personality on top.'],
  tagline: 'I design calm, useful interfaces for complex products.',
  location: 'Berlin, Germany',
  email: 'hello@example.com',
  availability: 'Open to new projects — 2026',
  bio: [
    'Placeholder bio. I am a product designer with X years of experience turning messy, ambiguous problems into software people actually enjoy using.',
    'I work end to end: research and framing, flows and wireframes, high-fidelity UI, then shipping alongside engineers and measuring what happens after launch.',
  ],
  links: [
    { label: 'Email', href: 'mailto:hello@example.com' },
    { label: 'Dribbble', href: 'https://dribbble.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'GitHub', href: 'https://github.com' },
  ],
}

// Optional showcase frame for the first screen: a soft pastel gradient behind a
// white rounded canvas. The gradient is deliberately NOT in the design system
// palette (§2), so it is opt-in. Set `frame: false` to drop the frame and let
// the first screen sit directly on the design system background.
export const hero = {
  frame: true,
  gradient: ['#cfe6f7', '#ffffff', '#eef3fa'],
  canvas: {
    maxWidth: 1140,
    radius: 28,
    marginY: 64,
    marginX: '5vw',
  },
}

// Nav is the §5 pill/outline variant: three outlined pills on the right, a bare
// icon mark on the left with no wordmark. Not sticky, per the first-screen spec.
export const nav = [
  ['Projects', '/#work'],
  ['About', '/#about'],
  ['Contact', '/#contact'],
]

export const services = [
  {
    title: 'Product design',
    body: 'End-to-end design for web and mobile features, from problem framing to polished UI.',
  },
  {
    title: 'Design systems',
    body: 'Component libraries, tokens and documentation that keep design and engineering in sync.',
  },
  {
    title: 'Research & strategy',
    body: 'User interviews, usability testing and product direction grounded in evidence.',
  },
]

export const experience = [
  {
    company: 'Northwind Labs',
    role: 'Senior Product Designer',
    period: '2022 — Present',
    notes: 'Led design for the analytics platform used by 40k teams. Built the first shared design system.',
  },
  {
    company: 'Fieldnote',
    role: 'Product Designer',
    period: '2019 — 2022',
    notes: 'Designed mobile onboarding and the offline sync engine experience. Cut first-week churn by a third.',
  },
  {
    company: 'Studio Kern',
    role: 'UI Designer',
    period: '2017 — 2019',
    notes: 'Client work across fintech and healthcare. Learned to love constraints and typography.',
  },
]

// Each project has a `slug` that becomes its URL: /work/<slug>
// `summary`, `outcome` and `tags` are used on the work grid; the rest is the
// long-form case study shown on the project page.
export const projects = [
  {
    slug: 'atlas-analytics',
    title: 'Atlas Analytics',
    year: '2025',
    summary:
      'Redesigned the reporting experience for a data platform: faster filters, clearer empty states, and a chart builder non-analysts could use.',
    outcome: 'Time to first insight cut from 6 min to 90 s',
    tags: ['Product design', 'Design system', 'Data viz'],
    kind: 'brand',
    fill: 'terracotta',
    lockup: 'Atlas',
    image: null,
    cover: null,
    meta: {
      role: 'Lead product designer',
      timeline: '8 months',
      team: '1 PM, 4 engineers, 1 data scientist',
      platform: 'Web app',
      status: 'Shipped',
    },
    intro: [
      'Atlas is a reporting product for teams that do not have an analyst on staff. Before this project, using it well meant learning a query language. The brief was to make reporting feel obvious.',
      'I owned the redesign end to end: discovery, interaction model, visual design, and the design system work needed to ship it across four squads without them each inventing their own patterns.',
    ],
    sections: [
      {
        heading: 'The problem',
        body: [
          'Support tickets told the story better than the roadmap did. People were opening the product, staring at an empty dashboard, and leaving. In session tests, six of eight participants could not produce their first chart without help.',
          'The existing filter panel exposed all 40 filter types at once. The chart builder assumed you already knew which aggregation you wanted. And the empty state said “No data,” which was technically true and completely useless.',
        ],
      },
      {
        heading: 'What I did',
        body: [
          'I started with 14 interviews and 6 moderated sessions, then mapped every path from landing to saved report. Three problems showed up in every single one.',
          'I proposed a progressive filter model: a single search field that surfaces relevant filters as you type, with the five most common ones pinned. Behind it, the full power set stayed one click away for people who knew what they wanted.',
          'The chart builder got the opposite treatment. Instead of a blank canvas, it opened with three suggested charts based on the columns in the dataset, each one a starting point you could edit rather than a template you had to configure.',
          'Empty states were rewritten as next actions: a sample report to explore, an import button, or a link to the column that was missing — whichever matched why the state was empty.',
        ],
      },
      {
        heading: 'Shipping it',
        body: [
          'The riskiest part was that this touched four squads at once. I built the filter model and chart builder first, then extracted them into the design system with tests in Storybook, and migrated each squad behind feature flags.',
          'Two things made that work: shipping the visual language as tokens rather than screenshots, so engineers could pull the new values without asking; and writing migration notes per squad instead of one document everyone had to read.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          'Median time to first saved report went from just under six minutes to ninety seconds. Weekly report creators grew 34% in the quarter after launch, and dashboard abandonment dropped by half.',
          'The empty-state work paid off fastest: users who hit an empty state were three times more likely to come back the next day than before.',
        ],
      },
      {
        heading: 'What I would do differently',
        body: [
          'I would have started the research eight weeks earlier. Most of the delay in the first month was learning the domain, and that knowledge would have sharpened the earlier design work.',
        ],
      },
    ],
    pullquote: '“The first week Alex was here, our PM stopped defending the redesign roadmap and started defending the research.”',
    pullquoteBy: 'Priya Raman, VP Product',
  },
  {
    slug: 'fieldnote-mobile',
    title: 'Fieldnote Mobile',
    year: '2024',
    summary:
      'Offline-first field research app. Designed the sync model UI, gesture-based capture, and a map that works with no signal.',
    outcome: '4.8★ across 2k reviews, 3x weekly active use',
    tags: ['Mobile', 'iOS / Android', 'Research'],
    kind: 'photo',
    fill: 'sky',
    lockup: null,
    image: null,
    cover: null,
    meta: {
      role: 'Product designer',
      timeline: '5 months',
      team: '1 PM, 3 engineers',
      platform: 'iOS and Android',
      status: 'Shipped',
    },
    intro: [
      'Field researchers take notes in places with no signal: basements, forests, remote sites. The previous app was online-first, which meant lost notes and a lot of quiet frustration.',
      'I designed the offline experience end to end — what the app admits it cannot do, how it tells the truth about that, and the capture interactions fast enough to use one-handed in the rain.',
    ],
    sections: [
      {
        heading: 'The problem',
        body: [
          'Field researchers were keeping a paper notebook as backup. Not because they preferred paper, but because they did not trust the app with the one thing they were there to collect.',
          'Every sync edge case leaked into the interface: spinner states that never resolved, photos silently failing to upload, no way to tell which notes had made it off the device.',
        ],
      },
      {
        heading: 'What I did',
        body: [
          'I spent four days shadowing researchers on live site visits. The observation that changed the design: they never look at the app while recording. Capture had to work without any of their attention.',
          'So the capture flow became a single gesture — a swipe up from the bottom edge to start, voice or text, a flick to save. Nothing requires a target, nothing requires reading.',
          'Sync became a visible, honest inbox. Every item shows one of three states — saved here, uploading, synced — and nothing is ever removed from the device until the server confirms it.',
        ],
      },
      {
        heading: 'Shipping it',
        body: [
          'Sync conflict resolution is where most of the engineering time went. I designed the states, not the resolution algorithm, and let engineering choose the merge strategy. We agreed on naming early so the UI vocabulary matched what engineers called things internally.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          'Weekly active use tripled. The app holds a 4.8 rating across 2,000 reviews, and the most common review text mentions not losing work — which is exactly the promise we set out to keep.',
        ],
      },
    ],
    pullquote: '“I stopped bringing the paper notebook. That is the whole review.”',
    pullquoteBy: 'Field researcher, beta programme',
  },
  {
    slug: 'kern-type-system',
    title: 'Kern Type System',
    year: '2023',
    summary:
      'An open-source variable font and pairing guide for product teams, including a token pipeline for Figma and CSS.',
    outcome: '3.4k weekly downloads',
    tags: ['Typography', 'Open source', 'Tooling'],
    kind: 'brand',
    fill: 'navy',
    lockup: 'Kern',
    image: null,
    cover: null,
    meta: {
      role: 'Creator',
      timeline: 'Ongoing side project',
      team: 'Solo, with 30 contributors',
      platform: 'Web, Figma, CSS',
      status: 'Active',
    },
    intro: [
      'Every product team I joined reinvented type scales and pairing rules, badly, from scratch. Kern is my attempt to publish one opinionated answer and make it easy to adopt.',
      'It is a variable font family, a scale generator, and a token pipeline that outputs the same numbers to Figma and to CSS.',
    ],
    sections: [
      {
        heading: 'The problem',
        body: [
          'Type scales in most design systems are a set of magic numbers with no rationale. Change the base size and everything breaks, so nobody changes the base size, so the scale drifts from the product it is supposed to serve.',
        ],
      },
      {
        heading: 'What I did',
        body: [
          'I built the scale around a modular ratio with a fixed step count, so there are never more than seven sizes regardless of viewport. Each step carries a named role — body, caption, title — not a number.',
          'The token pipeline reads one JSON file and writes both Figma variables and CSS custom properties, which means the design library and the codebase cannot disagree about type.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          '3,400 weekly downloads, 30 contributors, and used in production by six teams I know of. The most satisfying result is that the contribution model works: people send pull requests with new pairings and test cases.',
        ],
      },
    ],
    pullquote: null,
    pullquoteBy: null,
  },
  {
    slug: 'pulse-onboarding',
    title: 'Pulse Onboarding',
    year: '2023',
    summary:
      'Reworked signup into a progressive flow that asks for nothing until it is needed, with sample data instead of empty dashboards.',
    outcome: 'Activation +27%',
    tags: ['Growth', 'UX writing', 'Prototyping'],
    kind: 'brand',
    fill: 'accent',
    lockup: 'Pulse',
    image: null,
    cover: null,
    meta: {
      role: 'Product designer',
      timeline: '10 weeks',
      team: '2 PMs, 3 engineers',
      platform: 'Web app',
      status: 'Shipped',
    },
    intro: [
      'Pulse is a team feedback tool. New accounts landed on an empty dashboard, and the first thing the product asked them to do was invite a colleague — before they had any value to show.',
      'I redesigned signup around one idea: show the product working before asking for anything.',
    ],
    sections: [
      {
        heading: 'The problem',
        body: [
          'Signup asked for a company name, a team size, a role, and three integration choices. Median completion was 41%, and the people who finished were not meaningfully more likely to activate than the people who did not.',
          'So the fields were not the real problem. The empty dashboard was.',
        ],
      },
      {
        heading: 'What I did',
        body: [
          'New accounts now start with a worked example: three realistic feedback items in a live-looking dashboard that the user is invited to change rather than set up.',
          'Signup dropped to email and password. Company details moved to a short prompt after the first login, framed as “what should we call your workspace” instead of a form.',
          'I wrote all of it. The copy change was not decoration — “create your first board” became “this is your board, change anything in it,” and completion of that first edit is what we now track as activation.',
        ],
      },
      {
        heading: 'Outcome',
        body: [
          'Signup completion rose to 68%, and activation within seven days rose 27%. The invite step that used to come first now comes after the first edit, and invite rate is higher because the ask has context.',
        ],
      },
    ],
    pullquote: null,
    pullquoteBy: null,
  },
]

export const testimonials = [
  {
    quote:
      'Alex turns vague problems into shipped product. Rare combination of craft and follow-through.',
    name: 'Priya Raman',
    title: 'VP Product, Northwind Labs',
  },
  {
    quote: 'The design system work paid for itself in the first quarter.',
    name: 'Jonas Weber',
    title: 'Engineering Lead, Fieldnote',
  },
]

// Display section below the first screen: a headline row (display type left,
// supporting paragraph right, bottom-aligned) over a composition of three
// overlapping shapes. Layout and spacing follow the reference spec; colours,
// fonts and copy are this project's.
export const display = {
  // Two lines. `accent: true` gets the §3 highlight treatment.
  headline: {
    line1: 'transform.',
    line2: [
      { text: 'connect.', accent: true },
      { text: ' create.' },
    ],
  },
  body: 'Product designer working end to end: research and framing, interface design, and the design systems that get it shipped.',
  // Sits in the lime blob. A short line, because the blob is small and
  // overlapped. It is the second testimonial, which also appears in the About
  // section, so swap it if you would rather not repeat it.
  quote: testimonials[1],
  // Sits in the dark circle, with one real link.
  cta: {
    line: 'Read the full process',
    link: { label: 'see the case study', to: '/work/atlas-analytics' },
  },
}

// §5/§6 "Random-things" collage for the About section. Card sub-types come
// from the design system — illustration, photo, quote, badge, stat — and no two
// adjacent cards should be the same type.
//
// `pos` is a percentage box on the invisible 12-col grid, desktop only. Mobile
// ignores it and stacks the cards in a 2-column masonry in array order.
// Cards cluster near the edges; the middle vertical band is left clear so the
// headline stays legible (§6.4).
export const collage = [
  // Top cluster.
  {
    type: 'stat',
    figure: '40k',
    label: 'teams use Atlas daily',
    fill: 'ink',
    pos: { left: 0, top: 2, width: 15 },
    rotate: -3,
  },
  {
    type: 'illustration',
    title: 'Doodle: filter to insight',
    caption: 'Pen on paper, day 3',
    fill: 'surface',
    pos: { left: 20, top: 0, width: 16 },
    rotate: 2,
  },
  {
    type: 'badge',
    label: 'Shipped it',
    detail: '8 months, 4 squads',
    fill: 'accent',
    pos: { left: 62, top: 1, width: 14 },
    rotate: 3,
  },
  {
    type: 'photo',
    title: 'Workshop wall',
    caption: 'Journey map, week 2',
    fill: 'sky',
    pos: { left: 80, top: 7, width: 19 },
    rotate: -2,
  },
  // Mid-height cards, hard against the edges only.
  {
    type: 'quote',
    quote: 'Does this survive a bad signal?',
    name: 'Field researcher',
    fill: 'sand',
    pos: { left: 0, top: 36, width: 16 },
    rotate: -2,
  },
  {
    type: 'stat',
    figure: 'x3',
    label: 'weekly active use',
    fill: 'terracotta',
    pos: { left: 83, top: 38, width: 16 },
    rotate: 2,
  },
  // Bottom cluster.
  {
    type: 'badge',
    label: 'Open source',
    detail: '3.4k weekly downloads',
    fill: 'sand',
    pos: { left: 2, top: 68, width: 16 },
    rotate: 3,
  },
  {
    type: 'photo',
    title: 'Type specimen',
    caption: 'Kern, 14 sizes',
    fill: 'sky',
    pos: { left: 22, top: 73, width: 18 },
    rotate: -3,
  },
  {
    type: 'illustration',
    title: 'Doodle: three states',
    caption: 'Saved / uploading / synced',
    fill: 'surface',
    pos: { left: 46, top: 68, width: 17 },
    rotate: 2,
  },
  {
    type: 'quote',
    quote: 'I stopped bringing the paper notebook.',
    name: 'Beta tester',
    fill: 'ink',
    pos: { left: 70, top: 74, width: 20 },
    rotate: -2,
  },
]

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
