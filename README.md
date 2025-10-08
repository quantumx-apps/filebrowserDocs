# FileBrowser Quantum Documentation

Modern Hugo-based documentation for FileBrowser Quantum.

## Quick Start

### Run Locally

```bash
hugo server -D
```

Visit: `http://localhost:1313/docs/`

### Build for Production

```bash
hugo
```

Output in `public/` directory.

## Documentation Structure

```
content/docs/
├── _index.md                    # Main landing page
├── Getting Started/             # Quick start guides
├── Configuration/               # How to configure
├── Features/                    # Feature documentation
├── Advanced/                    # Advanced topics (API, CLI, etc)
└── Reference/                   # Complete reference docs
```

## Writing Documentation

### Create a New Page

```bash
hugo new content/docs/section/page-name.md
```

### Front Matter Template

```yaml
---
title: "Page Title"
description: "Brief description"
weight: 1
---
```

### Content Guidelines

- Use clear, concise language
- Include code examples
- Add troubleshooting sections
- Link to related pages
- Use minimal emojis

## Documentation Standards

### File Naming
- Lowercase with hyphens: `getting-started.md`
- Index files: `_index.md`

### Structure
1. Title (# H1)
2. Introduction
3. Main sections (## H2)
4. Subsections (### H3)
5. Code examples
6. Troubleshooting
7. Next Steps

### Code Blocks

Use syntax highlighting:

```yaml
server:
  port: 80
```

```bash
./filebrowser -c config.yaml
```

## Theme

Using custom theme at `../filebrowserDocsTheme`

## Deployment

Documentation is deployed automatically on push to main branch.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write/update documentation
4. Test locally with `hugo server -D`
5. Submit pull request

## Migration Status

See [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) for details on the migration from wiki to Hugo.

## Support

- Issues: https://github.com/gtsteffaniak/filebrowser/issues
- Discussions: https://github.com/gtsteffaniak/filebrowser/discussions

