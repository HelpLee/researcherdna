# ResearcherDNA

**Your Research Matters. Make It Tangible.**

ResearcherDNA is an early product prototype for turning a researcher's papers, code, projects and milestones into a structured **Researcher DNA** and a physical/digital collectible concept.

## Current version

`v0.4.0`

### What changed in v0.4

- Brand display unified as **ResearcherDNA**
- Internal development naming remains lowercase `researcherdna`
- New brand slogan: **Your Research Matters. Make It Tangible.**
- Brighter, more colorful visual system while keeping an academic/research feel
- Refined homepage hierarchy and collectible presentation
- Clearer four-step Create flow
- No-upload fast-start path preserved
- Redesigned Researcher DNA and final-output sections
- Added a research word cloud derived from approved CV, paper, GitHub, Scholar and ResearchGate sources
- Added ten traceable signature-object candidates with researcher-controlled selection of 3–5 objects
- Added an always-visible privacy promise plus a fuller privacy and purpose-limitation section
- Added public prototype contact: **lahoule · lahoule.lee@gmail.com**
- English / 中文 / Français language switching polished for typography and spacing
- French and Chinese hero typography have dedicated responsive rules
- Public demo identity is labeled **lahoule lee**, while institutional and research details remain illustrative
- Prototype prices are intentionally shown as **XX** until manufacturing and pricing are validated

> The current AI analysis is still a front-end prototype. It does not yet send files to a backend or run a real AI model.

## Brand naming rule

Use the following convention consistently:

```text
Public brand display: ResearcherDNA
Concept name:         Researcher DNA
Repository / folder:  researcherdna
URL slug:             researcherdna
Code identifiers:     researcherDna / researcherdna-*
```

Developers do not need to preserve the public-brand capitalization in filenames, paths, CSS classes or URLs.

## Project structure

```text
researcherdna/
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

From the project root:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Language-specific local URLs:

```text
English  http://localhost:8000/
中文     http://localhost:8000/?lang=zh
Français http://localhost:8000/?lang=fr
```

## Normal update workflow

After copying v0.4 files into your existing local `researcherdna` repository:

```bash
git status
git add .
git commit -m "Upgrade ResearcherDNA website to v0.4"
git push
```

If `main` is connected to Vercel, the production website redeploys automatically after the push.

For larger changes, use a feature branch:

```bash
git switch -c feature/my-feature
# edit files
python -m http.server 8000

git add .
git commit -m "Add my feature"
git push -u origin feature/my-feature
```

Vercel can create a preview deployment for the feature branch. Merge it into `main` when ready.

## Release workflow

For a named release:

```bash
git add .
git commit -m "Release ResearcherDNA v0.4.0"
git push

git tag v0.4.0
git push origin v0.4.0
```

## Deployment model

```text
Local researcherdna folder
        ↓ git push
GitHub repository
        ↓ automatic deployment
Vercel
        ↓
Public ResearcherDNA website
```

The public URL stays the same while the deployed version updates.

## Important security rule

Never commit private CVs, unpublished papers, API keys, access tokens, secrets or `.env` files into the public repository.

## Next product milestone

See [`docs/ROADMAP.md`](docs/ROADMAP.md).
