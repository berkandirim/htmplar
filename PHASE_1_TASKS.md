# Phase 1: Foundation - Detailed Task Breakdown

**Duration:** Weeks 1-2  
**Goal:** Set up modern monorepo infrastructure with all tooling configured

---

## Task 1: Initialize Monorepo Structure

### 1.1 Create New Branch
```bash
git checkout -b rewrite/monorepo-setup
```

**Acceptance Criteria:**
- [ ] New branch created from master
- [ ] Clean working directory

---

### 1.2 Initialize pnpm Workspace

**Steps:**
1. Install pnpm globally (if not installed)
2. Create `pnpm-workspace.yaml`
3. Create root `package.json`
4. Initialize package directories

**Files to Create:**
```
pnpm-workspace.yaml
package.json (root)
packages/core/package.json
packages/renderer/package.json
packages/cli/package.json
packages/create-htmplar/package.json
```

**Acceptance Criteria:**
- [ ] pnpm workspace configured
- [ ] All package directories created
- [ ] Root package.json has workspace scripts
- [ ] `pnpm install` runs successfully

**Dependencies (Root):**
- turbo
- typescript
- prettier
- eslint

---

### 1.3 Install and Configure Turborepo

**Steps:**
1. Install `turbo` as dev dependency
2. Create `turbo.json` configuration
3. Set up pipeline for build, lint, test, dev

**Files to Create:**
```
turbo.json
```

**Turbo Pipeline:**
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "lib/**"]
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**Acceptance Criteria:**
- [ ] turbo.json configured
- [ ] `turbo build` command works
- [ ] `turbo lint` command works
- [ ] `turbo test` command works
- [ ] Pipeline dependencies set up correctly

---

### 1.4 Create Package Directory Structure

**For each package (core, renderer, cli, create-htmplar):**

```
packages/<package-name>/
├── src/
│   └── index.ts
├── tests/
│   └── .gitkeep
├── package.json
├── tsconfig.json
├── README.md
└── .npmignore
```

**Acceptance Criteria:**
- [ ] All 4 packages have consistent structure
- [ ] Each has package.json with correct name (@htmplar/*)
- [ ] Each has basic src/index.ts
- [ ] Each has tsconfig.json (extends base)

---

## Task 2: TypeScript Configuration

### 2.1 Create Base TypeScript Config

**File:** `tsconfig.base.json` (root)

**Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

**Acceptance Criteria:**
- [ ] tsconfig.base.json created
- [ ] Strict mode enabled
- [ ] React JSX configured
- [ ] Modern ES features enabled

---

### 2.2 Configure Package-Specific TypeScript

**For each package:**

**@htmplar/core:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

**@htmplar/renderer:**
- Similar but may have Node-specific types

**@htmplar/cli:**
- Include "node" types
- May need executable configuration

**@htmplar/create-htmplar:**
- Include "node" types
- Scaffolding-specific config

**Acceptance Criteria:**
- [ ] Each package has tsconfig.json
- [ ] All extend base config
- [ ] Type checking works: `pnpm -r exec tsc --noEmit`
- [ ] No type errors

---

## Task 3: ESLint & Prettier Setup

### 3.1 Install Dependencies

**Root package.json devDependencies:**
```json
{
  "eslint": "^9.0.0",
  "typescript-eslint": "^8.0.0",
  "@eslint/js": "^9.0.0",
  "eslint-config-prettier": "^9.1.0",
  "eslint-plugin-react": "^7.35.0",
  "eslint-plugin-react-hooks": "^4.6.0",
  "prettier": "^3.3.0"
}
```

**Acceptance Criteria:**
- [ ] All ESLint dependencies installed
- [ ] Prettier installed

---

### 3.2 Configure ESLint (Flat Config)

**File:** `eslint.config.js` (root)

```js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  prettier,
];
```

**Acceptance Criteria:**
- [ ] eslint.config.js created
- [ ] Flat config format used
- [ ] TypeScript rules configured
- [ ] React rules configured
- [ ] `pnpm lint` works across all packages

---

### 3.3 Configure Prettier

**File:** `.prettierrc` (root)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

**File:** `.prettierignore` (root)

```
node_modules
dist
lib
coverage
*.md
pnpm-lock.yaml
```

**Acceptance Criteria:**
- [ ] .prettierrc created
- [ ] .prettierignore created
- [ ] `pnpm format` script works
- [ ] `pnpm format:check` script works

---

### 3.4 Add Scripts to Root Package.json

```json
{
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "lint:fix": "turbo lint -- --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "test": "turbo test",
    "test:watch": "turbo test -- --watch",
    "clean": "turbo clean && rm -rf node_modules",
    "typecheck": "turbo typecheck"
  }
}
```

**Acceptance Criteria:**
- [ ] All scripts added
- [ ] Scripts run successfully
- [ ] Turbo caching works

---

## Task 4: Vitest Testing Infrastructure

### 4.1 Install Testing Dependencies

**Root package.json devDependencies:**
```json
{
  "vitest": "^2.0.0",
  "@vitest/ui": "^2.0.0",
  "@testing-library/react": "^16.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "@testing-library/user-event": "^14.5.0",
  "jsdom": "^24.0.0",
  "happy-dom": "^14.0.0"
}
```

**Acceptance Criteria:**
- [ ] Vitest installed
- [ ] Testing Library installed
- [ ] DOM environment installed

---

### 4.2 Create Vitest Config

**File:** `vitest.config.ts` (root)

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**'],
    },
  },
});
```

**File:** `vitest.setup.ts` (root)

```ts
import '@testing-library/jest-dom';
```

**Acceptance Criteria:**
- [ ] vitest.config.ts created
- [ ] Setup file created
- [ ] Config works with React components

---

### 4.3 Create Test Utils Package

**File:** `packages/test-utils/src/index.ts`

```ts
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Custom render function with providers if needed
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, options);
}
```

**Acceptance Criteria:**
- [ ] Test utils package created
- [ ] Exports testing library functions
- [ ] Can be imported from other packages

---

### 4.4 Create Sample Tests

**File:** `packages/core/tests/index.test.ts`

```ts
import { describe, it, expect } from 'vitest';

describe('core package', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });
});
```

**Repeat for each package**

**Acceptance Criteria:**
- [ ] Each package has at least one test
- [ ] `pnpm test` runs all tests
- [ ] All tests pass
- [ ] Coverage reporting works

---

## Task 5: Build Configuration

### 5.1 Install Build Tools

**Dependencies:**
```json
{
  "vite": "^5.0.0",
  "@vitejs/plugin-react": "^4.3.0",
  "tsup": "^8.0.0"
}
```

**Why both?**
- Vite: For CLI dev server
- tsup: For library bundling (core, renderer)

**Acceptance Criteria:**
- [ ] Build tools installed
- [ ] Each package has appropriate build config

---

### 5.2 Configure Package Builds

**@htmplar/core - tsup.config.ts:**
```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
});
```

**@htmplar/renderer - Similar tsup config**

**@htmplar/cli - Different approach (may use Vite or tsup)**

**Acceptance Criteria:**
- [ ] Each package builds successfully
- [ ] TypeScript declarations generated
- [ ] Both ESM and CJS formats output
- [ ] External dependencies not bundled

---

### 5.3 Add Build Scripts to Package.json

**Each package package.json:**
```json
{
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint src/**/*.{ts,tsx}",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  }
}
```

**Acceptance Criteria:**
- [ ] All packages have consistent scripts
- [ ] `turbo build` builds all packages in order
- [ ] Watch mode works for development

---

## Task 6: GitHub Actions CI/CD

### 6.1 Create CI Workflow

**File:** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, master, 'rewrite/**']
  pull_request:
    branches: [main, master]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm format:check

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - uses: codecov/codecov-action@v4
        if: always()

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
```

**Acceptance Criteria:**
- [ ] CI workflow file created
- [ ] Runs on push and PR
- [ ] All steps (lint, typecheck, test, build) run
- [ ] Uses pnpm caching
- [ ] Reports pass on clean build

---

### 6.2 Create Publish Workflow

**File:** `.github/workflows/publish.yml`

```yaml
name: Publish

on:
  push:
    branches:
      - main

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          registry-url: 'https://registry.npmjs.org'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      
      - name: Create Release Pull Request or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm publish -r
          version: pnpm changeset version
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
          NPM_CONFIG_PROVENANCE: true
```

**Acceptance Criteria:**
- [ ] Publish workflow created
- [ ] Uses Changesets for versioning
- [ ] NPM provenance enabled
- [ ] Only runs on main branch

---

### 6.3 Set Up Changesets

**Install:**
```bash
pnpm add -D @changesets/cli
pnpm changeset init
```

**File:** `.changeset/config.json`

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

**Acceptance Criteria:**
- [ ] Changesets installed
- [ ] Config created
- [ ] `pnpm changeset` command works
- [ ] Can create changeset files

---

## Task 7: Documentation Setup

### 7.1 Create Root README

**File:** `README.md` (root)

```markdown
# HTMplar v2.0

Modern email development with React, TypeScript, and Vite.

## Packages

- [@htmplar/core](packages/core) - React component library
- [@htmplar/renderer](packages/renderer) - Email rendering engine
- [@htmplar/cli](packages/cli) - Command line interface
- [@htmplar/create-htmplar](packages/create-htmplar) - Project scaffolder

## Development

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint

# Format
pnpm format
```

**Acceptance Criteria:**
- [ ] Root README created
- [ ] Links to package READMEs
- [ ] Development instructions included

---

### 7.2 Create Package READMEs

**Each package needs:**
- Description
- Installation
- Usage examples
- API reference (placeholder)

**Acceptance Criteria:**
- [ ] All 4 packages have README.md
- [ ] Installation instructions accurate
- [ ] Basic usage examples included

---

### 7.3 Create Contributing Guide

**File:** `CONTRIBUTING.md`

```markdown
# Contributing to HTMplar

## Development Setup
## Adding a Changeset
## Running Tests
## Code Style
## Commit Messages
## Pull Requests
```

**Acceptance Criteria:**
- [ ] CONTRIBUTING.md created
- [ ] Clear instructions for contributors
- [ ] Changeset workflow documented

---

## Task 8: Git Configuration

### 8.1 Update .gitignore

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
dist/
lib/
*.tsbuildinfo

# Testing
coverage/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Temp
*.log
.turbo/
```

**Acceptance Criteria:**
- [ ] .gitignore updated
- [ ] Build outputs excluded
- [ ] IDE files excluded

---

### 8.2 Create .npmignore Templates

**Each package needs .npmignore:**

```
src/
tests/
*.test.ts
*.test.tsx
*.spec.ts
*.spec.tsx
tsconfig.json
vitest.config.ts
.eslintrc
```

**Acceptance Criteria:**
- [ ] All packages have .npmignore
- [ ] Source files excluded
- [ ] Only dist/ published

---

## Task 9: Validation & Smoke Tests

### 9.1 Validate Installation

```bash
# Clean install
rm -rf node_modules packages/*/node_modules
pnpm install
```

**Acceptance Criteria:**
- [ ] Clean install works
- [ ] No dependency conflicts
- [ ] All packages linked correctly

---

### 9.2 Run Full Build Pipeline

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

**Acceptance Criteria:**
- [ ] All commands pass
- [ ] No errors or warnings
- [ ] Build artifacts generated

---

### 9.3 Test Package Imports

**Create test file:** `smoke-test.mjs`

```js
import * as core from './packages/core/dist/index.js';
console.log('Core exports:', Object.keys(core));
```

**Acceptance Criteria:**
- [ ] Packages can be imported
- [ ] Exports are correct
- [ ] No runtime errors

---

## Phase 1 Completion Checklist

### Monorepo Setup
- [ ] pnpm workspace configured
- [ ] Turborepo installed and configured
- [ ] All 4 packages created with structure
- [ ] Package dependencies linked

### TypeScript
- [ ] Base tsconfig.base.json created
- [ ] All packages have tsconfig.json
- [ ] Type checking passes
- [ ] Declaration files generated

### Linting & Formatting
- [ ] ESLint configured (flat config)
- [ ] Prettier configured
- [ ] All code formatted
- [ ] No lint errors

### Testing
- [ ] Vitest installed
- [ ] Test utils package created
- [ ] Sample tests in each package
- [ ] All tests pass
- [ ] Coverage reporting works

### Build
- [ ] Build tools configured (tsup/vite)
- [ ] All packages build successfully
- [ ] Correct output formats (ESM/CJS)
- [ ] Type declarations generated

### CI/CD
- [ ] CI workflow created and passing
- [ ] Publish workflow created
- [ ] Changesets configured
- [ ] GitHub Actions running

### Documentation
- [ ] Root README
- [ ] Package READMEs
- [ ] CONTRIBUTING.md
- [ ] MODERNIZATION_PLAN.md

### Git
- [ ] .gitignore updated
- [ ] .npmignore in all packages
- [ ] Clean working directory
- [ ] Ready to commit

---

## Success Metrics

✅ **All commands work:**
- `pnpm install` - Clean install
- `pnpm build` - Builds all packages
- `pnpm test` - All tests pass
- `pnpm lint` - No lint errors
- `pnpm typecheck` - No type errors

✅ **GitHub Actions:**
- CI workflow passes
- All checks green

✅ **Developer Experience:**
- Fast builds with Turbo caching
- Type safety across all packages
- Hot reload ready for Phase 2

---

## Next Steps (Phase 2)

After Phase 1 is complete:
1. Implement @htmplar/renderer core functionality
2. Port existing components to @htmplar/core
3. Build CLI commands in @htmplar/cli
4. Create scaffolder in @htmplar/create-htmplar
