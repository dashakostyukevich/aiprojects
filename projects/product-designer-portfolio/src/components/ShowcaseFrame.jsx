import { hero } from '../data.js'

// Optional showcase frame for the first screen: a soft pastel gradient across the
// full viewport, with a white rounded canvas floating on top of it.
//
// The gradient is deliberately outside the design system palette (design.md §2
// is one accent plus neutrals, for UI chrome), so this is opt-in. With
// `hero.frame: false` the children render directly on the page background.
export default function ShowcaseFrame({ children }) {
  if (!hero.frame) {
    return <div className="bg-bg">{children}</div>
  }

  const { maxWidth, radius, marginY, marginX } = hero.canvas

  return (
    <div
      className="min-h-screen"
      style={{
        // Decorative only: a soft sky-to-white gradient, per the first-screen
        // reference. Never used for UI chrome.
        backgroundImage: `linear-gradient(160deg, ${hero.gradient[0]} 0%, ${hero.gradient[1]} 48%, ${hero.gradient[2]} 100%)`,
        paddingBlock: `${marginY}px`,
        // Side margin lives on the wrapper, so the canvas can be a plain
        // centred 100% width without overflowing. The 5vw alone would leave
        // too little canvas on a phone, hence the floor.
        paddingInline: `max(20px, ${marginX})`,
      }}
    >
      <div
        className="mx-auto w-full bg-white shadow-[0_24px_60px_rgb(0_0_0/0.08)]"
        style={{ maxWidth: `${maxWidth}px`, borderRadius: `${radius}px` }}
      >
        {children}
      </div>
    </div>
  )
}
