---
title: "Feature Development"
description: "Developer guide for adding features and fixing bugs"
icon: "construction"
---

Contribute code to FileBrowser Quantum by adding features or fixing bugs.

## Prerequisites

Before starting development:

- **Go 1.25+** (see `backend/go.mod`)
- **Node.js 18.0.0+** with npm 7.0.0+ (see `frontend/package.json`)
- **Git**
- **make** (for build commands)

### Optional Tools

**For media features**:
- **ffmpeg** - Thumbnails, subtitles, HEIC conversion
  - Ubuntu/Debian: `sudo apt-get install ffmpeg`
  - macOS: `brew install ffmpeg`
  - Windows: Download from [ffmpeg.org](https://ffmpeg.org/download.html)

**For PDF previews**:
- **mupdf-tools** - PDF preview generation
  - Ubuntu/Debian: `sudo apt-get install mupdf-tools`
  - macOS: `brew install mupdf-tools`
  - Windows: Download from [mupdf.com](https://mupdf.com/downloads/)

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/gtsteffaniak/filebrowser.git
cd filebrowser

# 2. Initial setup - installs dependencies and creates test config
make setup

# 3. Run in development mode with hot-reloading
make dev
```

**What `make setup` does**:
- Installs backend Go dependencies
- Installs frontend npm dependencies
- Creates `backend/test_config.yaml` for local testing

**What `make dev` does**:
- Builds frontend with hot-reloading
- Starts backend server
- Automatically rebuilds on file changes

## Release Strategy

FileBrowser uses a structured release workflow:

![release-workflow-diagram](https://github.com/user-attachments/assets/682a9f00-784f-4131-af0b-10b5677716d6)

### Branch Structure

1. **`dev/vX.X.X`** - Development branches (may be broken/non-functional)
2. **`beta/vX.X.X`** - Beta releases with binaries
3. **`stable/vX.X.X`** - Stable releases (separated by weeks)
4. **`main`** - Latest code, triggers `latest` Docker image

### Development Flow

1. Feature branch created from `dev/vX.X.X` (e.g., `my-new-feature`)
2. Pull request to `dev/vX.X.X`
3. When ready, `dev/vX.X.X` promoted to `beta/vX.X.X`
4. Beta tested, then promoted to `stable/vX.X.X`

{{% alert context="info" %}}
Bug fixes for beta/stable must go through the dev → beta → stable promotion process. Only non-functional changes (README, config, workflows) can go directly to beta/stable via PR.
{{% /alert %}}

### Release Cadence

**Beta**: Frequent releases, may include every minor version  
**Stable**: Separated by weeks, may skip minor versions

Example: `beta/v1.1.1` → `beta/v1.1.2`, but `stable/v1.1.1` may be skipped if `stable/v1.1.2` is ready within the stable release window.

## GitHub Workflow

### Automated Tests

Every branch/PR runs:
- **Unit tests**: Code compilation and basic functionality
- **Linting**: Code standard checks
- **Playwright tests**: Integration tests (UI automation)

<img width="500" alt="test-status" src="https://github.com/user-attachments/assets/5126c68d-fcec-4a8b-967d-2622f0a98f5f" />

### Automated Releases

- **`stable/vX.X.X`** and **`beta/vX.X.X`**: Auto-generate releases with binaries (via goreleaser)
- **`main`**: Updates `latest` Docker image tag

## Contributing as Unofficial Contributor

If you don't have write access:

1. **Fork** the repository
2. Create feature branch from `main`
3. Open **pull request** against `main`
4. Maintainer may change base to current `dev/vX.X.X` branch

### Pull Request Requirements

- ✅ Clear description of why it was opened
- ✅ Short descriptive title
- ✅ Passes unit and integration tests
- ✅ Additional details for functionality not covered by tests

{{% alert context="success" %}}
**Tip:** Test changes in your fork first, or open as draft PR if not ready.
{{% /alert %}}

## Project Architecture

### Backend (Go)
- **Entry Point**: `backend/main.go` → `backend/cmd/`
- **HTTP Server**: `backend/http/` - API routes, middleware, auth
- **Storage**: BoltDB via `backend/database/storage/`
- **Authentication**: Multiple providers in `backend/auth/`
- **Indexing**: Real-time search in `backend/indexing/`
- **Previews**: Image/video/document generation in `backend/preview/`

### Frontend (Vue.js + TypeScript)
- **Framework**: Vue 3 + Vite + TypeScript
- **State**: Custom store in `frontend/src/store/`
- **API Client**: Axios-based in `frontend/src/api/`
- **i18n**: 25+ languages with English as main
- **Components**: Feature-based organization

## Development Commands

### Essential Commands
```bash
make dev          # Start development server with hot-reloading
make test         # Run all tests
make lint         # Check code quality
make check-all    # Lint + tests (run before PR)

make build-frontend  # Build frontend only
make build-backend   # Build backend only
make build          # Build Docker image
```

### Testing Commands
```bash
make test              # All tests
make test-backend      # Go tests with race detection
make test-frontend     # Frontend unit tests
make test-playwright   # E2E tests in Docker
```

### Frontend-Specific
```bash
cd frontend
npm run lint:fix   # Auto-fix linting issues
npm run i18n:sync  # Sync translation changes
```

### Windows Development

Windows requires manual build process:

```bash
# Compile frontend
cd frontend
npm run build-windows

# Run backend
cd ../backend
go run . -c test_config.yaml
```

## Testing

### Test Coverage
```bash
cd backend
./run_check_coverage.sh  # Coverage report with HTML output
```

View report: Open `backend/coverage.html` after running.

**Coverage Requirements**:
- Maintain 80%+ coverage for critical packages
- CI enforces coverage checks
- Use `go test -cover` for quick package coverage

### E2E Tests

Playwright tests run with three authentication modes:
- Standard authentication
- No authentication
- Proxy authentication

```bash
make test-playwright  # Run all E2E tests
```

### Performance Testing
```bash
cd backend
./run_benchmark.sh  # Run benchmarks
```

## Contributing as Official Contributor

Official contributors have write access:
- Follow release strategy directly (no fork needed)
- Handle incoming PRs
- Answer GitHub issues/discussions
- Manage releases

To become an official contributor, email info@quantumx-apps.com with your GitHub username and contribution history.

## Getting Help

- **Wiki**: [Project Wiki](https://github.com/gtsteffaniak/filebrowser/wiki)
- **Issues**: [GitHub Issues](https://github.com/gtsteffaniak/filebrowser/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gtsteffaniak/filebrowser/discussions)
- **Roadmap**: [Project Roadmap](https://github.com/users/gtsteffaniak/projects/4/views/2)

## Troubleshooting

For common development issues, see the [Troubleshooting guide](/docs/contributing/features/troubleshooting/).

## Code Standards

### Backend (Go)
- **Linting**: `backend/.golangci.yml` with 30+ checks
- **Format**: Use `gofmt` (automated in CI)
- **Testing**: Maintain 80%+ coverage
- **Errors**: Handle all errors explicitly
- **Style**: Follow existing patterns in the codebase

### Frontend (Vue.js)
- **Linting**: ESLint with Vue 3 + TypeScript rules
- **i18n**: English is master locale, all text must use `$t('key')`
- **Types**: Use TypeScript everywhere
- **Fix**: Run `npm run lint:fix` before committing
- **Components**: Use Vue 3 Composition API

### Configuration
- **Test Config**: `backend/test_config.yaml` (auto-generated by `make setup`)
- Never commit test configuration changes
- Use environment variables for secrets

## Pull Request Process

### Before Submitting

1. **Fork and branch**: Create a feature branch from `main`
2. **Make changes**: Follow code standards and existing patterns
3. **Test**: Run `make dev` to test your changes locally
4. **Verify**: Run `make check-all` to ensure tests and linting pass
5. **Document**: Update documentation if needed

### PR Requirements

- ✅ Clear description of changes
- ✅ All tests must pass
- ✅ Follows existing code patterns
- ✅ Updated documentation (if applicable)
- ✅ No new linting errors

### Commit Format

Use conventional commits:

```
type(scope): description

Types: feat, fix, docs, refactor, test, chore
```

**Examples**:
```
feat(search): add fuzzy search support
fix(auth): resolve OIDC callback redirect issue
docs(api): update share endpoint documentation
```

## Build & Deployment

### Single Binary Build

The project builds into a single binary with embedded frontend:

```bash
make build-frontend  # Build Vue.js app
make build-backend   # Build Go binary with embedded assets
```

The frontend is embedded into the Go binary, creating a portable executable.

### Docker Build

```bash
make build  # Full image with ffmpeg and muPDF
```

Includes:
- FileBrowser binary
- FFmpeg for media processing
- muPDF tools for PDF previews

## Next Steps

- [Translation guide](/docs/contributing/translations/)
- [Documentation guide](/docs/contributing/documentation/)
