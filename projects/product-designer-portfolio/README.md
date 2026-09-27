# product-designer-portfolio

One-page portfolio site for a product designer. React + Vite + Tailwind CSS v4, static build,
ready to deploy on Netlify.

## Commands

```sh
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the built dist/ locally
npm run lint     # oxlint
```

## Editing content

All copy lives in `src/data.js` — name, bio, links, services, experience, projects,
testimonials. The page in `src/App.jsx` reads from it, so replacing the placeholders normally
means editing that one file.

Project cards currently use gradient blocks as stand-ins for real screenshots. To add images,
drop files in `public/` (e.g. `public/work/atlas.png`) and swap the `<div>` with the gradient in
`src/App.jsx` for an `<img>`.

## Deploying to Netlify

`netlify.toml` is already set up: build command `npm run build`, publish directory `dist`, plus a
SPA redirect so deep links work.

1. Push the project to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project** and pick the repo. The
   `netlify.toml` is detected automatically, so no manual build settings needed.
3. Deploy. Any push to the connected branch redeploys.

For a quick throwaway preview without GitHub, `npx netlify deploy` works too.
