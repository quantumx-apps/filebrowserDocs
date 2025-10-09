---
title: "Troubleshooting"
description: "Common issues and solutions for CLI and API"
icon: "bug_report"
---

Common issues and solutions for CLI and API usage.

## CLI Issues

### Database Locked

**Error**: "database is locked"

**Solution**: Stop running server first.

```bash
# Check for running processes
ps aux | grep filebrowser

# Kill if found
kill <pid>

# Or use systemd
systemctl stop filebrowser
```

### Config Not Found

**Error**: "config file not found"

**Solution**: Specify correct path or create config.

```bash
./filebrowser setup
./filebrowser -c config.yaml
```

### Permission Denied

**Error**: "permission denied"

**Solution**: Check file permissions.

```bash
# Make binary executable
chmod +x filebrowser

# Check database permissions
ls -la database.db
chown filebrowser:filebrowser database.db
```

## Systemd Integration

### Create Service File

`/etc/systemd/system/filebrowser.service`:

```ini
[Unit]
Description=FileBrowser
After=network.target

[Service]
Type=simple
User=filebrowser
WorkingDirectory=/opt/filebrowser
ExecStart=/opt/filebrowser/filebrowser -c /etc/filebrowser/config.yaml
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### CLI Operations with Systemd

```bash
# Stop service
sudo systemctl stop filebrowser

# Run CLI command
sudo -u filebrowser /opt/filebrowser/filebrowser set -u admin,newpass \
  -c /etc/filebrowser/config.yaml

# Start service
sudo systemctl start filebrowser
```

## Next Steps

- {{< doclink path="reference/cli/" text="CLI commands" />}}
- {{< doclink path="reference/environment-variables/" text="Environment variables" />}}
- {{< doclink path="reference/api/" text="API documentation" />}}
