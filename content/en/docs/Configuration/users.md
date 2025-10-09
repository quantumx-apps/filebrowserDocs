---
title: "User Management"
description: "Manage users and permissions"
icon: "group"
---

Configure users, permissions, and default user settings.

## User Management

Users can be managed through:
- Web UI (User Management section)
- CLI commands
- API

## Default User Settings

Configure defaults applied to new users:

```yaml
server:
  sources:
    - path: "/data"
      config:
        defaultEnabled: true         # Give to all new users
        defaultUserScope: "/"         # Default access path
        createUserDir: false          # Auto-create user directories
```

## Creating Users

### Via Web UI

1. Log in as admin
2. Go to **User Management**
3. Click **Create User**
4. Set username, password, permissions
5. Assign sources and scopes

### Via CLI

```bash
./filebrowser set -u username,password -c config.yaml
```

Create as admin:
```bash
./filebrowser set -u username,password -a -c config.yaml
```

## User Permissions

### Admin Permissions

```
- Full system access
- User management
- Configuration access
- All file operations
```

### Standard Permissions

Configure per user:
- **Create** - Create files and folders
- **Rename** - Rename files and folders
- **Modify** - Edit and modify files
- **Delete** - Delete files and folders
- **Share** - Create share links
- **Download** - Download files
- **API** - Access REST API

## User Scopes

Scopes define which sources and paths a user can access.

### Assign Scope

In User Management:
1. Edit user
2. Select source
3. Set scope path (e.g., `/`, `/subfolder`, `/users/john`)
4. Save

### Auto-Create User Directories

```yaml
server:
  sources:
    - path: "/home/users"
      config:
        defaultEnabled: true
        createUserDir: true
        defaultUserScope: "/"
```

This creates `/home/users/username` for each user.

## User Groups

See {{< doclink path="access-control/groups/" text="Groups" />}} for group-based management.

## Password Management

### Set Password Requirements

```yaml
auth:
  methods:
    password:
      minLength: 12
```

### Reset User Password

```bash
./filebrowser set -u username,newpassword -c config.yaml
```

## Two-Factor Authentication

Users can enable 2FA in their profile settings:
1. Go to **Profile** → **Security**
2. Click **Enable 2FA**
3. Scan QR code
4. Enter verification code

## API Tokens

Users with API permission can create tokens:
1. Go to **Settings** → **API Management**
2. Click **Create Token**
3. Copy and save securely

## Next Steps

- {{< doclink path="access-control/rules/" text="Configure access rules" />}}
- {{< doclink path="access-control/groups/" text="Set up groups" />}}
- {{< doclink path="configuration/authentication/" text="Configure authentication" />}}

