# ResearcherDNA development workflow

## Daily workflow

```bash
cd path/to/researcherdna
git pull

# edit files
python -m http.server 8000
# review http://localhost:8000
# also review ?lang=zh and ?lang=fr

git status
git add .
git commit -m "Describe the change"
git push
```

If GitHub `main` is connected to Vercel, pushing to `main` updates the live website automatically.

## Recommended branch strategy

- `main` — production website
- `feature/...` — isolated features and experiments

For a solo project, a separate `dev` branch is optional.

Example:

```bash
git switch -c feature/profile-card
# develop and test

git add .
git commit -m "Redesign profile card"
git push -u origin feature/profile-card
```

Review the Vercel preview, then merge into `main`.

## Multilingual QA

Before every release, check all three URLs:

```text
/?lang=en
/?lang=zh
/?lang=fr
```

Check:
- no English text remains unintentionally in Chinese/French pages
- buttons do not wrap awkwardly
- hero headings stay balanced
- cards keep equal heights
- navigation still fits on desktop
- mobile layout remains readable

## Brand rule

```text
Public: ResearcherDNA
Concept: Researcher DNA
Internal paths / repo / code: researcherdna
```

## Important security rule

Do not commit private CVs, unpublished papers, API keys, tokens, credentials or `.env` files into the public repository.

## Releasing a version

1. Update `VERSION`.
2. Update `CHANGELOG.md`.
3. Test English, Chinese and French locally.
4. Commit and push.
5. Add a Git tag.

```bash
git add .
git commit -m "Release ResearcherDNA v0.4.0"
git push

git tag v0.4.0
git push origin v0.4.0
```
