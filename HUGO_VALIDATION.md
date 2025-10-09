# Hugo-Specific Validation Guide

This document explains the Hugo-specific validation checks implemented in our CI/CD pipeline.

## Overview

While generic markdown and HTML validation are useful, Hugo has specific issues that can occur during site generation. Our validation workflow catches these Hugo-specific problems before they reach production.

## Hugo-Specific Checks

### 1. Front Matter YAML Validation

**What it checks:** Validates that all front matter blocks contain valid YAML syntax.

**Why it matters:** Invalid YAML in front matter will cause Hugo to fail to parse the page, resulting in missing pages or build failures.

**Common issues caught:**
- Incorrect YAML indentation
- Missing quotes around special characters
- Invalid date formats
- Malformed arrays or objects

**Example:**
```yaml
# ❌ Bad
title: My Page: A Guide  # Unquoted colon after title
date: 2024-13-45         # Invalid date

# ✅ Good
title: "My Page: A Guide"
date: "2024-01-15T10:00:00Z"
```

### 2. Hugo Build with Strict Flags

**Flags used:**
- `--printPathWarnings` - Warns about file path issues
- `--printUnusedTemplates` - Shows templates that aren't being used
- `--templateMetrics` - Shows template execution performance
- `--templateMetricsHints` - Provides optimization suggestions
- `--verbose` - Detailed output for debugging

**What it checks:**
- File naming conflicts
- Unused template files (potential cleanup candidates)
- Slow template execution
- Path resolution issues
- Resource loading problems

**Why it matters:** These flags help identify inefficiencies and potential issues before they impact production performance.

### 3. Hugo Audit - ZgotmplZ Detection

**What it checks:** The string `ZgotmplZ` in generated HTML.

**Why it matters:** `ZgotmplZ` is Hugo's way of indicating a template execution error or unsafe content that was prevented from rendering. This always indicates a problem.

**Common causes:**
- Incorrect variable references in templates
- Type mismatches in template functions
- Unsafe URL construction
- Missing or nil values in templates

**Example:**
```html
<!-- ❌ Generated output with error -->
<a href="ZgotmplZ">Link</a>

<!-- Caused by template code like: -->
<a href="{{ .Params.url }}">Link</a>  <!-- when .Params.url is nil or unsafe -->
```

**Fix:** Always check variables and use safe defaults:
```go-html-template
{{ with .Params.url }}
  <a href="{{ . }}">Link</a>
{{ end }}
```

### 4. Hugo Audit - Nil Pointer Detection

**What it checks:** The string `<nil>` or `&lt;nil&gt;` in generated HTML.

**Why it matters:** These indicate you're trying to render a variable that doesn't exist or hasn't been set, resulting in the literal text "nil" appearing on your page.

**Common causes:**
- Accessing undefined parameters
- Missing context variables
- Incorrect variable scope in templates

**Example:**
```html
<!-- ❌ Generated output -->
<p>Author: <nil></p>

<!-- Caused by: -->
<p>Author: {{ .Params.author }}</p>  <!-- when author is not set -->
```

**Fix:** Use conditionals or defaults:
```go-html-template
<p>Author: {{ .Params.author | default "Unknown" }}</p>
```

### 5. Hugo Audit - Raw HTML Omissions

**What it checks:** The string `raw HTML omitted` in generated HTML.

**Why it matters:** Hugo's markdown renderer (Goldmark) has security features that block certain HTML tags by default. This appears when you try to use unsafe HTML.

**Common causes:**
- Using `<iframe>`, `<script>`, `<style>` tags directly in markdown
- Embedding raw HTML without proper configuration
- Security-sensitive HTML attributes

**Solutions:**
1. Use Hugo shortcodes instead of raw HTML
2. Configure Goldmark to allow specific HTML:
   ```toml
   [markup.goldmark.renderer]
     unsafe = true  # Use with caution
   ```
3. Use Hugo's built-in features (like `figure` shortcode instead of raw HTML)

**Example:**
```markdown
<!-- ❌ This will show "raw HTML omitted" -->
<iframe src="https://example.com"></iframe>

<!-- ✅ Create a shortcode instead -->
{{< iframe src="https://example.com" >}}
```

### 6. Hugo Audit - Missing Translations

**What it checks:** The string `[i18n]` in generated HTML.

**Why it matters:** Indicates missing translation strings in multilingual sites. Users will see `[i18n] translation_key` instead of proper content.

**Common causes:**
- Translation key doesn't exist in i18n files
- Typo in translation key name
- Missing language file for the current locale

**Example:**
```html
<!-- ❌ Generated output -->
<button>[i18n] submit_button</button>

<!-- Caused by: -->
<button>{{ i18n "submit_button" }}</button>  <!-- when translation doesn't exist -->
```

**Fix:** Ensure all i18n keys are defined in your `i18n/` directory files.

### 7. Required Front Matter Fields

**What it checks:** Presence of required fields: `title`, `description`, `icon`

**Why it matters:** Our theme requires these fields for:
- Proper navigation menu generation
- SEO optimization (title, description)
- Icon display in menus and cards

**Example:**
```yaml
---
# ✅ Complete front matter
title: "Getting Started"
description: "Quick start guide for FileBrowser Quantum"
icon: "rocket_launch"
date: "2024-01-15T10:00:00Z"
---
```

## Hugo Build Flags Explained

### --printPathWarnings
Warns about:
- Duplicate content paths
- Conflicting taxonomies
- URL collisions
- Resource path issues

### --printUnusedTemplates
Lists templates that exist but are never called. Helps with:
- Identifying dead code
- Cleanup opportunities
- Template organization

### --templateMetrics & --templateMetricsHints
Shows:
- Template execution time
- Memory usage
- Optimization opportunities
- Slow template functions

## Running Locally

```bash
# Individual Hugo checks
make validate-frontmatter  # Check YAML syntax
make build-strict          # Build with all warnings
make hugo-audit            # Check for Hugo issues

# All checks
make check-all
```

## CI/CD Integration

These checks run automatically on every PR. The Hugo validation job will:
1. ✅ Block merge if critical errors found (ZgotmplZ, nil pointers)
2. ⚠️  Show warnings for non-critical issues (raw HTML, missing translations)
3. 📊 Display template metrics for performance insights

## Common Hugo Issues Quick Reference

| Issue | Detection String | Severity | Fix |
|-------|-----------------|----------|-----|
| Template error | `ZgotmplZ` | 🔴 Critical | Check variable existence, use safe defaults |
| Nil pointer | `<nil>` | 🔴 Critical | Use conditionals or default values |
| Unsafe HTML | `raw HTML omitted` | ⚠️ Warning | Use shortcodes or enable unsafe HTML |
| Missing i18n | `[i18n]` | ⚠️ Warning | Add translation strings |
| Invalid YAML | Build fails | 🔴 Critical | Fix YAML syntax |
| Missing field | Warning in logs | ⚠️ Warning | Add required front matter |

## Additional Resources

- [Hugo Troubleshooting Guide](https://gohugo.io/troubleshooting/)
- [Hugo Template Debugging](https://gohugo.io/templates/template-debugging/)
- [Goldmark Configuration](https://gohugo.io/getting-started/configuration-markup/)
- [Hugo Front Matter](https://gohugo.io/content-management/front-matter/)

## Best Practices

1. **Always run `make check-all` before creating a PR**
2. **Fix ZgotmplZ and nil pointer errors immediately** - they indicate real bugs
3. **Consider using shortcodes** instead of raw HTML for better portability
4. **Keep front matter consistent** across all documentation pages
5. **Review template metrics** periodically to maintain performance
6. **Use Hugo's verbose mode** (`--verbose`) when debugging build issues

## Need Help?

If you encounter Hugo-specific issues not covered here:
1. Check the [Hugo documentation](https://gohugo.io/documentation/)
2. Search [Hugo Discourse](https://discourse.gohugo.io/)
3. Open an issue in this repository with the full error message

