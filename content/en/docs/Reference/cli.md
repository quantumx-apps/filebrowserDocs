---
title: "CLI Commands"
description: "Command-line interface reference"
icon: "terminal"
---

FileBrowser provides a minimal CLI for setup and user management.

## Available Commands

### Start Server

Default command - runs the server:

```bash
./filebrowser
```

With custom config:

```bash
./filebrowser -c /path/to/config.yaml
```

### Setup

Create new configuration file:

```bash
./filebrowser setup
```

Generates `config.yaml` with defaults.

### Version

Check version information:

```bash
./filebrowser version
```

### User Management

Add or update user:

```bash
./filebrowser set -u username,password
```

With custom config:

```bash
./filebrowser set -u username,password -c config.yaml
```

Create admin user:

```bash
./filebrowser set -u username,password -a
```

## Important Notes

**Always shut down the server before CLI operations**

Only one process can access the database at once.

```bash
# Stop service first
systemctl stop filebrowser

# Run CLI command
./filebrowser set -u admin,newpass -c config.yaml

# Start service
systemctl start filebrowser
```

## Docker Usage

### Stop Running Container

```bash
docker compose down
```

### Run CLI in Container

```bash
docker run -it \
  -v $(pwd)/database.db:/home/filebrowser/database.db \
  -v $(pwd)/config.yaml:/home/filebrowser/config.yaml \
  --entrypoint="" \
  gtstef/filebrowser sh
```

Inside container:
```bash
./filebrowser set -u admin,newpass -c config.yaml
exit
```

### One-Line Docker Commands

**Password reset**:
```bash
docker run -it --rm \
  -v $(pwd)/database.db:/home/filebrowser/database.db \
  -v $(pwd)/config.yaml:/home/filebrowser/config.yaml \
  --entrypoint="" \
  gtstef/filebrowser \
  ./filebrowser set -u admin,newpassword -c config.yaml
```

**Create user**:
```bash
docker run -it --rm \
  -v $(pwd)/database.db:/home/filebrowser/database.db \
  -v $(pwd)/config.yaml:/home/filebrowser/config.yaml \
  --entrypoint="" \
  gtstef/filebrowser \
  ./filebrowser set -u newuser,password -c config.yaml
```

## Common Operations

### Password Reset

{{% alert context="warning" %}}
Password reset also disables 2FA for the user.
{{% /alert %}}

```bash
./filebrowser set -u admin,newpassword -c config.yaml
```

### Create New User

```bash
./filebrowser set -u joe,password -c config.yaml
```

{{% alert context="info" %}}
Always include config path so user defaults are applied.
{{% /alert %}}

### Promote User to Admin

```bash
./filebrowser set -u joe,newpassword -a -c config.yaml
```

{{% alert context="info" %}}
Promoting also resets password.
{{% /alert %}}

### Initial Admin Setup

After first install:

```bash
# Option 1: Use CLI
./filebrowser set -u admin,secure-password -a -c config.yaml

# Option 2: Use environment variable
export FILEBROWSER_ADMIN_PASSWORD="secure-password"
./filebrowser -c config.yaml
```

## Command Reference

### filebrowser

Start server with optional config.

**Syntax**:
```bash
./filebrowser [-c config.yaml]
```

**Options**:
- `-c` - Config file path (default: `config.yaml`)

**Examples**:
```bash
./filebrowser
./filebrowser -c /etc/filebrowser/config.yaml
```

### filebrowser setup

Create default configuration file.

**Syntax**:
```bash
./filebrowser setup
```

**Output**: Creates `config.yaml` in current directory.

### filebrowser version

Display version information.

**Syntax**:
```bash
./filebrowser version
```

**Output**:
```
FileBrowser version: v0.10.0
Built: 2025-01-15
Go version: go1.23
```

### filebrowser set

Add or update users.

**Syntax**:
```bash
./filebrowser set -u username,password [-a] [-c config.yaml]
```

**Options**:
- `-u` - Username and password (comma-separated)
- `-a` - Make user admin
- `-c` - Config file path

**Examples**:
```bash
# Create user
./filebrowser set -u john,pass123 -c config.yaml

# Create admin
./filebrowser set -u admin,secure-pass -a -c config.yaml

# Reset password
./filebrowser set -u john,newpass -c config.yaml
```

## Troubleshooting

For common issues and solutions, see the {{< doclink path="reference/troubleshooting/" text="Troubleshooting guide" />}}.

## Next Steps

- {{< doclink path="reference/environment-variables/" text="Environment variables" />}}
- {{< doclink path="reference/api/" text="API documentation" />}}
- {{< doclink path="reference/configuration/" text="Configuration reference" />}}

