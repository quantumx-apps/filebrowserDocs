---
title: "Troubleshooting"
description: "Common documentation issues and solutions"
icon: "bug_report"
---

Common issues and solutions for documentation development.

## Page Not Appearing

**Check**:
- File is `.md` extension
- Front matter is valid YAML
- File is in correct directory structure
- File is in correct folder

## Navigation Wrong Order

**Fix**: Move file to correct directory position (ordering is automatic based on file structure)

## Icons Not Showing

**Check**:
- Icon name matches Material Symbols
- `sidebarIcons = true` in hugo.toml
- Icon field is lowercase: `icon: "settings"`

## Build Errors

```bash
hugo server
```

Look for error messages about:
- Invalid YAML
- Missing front matter
- Broken links

## Next Steps

- [Documentation guide](/docs/contributing/documentation/)
- [Feature development](/docs/contributing/features/)
