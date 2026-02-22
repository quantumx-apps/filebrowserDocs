---
title: "Logging"
description: "Configure logging output and levels"
icon: "description"
order: 6
---

Configure FileBrowser's logging system.

For troubleshooting and enabling debug logs, see {{< doclink path="troubleshooting/debug-logging/" text="Debug Logging" />}}.

## Default Logging

Without configuration, logs to stdout with INFO, WARNING, ERROR, and API levels with colors enabled.

## Configuration

### Enable Debug Logging

Debug logging allows for more granular info-level logs which can be very helpful if you see issues.

```yaml
server:
  logging:
    - output: stdout
      levels: "info|warning|error|debug"
```

### Log to File

You can log to a file instead of stdoiut by choosing a filepath as "output".

{{% alert context="info" %}}
File logs do not support rotation and will append to the existing file.
{{% /alert %}}

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

### Json format

FileBrowser Quantum supports json formatted logging for improved indexed logging.

```yaml
server:
  logging:
    - levels: "info|warning|error"
      json: true
```

### UTC Time

Use UTC time instead of local time in log output:

```yaml
server:
  logging:
    - output: stdout
      levels: "info|warning|error"
      utc: true
```

## Configuration Options

### output
- `stdout` or omit: Log to console
- `"path/to/file.log"`: Log to file

### levels
Specify which levels to log: `"info|warning|error|debug"` or `disabled`. Use pipe, space, or commas to separate multiple levels.

### apiLevels
Same format as levels, but for API events. Use pipe (`|`) to separate multiple levels, or set to `disabled` to disable API logging.

### noColors
Disable colored output (recommended for files). Default: `false`.

### json
Output logs in JSON format for improved indexed logging. Default: `false`.

### utc
Use UTC time in the output instead of local time. Default: `false`.

## Log Levels

- `info` - General information
- `warning` - Warning messages
- `error` - Error messages
- `debug` - Detailed debugging with line numbers
- `api` - API request/response logs

## Next Steps

- {{< doclink path="troubleshooting/debug-logging/" text="Enable debug logging" />}} for troubleshooting
- {{< doclink path="configuration/server/" text="Configure server settings" />}}

