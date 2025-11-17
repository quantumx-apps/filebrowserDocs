# Validation System

This repository has a comprehensive validation system to catch errors before they reach production. The same validation checks run both locally (via makefile) and in CI/CD (via GitHub Actions), ensuring consistency.

## Quick Start

Run all validation checks locally:

```bash
make check-all
```

Or run a quick validation (skips external link checks):

```bash
make check-quick
```

## What Gets Validated

### 1. **YAML Front Matter Syntax** (`make check-frontmatter`)
- Validates that all markdown files have valid YAML front matter
- Catches syntax errors in the `---` delimited front matter sections
- Uses `yq` to parse and validate YAML

### 2. **Required Front Matter Fields** (`make check-frontmatter-fields`)
- Ensures all documentation pages have required fields:
  - `title`: Page title
  - `description`: Page description
  - `icon`: Page icon
- Warns if any required fields are missing

### 3. **Strict Hugo Build** (`make build-strict`)
- Builds the Hugo site with strict validation flags:
  - `--printPathWarnings`: Show path warnings
  - `--printUnusedTemplates`: Show unused templates
  - `--templateMetrics`: Show template performance metrics
  - `--templateMetricsHints`: Show optimization hints

### 4. **Hugo Audit** (`make hugo-audit`)
- Checks the built site for common issues:
  - **Raw HTML omitted**: Unsupported HTML in markdown
  - **ZgotmplZ**: Template execution errors (CRITICAL)
  - **Missing translations**: i18n placeholders
  - **Nil pointer references**: Template nil pointer errors (CRITICAL)

### 5. **Translation Validation** (`make check-translations`)
- Validates that translations are in sync
- Uses `npm run translate:check`
- Ensures all languages have the same keys

### 6. **Doclinks Validation** (`make check-doclinks`)
- Validates doclink shortcodes
- Uses `npm run doclinks:check`
- Ensures internal cross-references are valid

### 7. **Internal Links** (`make check-internal-links`)
- Checks markdown files for broken internal links
- Validates relative links point to existing files
- May have false positives with Hugo-specific paths

### 8. **External Links** (`make check-external-links`)
- Checks external URLs for dead links
- Uses `htmltest` tool (auto-installs if needed)
- Caches results to speed up repeated runs
- Can be slow, so excluded from `validate-quick`

### 9. **Image References** (`make check-images`)
- Validates that all image references point to existing files
- Checks for orphaned images in `static/` directory
- Supports relative and absolute image paths

### 10. **TODO/FIXME Markers** (`make check-no-todos`)
- Warns if TODO or FIXME comments are found in content
- Helps catch unfinished work before merging

## Running Specific Checks

You can run individual validation checks:

```bash
# Just check front matter
make check-frontmatter

# Just check images
make check-images

# Just check translations
make check-translations
```

## CI/CD Integration

The GitHub Actions workflow (`.github/workflows/pr-checks.yml`) runs the same makefile targets, ensuring:

1. **No Logic Duplication**: All validation logic lives in the makefile
2. **Consistency**: Local and CI validation are identical
3. **Easy Testing**: Test CI behavior locally before pushing
4. **Maintainability**: Update validation in one place

The workflow runs on every pull request to `main`.

## Dependencies

### Required
- **Hugo** (extended version): `CGO_ENABLED=1 go install -tags extended github.com/gohugoio/hugo@latest`
- **yq**: For YAML validation ([install instructions](https://github.com/mikefarah/yq#install))
- **Node.js & npm**: For translation and doclink validation

### Optional
- **htmltest**: For external link checking (auto-installs in makefile)

## Setup

Install all dependencies:

```bash
make setup
```

This will:
1. Install npm dependencies
2. Install Hugo (extended)
3. Check for yq (with install instructions if missing)

## Troubleshooting

### "yq not found"

Install yq:
- **macOS**: `brew install yq`
- **Linux**: 
  ```bash
  wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64
  chmod +x /usr/local/bin/yq
  ```

### "node_modules not found"

Run `npm install` in the repository root.

### "htmltest not found"

The makefile will attempt to auto-install it. If that fails:
- **macOS**: `brew install htmltest`
- **Linux**: Download from [htmltest releases](https://github.com/wjdp/htmltest/releases)

### Translation validation fails

Make sure you have npm dependencies installed: `npm install`

If you need to actually translate content (not just validate), you'll need:
```bash
export DEEPL_API_KEY=your-api-key
make translate
```

## Best Practices

1. **Run validation before committing**:
   ```bash
   make check-quick  # Fast check before every commit
   ```

2. **Run full validation before creating PR**:
   ```bash
   make check-all  # Complete check before PR
   ```

3. **Fix errors immediately**: Don't let validation errors accumulate

4. **Use individual checks during development**: If working on images, just run `make check-images`

5. **Keep dependencies updated**: Regularly run `make setup`

## Adding New Validation Checks

To add a new validation check:

1. **Add a makefile target** in the "VALIDATION CHECKS" section:
   ```makefile
   validate-my-check:
       @echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
       @echo "Running my validation check..."
       @echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
       # Your validation logic here
       @echo "✅ My check passed"
       @echo ""
   ```

2. **Add to `validate-all` target**:
   ```makefile
   validate-all: ... validate-my-check
   ```

3. **Add to GitHub Actions** (`.github/workflows/pr-checks.yml`):
   ```yaml
   - name: Run my validation check
     run: make check-my-check
   ```

4. **Update help text** in makefile

5. **Document in this file**

## Performance

- **`validate-quick`**: ~30 seconds (no external link checks)
- **`validate-all`**: 2-5 minutes (includes external link checks)
- Individual checks: 5-30 seconds each

External link checking is cached, so repeated runs are faster.

## Support

If you encounter issues with validation:

1. Check this documentation
2. Run individual checks to isolate the problem
3. Check the makefile for the exact commands being run
4. Review GitHub Actions logs for CI failures
5. Open an issue with details of the validation error

## Summary

The validation system helps maintain high quality documentation by:
- ✅ Catching errors early in development
- ✅ Ensuring consistency across the site
- ✅ Validating content, structure, and references
- ✅ Matching local and CI/CD validation exactly
- ✅ Providing fast feedback to developers
- ✅ Making the review process smoother

Run `make help` to see all available commands.

