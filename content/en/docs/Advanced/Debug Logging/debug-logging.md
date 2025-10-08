---
title: "Debug Logging"
description: "Enable detailed logging for troubleshooting"
icon: "bug_report"
weight: 1
---

Enable debug logging to get detailed information about FileBrowser operations for troubleshooting.

## Enable Debug Logging

Set the `log` parameter in your configuration:

```yaml
log: "debug"
```

Or via environment variable:
```bash
FB_LOG=debug
```

## Log Levels

| Level | Description |
|-------|-------------|
| `error` | Only error messages |
| `warn` | Warnings and errors |
| `info` | General information (default) |
| `debug` | Detailed debugging information |

## Debug Log Output

When debug logging is enabled, you'll see detailed information about:

- HTTP request/response details
- File operations and permissions
- Authentication attempts
- Database queries
- Share creation and access
- Integration operations (OnlyOffice, FFmpeg)

## Example Debug Output

```
[DEBUG] HTTP: GET /api/shares
[DEBUG] Auth: User admin authenticated
[DEBUG] Database: Query shares for user admin
[DEBUG] File: Accessing /documents/report.pdf
[DEBUG] Share: Created share abc123 for /documents
```

## Logging Configuration

### File Output

Log to a file:
```yaml
log: "debug"
logFile: "/var/log/filebrowser/debug.log"
```

### Console Output

Log to console (default):
```yaml
log: "debug"
```

### Structured Logging

Enable JSON structured logs:
```yaml
log: "debug"
logFormat: "json"
```
