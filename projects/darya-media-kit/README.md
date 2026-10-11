# Darya's Diary — Media Kit

Rebuild of the Webflow media kit at `daryas-diary.webflow.io`, as static
HTML/CSS/JS. No build step, no dependencies, no framework.

```
open index.html            # or: python3 -m http.server 8000
```

## Structure

```
index.html
assets/
  css/style.css            # design tokens + all component styles
  js/data.js               # work, photos, brands, packages (edit this)
  js/main.js               # rendering + interaction
  work/                    # 33 UGC video covers
  photo-*.avif             # UGC photography stills
  about-*.avif             # about-section images
  hero.mp4, footer-banner.mp4
```

## Editing content

All content lives in `assets/js/data.js`. No markup changes needed.

- **`window.WORK`** — UGC videos, grouped by category tab. `brand` is optional;
  blank means self-shot. `yt` is the YouTube id, `cover` the poster image. The
  group name becomes the category chip on each card and its filter chip.
- **`window.PHOTOS`** — photography stills. `cat` drives the filter chips, which
  are generated automatically from the categories present in the array.
- **`window.BRANDS`** — the brands grid. Adding a brand here also adds it to the
  scrolling marquee.
- **`window.PACKAGES`** / **`window.ADDONS`** — pricing.

### The prices are placeholders

`$100 / $240 / $600` and every add-on figure are invented to show the layout
working. **Replace them with your real rates before publishing.** They all live
in the `window.PACKAGES` and `window.ADDONS` blocks in `data.js`.

## Design system

Tokens live at the top of `style.css`.

| Token | Value | Used for |
| --- | --- | --- |
| `--cream` | `#efe5d7` | page background |
| `--cream-deep` | `#e4d9bd` | cards, footer, stats |
| `--ink` | `#171411` | body text, dark sections |
| `--red` | `#a6171b` | accent, buttons, eyebrows |
| `--yellow` | `#fcb70d` | script accents on dark sections |

Two typefaces, both self-hosted so there is no third-party font request:

- **Cabinet Grotesk** — everything
- **Nanum Brush Script** — the handwritten accents (`.script` class)

## Behaviour worth knowing

- **Filters** are generated from the `cat` values in the data. Adding a new
  category to `PHOTOS` or `WORK` makes a new chip appear; you don't touch the HTML.
- **Video lightbox** — clicking a work card loads the YouTube iframe on demand
  rather than at page load, so there are 33 fewer third-party requests up front.
  Escape and backdrop clicks close it.
- **Background video** doesn't autoplay below 768px — only the hero uses one.
- **`prefers-reduced-motion`** disables the marquee, reveal animations and the
  stat count-up; all content is visible without them.
- **The nav is transparent** over the hero and picks up a solid background once
  you scroll past it, matching the original.

## Two CSS traps worth knowing

Both cost real debugging time here, so they are commented in the source:

- **Grid ratios belong on the figure, not the image.** The photography lead tile
  spans two rows. With `aspect-ratio` on the `<img>` plus `height: 100%`, the row
  track sizes from its content while the content sizes from the row track, and
  the grid grows without bound. Put the ratio on the `<figure>` and let the image
  fill it.
- **`<figure>` has a UA margin of `1em 40px`.** Left unreset it silently eats most
  of a narrow grid cell — the tiles rendered 50px wide inside a 129px column. It
  is reset alongside `h1`–`p` in the reset block.

## Deploying

Published at **https://darya-media-kit.netlify.app** (site id `bc483233-ab33-4d5d-a124-9e8dc296cf34`,
team: dashakostyukevich’s team). `netlify.toml` holds the config and `.netlify/`
holds the site link, so there is no build step — the folder *is* the site.

```sh
npm i -g netlify-cli      # once
netlify deploy --prod --dir .
```

Any static host works too — drag the folder onto Netlify.

### Visitor access was switched off

The new site shipped returning **401 on every path**: the team account has
`sso_login: true`, which Netlify applies to new sites, so the site was only
visible to logged-in team members. Fixed with:

```sh
netlify api updateSite --data '{"site_id":"bc483233-ab33-4d5d-a124-9e8dc296cf34","body":{"sso_login":false}}'
```

If a redeploy ever comes back 401 again, check that flag first.

Remember to swap the placeholder prices first.