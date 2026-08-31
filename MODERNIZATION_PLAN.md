# HTMplar Modernization Plan

## Executive Summary

This document outlines a comprehensive plan to rewrite HTMplar from the ground up with modern tooling, improved developer experience, and enterprise-grade email compatibility.

---

## Current Architecture Analysis

### What Works Well
✅ **Clear separation of concerns**: Components, CLI, server, and rendering logic are well-organized  
✅ **React-based approach**: Familiar DX for developers  
✅ **Email-safe base styles**: Comprehensive CSS reset for email clients  
✅ **MSO compatibility**: Proper Outlook conditional comments  
✅ **Responsive utilities**: Mobile/desktop targeting built-in  
✅ **Block system**: Reusable content blocks vs full templates  

### Pain Points & Technical Debt
❌ **Outdated tooling**: Babel-only transpilation, no bundler  
❌ **No TypeScript**: Lack of type safety causes runtime errors  
❌ **Manual inline CSS**: Uses `inline-css` library post-render instead of build-time optimization  
❌ **No testing**: Zero test coverage  
❌ **Complex setup**: Users need to install globally + locally + configure scripts  
❌ **VM-based rendering**: Uses Node's `vm` module for eval - fragile and hard to debug  
❌ **No HMR**: Dev server requires full rebuild on changes  
❌ **Styled-components overhead**: Runtime CSS-in-JS isn't ideal for static email generation  
❌ **Limited dark mode support**: No systematic dark mode implementation  
❌ **No accessibility features**: Missing ARIA attributes, semantic HTML  
❌ **No modern email features**: Missing support for AMP4Email, dark mode, interactive features  

---

## Proposed Modern Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         User's Project                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  src/emails/welcome.tsx                              │  │
│  │  - Uses @htmplar/core components                     │  │
│  │  - Vanilla Extract styles (.css.ts)                  │  │
│  │  - TypeScript for type safety                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  @htmplar/cli (commands)                             │  │
│  │  - htmplar dev   → Vite dev server (HMR)            │  │
│  │  - htmplar build → Production build                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  @htmplar/renderer                                   │  │
│  │  1. React → Static HTML (renderToStaticMarkup)      │  │
│  │  2. Vanilla Extract → CSS extraction                 │  │
│  │  3. PostHTML → Inline styles                         │  │
│  │  4. Optimize → Minify, purge, email-safe            │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  dist/welcome.html                                   │  │
│  │  - 100% static HTML                                  │  │
│  │  - Inline styles                                     │  │
│  │  - Email client compatible                           │  │
│  │  - Dark mode ready                                   │  │
│  │  - Accessible                                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

                          ↓ (User copies HTML)

┌─────────────────────────────────────────────────────────────┐
│         Email Service (Salesforce, SendGrid, etc.)          │
│         - User pastes HTML                                   │
│         - Adds dynamic content (AMPscript, etc.)            │
│         - Sends emails                                       │
└─────────────────────────────────────────────────────────────┘
```

**Package Relationships:**
```
@htmplar/create-htmplar (scaffolder)
         ↓ creates
    User Project
         ↓ depends on
    @htmplar/cli ────→ @htmplar/renderer ────→ @htmplar/core
         ↓                    ↓                      ↓
    Commands          React → HTML           Components
    (dev, build)      CSS inlining          (Button, Block, etc.)
                      Optimization           + Vanilla Extract
```

**Optional Packages:**
```
@htmplar/mjml-adapter (optional)
         ↓ depends on
    @htmplar/core
         ↓
    Provides MJML-like components
    (only if user installs it)
```

---

### 1. Monorepo Structure

```
htmplar/
├── packages/
│   ├── core/                    # Core React component library
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Block/
│   │   │   │   │   ├── Block.tsx
│   │   │   │   │   ├── Block.test.tsx
│   │   │   │   │   ├── Block.styles.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Button/
│   │   │   │   ├── Image/
│   │   │   │   ├── Text/
│   │   │   │   ├── Table/
│   │   │   │   └── ... (all components)
│   │   │   ├── utils/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── renderer/                # Email rendering engine
│   │   ├── src/
│   │   │   ├── render.ts
│   │   │   ├── inline-styles.ts
│   │   │   ├── optimize.ts
│   │   │   ├── templates/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── cli/                     # Command line interface
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   │   ├── init.ts
│   │   │   │   ├── dev.ts
│   │   │   │   ├── build.ts
│   │   │   │   ├── preview.ts
│   │   │   │   └── test.ts
│   │   │   ├── scaffold/
│   │   │   ├── server/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── bin/
│   │       └── htmplar.js
│   │
│   └── create-htmplar/          # Project scaffolder (like create-react-app)
│       ├── src/
│       │   ├── templates/
│       │   └── index.ts
│       └── package.json
│
├── templates/                   # Starter templates
│   ├── default/                 # Basic starter
│   ├── marketing/               # Marketing emails
│   ├── transactional/           # Transactional emails
│   └── newsletter/              # Newsletter template
│
├── examples/                    # Example projects
│   ├── basic/
│   ├── e-commerce/
│   └── saas-notifications/
│
├── docs/                        # Documentation site
│   └── ... (VitePress or Docusaurus)
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── publish.yml
│       └── release.yml
│
├── package.json                 # Root monorepo config
├── pnpm-workspace.yaml
├── turbo.json                   # Turborepo config
└── tsconfig.base.json
```

---

## Modern Tech Stack

### Build System & Tooling
- **Monorepo**: Turborepo (fast, cached builds)
- **Package Manager**: pnpm (efficient, workspace support)
- **Bundler**: Vite (fast, modern, great DX)
- **TypeScript**: Full type safety across all packages
- **Linting**: ESLint 9 (flat config) + TypeScript ESLint
- **Formatting**: Prettier + Biome (faster alternative)
- **Testing**: Vitest (fast, Vite-native) + Testing Library
- **E2E Testing**: Playwright (email rendering tests)

### Component Library (@htmplar/core)
- **Framework**: React 18 (with TypeScript)
- **Styling**: Vanilla Extract (zero-runtime, type-safe)
  - Build-time CSS generation
  - Type-safe styles with TypeScript autocomplete
  - Automatic critical CSS extraction
  - Theme system with light/dark mode support
- **Email CSS**: PostHTML + PostHTML-Inline-CSS (fast, reliable)
- **Validation**: Zod for runtime prop validation
- **Icons**: Lucide React (tree-shakeable, email-safe)

### Renderer (@htmplar/renderer)
- **HTML Generation**: React Server Components + renderToStaticMarkup
- **CSS Inlining**: PostHTML + PostHTML-Inline-CSS (faster than juice)
- **Minification**: html-minifier-terser
- **Optimization**: 
  - CSS purging (remove unused styles)
  - Image optimization integration (sharp)
  - Email-specific optimizations (MSO conditionals, etc.)
- **Testing**: MJML test suite patterns for email compatibility

### CLI (@htmplar/cli)
- **Framework**: Commander.js (modern, typed CLI)
- **Dev Server**: Vite (HMR, instant updates)
- **File Watching**: Chokidar (reliable cross-platform)
- **UI**: Inquirer.js + Chalk + Ora (beautiful CLI)
- **Config**: Cosmiconfig (flexible config files)
- **Live Preview**: 
  - Vite dev server with HMR
  - Live email preview in browser
  - Multiple device preview (desktop/mobile)
  - Dark mode toggle
  - Email client simulator

### Scaffolding (@htmplar/create-htmplar)
- **Interactive Setup**: Prompts for template selection, features
- **Templates**: Curated starter projects
- **Git Integration**: Auto-init git, optional GitHub repo creation

---

## Key Features & Improvements

### 1. Developer Experience

#### Simple Installation & Setup
```bash
# Global install for CLI
npm install -g @htmplar/cli

# Scaffold new project
htmplar init my-email-project

# Or with npx (no global install)
npx @htmplar/create-htmplar my-email-project
```

#### Project Structure (User-facing)
```
my-email-project/
├── src/
│   ├── emails/
│   │   ├── welcome.tsx
│   │   ├── password-reset.tsx
│   │   └── newsletter.tsx
│   ├── blocks/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── product-card.tsx
│   ├── components/          # Custom components
│   └── styles/
│       ├── theme.ts
│       └── tokens.ts
├── public/
│   └── assets/
│       └── images/
├── dist/                    # Built HTML output
├── .htmplarrc.ts           # Config file (TypeScript!)
└── package.json
```

#### Developer Commands
```bash
htmplar dev           # Start dev server with HMR
htmplar build         # Build all emails to HTML
htmplar preview       # Preview built emails
htmplar test          # Run email compatibility tests
htmplar send          # Send test emails
htmplar validate      # Validate against email client requirements
```

### 2. Modern Email Features

#### Dark Mode Support
- **Automatic dark mode**: `@media (prefers-color-scheme: dark)`
- **Theme tokens**: Light/dark color schemes
- **MSO dark mode**: Outlook dark mode support
- **Manual overrides**: Component-level dark mode control

```tsx
<Block 
  background={{ light: '#ffffff', dark: '#1a1a1a' }}
  color={{ light: '#000000', dark: '#ffffff' }}
>
  {/* Content */}
</Block>
```

#### Accessibility
- **Semantic HTML**: Proper heading hierarchy, landmarks
- **ARIA attributes**: role, aria-label, aria-describedby
- **Alt text validation**: Required for images
- **Color contrast checking**: WCAG AA/AAA compliance
- **Screen reader testing**: Optimized for email screen readers

#### Modern Email Client Support
- **Apple Mail**: Native dark mode, responsive design
- **Gmail**: Mobile app, web app, iOS/Android
- **Outlook**: Desktop (Windows/Mac), web, mobile
- **Yahoo/AOL**: Web and mobile
- **Superhuman, Hey**: Modern email clients
- **MSO compatibility**: Outlook 2007-2021

### 3. Component Library Enhancements

#### Type-Safe Components
```tsx
import { Block, Button, Image, Text } from '@htmplar/core';

<Button
  href="https://example.com"
  variant="primary"        // Type-safe variants
  size="large"
  fullWidth={false}
  icon={<Icon name="arrow-right" />}
  darkMode={{
    background: '#ffffff',
    color: '#000000'
  }}
>
  Click Here
</Button>
```

#### New Components
- **Spacer**: Consistent spacing (email-safe)
- **Divider**: Horizontal rules with variants
- **Card**: Boxed content with shadows (email-safe)
- **Grid**: Responsive grid system
- **Hero**: Hero section with image/video
- **Countdown**: Event countdown timer
- **Social**: Social media links with icons
- **QRCode**: QR code generation
- **Video**: Video thumbnail with play button
- **AMP Components**: Interactive AMP4Email components (optional)

#### Theme System
```tsx
// theme.ts
export const theme = {
  colors: {
    primary: { light: '#0066cc', dark: '#3399ff' },
    background: { light: '#ffffff', dark: '#1a1a1a' },
    text: { light: '#000000', dark: '#ffffff' },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    fontSize: { sm: '14px', md: '16px', lg: '20px' },
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
  },
};
```

### 4. Testing & Quality

#### Component Tests
```tsx
import { render } from '@htmplar/test-utils';
import { Button } from '@htmplar/core';

test('renders button with correct href', () => {
  const { getByRole } = render(<Button href="/test">Click</Button>);
  expect(getByRole('link')).toHaveAttribute('href', '/test');
});
```

#### Email Compatibility Tests
```tsx
import { renderEmail, validateEmail } from '@htmplar/renderer';

test('renders correctly in Outlook', async () => {
  const html = await renderEmail(<MyEmail />);
  const validation = await validateEmail(html, {
    clients: ['outlook-2016', 'gmail-mobile', 'apple-mail'],
  });
  
  expect(validation.errors).toHaveLength(0);
});
```

#### Visual Regression Tests
- **Screenshot comparison**: Across email clients
- **Litmus/Email on Acid integration**: Real email client testing
- **Automated preview generation**: CI/CD integration

### 5. Build Optimization

#### Performance
- **Tree shaking**: Only include used components
- **CSS purging**: Remove unused styles
- **Minification**: HTML, CSS, inline styles
- **Image optimization**: Automatic compression, responsive images
- **Code splitting**: Separate builds per email (not bundled together)

#### Output Quality
- **Email size targets**: < 102KB (Gmail clipping)
- **Validation**: HTML email standards compliance
- **Accessibility checks**: Automated a11y validation
- **Dark mode testing**: Automatic preview generation
- **Link validation**: Check for broken links

---

## Release & Distribution

### NPM Packages (Scoped)
```
@htmplar/core          # Component library
@htmplar/renderer      # Rendering engine
@htmplar/cli          # CLI tool
@htmplar/create-htmplar  # Scaffolder
@htmplar/test-utils   # Testing utilities
@htmplar/mjml-adapter  # Optional MJML compatibility (community/future)
```

### Semantic Versioning
- **Changesets**: Automated versioning and changelogs
- **Conventional Commits**: Standard commit messages
- **Release Please**: Automated GitHub releases
- **NPM Provenance**: Supply chain security

### CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
- Lint & format check
- Type checking
- Unit tests (Vitest)
- E2E tests (Playwright)
- Build all packages
- Visual regression tests
- Email compatibility tests
- Size checks (bundle size)
```

```yaml
# .github/workflows/publish.yml
- Version bump (changesets)
- Build packages
- Publish to NPM
- Create GitHub release
- Deploy documentation
- Update examples
```

### Distribution Channels

#### NPM (Primary)
```bash
npm install -g @htmplar/cli
npm install @htmplar/core @htmplar/renderer
```

#### Homebrew (Future)
```bash
brew install htmplar
```

#### Other Package Managers (Future)
- **apt/deb**: For Debian/Ubuntu
- **yum/rpm**: For RedHat/CentOS
- **Chocolatey**: For Windows
- **Scoop**: For Windows
- **winget**: Windows Package Manager

---

## Migration Path

### For Existing Users

#### 1. Legacy Support Branch
- Maintain `v0.x` branch with critical fixes
- Clear deprecation timeline (6 months)

#### 2. Migration Guide
- Component mapping (old → new)
- Config file migration
- CLI command changes
- Breaking changes documentation

#### 3. Codemods
- Automated migration scripts
- AST transforms for component updates
- Config file converters

#### 4. Compatibility Layer (Optional)
- Adapter package for old syntax
- Gradual migration support

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up monorepo structure (Turborepo + pnpm)
- [ ] Configure TypeScript, ESLint, Prettier
- [ ] Set up testing infrastructure (Vitest + Playwright)
- [ ] Create base build pipeline (Vite + tsup)
- [ ] Set up CI/CD (GitHub Actions)

### Phase 2: Core Library (Weeks 3-5)
- [ ] Build rendering engine (@htmplar/renderer)
  - [ ] React to static HTML
  - [ ] CSS inlining system
  - [ ] Email optimization pipeline
  - [ ] Template system
- [ ] Port existing components to TypeScript
  - [ ] Block, Row, Column, Table
  - [ ] Button, Link, Image
  - [ ] Text, Heading, Headline
  - [ ] All other existing components
- [ ] Add new components
  - [ ] Spacer, Divider, Card
  - [ ] Grid, Hero, Social
- [ ] Implement theme system
- [ ] Add dark mode support
- [ ] Write comprehensive tests

### Phase 3: CLI (Weeks 6-7)
- [ ] Build CLI framework (@htmplar/cli)
  - [ ] Command structure
  - [ ] Config system
  - [ ] Dev server with HMR
  - [ ] Build command
  - [ ] Preview server
- [ ] Create scaffolding tool (@htmplar/create-htmplar)
  - [ ] Interactive prompts
  - [ ] Template system
  - [ ] Project initialization
- [ ] Build starter templates
  - [ ] Default template
  - [ ] Marketing template
  - [ ] Transactional template

### Phase 4: Testing & Quality (Week 8)
- [ ] Email compatibility testing suite
- [ ] Visual regression testing
- [ ] Accessibility testing
- [ ] Performance benchmarks
- [ ] Integration tests

### Phase 5: Documentation (Week 9)
- [ ] Component documentation
- [ ] API reference
- [ ] Migration guide
- [ ] Best practices guide
- [ ] Example gallery
- [ ] Video tutorials

### Phase 6: Release (Week 10)
- [ ] Beta release to npm
- [ ] Community feedback
- [ ] Bug fixes
- [ ] v1.0.0 stable release
- [ ] Marketing & announcement

### Phase 7: Future (Post-Launch)
- [ ] Homebrew distribution
- [ ] VS Code extension
- [ ] Figma/Sketch integration
- [ ] MJML adapter package (@htmplar/mjml-adapter)
- [ ] Email testing service integrations (Litmus, Email on Acid APIs)
- [ ] Community plugins ecosystem

---

## Success Metrics

### Developer Experience
- ⚡ Dev server startup: < 1 second
- 🔄 HMR update: < 100ms
- 📦 Build time: < 5 seconds for 10 emails
- 📝 Type safety: 100% TypeScript coverage
- ✅ Test coverage: > 80%

### Email Quality
- 📧 Email client support: 20+ clients
- 🎨 Dark mode: Automatic support
- ♿ Accessibility: WCAG AA compliance
- 📱 Responsive: Mobile-first design
- 🚀 Performance: < 102KB per email

### Adoption
- 📈 NPM downloads: Track weekly downloads
- ⭐ GitHub stars: Community engagement
- 🐛 Issue response time: < 24 hours
- 📚 Documentation quality: User feedback
- 🤝 Contributors: Active community

---

## Risk Mitigation

### Technical Risks
- **Breaking changes**: Comprehensive migration guide + codemods
- **Email client compatibility**: Extensive testing suite + Litmus integration
- **Performance**: Benchmarking + optimization passes
- **Bundle size**: Tree shaking + code splitting

### Adoption Risks
- **Learning curve**: Excellent documentation + video tutorials
- **Migration effort**: Gradual migration path + compatibility layer
- **Ecosystem**: Integrations with popular email services

---

## Decisions Made ✅

1. **AMP4Email**: ❌ No - Too complex, keeping it simple
2. **Visual builder**: ❌ No - Developer-focused tool only
3. **Email service integrations**: ❌ No - Tool outputs HTML only, users integrate themselves
4. **MJML compatibility**: ✅ Yes - Optional adapter package (`@htmplar/mjml-adapter`)
   - Separate optional package
   - Users can install if needed: `npm install @htmplar/mjml-adapter`
   - Not included in core or default templates
   - Allows MJML components to work alongside HTMplar components
   - Can be community-maintained initially
5. **Styling solution**: ✅ Vanilla Extract
   - Zero runtime overhead
   - Type-safe styles
   - Perfect for static email generation
   - Build-time CSS with easy inlining

---

## Technical Deep Dives

### Vanilla Extract Implementation

**Why Vanilla Extract is Perfect for Email:**

1. **Build-time CSS Generation**
   - All styles compiled to static CSS at build time
   - No runtime JavaScript in final output
   - Clean, predictable CSS that's easy to inline

2. **Type Safety**
   ```tsx
   // theme.css.ts
   import { createTheme, style } from '@vanilla-extract/css';
   
   export const [themeClass, vars] = createTheme({
     color: {
       primary: { light: '#0066cc', dark: '#3399ff' },
       text: { light: '#000000', dark: '#ffffff' },
       background: { light: '#ffffff', dark: '#1a1a1a' },
     },
     space: {
       small: '8px',
       medium: '16px',
       large: '24px',
     },
   });
   
   // Button.css.ts
   export const button = style({
     padding: vars.space.medium,
     backgroundColor: vars.color.primary.light,
     color: vars.color.text.light,
     borderRadius: '4px',
     textDecoration: 'none',
     display: 'inline-block',
     
     '@media': {
       '(max-width: 480px)': {
         padding: vars.space.small,
       },
       '(prefers-color-scheme: dark)': {
         backgroundColor: vars.color.primary.dark,
         color: vars.color.text.dark,
       },
     },
   });
   ```

3. **Component Usage**
   ```tsx
   // Button.tsx
   import * as styles from './Button.css';
   
   export interface ButtonProps {
     href: string;
     children: React.ReactNode;
   }
   
   export const Button: React.FC<ButtonProps> = ({ href, children }) => (
     <a href={href} className={styles.button}>
       {children}
     </a>
   );
   ```

4. **CSS Inlining Pipeline**
   ```
   React Component + Vanilla Extract
           ↓
   Static HTML + <style> tags
           ↓
   PostHTML-Inline-CSS
           ↓
   HTML with inline styles + critical CSS in <head>
           ↓
   Final Email HTML (optimized)
   ```

**Benefits for Email:**
- Clean class names: `.Button_button__abc123`
- Easy to inline: All styles extractable
- No style conflicts: Scoped by default
- Dark mode: Built-in media query support
- Responsive: Mobile-first breakpoints
- Themeable: Design tokens system

---

### Optional MJML Adapter

**Package Structure:**
```
@htmplar/mjml-adapter/
├── src/
│   ├── components/
│   │   ├── MjSection.tsx      # Wraps <mj-section>
│   │   ├── MjColumn.tsx       # Wraps <mj-column>
│   │   ├── MjText.tsx         # Wraps <mj-text>
│   │   ├── MjButton.tsx       # Wraps <mj-button>
│   │   └── ... (all MJML components)
│   ├── converter.ts           # MJML → HTMplar conversion
│   └── index.ts
└── package.json
```

**How It Works:**

1. **Optional Installation**
   ```bash
   # Users install only if they want MJML support
   npm install @htmplar/mjml-adapter
   ```

2. **Use MJML Components (if installed)**
   ```tsx
   import { Block, Button, Text } from '@htmplar/core';
   import { MjSection, MjColumn } from '@htmplar/mjml-adapter';
   
   export const MyEmail = () => (
     <Block>
       {/* Native HTMplar components */}
       <Text>HTMplar native text</Text>
       
       {/* MJML components (optional) */}
       <MjSection>
         <MjColumn>
           <Text>Mixed usage!</Text>
         </MjColumn>
       </MjSection>
       
       {/* Back to native */}
       <Button href="#">Click me</Button>
     </Block>
   );
   ```

3. **Implementation Strategy**
   - Adapter components map MJML props to HTMplar equivalents
   - Under the hood, renders HTMplar components
   - No actual MJML compilation (avoid dependency on mjml package)
   - Pure React implementation mimicking MJML's responsive behavior

4. **Example Adapter Component**
   ```tsx
   // MjButton.tsx (in @htmplar/mjml-adapter)
   import { Button } from '@htmplar/core';
   
   interface MjButtonProps {
     href: string;
     'background-color'?: string;
     color?: string;
     'font-family'?: string;
     children: React.ReactNode;
   }
   
   export const MjButton: React.FC<MjButtonProps> = ({
     href,
     'background-color': backgroundColor,
     color,
     'font-family': fontFamily,
     children,
   }) => (
     <Button 
       href={href}
       style={{ backgroundColor, color, fontFamily }}
     >
       {children}
     </Button>
   );
   ```

**Benefits:**
- ✅ **Optional**: Core package stays lean
- ✅ **No lock-in**: Users choose HTMplar OR mixed approach
- ✅ **Easy migration**: MJML users can gradually migrate
- ✅ **Community-driven**: Can be maintained separately
- ✅ **Zero core impact**: Doesn't affect non-MJML users

**Future Enhancement - CLI Converter:**
```bash
# Convert MJML files to HTMplar
htmplar convert email.mjml --output email.tsx

# Converts MJML → Pure HTMplar components (no adapter needed)
```

---

## Conclusion

This modernization will transform HTMplar into a best-in-class email development framework with:
- 🚀 Modern tooling (TypeScript, Vite, Turborepo)
- ⚡ Excellent DX (HMR, type safety, great CLI)
- 🎨 Modern features (dark mode, accessibility)
- 📧 Enterprise-grade email compatibility
- 🧪 Comprehensive testing
- 📚 Great documentation

The monorepo approach keeps the library, CLI, and templates separate while allowing users to install only what they need. The scaffolding tool makes it dead simple to get started.

**Next Steps:**
1. Review and approve this plan
2. Decide on open questions
3. Begin Phase 1 implementation
4. Set up project boards and milestones
