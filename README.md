# ResearchDNA

ResearchDNA is an early product prototype for turning a researcher's papers, code, projects and milestones into a structured **Research DNA** and a physical/digital collectible concept.

## Current version

`v0.3.0`

Current prototype features:

- English / 中文 / Français switching
- Responsive landing page
- Interactive Create flow
- Step 1: basic researcher identity
- Step 2: optional research sources — users can skip uploads
- Step 3: starter Research DNA
- Editable signature research objects
- Collectible preview
- Static deployment support for Vercel / GitHub Pages

> The current analysis is a front-end prototype. It does not yet send files to a backend or run a real AI model.

## Project structure

```text
researchdna/
├── index.html
├── styles.css
├── app.js
├── i18n.js
├── assets/
│   └── images/
├── docs/
│   ├── DEVELOPMENT.md
│   └── ROADMAP.md
├── .gitignore
├── .nojekyll
├── vercel.json
├── VERSION
├── CHANGELOG.md
└── README.md
```

## Run locally

The simplest option is to open `index.html` directly.

For a local web server, from this directory run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Git workflow

After copying these files into your local `researchdna` directory:

```bash
git status
git add .
git commit -m "Initialize ResearchDNA website v0.3"
git branch -M main
git push
```

For future development:

```bash
git switch -c feature/my-feature
# edit files
git add .
git commit -m "Add my feature"
git push -u origin feature/my-feature
```

Merge the feature branch into `main` when ready. If the GitHub repository is connected to Vercel, every push to `main` updates the production site automatically, while feature branches receive preview deployments.

## Language links

English:

```text
https://your-domain.com/
```

Chinese:

```text
https://your-domain.com/?lang=zh
```

French:

```text
https://your-domain.com/?lang=fr
```

## Next product milestones

See [`docs/ROADMAP.md`](docs/ROADMAP.md).
