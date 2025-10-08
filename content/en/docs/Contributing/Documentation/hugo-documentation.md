---
title: "Understanding Hugo Documentation"
description: "Guide to understanding Hugo-generated documentation structure and conventions"
icon: "code"
weight: 1
katex: true
---

# Understanding Hugo-Generated Documentation

This guide explains how the FileBrowser Quantum documentation is structured using Hugo and the custom theme.

## Hugo Theme

The documentation uses a custom Hugo theme based on [Lotus Docs](https://lotusdocs.dev/), a modern documentation theme for Hugo. The theme provides:

### Getting Help with Lotus Docs

For detailed theme documentation and advanced features, visit the [Lotus Docs website](https://lotusdocs.dev/). The official documentation includes:

- **Configuration options** - All available parameters
- **Customization guides** - Styling and theming
- **Shortcode examples** - How to use custom shortcodes
- **Deployment guides** - Platform-specific instructions
- **Advanced features** - Search, analytics, and more

### Using Theme Features

#### Custom Shortcodes

Lotus Docs provides powerful shortcodes for enhanced content:

**Alerts:**

The theme supports multiple alert types with automatic icons:

{{% alert context="info" %}}
This is an informational alert with automatic icon.
{{% /alert %}}

{{% alert context="warning" %}}
This is a warning alert with automatic icon.
{{% /alert %}}

{{% alert context="success" %}}
This is a success alert with automatic icon.
{{% /alert %}}

{{% alert context="danger" %}}
This is a danger alert with automatic icon.
{{% /alert %}}

{{% alert context="primary" %}}
This is a primary alert with automatic icon.
{{% /alert %}}

{{% alert context="default" %}}
This is a default alert with automatic icon.
{{% /alert %}}

**Alert Types and Icons:**

| Type | Icon | Use Case |
|------|------|----------|
| `info` | ℹ️ info | General information, tips, notes |
| `warning` | ⚠️ warning | Important notices, cautions |
| `success` | ✅ check_circle | Success messages, confirmations |
| `danger` | ❌ report | Errors, critical issues, failures |
| `primary` | ℹ️ info | Primary information, highlights |
| `default` | 🔔 notifications | General notifications, updates |

**Alert Customization:**

You can customize alerts with custom icons and titles:

{{% alert context="info" icon="star" %}}
**Custom Title:** This alert uses a custom star icon instead of the default info icon.
{{% /alert %}}

{{% alert context="warning" text="Short alert message using the text parameter." /%}}

**Rich Content Alerts:**

For detailed alerts with titles and multiple paragraphs:

{{% alert context="info" %}}
**Note:** If you are using Docker, you need to mount a volume with the `branding` directory in order for it to be accessible from within the container.

This is a second paragraph in the same alert. You can include multiple lines of text, code examples, and even lists.

- First item
- Second item
- Third item
{{% /alert %}}

{{% alert context="warning" %}}
**Important:** This is a warning with multiple sections.

The first paragraph explains the main issue.

The second paragraph provides additional context and details about what might happen if you don't follow the instructions.

**Code Example:**
```bash
docker run -v /path/to/branding:/app/branding filebrowser
```
{{% /alert %}}

**Tabs:**

Create interactive tabbed content for organizing related information:

{{< tabs tabTotal="2" >}}
{{< tab tabName="Docker" >}}
```bash
docker run -p 8080:8080 filebrowser
```
{{< /tab >}}
{{< tab tabName="Binary" >}}
```bash
./filebrowser -c config.yaml
```
{{< /tab >}}
{{< /tabs >}}

**Advanced Example with Right-Aligned Tab:**

{{< tabs tabTotal="3" tabRightAlign="3" >}}
{{< tab tabName="Installation" >}}
Installation instructions and setup guides for different platforms.
{{< /tab >}}
{{< tab tabName="Configuration" >}}
Configuration options and customization settings.
{{< /tab >}}
{{< tab tabName="Advanced" >}}
Advanced settings and enterprise features.
{{< /tab >}}
{{< /tabs >}}

**Code Highlighting:**

The theme supports both **PrismJS fenced code blocks** and **Hugo highlight shortcode with line numbers**:

**PrismJS Fenced Code Blocks (Recommended for simple highlighting):**

```yaml
server:
  port: 8080
  sources:
    - path: "/data"
```

**Hugo Highlight Shortcode with Line Numbers:**

{{< highlight yaml "linenos=table" >}}
server:
  port: 8080
  sources:
    - path: "/data"
{{< /highlight >}}

#### Table of Contents

Enable TOC on any page by adding `toc: true` to the front matter.

#### Custom Icons

Use Material Symbols icons in front matter by adding `icon: "icon_name"`.

Available icon categories:
- Navigation: `home`, `menu`, `arrow_back`
- Actions: `play_arrow`, `pause`, `stop`
- Content: `article`, `code`, `image`
- Communication: `chat`, `email`, `phone`
- And many more...

#### Math Equations

Use KaTeX for mathematical expressions. **Important:** You must add `katex: true` to your page's front matter to enable KaTeX rendering.

**Inline Math:**
Inline math: $E = mc^2$

**Block Math:**
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

**KaTeX Shortcode (for complex equations):**

{{< katex >}}
$$
\begin{array} {lcl}
  L(p,w_i) &=& \dfrac{1}{N}\Sigma_{i=1}^N(\underbrace{f_r(x_2 \rightarrow x_1 \rightarrow x_0)G(x_1 \longleftrightarrow x_2)f_r(x_3 \rightarrow x_2 \rightarrow x_1)}_{sample\, radiance\, evaluation\, in\, stage2})
\end{array}
$$
{{< /katex >}}

#### Mermaid Diagrams

Create diagrams with Mermaid using fenced code blocks:

```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
```

## Building Documentation

### Using Makefile

The easiest way to build and serve the documentation locally:

Run `make dev` to:
- Start a local Hugo development server
- Enable live reloading when files change
- Serve the documentation at `http://localhost:1313`

### Manual Hugo Commands

If you prefer to use Hugo directly:

- `hugo server` - Serve locally with live reload
- `hugo` - Build static site
- `hugo --extended` - Build with extended features

## Documentation Structure

### File Organization

The documentation follows a hierarchical structure:
- `_index.md` files serve as section homepages
- Individual pages are organized in logical directories
- Subdirectories group related content
- Each section has its own `_index.md` for navigation

### Required Front Matter

Every documentation page must include front matter with these attributes:
- `title` - Page title (required)
- `description` - Brief description (required)
- `icon` - Material icon name (required)
- `weight` - Sort order, lower numbers appear first (required)

## Understanding Weights

Weights control the order of pages in navigation. Lower numbers appear first:

### Section Weights
- `weight: 1` - Appears first in main navigation
- `weight: 2` - Appears second
- `weight: 3` - Appears third
- etc.

### Page Weights Within Sections
- `weight: 1` - First page in section
- `weight: 2` - Second page in section
- etc.

### Common Weight Patterns

**Main Navigation:**
- Getting Started: `weight: 1`
- Configuration: `weight: 2`
- User Guides: `weight: 3`
- Reference: `weight: 4`
- Contributing: `weight: 5`

**Within Sections:**
- Overview pages: `weight: 1`
- Specific guides: `weight: 2`
- Advanced topics: `weight: 3`
- Troubleshooting: `weight: 4`

## Required Attributes

### Title
- **Required**: Yes
- **Purpose**: Page title displayed in navigation and browser tab
- **Format**: String, should be descriptive and concise
- **Example**: `"Docker Installation"`

### Description
- **Required**: Yes
- **Purpose**: Brief description used in navigation and search
- **Format**: String, 1-2 sentences
- **Example**: `"Install FileBrowser using Docker containers"`

### Icon
- **Required**: Yes
- **Purpose**: Material Design icon displayed in navigation
- **Format**: String, Material icon name
- **Examples**: 
  - `"rocket_launch"` - Getting started
  - `"settings"` - Configuration
  - `"api"` - API reference
  - `"security"` - Access control
  - `"help"` - Help topics

### Weight
- **Required**: Yes
- **Purpose**: Controls sort order in navigation
- **Format**: Integer, lower numbers appear first
- **Range**: 1-999 (typically 1-10 for main sections)

## Extended Hugo Version

The documentation requires **Hugo Extended** version because:

1. **SCSS/SASS Support** - The theme uses SCSS for styling
2. **Advanced Features** - Extended version includes additional processing capabilities
3. **Theme Compatibility** - The custom theme requires extended features

### Checking Your Hugo Version

Run `hugo version` and look for `extended` in the output:
```
hugo v0.121.0+extended darwin/arm64 BuildDate=2024-01-01T00:00:00Z
```

### Installing Hugo Extended

**macOS (Homebrew):** `brew install hugo`

**Windows (Chocolatey):** `choco install hugo-extended`

**Linux:** Download from GitHub releases and install the extended version

**Docker:** `docker run --rm -it -v $(pwd):/src -p 1313:1313 klakegg/hugo:extended server`

## Common Issues

### Build Failures

If you encounter build issues:

1. **Check Hugo Version**: Ensure you have Hugo Extended
2. **Theme Issues**: The theme might need updates
3. **Dependencies**: Missing Hugo modules

### Getting Help

If you're unable to build the documentation:

1. **Check Requirements**: Ensure Hugo Extended is installed
2. **Update Dependencies**: Run `hugo mod get -u`
3. **Open an Issue**: Create an issue on the repository with:
   - Your Hugo version (`hugo version`)
   - Operating system
   - Error messages
   - Steps to reproduce

### Theme Issues

The documentation uses a custom theme. If you encounter theme-related issues:

1. **Theme Updates**: The theme might need updates
2. **Compatibility**: Check Hugo version compatibility
3. **Report Issues**: Open an issue with theme-specific problems

## Development Workflow

### Making Changes

1. **Edit Files**: Modify content in english `content/en/docs`
2. **Preview Changes**: Run `make dev` to see changes live
3. **Test Navigation**: Ensure weights and structure work correctly
4. **Translate**: Export DEEPL_API_KEY and run `make sync-translations` to sync english changes to target languages
5. **Manually Verify**: adjust target translations as needed.
6. **Commit Changes**: Submit pull request with your changes

### Adding New Pages

1. **Create File**: Add new `.md` file in appropriate directory
2. **Add Front Matter**: Include all required attributes
3. **Set Weight**: Choose appropriate weight for ordering
4. **Add to Index**: Update `_index.md` if needed
5. **Test**: Verify page appears in correct location

### Updating Existing Pages

1. **Edit Content**: Modify the markdown content
2. **Update Front Matter**: Adjust title, description, or weight if needed
3. **Test Changes**: Use `make dev` to preview
4. **Translate**: Export DEEPL_API_KEY and run `make sync-translations` to sync english changes to target languages
5. **Manually Verify**: adjust target translations as needed.
6. **Submit PR**: Create pull request with changes

## Best Practices

### Content Guidelines

- **Clear Titles**: Use descriptive, concise titles
- **Good Descriptions**: Write helpful descriptions for navigation
- **Appropriate Icons**: Choose icons that represent the content
- **Logical Weights**: Order content logically (overview first, advanced last)

### File Organization

- **Group Related Content**: Keep related pages in the same directory
- **Use Subdirectories**: Organize complex sections with subdirectories
- **Consistent Naming**: Use kebab-case for file names
- **Index Pages**: Include `_index.md` for each section

### Writing Style

- **Clear and Concise**: Write for users of all technical levels
- **Code Examples**: Include working code examples
- **Cross-References**: Link to related pages
- **Consistent Formatting**: Follow existing formatting patterns

## Multilingual Support (i18n)
- [Translations Guide](/docs/contributing/documentation/translations/)

## Next Steps


- [Documentation Style Guide](/docs/contributing/documentation/documentation/)
- [Troubleshooting](/docs/contributing/documentation/troubleshooting/)
- [Feature Development](/docs/contributing/features/)
