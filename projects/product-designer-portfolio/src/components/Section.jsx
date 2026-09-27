export default function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-neutral-200 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-5xl px-6">
        <h2 className="mb-10 text-sm font-semibold tracking-[0.2em] text-neutral-400 uppercase">
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}
