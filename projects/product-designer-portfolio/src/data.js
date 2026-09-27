// Swap these placeholders for your real details. Everything on the page reads
// from here, so editing this file is usually all you need.

export const profile = {
  name: 'Alex Morgan',
  role: 'Product Designer',
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

export const projects = [
  {
    title: 'Atlas Analytics',
    year: '2025',
    summary:
      'Redesigned the reporting experience for a data platform: faster filters, clearer empty states, and a chart builder non-analysts could use.',
    outcome: 'Time to first insight cut from 6 min to 90 s',
    tags: ['Product design', 'Design system', 'Data viz'],
    accent: 'from-indigo-500 to-sky-400',
  },
  {
    title: 'Fieldnote Mobile',
    year: '2024',
    summary:
      'Offline-first field research app. Designed the sync model UI, gesture-based capture, and a map that works with no signal.',
    outcome: '4.8★ across 2k reviews, 3x weekly active use',
    tags: ['Mobile', 'iOS / Android', 'Research'],
    accent: 'from-emerald-500 to-teal-300',
  },
  {
    title: 'Kern Type System',
    year: '2023',
    summary:
      'An open-source variable font and pairing guide for product teams, including a token pipeline for Figma and CSS.',
    outcome: '3.4k weekly downloads',
    tags: ['Typography', 'Open source', 'Tooling'],
    accent: 'from-rose-500 to-amber-300',
  },
  {
    title: 'Pulse Onboarding',
    year: '2023',
    summary:
      'Reworked signup into a progressive flow that asks for nothing until it is needed, with sample data instead of empty dashboards.',
    outcome: 'Activation +27%',
    tags: ['Growth', 'UX writing', 'Prototyping'],
    accent: 'from-violet-500 to-fuchsia-300',
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
