---
title: "In-editor settings"
description: "Configure the built-in text editor from the toolbar, including soft wrap for long lines"
icon: "edit_note"
date: "2026-10-12T00:00:00Z"
lastmod: "2026-10-12T00:00:00Z"
---

{{% alert context="info" %}}
**v2.1.x**
{{% /alert %}}

The built-in text editor stores per-browser preferences in **local storage** under the key `editorConfig` (a JSON object). These values are not in `config.yaml` and are not synced through **Settings → Profile** on the server. They apply only on the device and browser where you change them.

## Open the settings prompt

While the text editor is open:

- Open the toolbar **More options** menu (⋯) and choose **Editor settings**, or
- Press **Ctrl+,** (**Cmd+,** on macOS).

The prompt lists dropdowns and toggles for editor behavior (keybindings, tab size, gutter options, autocompletion, and others).

## Wrap long lines (soft wrap)

**Stored field:** `wrapEditorContent` in the `editorConfig` local storage object (boolean, default `false`)

In **Editor settings**, enable **Wrap long lines in the editor**. When on, the Ace editor wraps long lines in the viewport so you can read them without horizontal scrolling. When off (default), long lines extend horizontally and you scroll sideways to see them.

With wrap enabled, an **Indented soft wrap** toggle appears in the same prompt. It adds indentation at the start of wrapped continuation lines.

This is separate from profile **File viewer options** (`userDefaults.editorQuickSave`, `userDefaults.preferEditorForMarkdown`, and related defaults). See {{< doclink path="user-preferences/file-viewer-options/" text="File viewer options" />}} for those server-side defaults.

## Reset

Use **Reset defaults** at the bottom of the **Editor settings** prompt to restore all in-editor preferences (including wrap) to their built-in defaults.

## Related

- {{< doclink path="features/previewing-files/" text="Previewing files" />}} — which file types open in the editor
- {{< doclink path="user-preferences/file-viewer-options/" text="File viewer options" />}} — profile defaults for viewers and editor shortcuts
