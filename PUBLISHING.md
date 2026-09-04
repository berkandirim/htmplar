# Publishing Guide

This document explains how to publish HTMplar packages to npm using GitHub Actions.

## 🎯 Publishing Methods

We have two GitHub Actions workflows for publishing:

### 1. **Manual Publish** (Recommended) 🎮

**File**: `.github/workflows/manual-publish.yml`

**Trigger**: Manual from GitHub UI

**Best for**:
- Controlled releases
- Alpha/beta releases
- Testing with dry-run
- Quick version bumps

**How to use**:

1. Go to GitHub Actions tab
2. Select "Manual Publish to npm"
3. Click "Run workflow"
4. Choose options:
   - **Version bump**: patch/minor/major/prerelease (or leave empty)
   - **npm tag**: latest/alpha/beta/next
   - **Dry run**: Test without publishing

### 2. **Automatic Publish with Changesets** 📦

**File**: `.github/workflows/publish.yml`

**Trigger**: 
- Push to master/main branch with changesets
- Manual trigger with release type

**Best for**:
- Production releases
- Following semver strictly
- Team coordination

## 🔐 Setup: npm Token

Both workflows require an `NPM_TOKEN` secret:

### Creating npm Access Token

1. **Login to npmjs.com**
   ```bash
   npm login
   ```

2. **Generate Access Token**
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Click "Generate New Token"
   - Choose "Automation" (for CI/CD)
   - Copy the token (starts with `npm_...`)

3. **Add to GitHub Secrets**
   
   **For your fork** (berkandirim/htmplar):
   - Go to: https://github.com/berkandirim/htmplar/settings/secrets/actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your token
   - Click "Add secret"

   **For upstream** (adidas/htmplar):
   - Same process, but in adidas/htmplar repository
   - Requires admin access to adidas org

### Token Permissions

The npm token needs:
- ✅ Publish access to `@htmplar/*` packages
- ✅ Automation type (recommended for CI/CD)

## 📋 Publishing Workflows

### Quick Alpha Release

Use this for the current v2.0.0-alpha release:

1. **Merge PR** to master in adidas/htmplar
2. **Go to Actions** → "Manual Publish to npm"
3. **Run workflow** with:
   - Version bump: (leave empty)
   - npm tag: `alpha`
   - Dry run: `false`
4. **Done!** Packages published as `@htmplar/core@2.0.0-alpha.0`

Users can install with:
```bash
npm install @htmplar/core@alpha
```

### Test Before Publishing (Dry Run)

Always recommended for first-time:

1. **Run workflow** with:
   - Version bump: (leave empty)
   - npm tag: `alpha`
   - Dry run: `true` ✅
2. **Check logs** - see what would happen
3. **Run again** with `Dry run: false` if everything looks good

### Bump Version and Publish

When ready for beta/RC/stable:

1. **Run workflow** with:
   - Version bump: `patch` (or `minor`/`major`)
   - npm tag: `beta` (or `latest` for stable)
   - Dry run: `false`

This will:
- Bump all package versions
- Publish to npm with specified tag
- Commit version changes back to repo

## 🏷️ npm Tags Explained

| Tag | When to Use | Install Command |
|-----|-------------|-----------------|
| `alpha` | Early development, unstable | `npm i @htmplar/core@alpha` |
| `beta` | Feature complete, testing | `npm i @htmplar/core@beta` |
| `next` | Pre-release for testing | `npm i @htmplar/core@next` |
| `latest` | Stable production release | `npm i @htmplar/core` |

**Current Status**: v2.0.0-alpha.0 → Use `alpha` tag

## 🔄 Development Workflow

### Fork + PR Model

```bash
# 1. Work in your fork
git checkout -b feature/my-feature
# ... make changes ...
git push origin feature/my-feature

# 2. Create PR to adidas/htmplar
# Use GitHub UI

# 3. After PR is merged to adidas/htmplar
# Trigger publish from adidas/htmplar Actions tab
```

### Important Notes

- ⚠️ **Publish from adidas/htmplar**, not your fork
- ⚠️ npm packages should come from official org repo
- ⚠️ Always test with dry-run first
- ⚠️ Keep your fork synced after publish:
  ```bash
  git fetch upstream
  git merge upstream/master
  git push origin master
  ```

## 📊 Checking Published Packages

After publishing:

```bash
# Check if packages are live
npm view @htmplar/core
npm view @htmplar/renderer
npm view @htmplar/cli
npm view @htmplar/create-htmplar

# Check specific version
npm view @htmplar/core@alpha

# Test installation
mkdir test-project && cd test-project
npm init -y
npm install @htmplar/core@alpha
```

## 🐛 Troubleshooting

### "ENEEDAUTH" Error

```
npm error code ENEEDAUTH
npm error need auth This command requires you to be logged in.
```

**Fix**: Add `NPM_TOKEN` secret to GitHub repository settings

### "403 Forbidden" Error

```
npm error 403 Forbidden - PUT https://registry.npmjs.org/@htmplar/core
```

**Fixes**:
1. Check npm token has publish permissions
2. Verify you have access to `@htmplar` scope on npm
3. Make sure `publishConfig.access: "public"` is set in package.json

### "Package name not available" Error

```
npm error 404 '@htmplar/core' is not in the npm registry.
```

**Fix**: Package names are available! This is just a check. Proceed with publish.

### Packages Not Appearing

After publishing, wait 1-2 minutes for npm's CDN to update. Check:
- https://www.npmjs.com/package/@htmplar/core
- https://www.npmjs.com/package/@htmplar/renderer
- https://www.npmjs.com/package/@htmplar/cli
- https://www.npmjs.com/package/@htmplar/create-htmplar

## 🎓 Best Practices

1. **Always use dry-run first** when testing new workflows
2. **Publish alpha/beta** before stable releases
3. **Test installed packages** before announcing releases
4. **Use semantic versioning**:
   - `patch`: Bug fixes (2.0.0 → 2.0.1)
   - `minor`: New features (2.0.0 → 2.1.0)
   - `major`: Breaking changes (2.0.0 → 3.0.0)
5. **Document changes** in CHANGELOG.md
6. **Tag releases** in GitHub for major versions

## 📝 Checklist: First Release

- [x] Code complete and tested locally
- [x] All CI checks passing
- [x] README has migration guide
- [ ] Push commits to GitHub
- [ ] Create npm account (if needed)
- [ ] Generate npm access token
- [ ] Add `NPM_TOKEN` to GitHub secrets
- [ ] Run workflow with dry-run: true
- [ ] Review dry-run output
- [ ] Run workflow with dry-run: false
- [ ] Verify packages on npmjs.com
- [ ] Test installation locally
- [ ] Announce release! 🎉

## 🆘 Need Help?

- npm registry status: https://status.npmjs.org/
- npm docs: https://docs.npmjs.com/
- GitHub Actions docs: https://docs.github.com/en/actions
- Open an issue: https://github.com/adidas/htmplar/issues
