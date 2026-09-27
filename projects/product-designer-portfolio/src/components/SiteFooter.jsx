import { profile } from '../data.js'

export default function SiteFooter() {
  return (
    <footer id="contact" className="scroll-mt-20 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto w-full max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Let’s work together
        </h2>
        <a
          href={`mailto:${profile.email}`}
          className="mt-4 inline-block text-lg text-neutral-600 underline underline-offset-4 hover:text-neutral-900"
        >
          {profile.email}
        </a>
        <div className="mt-10 flex flex-wrap gap-5 text-sm text-neutral-500">
          {profile.links.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-neutral-900">
              {l.label}
            </a>
          ))}
        </div>
        <p className="mt-12 text-sm text-neutral-400">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  )
}
