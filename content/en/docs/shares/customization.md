---
title: "Customization"
description: "Branding and appearance options"
icon: "auto_awesome"
order: 1
---

Customize share appearance with branding elements, colors, and custom content. These options appear in the **Show More** section of the share creation dialog.

## Customization Options

### Theme Color

<div class="option-field">
  <label>Share Theme Color</label>
  <input type="text" placeholder="e.g., red, #0ea5e9, rgb(14,165,233)" />
  <p class="help-text">CSS color value applied to the share's theme (e.g., red, #0ea5e9, rgb(14,165,233)).</p>
</div>

The theme color is applied to:
- Buttons and interactive elements
- Links and accents
- Progress indicators
- Active states
- Navigation highlights

**Examples:**
- Hex: `#0066cc`, `#e91e63`
- RGB: `rgb(0, 102, 204)`
- Named colors: `red`, `blue`, `green`

### Page Title

<div class="option-field">
  <label>Share Title</label>
  <input type="text" placeholder="Custom page title" />
  <p class="help-text">Custom page title shown on the share page.</p>
</div>

The title appears in:
- Browser tabs
- Bookmarks
- Browser history
- Window titles

**Default if not set:**
- Normal share: `"Shared files - {filename}"`
- Upload share: `"Upload Files"`

**Examples:**
- `"Q4 Financial Reports"`
- `"Project Alpha Deliverables"`
- `"Event Photos Upload"`

### Page Description

<div class="option-field">
  <label>Share Description</label>
  <textarea placeholder="Short description"></textarea>
  <p class="help-text">Short description shown on the share page (may be used in meta tags).</p>
</div>

The description is used for:
- Social media link previews
- Messaging app previews
- Search engine results
- Browser tooltips

**Default values:**
- Normal share: `"A share has been sent to you to view or download."`
- Upload share: `"A share has been sent to you to upload files."`

**Best practices:**
- Keep under 160 characters
- Include relevant keywords
- Be descriptive and clear
- Avoid sensitive information

### Custom Banner

<div class="option-field">
  <label>Share Banner</label>
  <input type="text" placeholder="https://domain.com/banner.png or /path/to/banner.png" />
  <p class="help-text">Banner image URL or path accessible by the client -- either absolute or index path are accepted: eg 'https://domain.com/banner.png' or '/path/to/banner.png'</p>
</div>

Display a custom banner at the top of the share page. Supports both plain text and HTML.

**Image URLs:**
- Absolute: `https://company.com/banner.png`
- Index path: `/images/banner.png`

### Custom Favicon

<div class="option-field">
  <label>Share Favicon</label>
  <input type="text" placeholder="https://domain.com/favicon.png or /path/to/favicon.png" />
  <p class="help-text">Favicon URL or path accessible by the client -- either absolute or index path are accepted: eg 'https://domain.com/favicon.png' or '/path/to/favicon.png'</p>
</div>

Set a custom favicon that appears in browser tabs and bookmarks.

**URL formats:**
- Absolute: `https://example.com/favicon.ico`
- Index path: `/icons/favicon.png`

**Requirements:**
- Must be publicly accessible by clients
- Recommended sizes: 16x16, 32x32, or 48x48 pixels
- Supported formats: `.ico`, `.png`, `.svg`

## Complete Branding Examples

### Corporate Share

<div class="example-card">
  <h4>Professional corporate file sharing</h4>

  <div class="example-field">
    <strong>Theme Color:</strong> <code>#003366</code> <span class="color-preview" style="background:#003366;"></span>
  </div>

  <div class="example-field">
    <strong>Title:</strong> Acme Corp - Secure File Transfer
  </div>

  <div class="example-field">
    <strong>Description:</strong> Secure file sharing portal for client deliverables
  </div>

  <div class="example-field">
    <strong>Banner:</strong>
    <pre><code>&lt;img src='https://acme.com/logo.png' width='200'&gt;
&lt;br&gt;&lt;strong&gt;Confidential Files&lt;/strong&gt;</code></pre>
  </div>

  <div class="example-field">
    <strong>Favicon:</strong> <code>https://acme.com/favicon.ico</code>
  </div>
</div>

### Event File Collection

<div class="example-card">
  <h4>Photo upload portal for events</h4>

  <div class="example-field">
    <strong>Share Type:</strong> Upload
  </div>

  <div class="example-field">
    <strong>Theme Color:</strong> <code>#28a745</code> <span class="color-preview" style="background:#28a745;"></span>
  </div>

  <div class="example-field">
    <strong>Title:</strong> Event Photos Upload
  </div>

  <div class="example-field">
    <strong>Description:</strong> Share your photos from the company event
  </div>

  <div class="example-field">
    <strong>Banner:</strong>
    <pre><code>&lt;h2&gt;📸 Company Event 2025&lt;/h2&gt;
&lt;p&gt;Upload your photos here!&lt;/p&gt;</code></pre>
  </div>

  <div class="example-field">
    <strong>Expiration:</strong> 30 days
  </div>
</div>

### Client Portal

<div class="example-card">
  <h4>Minimalist client document portal</h4>

  <div class="example-field">
    <strong>Theme Color:</strong> <code>#6c757d</code> <span class="color-preview" style="background:#6c757d;"></span>
  </div>

  <div class="example-field">
    <strong>Title:</strong> Client Portal - ABC Project
  </div>

  <div class="example-field">
    <strong>Description:</strong> Project files and documentation
  </div>

  <div class="example-field">
    <strong>Banner:</strong>
    <pre><code>&lt;h3&gt;ABC Project Files&lt;/h3&gt;
&lt;p&gt;Last updated: January 2025&lt;/p&gt;</code></pre>
  </div>

  <div class="example-field">
    <strong>Options:</strong> Disable share card, List view mode
  </div>
</div>

### Marketing Materials

<div class="example-card">
  <h4>Brand assets gallery</h4>

  <div class="example-field">
    <strong>Theme Color:</strong> <code>#e91e63</code> <span class="color-preview" style="background:#e91e63;"></span>
  </div>

  <div class="example-field">
    <strong>Title:</strong> Marketing Assets Q1 2025
  </div>

  <div class="example-field">
    <strong>Description:</strong> Downloadable marketing materials and brand assets
  </div>

  <div class="example-field">
    <strong>Banner:</strong>
    <pre><code>&lt;h2&gt;Brand Assets&lt;/h2&gt;
&lt;p&gt;For internal use only&lt;/p&gt;</code></pre>
  </div>

  <div class="example-field">
    <strong>Options:</strong> Quick download enabled, Gallery view mode
  </div>
</div>

## Best Practices

### Color Selection

- **Use hex color codes** for consistency (`#0066cc`)
- **Match your brand colors** for professional appearance
- **Ensure sufficient contrast** for readability
- **Test in both light and dark modes** - some colors work better in specific modes

### Banner Content

- **Keep it concise** - users should quickly understand the purpose
- **Use HTML for formatting** - creates more professional appearance
- **Include important information** - deadlines, instructions, warnings
- **Consider mobile users** - test responsive design on smaller screens
- **Use inline styles** - ensures consistent appearance across browsers

### Title and Description

- **Use clear, descriptive titles** - helps users identify the share
- **Keep descriptions under 160 characters** - optimal for social media previews
- **Include relevant keywords** - improves searchability
- **Match the tone** to your audience and purpose
- **Avoid sensitive information** - titles and descriptions may be cached

### Favicon

- **Use consistent branding** - helps users identify shares from your organization
- **Ensure accessibility** - must be reachable from share URLs
- **Test in browsers** - verify appearance in different browsers
- **Use appropriate formats** - `.ico` for best compatibility, `.png` or `.svg` for modern browsers
- **Consider size** - 32x32 pixels is a safe default

## Security Considerations

When using custom HTML in banners:

⚠️ **Important Security Notes:**

- **Avoid sensitive information** - banners are visible to all share users
- **Don't embed third-party scripts** - potential security risk
- **Use HTTPS URLs only** - for images and resources
- **Test for XSS vulnerabilities** - sanitize any user-provided content
- **Limit external resources** - reduces privacy concerns and loading times

## Common Use Cases

### Password-Protected Client Delivery

Combine customization with security:
- Set theme color to match client branding
- Add banner with instructions for password
- Set descriptive title and description
- Enable password protection
- Set expiration date

### Public File Gallery

Create an attractive public gallery:
- Add banner with description
- Enforce gallery view mode

### Internal Document Portal

Professional internal sharing:
- Use corporate theme color
- Add banner with department info
- Restrict to allowed usernames
- Disable anonymous access
- Keep after expiration for auditing

## Next Steps

- {{< doclink path="shares/options/" text="Common options" />}}
- {{< doclink path="shares/normal/" text="Normal shares" />}}
- {{< doclink path="shares/upload/" text="Upload shares" />}}

<style>
/* Light mode (default) */
.option-field {
  margin: 1.5em 0;
  padding: 1em;
  border-left: 3px solid var(--primary, #0ea5e9);
  background: rgba(14, 165, 233, 0.06);
  border-radius: 4px;
}

.option-field label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.5em;
  color: var(--text-default);
}

.option-field input[type="text"],
.option-field input[type="password"],
.option-field input[type="number"],
.option-field textarea,
.option-field select {
  width: 100%;
  padding: 0.5em;
  border: 1px solid var(--gray-400);
  border-radius: 4px;
  font-family: inherit;
  background: var(--white);
  color: var(--text-default);
}

.option-field textarea {
  min-height: 80px;
  resize: vertical;
}

.help-text {
  margin-top: 0.5em;
  font-size: 0.9em;
  color: var(--text-muted);
  font-style: italic;
}

.example-card {
  margin: 2em 0;
  padding: 1.5em;
  border: 2px solid var(--gray-300);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.02);
}

.example-card h4 {
  margin-top: 0;
  margin-bottom: 1em;
  color: var(--primary);
  font-size: 1.1em;
}

.example-field {
  margin: 1em 0;
  padding: 0.5em 0;
}

.example-field strong {
  display: inline-block;
  min-width: 120px;
  color: var(--text-default);
}

.example-field code {
  background: var(--inline-code-bg);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9em;
}

.example-field pre {
  margin: 0.5em 0 0 0;
  padding: 0.75em;
  background: var(--code-block-bg);
  border-radius: 4px;
  overflow-x: auto;
}

.example-field pre code {
  background: none;
  padding: 0;
  font-size: 0.85em;
}

.color-preview {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 1px solid var(--gray-400);
  vertical-align: middle;
  margin-left: 0.5em;
}

/* Dark mode support using theme's selector */
[data-dark-mode] .option-field {
  background: rgba(14, 165, 233, 0.12);
}

[data-dark-mode] .option-field input[type="text"],
[data-dark-mode] .option-field input[type="password"],
[data-dark-mode] .option-field input[type="number"],
[data-dark-mode] .option-field textarea,
[data-dark-mode] .option-field select {
  background: var(--surfaceSecondary);
  border: 1px solid var(--gray-700);
  color: var(--text-default);
}

[data-dark-mode] .option-field input[type="text"]::placeholder,
[data-dark-mode] .option-field input[type="password"]::placeholder,
[data-dark-mode] .option-field input[type="number"]::placeholder,
[data-dark-mode] .option-field textarea::placeholder {
  color: var(--text-muted);
}

[data-dark-mode] .example-card {
  background: rgba(255, 255, 255, 0.03);
  border-color: var(--gray-700);
}

[data-dark-mode] .color-preview {
  border-color: var(--gray-600);
}
</style>
