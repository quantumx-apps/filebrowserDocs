---
title: "Welcome Contributors"
description: "Get started contributing to FileBrowser Quantum"
icon: "waving_hand"
---

Thank you for your interest in contributing to FileBrowser Quantum! This guide will help you find the right way to contribute.

## Ways to Contribute

### 💻 {{< doclink path="contributing/features/" text="Code Contributions" />}}
Add features, fix bugs, and improve the codebase.

**Best for**:
- Developers familiar with Go and Vue.js
- Those wanting to add new features
- Bug fixers and performance optimizers

**What you'll need**:
- Go 1.25+
- Node.js 18.0.0+
- Basic understanding of the codebase

### 🌍 {{< doclink path="contributing/translations/" text="Translation Contributions" />}}
Help make FileBrowser accessible in more languages.

**Best for**:
- Native speakers of supported languages
- Those wanting to improve existing translations
- Adding new language support

**What you'll need**:
- Language proficiency
- Basic text editor
- DeepL API key (for auto-translation)

### 📚 {{< doclink path="contributing/documentation/" text="Documentation Contributions" />}}
Improve guides, references, and examples.

**Best for**:
- Technical writers
- Those who found gaps in documentation
- Users wanting to share knowledge

**What you'll need**:
- Markdown knowledge
- Hugo (for local preview)
- Understanding of the topic you're documenting

## Quick Start for New Contributors

### 1. Choose Your Contribution Type

**Not sure where to start?**
- Browse [open issues](https://github.com/gtsteffaniak/filebrowser/issues) labeled `good first issue`
- Check the [project roadmap](https://github.com/users/gtsteffaniak/projects/4/views/2)
- Ask in [discussions](https://github.com/gtsteffaniak/filebrowser/discussions) what help is needed

### 2. Set Up Your Environment

For code contributions:
```bash
# Clone the repository
git clone https://github.com/gtsteffaniak/filebrowser.git
cd filebrowser

# Install dependencies and create test config
make setup

# Run development server
make dev
```

For documentation:
```bash
cd docs
hugo server
```

### 3. Make Your Changes

Follow the specific guide for your contribution type:
- {{< doclink path="contributing/features/" text="Feature development guide" />}}
- {{< doclink path="contributing/translations/" text="Translation guide" />}}
- {{< doclink path="contributing/documentation/" text="Documentation guide" />}}

### 4. Submit Your Work

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Contributing Without Code

You can help without writing code:

### 🐛 Report Bugs
Found a bug? [Open an issue](https://github.com/gtsteffaniak/filebrowser/issues/new) with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- System information

### 💡 Request Features
Have an idea? [Start a discussion](https://github.com/gtsteffaniak/filebrowser/discussions/new) to:
- Describe your use case
- Explain the benefit
- Discuss implementation approaches

### 💬 Help Others
Answer questions in:
- [GitHub Discussions](https://github.com/gtsteffaniak/filebrowser/discussions)
- [GitHub Issues](https://github.com/gtsteffaniak/filebrowser/issues)

### 🧪 Test Beta Releases
Try beta versions and report issues:
- Download from [releases](https://github.com/gtsteffaniak/filebrowser/releases)
- Test in your environment
- Report any issues found

## Understanding the Project

### Architecture Overview

**Backend (Go)**:
- REST API server
- BoltDB database
- Real-time indexing
- Multiple auth providers

**Frontend (Vue.js + TypeScript)**:
- Vue 3 with Vite
- 25+ language support
- Responsive design
- Real-time updates

### Release Strategy

FileBrowser uses a structured workflow:

1. **`dev/vX.X.X`** - Active development (may be unstable)
2. **`beta/vX.X.X`** - Beta testing with binaries
3. **`stable/vX.X.X`** - Production releases
4. **`main`** - Latest code for `latest` Docker tag

See {{< doclink path="contributing/features/" text="Feature Development" />}} for details.

## Code Standards

### Go Backend
- Use `gofmt` for formatting
- Follow `golangci-lint` rules
- Maintain 80%+ test coverage
- Handle all errors explicitly

### Vue Frontend
- TypeScript everywhere
- Use i18n for all text (`$t('key')`)
- Run `npm run lint:fix` before committing
- Follow Vue 3 composition API

### Documentation
- Use Markdown with Hugo front matter
- Add icons to all pages
- Include code examples
- Link to related topics

## Communication

### GitHub Resources
- **Issues**: Bug reports and feature requests
- **Discussions**: Questions and general topics
- **Pull Requests**: Code contributions
- **Wiki**: Additional documentation

### Response Time
This is a community-driven project with limited maintainer time. Please be patient:
- Issues reviewed within a few days
- PRs reviewed within a week
- Complex features may need discussion first

## Recognition

Contributors are recognized in:
- Git commit history
- Release notes
- Project README
- Contributor list

## Getting Help

### Where to Ask
- **Development questions**: GitHub Discussions
- **Bug reports**: GitHub Issues
- **Documentation**: This site
- **Email**: info@quantumx-apps.com (non-technical only)

### Before Asking
1. Search existing issues/discussions
2. Check documentation
3. Review wiki pages
4. Try debugging locally

## Next Steps

Ready to contribute? Choose your path:

- **{{< doclink path="contributing/features/" text="Feature Development" />}}** - Start coding
- **{{< doclink path="contributing/translations/" text="Translations" />}}** - Help with languages
- **{{< doclink path="contributing/documentation/" text="Documentation" />}}** - Improve docs

Thank you for helping make FileBrowser Quantum better! 🚀

