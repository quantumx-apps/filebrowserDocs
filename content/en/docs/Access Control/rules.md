---
title: "Access Rules"
description: "Directory-level access control"
icon: "gavel"
weight: 1
---

Control user access to specific directories with allow/deny rules.

**Note**: Access rules do not apply to shares.

**Warning**: FileBrowser Quantum access rules differ entirely from the original FileBrowser. Rules do not carry over when migrating.

## How Access Control Works

User access to files depends on three factors:

1. **User Scope** - User must have source in their scopes
2. **denyByDefault** - Default access behavior (grant or deny)
3. **Access Rules** - Specific allow/deny rules for directories

## Rule Evaluation

When a user accesses a file or directory:

1. **Direct Path Check** - Look for rules on the exact path
2. **Recursive Parent Check** - Check parent directories up to root
3. **Default Behavior** - Grant access if no rules found (unless denyByDefault)

## Rule Precedence

**More specific rules override general rules**

- Rule on `/folder/subfolder` overrides rule on `/folder`
- **Allow rules take priority over deny rules**

## Creating Access Rules

Rules are created via the Web UI:

1. Go to **User Management** or **Group Management**
2. Edit a user or group
3. Select a source
4. Click **Access Rules**
5. Add allow/deny rules for specific directories

## Source Default Behavior

### denyByDefault

Configure in source settings:

```yaml
server:
  sources:
    - path: "/data"
      config:
        denyByDefault: true  # Deny all unless explicitly allowed
```

With `denyByDefault: true`:
- Users see source exists
- No file access without explicit allow rules
- Must create allow rules for access

## Examples

### Example 1: Basic Deny

**Rule**: Deny user `graham` access to `/`

**Result**: `graham` cannot access any files or directories

### Example 2: Allow Specific Subfolder

**Rules**:
- Deny user `graham` access to `/`
- Allow user `graham` access to `/subpath`

**Result**: `graham` can only access `/subpath` and subdirectories

### Example 3: Deny All with Exceptions

**Rules**:
- `denyAll` access to `/vip`
- Allow user `admin` access to `/vip`

**Result**: Only `admin` can access `/vip`

### Example 4: Departmental Access

**Rules**:
- Allow group `sales` access to `/departments/sales`
- Allow group `engineering` access to `/departments/engineering`
- Deny all users access to `/departments`

**Result**: Each department accesses only their folder

### Example 5: Read-Only Area

**Rules**:
- Allow all users read access to `/public`
- Deny all users write access to `/public`
- Allow user `publisher` write access to `/public`

**Result**: Everyone can read, only `publisher` can write

## Rule Types

### Allow Rules
Grant access to a path (read, write, execute, delete)

### Deny Rules
Explicitly deny access to a path

### DenyAll Rules
Special rule denying all users (requires specific allow to override)

## Group-Based Rules

Apply rules to groups for easier management:

1. Create user groups
2. Assign users to groups
3. Create access rules for groups
4. All members inherit rules

**Benefits**:
- Easier to manage large user bases
- Consistent permissions
- Single point of updates

## Best Practices

### Use Least Privilege

Start minimal, add as needed:
1. Set `denyByDefault: true`
2. Create specific allow rules
3. Review regularly

### Organize with Groups

Use groups instead of per-user rules:
- Create groups: sales, engineering, admin
- Apply rules to groups
- Add/remove users from groups

### Plan Directory Structure

Design directories with access control in mind:

```
/departments/
  /sales/
  /engineering/
  /hr/
  /shared/
```

### Test Access

Always test after creating rules:
- Log in as target user
- Verify expected access
- Check both allow and deny scenarios

## Common Patterns

### Multi-Tenant

```
Rules:
- Deny all users access to /tenants
- Allow user "client-a" access to /tenants/client-a
- Allow user "client-b" access to /tenants/client-b
```

### Public + Private

```
Rules:
- Allow all users read to /public
- Deny all users write to /public
- Allow all users read/write to /private/username
```

### Hierarchical Organization

```
Rules:
- Allow group "executives" access to /
- Allow group "managers" access to /departments
- Allow group "staff" access to /departments/staff-files
```

## Troubleshooting

For common issues and solutions, see the [Troubleshooting guide](/docs/access-control/troubleshooting/).

## Next Steps

- [Set up user groups](/docs/access-control/groups/)
- [Configure user scopes](/docs/access-control/scopes/)
- [Manage users](/docs/configuration/users/)

