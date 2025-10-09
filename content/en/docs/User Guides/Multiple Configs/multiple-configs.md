---
title: "Multiple Config Files"
description: "Use YAML anchoring for modular configuration"
icon: "inventory_2"
---

Use YAML anchoring with multi-file configuration for modular, reusable configurations.

## Overview

YAML anchoring allows you to:
- Maintain multiple configuration presets in separate files
- Switch between them instantly by changing one line
- Override specific fields when needed
- Keep your main config file clean and simple

## How It Works

The main config file uses YAML merge keys (`<<:`) to include anchored configurations from separate modular files:

- `server-config.yaml` - Server settings (port, sources, logging)
- `auth-config.yaml` - Authentication configuration
- `integrations-config.yaml` - Media and office integration settings
- `frontend-config.yaml` - UI styling and themes
- `users-config.yaml` - User default settings

## Basic Concepts

### 1. Anchor Definition (`&anchor_name`)
Define a reusable configuration block with a name.

### 2. Alias Reference (`*anchor_name`)
Reference the entire anchor exactly as defined.

### 3. Merge Key (`<<: *anchor_name`)
Merge the anchor into the current context, allowing overrides.

## Quick Configuration Switching

**Example:** Switch from development to production by changing the anchor reference:

```yaml
# config.yaml - Switch environments by changing the anchor name

# For development:
server:
  <<: *server_dev

# For production (just change the anchor name):
server:
  <<: *server_production
```

## Example: Server Configurations

**File: `server-config.yaml`**
```yaml
# Development server - multiple sources, verbose logging
server_dev: &server_dev
  port: 8080
  baseURL: "/dev"
  logging:
    - levels: "info|debug|warning|error"
  sources:
    - path: "/data/downloads"
      name: "downloads"
    - path: "/data/projects"
      name: "projects"

# Production server - restricted sources, minimal logging
server_production: &server_production
  port: 80
  baseURL: "/"
  logging:
    - levels: "warning|error"
  sources:
    - path: "/data/public"
      name: "public"

# Minimal server - single source
server_minimal: &server_minimal
  port: 8080
  baseURL: "/"
  sources:
    - path: "/data"
```

**File: `config.yaml`**
```yaml
# Simply change the anchor name to switch configurations!
server:
  <<: *server_dev              # Use development config
  # <<: *server_production     # OR use production config
  # <<: *server_minimal        # OR use minimal config
```

**To switch environments:** Just uncomment the line you want!

## Example: User Permission Presets

**File: `users-config.yaml`**
```yaml
# Admin user - full permissions
user_admin: &user_admin
  showHidden: true
  permissions:
    admin: true
    modify: true
    share: true
    api: true

# Regular user - standard permissions
user_regular: &user_regular
  showHidden: false
  permissions:
    admin: false
    modify: true
    share: true
    api: false

# Read-only user - view only
user_readonly: &user_readonly
  showHidden: false
  permissions:
    admin: false
    modify: false
    share: false
    api: false
  lockPassword: true
```

**File: `config.yaml`**
```yaml
# Switch default user permissions with one line!
userDefaults:
  <<: *user_regular            # Use regular user settings
  # <<: *user_admin            # OR use admin settings
  # <<: *user_readonly         # OR use readonly settings
```

## Extending Anchors

You can also extend an anchor and add/override specific fields:

**File: `server-config.yaml`**
```yaml
server_base: &server_base
  port: 80
  baseURL: "/"
  sources:
    - path: "/data"

# Extend base and add search length
server_extended: &server_extended
  <<: *server_base             # Include everything from server_base
  minSearchLength: 10          # Add new field
```

**File: `config.yaml`**
```yaml
# Use extended config but override the port
server:
  <<: *server_extended
  port: 8080                   # Override just this one field
```

## Complete Multi-File Setup

**File: `config.yaml`** (Main config - minimal and clean!)
```yaml
server:
  <<: *server_dev

auth:
  <<: *auth_oidc

integrations:
  <<: *integrations_full

userDefaults:
  <<: *user_regular

frontend:
  <<: *frontend_multi_theme
```

**To deploy to production:** Change the anchor references:
```yaml
server:
  <<: *server_production       # Changed from *server_dev

auth:
  <<: *auth_oidc

integrations:
  <<: *integrations_no_office  # Changed from *integrations_full

userDefaults:
  <<: *user_readonly           # Changed from *user_regular

frontend:
  <<: *frontend_single_theme   # Changed from *frontend_multi_theme
```

## Benefits

1. **One-line switching** - Change entire configuration profiles instantly
2. **Modularity** - Each concern lives in its own file
3. **Reusability** - Create multiple presets and reuse across environments
4. **Maintainability** - Update one anchor to affect all configs using it
5. **Clean main config** - Main config stays simple and readable
6. **Testing** - Quickly test different configurations without code duplication

## Validation

All configurations must match the structure defined in your schema. The anchor system just provides a way to organize and reuse configuration blocks.

## Next Steps

- {{< doclink path="configuration/server/" text="Server configuration" />}}
- {{< doclink path="configuration/authentication/" text="Authentication setup" />}}
- {{< doclink path="reference/environment-variables/" text="Environment variables" />}}
