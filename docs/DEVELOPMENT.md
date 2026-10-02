# Development workflow

## Daily workflow

```bash
git pull
# edit files
python -m http.server 8000
# review http://localhost:8000

git status
git add .
git commit -m "Describe the change"
git push
```

## Recommended branches

- `main` — production website
- `feature/...` — isolated features and experiments

For the current solo-development stage, a separate `dev` branch is optional. Feature branches plus Vercel preview deployments are enough.

## Important rule

Do not commit private CVs, unpublished papers, API keys, tokens or `.env` files into the public repository.

## Releasing a version

Update `VERSION` and `CHANGELOG.md`, then:

```bash
git add VERSION CHANGELOG.md
git commit -m "Release v0.4.0"
git tag v0.4.0
git push
git push origin v0.4.0
```
