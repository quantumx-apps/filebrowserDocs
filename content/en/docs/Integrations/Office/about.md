---
title: "About"
description: "Overview of office integration features"
icon: "info"
---

Overview of office document preview and editing capabilities.

{{% alert context="info" %}}
OnlyOffice is currently the only supported office integration. Collabora support is planned for the future.
{{% /alert %}}

## Overview

FileBrowser Quantum integrates with [OnlyOffice Document Server](https://helpcenter.onlyoffice.com/docs/installation/docs-developer-install-docker.aspx#runningonlyofficedocsusinghttps_block) to provide document preview and editing capabilities directly in the browser.

## Support Levels

**Without Integration (Default)**
- Image preview for certain formats
- Basic DOCX and EPUB viewer

**With OnlyOffice Integration**
- Wide range of preview types
- Full office editor
- Real-time collaboration

## Features

- ✅ Open and edit office documents
- ✅ Enable/disable OnlyOffice per user
- ✅ Create new files from UI
- ✅ Office document previews
- ✅ Real-time collaboration
- ✅ Share office files with editing

## Supported File Types

### Word Processing
```
.doc, .docm, .docx, .dot, .dotm, .dotx, .epub, .fb2, .fodt, .htm, .html, 
.mht, .mhtml, .odt, .ott, .rtf, .stw, .sxw, .txt, .wps, .wpt, .xml
```

### Spreadsheets
```
.csv, .et, .ett, .fods, .ods, .ots, .sxc, .xls, .xlsb, .xlsm, .xlsx, 
.xlt, .xltm, .xltx
```

### Presentations
```
.dps, .dpt, .fodp, .odp, .otp, .pot, .potm, .potx, .pps, .ppsm, .ppsx, 
.ppt, .pptm, .pptx, .sxi
```

### Other Formats
```
.djvu, .docxf, .oform, .oxps, .pdf, .xps
```

## Native Preview Support

Without OnlyOffice, these formats have native preview:

```
.pdf, .xps, .epub, .mobi, .fb2, .cbz, .svg, .txt, .docx, .ppt, .pptx, 
.xlsx, .hwp, .hwpx
```

## Configuration

To enable these office features, you need:

1. A running OnlyOffice server accessible from both server and client
2. Update config.yaml to add the integration with URL and JWT secret

### Basic Configuration

```yaml
integrations:
  office:
    url: "http://onlyoffice-server:8000"  # OnlyOffice Document Server URL
    secret: "your-secret-key"             # Optional JWT secret for security
```

### Server Settings

```yaml
server:
  baseURL: "/filebrowser"                 # Base URL for external access
  internalUrl: "http://filebrowser:8080"  # (Optional) internal URL for OnlyOffice server communication
```

{{% alert context="warning" %}}
`internalUrl` should be accessible from the OnlyOffice server. This is typically a Docker network or private address.
{{% /alert %}}

## Troubleshooting


### Enable OnlyOffice Debug Mode

The easiest way to troubleshoot OnlyOffice issues is to enable the built-in debug mode:

1. **Navigate to Profile Settings** → **File Viewer Options** → **Enable OnlyOffice Debug Mode**
2. **Toggle "Debug OnlyOffice Editor"** to ON
3. **Open any document** with OnlyOffice editor
4. **View the debug tooltip** that appears automatically

#### Debug Information Includes

**Basic Configuration:**
- OnlyOffice server URL and internal URL usage
- File source, path, and share information  
- Base URL and authentication context

**Network Flow:**
- Browser ↔ OnlyOffice server communication
- OnlyOffice → FileBrowser download URL (with domain)
- OnlyOffice → FileBrowser callback URL (with domain)

**Process Steps:**
- Configuration URL building and validation
- API request status and config retrieval
- OnlyOffice server connection status
- Document download progress  
- Editor initialization results
- Real-time error detection and classification

#### Network Testing

Test download URL manually:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" "http://your-server/api/raw?files=source%3A%3Apath"
```

Test from OnlyOffice server perspective:
```bash
# From OnlyOffice server container/machine
curl "http://filebrowser:8080/api/raw?files=source%3A%3Apath&auth=token"
```

### Common Configuration Issues

#### 1. Docker Network Setup

If using Docker, ensure services can communicate:

```yaml
# docker-compose.yml
services:
  filebrowser:
    image: filebrowser/filebrowser
    environment:
      - INTERNAL_URL=http://filebrowser:8080

  onlyoffice:
    image: onlyoffice/documentserver
```

#### 2. Reverse Proxy Configuration

When using a reverse proxy, ensure proper headers:

```nginx
# nginx.conf
location /onlyoffice/ {
    proxy_pass http://onlyoffice:8000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Status Codes Reference

### OnlyOffice Callback Status Codes
- `1`: Document being edited
- `2`: Document ready for saving (closed with changes)
- `3`: Document saving error
- `4`: Document closed without changes
- `6`: Document being edited, but force save requested
- `7`: Document error

### HTTP Response Codes
- `200`: Success
- `400`: Bad request (missing parameters, invalid format)
- `403`: Forbidden (no access to source, no modify permissions)
- `404`: Not found (file not found, document ID generation failed)
- `500`: Internal server error (configuration issues, system errors)

## Next Steps

- {{< doclink path="integrations/office/configuration/" text="Configuration" />}}
- {{< doclink path="integrations/office/guides/" text="Guides" />}}
- {{< doclink path="integrations/office/troubleshooting/" text="Troubleshooting" />}}
