// Resolves a colour reference for data-driven artwork (collage cards, headline
// chips, project brand fills). Accepts a design system token name, which maps to
// the matching CSS variable, or a raw hex/CSS value passed straight through.
//
// Token names keep artwork tied to design.md. Raw hex exists because project
// brand cards are supposed to carry a client's real brand colour, which will not
// be in this palette.
const vars = {
  bg: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  ink: 'var(--color-ink)',
  sand: 'var(--color-sand)',
  accent: 'var(--color-accent)',
  sky: 'var(--color-sky)',
  terracotta: 'var(--color-terracotta)',
  navy: 'var(--color-navy)',
}

export function color(ref) {
  if (!ref) return undefined
  return vars[ref] ?? ref
}

// Tailwind class equivalents, for places where a class is needed rather than an
// inline value (project card fills, collage card fills).
const classes = {
  bg: 'bg-bg',
  surface: 'bg-surface',
  ink: 'bg-ink',
  sand: 'bg-sand',
  accent: 'bg-accent',
  sky: 'bg-sky',
  terracotta: 'bg-terracotta',
  navy: 'bg-navy',
}

export function colorClass(ref) {
  if (!ref) return undefined
  return classes[ref] ?? undefined
}
