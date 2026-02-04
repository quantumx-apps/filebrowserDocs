---
title: "Upload Shares"
description: "Upload-only shares for collecting files"
icon: "upload"
order: 4
---

Upload-only shares allow users to upload files to a specific location without viewing or accessing existing content.

## What Upload Shares Include

Upload shares provide:
- ✅ **File upload capability** - Users can upload files and folders
- ✅ **Upload progress indication** - Real-time upload progress
- ✅ **Upload confirmation** - Success/error feedback

Upload shares **do not** provide:
- ❌ **File browsing** - Cannot see existing files
- ❌ **File viewing** - Cannot preview or open files
- ❌ **Downloading** - Cannot download any files
- ❌ **Directory visibility** - Cannot see folder structure

{{% alert context="info" %}}
Upload shares are perfect for collecting submissions where privacy between uploaders is important.
{{% /alert %}}

## How to Create an Upload Share

1. Navigate to the **destination directory** where uploads should be stored
2. Click the **Share** button in the actions menu
3. Set **Share Type** to `Upload only`
4. Configure your desired options
5. Click **Share** to generate the link
6. Copy and share the upload URL with your users

## Available Options

Upload shares support most {{< doclink path="shares/options/" text="common options" />}}:

### Basic Settings

<div class="option-field">
  <label>Share Duration</label>
  <div class="field-group">
    <input type="number" placeholder="0" />
    <select>
      <option>minutes</option>
      <option>hours</option>
      <option>days</option>
    </select>
  </div>
  <p class="help-text">Duration before the share expires. Leave blank for a permanent share.</p>
</div>

<div class="option-field">
  <label>Optional Password</label>
  <input type="password" />
  <p class="help-text">Optional password required to access this upload portal.</p>
</div>

### Access Control

<div class="option-field">
  <label>
    <input type="checkbox" /> Disable anonymous access
  </label>
  <p class="help-text">Only authenticated users can access the share. The user must have access to the source of the share.</p>
</div>

<div class="option-field">
  <label>
    <input type="checkbox" /> Only share to certain users
  </label>
  <p class="help-text">Only the specified users can access the share. The user must have access to the source of the share.</p>
  <input type="text" placeholder="Enter usernames, comma-separated" />
</div>

### Upload Permissions

<div class="option-field">
  <label>
    <input type="checkbox" /> Allow Replacements
  </label>
  <p class="help-text">Allow replacing existing files when uploading.</p>
</div>

### Branding

<div class="option-field">
  <label>Share Title</label>
  <input type="text" placeholder="Custom page title" />
  <p class="help-text">Custom page title shown on the share page.</p>
</div>

<div class="option-field">
  <label>Share Description</label>
  <textarea placeholder="Short description"></textarea>
  <p class="help-text">Short description shown on the share page.</p>
</div>

<div class="option-field">
  <label>Share Theme Color</label>
  <input type="text" placeholder="e.g., #0ea5e9" />
  <p class="help-text">CSS color value applied to the share's theme.</p>
</div>

<div class="option-field">
  <label>Share Banner</label>
  <input type="text" placeholder="Custom banner text or HTML" />
  <p class="help-text">Banner displayed at the top of the upload page.</p>
</div>

## Options NOT Available

These normal share options **do not apply** to upload shares because there is no viewing/downloading:

<div class="unavailable-options">
  <ul>
    <li>❌ Disable File Viewer (no viewer exists)</li>
    <li>❌ Show Quick Download (no downloads available)</li>
    <li>❌ Downloads Limit (no downloads possible)</li>
    <li>❌ Per User Download Limit (no downloads possible)</li>
    <li>❌ Max Bandwidth (only applies to downloads)</li>
    <li>❌ Disable Thumbnails (no browsing available)</li>
    <li>❌ Disable Sidebar (no sidebar shown)</li>
    <li>❌ View Mode (no viewing available)</li>
    <li>❌ Enable OnlyOffice (no viewing available)</li>
    <li>❌ Enable OnlyOffice Editing (no viewing available)</li>
    <li>❌ Extract Embedded Subtitles (no media viewing)</li>
    <li>❌ Disable File Viewer (no viewer exists)</li>
    <li>❌ Disable Download (no downloads available)</li>
    <li>❌ Allow Modify (no file editing available)</li>
    <li>❌ Allow Delete (no file deletion available)</li>
    <li>❌ Show Hidden Files (no file browsing available)</li>
  </ul>
</div>

## Configuration Examples

### Basic Upload Portal

Simple upload portal with 7-day expiration:

<div class="example-card">
  <h4>Basic homework submission portal</h4>

  <div class="example-field">
    <strong>Destination:</strong> /submissions/homework
  </div>

  <div class="example-field">
    <strong>Expiration:</strong> 7 days
  </div>

  <div class="example-field">
    <strong>Result:</strong> Students can upload homework for one week
  </div>
</div>

### Authenticated Upload Only

Require users to be logged in:

<div class="example-card">
  <h4>Internal employee upload</h4>

  <div class="example-field">
    <strong>Options:</strong>
    <ul>
      <li>☑ Disable anonymous access</li>
    </ul>
  </div>

  <div class="example-field">
    <strong>Use case:</strong> Only authenticated employees can upload
  </div>
</div>

### Specific Users Only

Restrict uploads to specific usernames:

<div class="example-card">
  <h4>Student group project submission</h4>

  <div class="example-field">
    <strong>Allowed Users:</strong> student1, student2, student3
  </div>

  <div class="example-field">
    <strong>Result:</strong> Only these three students can access the upload portal
  </div>
</div>

### Password Protected Upload

Require password for upload access:

<div class="example-card">
  <h4>Secure file collection</h4>

  <div class="example-field">
    <strong>Password:</strong> upload2025
  </div>

  <div class="example-field">
    <strong>Use case:</strong> Share the password separately to control access
  </div>
</div>

### Branded Upload Portal

Custom branding for professional appearance:

<div class="example-card">
  <h4>Professional submission portal</h4>

  <div class="example-field">
    <strong>Title:</strong> Homework Submission Portal
  </div>

  <div class="example-field">
    <strong>Description:</strong> Upload your assignment files here
  </div>

  <div class="example-field">
    <strong>Banner:</strong>
    <pre><code>&lt;h3&gt;Assignment Due: Friday&lt;/h3&gt;</code></pre>
  </div>

  <div class="example-field">
    <strong>Theme Color:</strong> <code>#0066cc</code> <span class="color-preview" style="background:#0066cc;"></span>
  </div>
</div>

### Event Photo Collection

Collect photos from event participants:

<div class="example-card">
  <h4>Company event photo upload</h4>

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
    <strong>Theme Color:</strong> <code>#28a745</code> <span class="color-preview" style="background:#28a745;"></span>
  </div>

  <div class="example-field">
    <strong>Expiration:</strong> 30 days
  </div>
</div>

### Complete Secure Example

Full configuration with all security options:

<div class="example-card">
  <h4>Secure project submission</h4>

  <div class="example-field">
    <strong>Destination:</strong> /submissions/project-2025
  </div>

  <div class="example-field">
    <strong>Password:</strong> project2025
  </div>

  <div class="example-field">
    <strong>Expiration:</strong> 14 days
  </div>

  <div class="example-field">
    <strong>Options:</strong>
    <ul>
      <li>☐ Anonymous access allowed</li>
      <li>☑ Keep after expiration</li>
    </ul>
  </div>

  <div class="example-field">
    <strong>Branding:</strong>
    <ul>
      <li>Title: "Project Submission"</li>
      <li>Description: "Upload your project files"</li>
      <li>Banner: "Maximum file size: 100MB per file"</li>
      <li>Theme: #6c757d</li>
    </ul>
  </div>
</div>

## Common Use Cases

### Homework/Assignment Submissions

<div class="use-case">
  <strong>Scenario:</strong> Collect student assignments without allowing them to see other submissions<br>
  <strong>Configuration:</strong> Upload share + expiration + optional password<br>
  <strong>Privacy:</strong> Students cannot see each other's work
</div>

### Resume/Application Collection

<div class="use-case">
  <strong>Scenario:</strong> Allow job applicants to upload resumes<br>
  <strong>Configuration:</strong> Permanent upload share + professional branding<br>
  <strong>Privacy:</strong> Applicants cannot view other applications
</div>

### Event Photo Gathering

<div class="use-case">
  <strong>Scenario:</strong> Collect photos from event participants<br>
  <strong>Configuration:</strong> Upload share + gallery theme + 30-day expiration<br>
  <strong>Privacy:</strong> Participants can't see others' photos
</div>

### Client File Submissions

<div class="use-case">
  <strong>Scenario:</strong> Allow clients to upload documents, designs, or files<br>
  <strong>Configuration:</strong> Password-protected upload + brand customization<br>
  <strong>Security:</strong> Password + optional user restrictions
</div>

### Anonymous Feedback with Attachments

<div class="use-case">
  <strong>Scenario:</strong> Enable file uploads for anonymous feedback or reports<br>
  <strong>Configuration:</strong> Upload share with anonymous access enabled<br>
  <strong>Privacy:</strong> Complete anonymity for submitters
</div>

### Contest/Competition Entries

<div class="use-case">
  <strong>Scenario:</strong> Collect competition entries without revealing submissions<br>
  <strong>Configuration:</strong> Upload share + expiration at contest deadline<br>
  <strong>Fairness:</strong> Entries remain private until judging
</div>

## Public Access URL

Upload shares are accessible via:
```
https://your-domain.com/public/share/{hash}
```

Users see a clean upload interface with your custom branding but cannot browse, view, or download existing files.

## Security Best Practices

### 1. Set Expiration Dates

<div class="best-practice">
  <strong>Why:</strong> Automatically close submission windows<br>
  <strong>Example:</strong> Set 7-day expiration for weekly homework submissions
</div>

### 2. Use Password Protection

<div class="best-practice">
  <strong>Why:</strong> Prevent unauthorized uploads<br>
  <strong>Example:</strong> Share password separately via email or in class
</div>

### 3. Limit to Specific Users

<div class="best-practice">
  <strong>Why:</strong> Restrict to known users only<br>
  <strong>Example:</strong> Use <code>allowedUsernames</code> for internal submissions
</div>

### 4. Require Authentication

<div class="best-practice">
  <strong>Why:</strong> Track who uploaded what<br>
  <strong>Example:</strong> Enable <code>disableAnonymous</code> for accountability
</div>

### 5. Use Custom Instructions

<div class="best-practice">
  <strong>Why:</strong> Provide upload guidelines and requirements<br>
  <strong>Example:</strong> Banner with "Maximum file size: 100MB, PDF only"
</div>

## Tips and Best Practices

💡 **Clear Instructions**: Use the banner to provide upload guidelines (file types, size limits, naming conventions)

💡 **Set Expectations**: Include deadline information in the title or description

💡 **Professional Appearance**: Use custom branding for client-facing portals

💡 **Privacy Assurance**: Remind users that their uploads are private in the description

💡 **Track Submissions**: Use authenticated access for accountability

💡 **Temporary Links**: Set expiration dates for time-sensitive submissions

## Next Steps

- {{< doclink path="shares/normal-shares/" text="Normal shares" />}} - Create viewing/downloading shares
- {{< doclink path="shares/options/" text="Common options" />}} - Options available to all share types
- {{< doclink path="shares/customization/" text="Customization" />}} - Brand your shares with colors and logos

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

.option-field input[type="checkbox"] {
  margin-right: 0.5em;
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
  min-height: 60px;
  resize: vertical;
}

.field-group {
  display: flex;
  gap: 0.5em;
}

.field-group input {
  flex: 2;
}

.field-group select {
  flex: 1;
}

.help-text {
  margin-top: 0.5em;
  font-size: 0.9em;
  color: var(--text-muted);
  font-style: italic;
}

.unavailable-options {
  margin: 1.5em 0;
  padding: 1.5em;
  background: rgba(244, 67, 54, 0.05);
  border-left: 3px solid #f44336;
  border-radius: 4px;
}

.unavailable-options ul {
  margin: 0;
  padding-left: 1.5em;
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
  min-width: 140px;
  color: var(--text-default);
}

.example-field ul {
  margin: 0.5em 0 0 0;
  padding-left: 1.5em;
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

.use-case {
  margin: 1em 0;
  padding: 1em;
  background: rgba(14, 165, 233, 0.04);
  border-left: 3px solid var(--primary);
  border-radius: 4px;
}

.best-practice {
  margin: 1em 0;
  padding: 1em;
  background: rgba(76, 175, 80, 0.05);
  border-left: 3px solid #4caf50;
  border-radius: 4px;
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

[data-dark-mode] .unavailable-options {
  background: rgba(244, 67, 54, 0.1);
}

[data-dark-mode] .example-card {
  background: rgba(255, 255, 255, 0.03);
  border-color: var(--gray-700);
}

[data-dark-mode] .use-case {
  background: rgba(14, 165, 233, 0.08);
}

[data-dark-mode] .best-practice {
  background: rgba(76, 175, 80, 0.1);
}

[data-dark-mode] .color-preview {
  border-color: var(--gray-600);
}
</style>
