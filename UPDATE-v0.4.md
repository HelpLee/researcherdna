# Update your existing ResearcherDNA repository to v0.4

This package is designed to replace the website files inside your existing local `researcherdna` folder **without replacing the `.git` folder**.

> If you already copied an earlier draft of v0.4 locally but **have not pushed it to GitHub yet**, simply overwrite those draft files with this final v0.4 package. You do not need a second version number or a revert. Commit only after you finish the local check below.

## 1. Open your existing repository

```powershell
cd D:\path\to\researcherdna
```

Check the current state:

```powershell
git status
```

If you have unfinished local changes, commit them first or stash them before updating.

## 2. Create a safety branch before replacing files

Optional but recommended:

```powershell
git branch backup-before-v0.4
```

This preserves the current commit under a backup branch.

## 3. Copy the v0.4 files into the existing folder

Extract the v0.4 ZIP somewhere temporary.

Copy **the contents** of the extracted package into your existing `researcherdna` folder and allow Windows to replace files with the same names.

Do **not** delete or replace:

```text
researcherdna/.git/
```

Your final structure should still look like:

```text
researcherdna/
├── .git/
├── index.html
├── styles.css
├── app.js
├── i18n.js
├── README.md
├── CHANGELOG.md
├── UPDATE-v0.4.md
├── VERSION
├── vercel.json
├── assets/
└── docs/
```

## 4. Test locally before pushing

```powershell
python -m http.server 8000
```

Check:

```text
English
http://localhost:8000/

中文
http://localhost:8000/?lang=zh

Français
http://localhost:8000/?lang=fr
```

Also test:

```text
Create yours
→ Identity
→ No uploads yet
→ Researcher DNA
→ Replace a signature object
→ Preview
```

## 5. Review what changed

Stop the local server with `Ctrl+C`, then run:

```powershell
git status
git diff
```

## 6. Commit v0.4

```powershell
git add .
git commit -m "Release ResearcherDNA v0.4"
git push
```

If your production branch is `main`, Vercel should automatically deploy the new commit after GitHub receives the push.

## 7. Optional: create a version tag

```powershell
git tag v0.4.0
git push origin v0.4.0
```

## 8. Verify the public website

After Vercel finishes deploying, check your existing production URL in all three languages:

```text
https://researcherdna.vercel.app/
https://researcherdna.vercel.app/?lang=zh
https://researcherdna.vercel.app/?lang=fr
```

The domain remains the same. Only the deployed website version changes.

## Normal workflow after v0.4

For small changes:

```powershell
# edit locally
python -m http.server 8000
# test

git add .
git commit -m "Improve homepage"
git push
```

For a larger feature:

```powershell
git switch -c feature/my-feature
# develop and test

git add .
git commit -m "Add my feature"
git push -u origin feature/my-feature
```

Use the Vercel preview URL to review the branch, then merge it into `main` when ready.
