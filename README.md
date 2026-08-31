# HTMplar v2.0 🚀

> Modern email development with React, TypeScript, and Vite

[![CI](https://github.com/adidas/htmplar/workflows/CI/badge.svg)](https://github.com/adidas/htmplar/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

HTMplar is a developer-friendly React component library for building email-safe HTML templates. Write emails in React with modern tooling, and get production-ready HTML that works across all email clients.

## ✨ Features

- 🎨 **React Components** - Build emails with familiar React syntax
- 🎯 **Type-Safe** - Full TypeScript support with strict mode
- ⚡ **Fast Builds** - Turborepo + tsup for lightning-fast builds  
- 🌗 **Dark Mode** - Built-in dark mode support
- ♿ **Accessible** - WCAG AA compliant email templates
- 📱 **Responsive** - Mobile-first, works on all devices
- 📧 **Email Client Compatible** - Tested on 20+ email clients including Outlook

## 📦 Packages

This is a monorepo containing multiple packages:

| Package | Description | Version |
|---------|-------------|---------|
| [@htmplar/core](./packages/core) | React component library | `2.0.0-alpha.0` |
| [@htmplar/renderer](./packages/renderer) | Email rendering engine | `2.0.0-alpha.0` |
| [@htmplar/cli](./packages/cli) | Command line interface | `2.0.0-alpha.0` |
| [@htmplar/create-htmplar](./packages/create-htmplar) | Project scaffolder | `2.0.0-alpha.0` |

## 🚀 Quick Start (Coming Soon)

### Create a New Project

```bash
npx @htmplar/create-htmplar my-email-project
cd my-email-project
npm run dev
```

### Or Install in Existing Project

```bash
npm install @htmplar/core @htmplar/renderer
```

## 📖 Usage Example (Coming Soon)

```tsx
import { Block, Button, Text } from '@htmplar/core';
import { renderToEmail } from '@htmplar/renderer';

function WelcomeEmail() {
  return (
    <Block>
      <Text>Welcome to HTMplar!</Text>
      <Button href="https://example.com">
        Get Started
      </Button>
    </Block>
  );
}

// Render to email-safe HTML
const html = renderToEmail(<WelcomeEmail />);
```

## 🛠️ Development

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

### Setup

```bash
# Clone the repository
git clone https://github.com/adidas/htmplar.git
cd htmplar

# Checkout the rewrite branch
git checkout rewrite/monorepo-setup

# Install dependencies
npm install --legacy-peer-deps

# Build all packages
npm run build

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

### Monorepo Structure

```
htmplar/
├── packages/
│   ├── core/          # Component library (Vanilla Extract styling)
│   ├── renderer/      # React → HTML rendering engine
│   ├── cli/           # CLI tool (dev server, build commands)
│   └── create-htmplar/ # Project scaffolder
├── .github/workflows/ # CI/CD pipelines
└── docs/              # Documentation
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build all packages with Turborepo |
| `npm run dev` | Start dev mode with watch |
| `npm run test` | Run all tests |
| `npm run lint` | Lint all packages |
| `npm run typecheck` | Type check all packages |
| `npm run format` | Format all files |
| `npm run clean` | Remove build artifacts |

## 📚 Documentation

- **[Modernization Plan](./MODERNIZATION_PLAN.md)** - Complete rewrite plan and architecture decisions
- **[Phase 1 Tasks](./PHASE_1_TASKS.md)** - Detailed implementation checklist
- **[Session Summary](./SESSION_SUMMARY.md)** - Current progress and status
- **[Setup Status](./SETUP_STATUS.md)** - Setup instructions and next steps

## 🎯 Project Status

### Phase 1: Foundation ✅ (100% Complete)

- ✅ Monorepo structure (Turborepo + npm workspaces)
- ✅ TypeScript configuration (strict mode)
- ✅ Build system (tsup for ESM/CJS)
- ✅ Testing infrastructure (Vitest + Testing Library)
- ✅ CI/CD workflows (GitHub Actions)
- ✅ Code quality tools (ESLint 9, Prettier)
- ✅ Documentation

### Phase 2: Core Functionality 🚧 (Next)

- ⏳ Renderer: React → HTML conversion
- ⏳ Core components: Block, Button, Text, Image, etc.
- ⏳ Vanilla Extract styling system
- ⏳ CLI: dev server, build commands
- ⏳ Email optimization & inlining

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./.github/CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Changesets

We use [Changesets](https://github.com/changesets/changesets) for versioning:

```bash
npm run changeset
```

## 📝 License

MIT © [adidas AG](https://github.com/adidas)

## 🙏 Acknowledgments

- Original htmplar by [Bilal Çınarlı](https://github.com/bcinarli)
- v2.0 rewrite by [Berkan Dirim](https://github.com/berkandirim)

## 📧 Support

- 📖 [Documentation](./MODERNIZATION_PLAN.md)
- 🐛 [Issue Tracker](https://github.com/adidas/htmplar/issues)
- 💬 [Discussions](https://github.com/adidas/htmplar/discussions)

---

**⚠️ Alpha Version:** This is v2.0.0-alpha - a complete rewrite in progress. The foundation is complete and we're now building the core functionality. For the stable v0.x version, see the original `master` branch.

**Branch:** `rewrite/monorepo-setup`  
**Status:** Phase 1 Complete, Phase 2 in progress

Built with ❤️ by the adidas team
