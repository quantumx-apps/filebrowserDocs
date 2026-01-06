---
title: "Translations"
description: "Update and improve language translations on FileBrowser Quantum"
icon: "translate"
---

Contribute translations to make FileBrowser accessible in more languages.

{{% alert context="info" %}}
Looking for how to update FileBrowser documentation translations? See {{< doclink path="contributing/documentation/translations" text="Application Translations" />}}
{{% /alert %}}

## Translation Files

Language files are located at [`frontend/src/i18n/`](https://github.com/gtsteffaniak/filebrowser/tree/main/frontend/src/i18n). The master file is `en.json` - all other languages derive from this.


## Setup

1. Create free account at [DeepL](https://www.deepl.com/en/your-account)
2. Get API token from account dashboard
3. Set environment variable: `export DEEPL_API_KEY="your-api-key-here"`
4. Run: `make sync-translations`


<div class="info-card">
  <h2>How to update translations</h2>

  <p><strong>Finding keys</strong>: Search existing text in language files or check corresponding <code>*.vue</code> files in <code>frontend/src/</code>.</p>

  <h3>Improve Existing Translations for a specific language</h3>

  <ol>
    <li>Navigate to the language file (e.g., <code>es.json</code> for Spanish)</li>
    <li>Find and update the translation key</li>
    <li>Submit a pull request</li>
  </ol>

  <h3>Delete a translation</h3>

  <ol>
    <li>Delete the key from the <code>en.json</code> file</li>
    <li>Run <code>make sync-translations</code> to remove from all other files.</li>
  </ol>

  <h3>Completely change a translation (for all languages)</h3>

  <ol>
    <li>First, delete the translation as mentioned above.</li>
    <li>Add the completely new text back to <code>en.json</code></li>
    <li>Run <code>make sync-translations</code> to re-populate all languages</li>
    <li>Adjust any specific languages afterwards manually.</li>
  </ol>

  <h3>Add New Translation Fields</h3>

  <ol>
    <li>Add field to <code>en.json</code> (master file)</li>
    <li>Set up DeepL API (free account)</li>
    <li>Run auto-translation: <code>make sync-translations</code></li>
    <li>Review and adjust generated translations</li>
  </ol>
</div>

## Best Practices

### Consolidate Translation Keys

If keys are simple words, consider adding them to `general` instead so they can be more generally used across the application.

### Write Lint-Friendly Code

The linter automatically checks that all translation keys exist, but can only verify keys that do not use computed logic.

<div class="comparison-grid">
  <div class="comparison-card good-format">
    <h4>✅ Do this</h4>

```javascript
filesLabel() {
  return this.numFiles === 1
    ? this.$t("general.file")
    : this.$t("general.files");
}
```
  </div>

  <div class="comparison-card bad-format">
    <h4>❌ Don't do this</h4>

```javascript
filesLabel() {
  return this.$t(this.numFiles === 1 ? "general.file" : "general.files")
}
```
  </div>
</div>

### Choose Translation-Friendly Terms

Keep translations in mind when choosing words and terms. Select terminology that will translate well across different languages. For example, use "URL" or "hyperlink" instead of "link".

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

supported languages are limited to those supported by DeepL:

- Arabic (`ar.json`)
- Czech (`cz.json`)
- German (`de.json`)
- Greek (`el.json`)
- English (`en.json`) - master file
- Spanish (`es.json`)
- French (`fr.json`)
- Hebrew (`he.json`)
- Hungarian (`hu.json`)
- Icelandic (`is.json`)
- Italian (`it.json`)
- Japanese (`ja.json`)
- Korean (`ko.json`)
- Dutch (Belgium) (`nl-be.json`)
- Polish (`pl.json`)
- Portuguese (Brazil) (`pt-br.json`)
- Portuguese (`pt.json`)
- Romanian (`ro.json`)
- Russian (`ru.json`)
- Slovak (`sk.json`)
- Swedish (`sv-se.json`)
- Turkish (`tr.json`)
- Ukrainian (`ua.json`)
- Chinese Simplified (`zh-cn.json`)
- Chinese Traditional (`zh-tw.json`)

## Next Steps

- {{< doclink path="contributing/features/" text="Feature development" />}}
- {{< doclink path="contributing/documentation/" text="Documentation guide" />}}

<style>
/* Info Card */
.info-card {
  margin: 2em 0;
  padding: 2em;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  background: var(--surfaceSecondary);
}

.info-card h2 {
  margin-top: 0;
  margin-bottom: 1em;
  color: var(--primary);
  font-size: 1.5em;
}

.info-card h3 {
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  color: var(--textPrimary);
  font-size: 1.2em;
}

.info-card p {
  margin: 1em 0;
  color: var(--textSecondary);
  line-height: 1.6;
}

.info-card ol {
  margin: 1em 0;
  padding-left: 1.5em;
}

.info-card li {
  margin: 0.5em 0;
  color: var(--textSecondary);
  line-height: 1.6;
}

.info-card code {
  background: rgba(14, 165, 233, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
  color: var(--textPrimary);
}

/* Comparison Grid */
.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5em;
  margin: 2em 0;
}

.comparison-card {
  padding: 1.5em;
  border-radius: 8px;
  border: 2px solid var(--gray-300);
}

.comparison-card.good-format {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.comparison-card.bad-format {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.comparison-card h4 {
  margin-top: 0;
  margin-bottom: 1em;
  font-size: 1.1em;
}

.comparison-card.good-format h4 {
  color: #10b981;
}

.comparison-card.bad-format h4 {
  color: #ef4444;
}

/* Dark mode support */
[data-dark-mode] .info-card {
  background: rgba(255, 255, 255, 0.03);
  border-color: var(--gray-700);
}

[data-dark-mode] .info-card code {
  background: rgba(14, 165, 233, 0.2);
}

[data-dark-mode] .comparison-card {
  border-color: var(--gray-700);
}

[data-dark-mode] .comparison-card.good-format {
  border-color: #059669;
  background: rgba(5, 150, 105, 0.1);
}

[data-dark-mode] .comparison-card.bad-format {
  border-color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
}

/* Responsive */
@media (max-width: 768px) {
  .comparison-grid {
    grid-template-columns: 1fr;
  }
}
</style>