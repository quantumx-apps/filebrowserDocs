---
title: "About FileBrowser Quantum"
description: "Learn about FileBrowser Quantum"
icon: "info"
---

Learn about FileBrowser Quantum - the best free self-hosted web-based file manager.

## Overview

FileBrowser Quantum provides an easy way to access and manage your files from the web. It has a modern responsive interface with many advanced features to manage users, access, sharing, and file preview and editing.

This version is called "Quantum" because it packs tons of advanced features into a tiny easy-to-run file. Unlike the majority of alternative options, FileBrowser Quantum is simple to install and easy to configure.

**Goal**: Become the best open-source self-hosted file browsing application that exists -- **all for free**. This repo will always be free and open-source.

## Key Features

### Multiple Sources Support
Access multiple directories or storage locations from one interface.

### Advanced Authentication
- Password authentication with optional 2FA
- OIDC single sign-on
- Proxy authentication

### Beautiful UI
Responsive, customizable interface with themes and branding support.

### Simplified Configuration
Everything configured via a single `config.yaml` file.

### Ultra-Efficient Indexing
- Real-time search results as you type
- Real-time monitoring and updates in the UI
- Search supports file and folder sizes with various filters

### Better File Browsing
- Office and video file previews
- Instant view mode switching
- Folder sizes displayed
- Remembers scroll position

### Flexible Sharing
- Share expiration time
- User-specific or anonymous access
- Custom styling and themes
- File viewing, editing, and uploading permissions

### Directory-Level Access Control
Scoped access rules per user or group.

### Developer API
- Long-lived API tokens
- Swagger documentation at `/swagger` endpoint

## What's Different from Original FileBrowser

FileBrowser Quantum is a massive fork with significant changes:

**Added Features**:
- ✅ Multiple sources support
- ✅ OIDC, password + 2FA, and proxy authentication
- ✅ Beautiful, responsive, customizable UI
- ✅ Simplified configuration via `config.yaml`
- ✅ Ultra-efficient indexing and real-time updates
- ✅ More file type previews (office, video)
- ✅ Highly configurable sharing options
- ✅ Directory-level access control
- ✅ Developer API with long-lived tokens

**Removed Features**:
- ❌ Shell commands (completely removed for security)
- :construction: Jobs (not supported yet, planned)

## System Requirements

{{% alert context="info" %}}
Every file and directory in the source gets indexed by default. This enables powerful features like instant search, but large filesystems increase memory requirements.
{{% /alert %}}

- **Memory**: Depends on source complexity (typically 256MB minimum)
- **GPU**: Not currently used (planned)

See [How much RAM does it require?](https://github.com/gtsteffaniak/filebrowser/discussions/787) for details.

## The User Interface

The UI has a simple three-component navigation system:

1. **(Left)** Multi-action button with slide-out panel
2. **(Middle)** Powerful search bar
3. **(Right)** View change toggle

All other functions are in the action menu or context pop-up menus.

<p align="center">
  <img width="800" src="https://github.com/user-attachments/assets/aa32b05c-f917-47bb-b07f-857edc5e47f7" title="Search">
</p>

## Current Status

{{% alert context="warning" %}}
There is no stable version yet. Stable release planned for 2025.
{{% /alert %}}

Current release status:
- **Beta**: Frequent releases, latest features
- **Stable**: Coming soon

See [latest announcements](https://github.com/gtsteffaniak/filebrowser/discussions) for updates.

## Comparison with Alternatives

FileBrowser Quantum compares favorably with alternatives:

| Feature | Quantum | Nextcloud | Google Drive | FileRun |
|---------|---------|-----------|--------------|---------|
| Self-hostable | ✅ | ✅ | ❌ | ✅ |
| Filesystem support | ✅ | ❌ | ❌ | ✅ |
| Multiple sources | ✅ | ✅ | ❌ | ✅ |
| Standalone binary | ✅ | ❌ | ❌ | ❌ |
| Docker image size | 180 MB | 250 MB | ❌ | > 2 GB |
| Min. memory | 256 MB | 512 MB | ❌ | 512 MB |
| Price | Free | Free tier | Free tier | $99+ |
| Advanced search | ✅ | Configurable | ✅ | ✅ |
| Single sign-on | ✅ | ✅ | ✅ | ✅ |
| API documentation | ✅ | ✅ | ❌ | ✅ |
| Office file support | ✅ | ✅ | ✅ | ✅ |
| Themes | ✅ | ❌ | ❌ | ✅ |
| Branding | ✅ | ❌ | ❌ | ✅ |
| Open source | ✅ | ✅ | ❌ | ❌ |

See [full comparison](https://github.com/gtsteffaniak/filebrowser#comparison-chart) for more details.

## Why This Fork Exists

This fork exists to create the ultimate version of FileBrowser with features and improvements that would take years to merge into the original project.

### Reasons for Forking

1. **Velocity** - The original maintainers are less active, changes would be 100x slower
2. **Vision** - My changes are an opinionated departure requiring nearly complete rewrite
3. **Freedom** - Full control over features, UX, and technical decisions

If you look at the commit history, I have personally contributed more code changes than any other contributor on the original FileBrowser. This version is well over 50% my code.

## Ultimate Vision

My vision for this free software:

- **Minimal requirements** - Easy to install and configure, even for Docker
- **Feature parity** - Compete with paid alternatives while remaining free
- **Powerhouse features** - Advanced media player, job manager, duplicate detection, security scanning
- **Metrics dashboard** - User activity, system activity, job activity, API activity

None of this would be possible without creating this forked repo.

## Get Started

Ready to try it out? See {{< doclink path="getting-started/" text="Getting Started" />}}.

## Next Steps

- {{< doclink path="getting-started/" text="Getting Started" />}}
- {{< doclink path="configuration/" text="Configuration" />}}
- {{< doclink path="help/qa/" text="Q&A" />}}
- [GitHub Repository](https://github.com/gtsteffaniak/filebrowser)

