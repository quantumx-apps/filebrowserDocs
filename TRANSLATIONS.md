# Documentation Translations

This directory contains the translation files for the FileBrowser Quantum documentation.

## Structure

- `i18n/` - Translation files in JSON format
- `scripts/sync-translations.js` - Translation synchronization script
- `package.json` - NPM scripts for translation management

## Translation Workflow

### 1. Check for Translation Changes

```bash
# Check UI translations
npm run i18n:check

# Check content translations
npm run content:check
```

This will check what translations need to be updated without actually performing any translations.

### 2. Sync Translations with DeepL

```bash
# Set your DeepL API key
export DEEPL_API_KEY="your-deepl-api-key"

# Sync UI translations
npm run i18n:sync

# Sync content translations
npm run content:sync
```

**UI Translation Sync:**
- Read the master English translation file (`i18n/en.json`)
- Generate/update translation files for all supported languages
- Use DeepL API for automatic translation
- Preserve the `languages` section (copied as-is from master)
- Handle placeholders in translation strings

**Content Translation Sync:**
- ✅ **Preserves manual edits** - Only translates when English content changes
- ✅ **Translation markers** - Adds `<!-- TRANSLATED -->` to track translated files
- ✅ **Content comparison** - Uses MD5 hashes to detect changes
- ✅ **Incremental updates** - Only translates new or modified content
- Create language-specific content directories (`content/de/docs/`, `content/fr/docs/`, etc.)
- Translate all markdown files using DeepL
- Preserve front matter, code blocks, and markdown formatting
- Skip translation of code, tables, and special markdown elements

### 4. Build Documentation

```bash
# Development server
npm run docs:dev

# Production build
npm run docs:build
```

## Supported Languages

The documentation supports all languages that your frontend application supports:

- English (en) - Master language
- Arabic (ar)
- Czech (cs)
- German (de)
- Greek (el)
- Spanish (es)
- French (fr)
- Hebrew (he)
- Hungarian (hu)
- Icelandic (is)
- Italian (it)
- Japanese (ja)
- Korean (ko)
- Dutch - Belgium (nl-be)
- Polish (pl)
- Portuguese (pt)
- Portuguese - Brazil (pt-br)
- Romanian (ro)
- Russian (ru)
- Slovak (sk)
- Swedish - Sweden (sv-se)
- Turkish (tr)
- Ukrainian (uk)
- Chinese - Simplified (zh-cn)
- Chinese - Traditional (zh-tw)

## Content Structure

Hugo will automatically create language-specific URLs:

- English: `/docs/getting-started/` (default)
- German: `/de/docs/getting-started/`
- French: `/fr/docs/getting-started/`
- Spanish: `/es/docs/getting-started/`

## Translation File Structure

### UI Translations (`i18n/`)

Translation files are organized in sections:

```json
{
  "navigation": {
    "home": "Home",
    "getting-started": "Getting Started",
    // ... navigation items
  },
  "ui": {
    "search-placeholder": "Search documentation...",
    "read-more": "Read More",
    // ... UI elements
  },
  "languages": {
    "en": "English",
    "de": "Deutsch",
    // ... language names
  }
}
```

### Content Structure

```
content/
├── docs/                    # English content (default)
│   ├── getting-started.md
│   ├── configuration.md
│   └── ...
├── de/docs/                 # German content
│   ├── getting-started.md
│   ├── configuration.md
│   └── ...
├── fr/docs/                 # French content
│   ├── getting-started.md
│   ├── configuration.md
│   └── ...
└── es/docs/                 # Spanish content
    ├── getting-started.md
    ├── configuration.md
    └── ...
```

## Adding New Translation Keys

1. Add the key to `i18n/en.json` in the appropriate section
2. Run `npm run i18n:sync` to translate to all languages
3. Review and adjust translations as needed

## Notes

- The `languages` section is always copied from the master file and not translated
- Placeholders in strings (like `{variable}`) are preserved during translation
- Icelandic (is) is excluded from automatic translation as DeepL doesn't support it
- The script handles rate limiting and error recovery automatically
