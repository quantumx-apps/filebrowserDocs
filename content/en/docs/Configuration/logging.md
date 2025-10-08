---
title: "Logging"
description: "Configure logging output and levels"
icon: "description"
weight: 5
---

Configure FileBrowser's logging system.

For troubleshooting and enabling debug logs, see [Debug Logging](/docs/troubleshooting/debug-logging/).

## Default Logging

Without configuration, logs to stdout with INFO, WARNING, ERROR, and API levels with colors enabled.

## Configuration

### Enable Debug Logging

```yaml
server:
  logging:
    - output: stdout
      levels: "info|warning|error|debug"
```

### Log to File

```yaml
server:
  logging:
    - output: "/var/log/filebrowser.log"
      levels: "info|warning|error"
      noColors: true
```

### Multiple Outputs

```yaml
server:
  logging:
    # Terminal
    - output: stdout
      levels: "info|warning|error"
      apiLevels: disabled
    
    # API logs
    - output: "api-events.log"
      levels: disabled
      noColors: true
    
    # Errors
    - output: "errors.log"
      levels: "error|warning"
      apiLevels: disabled
      noColors: true
```

## Configuration Options

### output
- `stdout` or omit: Log to console
- `"path/to/file.log"`: Log to file

### levels
Specify which levels to log: `"info|warning|error|debug"` or `disabled`

### apiLevels
Same format as levels, but for API events

### noColors
Disable colored output (recommended for files)

## Log Levels

- `info` - General information
- `warning` - Warning messages
- `error` - Error messages
- `debug` - Detailed debugging with line numbers
- `api` - API request/response logs

## Next Steps

- [Enable debug logging](/docs/troubleshooting/debug-logging/) for troubleshooting
- [Configure server settings](/docs/configuration/server/)

