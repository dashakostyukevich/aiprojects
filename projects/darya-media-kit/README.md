# Darya's Diary — Media Kit

Rebuild of the Webflow media kit at `daryas-diary.webflow.io`, as static
HTML/CSS/JS. No build step, no dependencies, no framework.

```
open index.html            # or: python3 -m http.server 8000
```

## Structure

```
index.html
admin/
  index.html               # the editing screen, at <site>/admin/
  config.yml               # what the editing screen shows, field by field
content/content.json       # ALL the content — this is what you edit
assets/
  css/style.css            # design tokens + all component styles
  js/data.js               # built-in copy of the content, used only as a fallback
  js/main.js               # loading, rendering, interaction
  uploads/                 # images added through the editing screen
  work/                    # UGC video covers
  photo-*.avif             # UGC photography stills
  about-*.avif             # about-section images
  hero.mp4, footer-banner.mp4
deploy.sh                  # publishes to Netlify — see Deploying
netlify.toml               # publish dir + cache headers
```

## Editing content

**You do not need to touch any file.** Everything on the page is edited at
**<https://darya-media-kit.netlify.app/admin/>** — name, links, stats, videos,
photos, brands, packages and prices. Change something, press Publish, and the live
site rebuilds about a minute later.

Everything on the page lives in one file, `content/content.json`, and
`admin/config.yml` describes it as a form. The page reads the JSON at runtime, so
nothing is baked into the HTML.

| Key | What it drives |
| --- | --- |
| `SITE` | name, email, socials, hero text, browser title, description, stats, footer |
| `WORK` | the videos, grouped by the category tabs |
| `PHOTOS` | the photography grid; `cat` generates the filter chips |
| `BRANDS` | the brand grid and the scrolling marquee |
| `PACKAGES` | the package cards and their prices |
| `ADDONS` | the add-on list |

### `assets/js/data.js` is a fallback, not the source

It holds a copy of the same content and is only used if `content/content.json`
fails to load — a fresh clone, a bad path, a dropped connection. That way the site
always renders a complete page rather than an empty shell. Keep it in step with
`content.json` if you hand-edit either one.

### One-time Netlify setup for editing

Editing needs two switches in the Netlify dashboard, per site:

1. **Site configuration → Identity & Access → Identity → Enable identity**
2. **Same page → Services → Git Gateway → Enable**

Git Gateway is what carries a published save back to the site. Until it is on,
`/admin` shows a note saying exactly this rather than a bare error.

### The prices are placeholders

`$100 / $240 / $600` and every add-on figure are invented to show the layout
working. **Replace them with your real rates before publishing** — either through
`/admin`, or in the `PACKAGES` and `ADDONS` blocks of `content/content.json`.

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

- **Content loads at runtime.** `main.js` fetches `content/content.json` and
  renders from it, falling back to `assets/js/data.js` if that fails. The HTML
  ships the real text as a fallback, so the page reads correctly even if the
  fetch never completes.
- **Filters** are generated from the `cat` values in the data. Adding a new
  category to `PHOTOS` or `WORK` makes a new chip appear; you don't touch the HTML.
- **Content is escaped on the way in.** Since content is now typed by hand in a
  web form, every string is HTML-escaped before it goes into the page. A stray `<`
  in a brand name shows as a character, not as markup.
- **Stat figures** are plain numbers in the CMS (`6.47`) and the site adds the
  formatting, so the count-up animation always ends on the value that was typed.
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

### Deploying by hand

Run the script from this folder:

```sh
./deploy.sh                          # production deploy
./deploy.sh --draft                  # draft URL, leaves the live site alone
./deploy.sh --msg "fix pricing copy"  # attach a message to the deploy
./deploy.sh --help
```

One-time setup, if you ever need to redo it on another machine:

```sh
npm i -g netlify-cli   # the CLI is global, not a project dependency
netlify login          # opens a browser to approve
netlify link           # ties this folder to the site
```

The script fails with a readable message rather than a CLI stack trace if
`netlify-cli` is missing or the folder is not linked, and it warns when there
are uncommitted changes in the folder — deploying publishes whatever is on
disk, not just what is committed.

Any static host works too — drag the folder onto Netlify.

### Visitor access was switched off

The new site shipped returning **401 on every path**: the team account has
`sso_login: true`, which Netlify applies to new sites, so the site was only
visible to logged-in team members. Fixed with:

```sh
netlify api updateSite --data '{"site_id":"bc483233-ab33-4d5d-a124-9e8dc296cf34","body":{"sso_login":false}}'
```

If a redeploy ever comes back 401 again, check that flag first.

### The site is not connected to git

`deploy.sh` publishes with the CLI, and the Netlify site has **no repository
linked** — so nothing rebuilds on its own when a file changes. That matters for
editing: Decap's Git Gateway backend needs a repo to commit to.

To connect it:

1. Push this folder's contents to a repository.
2. Netlify → **Site configuration → Git → Connect repository**, pick that repo
   and the branch. Netlify reads `netlify.toml` from the repo root, so if the
   site lives in a subfolder of a larger repo, the root config needs
   `publish = "path/to/this-folder"`.

After that, `/admin` works and `deploy.sh` becomes optional.

Remember to swap the placeholder prices first.