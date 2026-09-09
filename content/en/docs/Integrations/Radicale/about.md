---
title: "About"
description: "Overview of Radicale integration features"
icon: "info"
---

Overview of calendar (CalDAV) and contact (CardDAV) management with Radicale.

{{% alert context="info" %}}
Radicale is a lightweight, free and open-source CalDAV/CardDAV server. 
It supports multiple users, each with multiple calendars and contact groups accessible via standard clients such as Thunderbird, Apple Calendar, ...
{{% /alert %}}

## Overview

FileBrowser Quantum can integrate with [Radicale](https://radicale.org/) to provide calendar and contact management directly in your environment.

## Support Levels

**Without Integration (Default)**
- Image preview for certain formats
- Basic DOCX and EPUB viewer

**With Radicale Integration**
- Full CalDAV calendar support
- Full CardDAV contact support
- Access via compatible clients (Outlook, Mozilla Thunderbird, ...)

## Features

- ✅ Manage personal and shared calendars
- ✅ Manage personal and shared contacts
- ✅ Support for multiple users
- ✅ Access via standard CalDAV/CardDAV clients
- ✅ Optional authentication and encryption
- ✅ Sync across devices

## Supported Clients

- Apple: macOS Calendar & Contacts, iOS Calendar & Contacts
- Android with DAVx⁵ (formerly DAVdroid)
- GNOME Calendar, Contacts and Evolution
- KDE PIM Applications, KDE Merkuro
- Mozilla Thunderbird (Thunderbird/Radicale) with CardBook and Lightning
- InfCloud (InfCloud/Radicale), CalDavZAP, CardDavMATE and Open Calendar
- pimsync (pimsync/Radicale)

For more details on client compatibility and setup: [Radicale Supported Clients](https://radicale.org/v3.html#supported-clients) 🔗

## Supported File Types

### iCalendar format for events and appointments

```
.ics
```

### vCard format for contacts

```
.vcf
```

## Configuration

To enable Radicale features, you need:

1. Radicale container is running (Docker or Podman) and configured for FileBrowser Quantum.
2. FileBrowser Quantum is configured to communicate with Radicale via custom network and proxy.
3. CalDAV/CardDAV clients (mobile apps, GNOME Calendar, Thunderbird, etc.) are connected using the username and API token.

## Next Steps

- {{< doclink path="integrations/radicale/configuration/" text="Configuration" />}}
- {{< doclink path="user-guides/radicale-integration/radicale-integration/" text="Radicale guides" />}}
- {{< doclink path="integrations/radicale/troubleshooting/" text="Troubleshooting" />}}
