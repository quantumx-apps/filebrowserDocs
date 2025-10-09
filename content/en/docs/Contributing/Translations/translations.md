---
title: "Translations"
description: "Update and improve language translations"
icon: "translate"
---

Contribute translations to make FileBrowser accessible in more languages.

## Translation Files

Language files are located at [`frontend/src/i18n/`](https://github.com/gtsteffaniak/filebrowser/tree/main/frontend/src/i18n). The master file is `en.json` - all other languages derive from this.

## Quick Updates

### Improve Existing Translations

1. Navigate to the language file (e.g., `es.json` for Spanish)
2. Find and update the translation key
3. Submit a pull request

**Finding keys**: Search existing text in language files or check corresponding `*.vue` files in `frontend/src/`.

### Add New Translation Fields

1. Add field to `en.json` (master file)
2. Set up DeepL API (free account)
3. Run auto-translation: `cd frontend && npm run i18n:sync`
4. Review and adjust generated translations

## Auto-Translation Setup

1. Create free account at [DeepL](https://www.deepl.com/en/your-account)
2. Get API token from account dashboard
3. Set environment variable: `export DEEPL_API_KEY="your-api-key-here"`
4. Run: `cd frontend && npm run i18n:sync`

## Best Practices

- **Consistency**: Use consistent terminology across the app
- **Conciseness**: Keep UI text short and clear
- **Context**: Consider where text appears (buttons, errors, tooltips)
- **Testing**: Change language in browser settings and verify translations appear correctly

## Language File Structure

```json
{
  "buttons": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "errors": {
    "notFound": "File not found"
  }
}
```

## Supported Languages

We currently support a focused set of languages to ensure high-quality translations:

- **English** (master) - Default language
- **German** (de) - Deutsch
- **Spanish** (es) - Español  
- **French** (fr) - Français
- **Chinese Simplified** (zh-cn) - 中文 (简体)

## Adding New Language

To add a new language to our supported set:

1. Update `hugo.toml` to include the new language configuration
2. Update both translation scripts (`sync-translations.js` and `translate-content-smart.js`) to include the new language
3. Copy `en.json` to new file (e.g., `it.json` for Italian)
4. Translate all fields using DeepL or manual translation
5. Update documentation to reflect the new language
6. Open pull request

{{% alert context="info" %}}
We maintain a focused set of languages to ensure translation quality and maintenance efficiency.
{{% /alert %}}

## Next Steps

- {{< doclink path="contributing/features/" text="Feature development" />}}
- {{< doclink path="contributing/documentation/" text="Documentation guide" />}}