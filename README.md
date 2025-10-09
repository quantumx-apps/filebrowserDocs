# FileBrowser Quantum Documentation

Modern Hugo-based documentation for FileBrowser Quantum.

## Quick Start

### First Time Setup

```bash
make setup
```

This installs npm dependencies and checks for required tools.

### Run Development Server

```bash
make dev
```

Visit: `http://localhost:1313/`

The development server includes draft pages and live reloading.

### Build for Production

```bash
make build
```

Output is generated in the `dist/` directory (minified and optimized).

### View All Available Commands

```bash
make help
```

This displays all available make commands with descriptions.

## Documentation Structure

```
content/en/docs/
├── _index.md                    # Documentation landing page
├── Getting Started/             # Installation guides (Docker, Linux, macOS, Windows)
│   └── Migration/               # Migration guides
├── Configuration/               # Configuration options
│   ├── Authentication/          # Auth methods (Password, OIDC, Proxy)
│   └── Frontend/                # UI customization (Branding, Styling, Themes)
├── Access Control/              # Permissions and rules
├── Shares/                      # Sharing features (Normal, Upload)
├── Integrations/                # Third-party integrations
│   ├── Media/                   # Media server integration
│   └── Office/                  # Office suite integration
├── User Guides/                 # How-to guides
│   ├── Init Scripts/            # Startup scripts
│   ├── Multiple Configs/        # Multi-instance setups
│   └── Office Integration/      # Office integration examples
├── Advanced/                    # Advanced features
│   └── Logging/                 # Debug and troubleshooting logs
├── Reference/                   # API, CLI, Environment Variables
├── Contributing/                # Contribution guidelines
│   ├── Documentation/           # Doc writing guides
│   ├── Features/                # Feature development
│   └── Translations/            # Translation guides
└── Help/                        # FAQ, About, Roadmap
```

## Writing Documentation

### Create a New Page

```bash
hugo new content/en/docs/section/page-name.md
```

This will create a new page using the archetype template with all required front matter.

### Front Matter Template

Every documentation page requires the following front matter:

```yaml
---
title: "Page Title"
description: "Brief description (40-60 characters recommended)"
icon: "article"              # Material icon name
date: "2024-01-15T10:00:00Z"
lastmod: "2024-01-15T10:00:00Z"
draft: true                  # Set to false when ready to publish
toc: true                    # Enable table of contents
# order: 0                   # Optional: Manual ordering (positive=first, 0=default, negative=last)
---
```

### Automatic Ordering

The documentation uses **automatic ordering** based on file system structure:
- Pages are automatically ordered by their directory path
- No manual `weight` values needed
- Use the optional `order` field only when you need to override automatic ordering within a directory

**Order Field Examples:**
- `order: 1` - Page appears first in its directory
- `order: 0` or unset - Default alphabetical ordering
- `order: -1` - Page appears last in its directory

### Content Guidelines

- Use clear, concise language
- Include code examples with syntax highlighting
- Add troubleshooting sections where applicable
- Link to related pages
- Update `lastmod` field when making changes
- Use Material Design icons consistently

## Documentation Standards

### File Naming
- Lowercase with hyphens: `getting-started.md`
- Section index files: `_index.md`
- Use descriptive names that match the content

### Page Structure
1. **Title** (# H1) - Automatically generated from front matter
2. **Introduction** - Brief overview of the topic
3. **Main Sections** (## H2) - Primary content blocks
4. **Subsections** (### H3) - Detailed breakdowns
5. **Code Examples** - Practical demonstrations
6. **Troubleshooting** - Common issues and solutions
7. **Next Steps** - Links to related pages

### Code Blocks

Always use syntax highlighting:

```yaml
server:
  port: 80
  root: /data
```

```bash
./filebrowser -c config.yaml
```

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, FileBrowser!")
}
```

### Available Shortcodes

The theme provides powerful shortcodes for enhanced content:

**Alerts:**
```markdown
{{% alert context="info" %}}
This is an informational message.
{{% /alert %}}

{{% alert context="warning" %}}
Important warning for users.
{{% /alert %}}
```

Available contexts: `info`, `warning`, `success`, `danger`, `primary`, `default`

**Custom Tabs and More:**
See [Hugo Documentation](content/en/docs/Contributing/Documentation/hugo-documentation.md) for complete shortcode reference.

## Theme

Custom theme based on [Lotus Docs](https://lotusdocs.dev/):
- Repository: https://github.com/quantumx-apps/filebrowserDocsTheme
- Local development: Theme is mounted via `go.mod` replace directive
- Features: Automatic ordering, dark mode, search, responsive design

## CI/CD & Quality Checks

### Automated Deployment

Documentation is deployed automatically on push to main branch via GitHub Actions.

### PR Validation

Pull requests against the main branch are automatically validated with the following checks:

#### Hugo-Specific Validations
1. **Front Matter Syntax** - Validates YAML syntax in all markdown files
2. **Build with Strict Flags** - Builds with `--printPathWarnings`, `--printUnusedTemplates`, etc.
3. **Hugo Audit** - Detects common Hugo issues:
   - Template execution errors (ZgotmplZ)
   - Nil pointer references
   - Raw HTML omissions
   - Missing translations
4. **Required Fields** - Checks for required front matter fields (title, description, icon)

All validation uses Hugo's built-in features - **no external dependencies needed** (except `yq` for local YAML validation)!

### Local Quality Checks

Before submitting a PR, you can run these checks locally:

**Install Dependencies:**
```bash
make setup
```

This installs:
- npm packages (deepl-node, fs-extra, glob) for translation scripts
- Checks for `yq` (YAML validator - install with `brew install yq` on macOS)

**Run Hugo Validation Checks:**
```bash
# Individual checks
make validate-frontmatter  # Validate YAML front matter syntax (needs yq)
make build-strict          # Build with strict validation flags
make hugo-audit            # Check for Hugo-specific issues

# All checks at once
make check-all
```

Hugo validation uses built-in features - no Ruby dependencies required!

### Configuration Files

- `.github/workflows/pr-checks.yml` - PR validation workflow (Hugo-only, no external dependencies)
- `.github/workflows/static.yml` - Production deployment workflow

### Documentation

- [`HUGO_VALIDATION.md`](HUGO_VALIDATION.md) - Detailed guide on Hugo-specific validation checks and common issues

## Translation

Translations are managed with DeepL API integration. Set your API key first:

```bash
export DEEPL_API_KEY="your-api-key"
```

### Translation Commands

```bash
# Check translation status (no API calls)
make translate-check

# Sync all translations (content + i18n strings)
make translate

# Translate only content files
make translate-content

# Translate only i18n strings
make translate-i18n
```

Or use npm directly:
```bash
npm run translate:check
npm run translate
npm run translate:content
npm run translate:i18n
```

### Doclink Management

Convert between relative markdown links and Hugo doclink shortcodes:

```bash
# Convert relative links to doclink shortcodes
make doclinks-convert

# Check doclinks without modifying files
make doclinks-check

# Revert doclinks back to relative links
make doclinks-revert
```

## Contributing

### Documentation Contributions

1. Fork the repository
2. Create a feature branch (`git checkout -b docs/my-improvement`)
3. Write/update documentation
   - Add new pages in `content/en/docs/`
   - Update `lastmod` field in front matter
   - Follow content guidelines above
4. Test locally with `make dev`
5. Run translation sync if you modified English content
6. Submit pull request with clear description

### Best Practices

- **Front Matter**: Always include all required fields (`title`, `description`, `icon`, `date`, `lastmod`)
- **Ordering**: Let automatic ordering work for you; only use `order` field when necessary
- **Links**: Use relative links for internal documentation pages
- **Images**: Place in `static/` directory and reference with `/image-name.png`
- **Code Examples**: Always include working, tested code snippets
- **Troubleshooting**: Add common issues and solutions to help users

## Support

- Issues: https://github.com/gtsteffaniak/filebrowser/issues
- Discussions: https://github.com/gtsteffaniak/filebrowser/discussions

