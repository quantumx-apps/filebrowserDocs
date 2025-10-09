---
title: "User Migration"
description: "Preserve user accounts during migration"
icon: "people"
---

Preserve user accounts and permissions when migrating to FileBrowser Quantum.

## User Data Preservation

User accounts are stored in the database and will be automatically preserved when you migrate the database file.

## What's Preserved

- ✓ Usernames and passwords
- ✓ User permissions
- ✓ Admin status
- ✓ File scopes

## What Needs Recreating

- ✗ Share links
- ✗ API tokens (for security)
- ✗ TOTP/2FA secrets (users must re-enroll)

## Post-Migration User Tasks

### 1. Verify Admin Access

Test admin login immediately after migration:

```bash
curl -H "X-Password: admin" \
  "http://localhost:8080/api/auth/login?username=admin"
```

### 2. Reset Admin Password

Change the default admin password:

```yaml
# config.yaml
auth:
  adminPassword: "new-secure-password"
```

Or via API after login:

```bash
curl -X PUT \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "which": ["password"],
    "data": {"password": "new-secure-password"}
  }' \
  "http://localhost:8080/api/users?id=self"
```

### 3. Notify Users

Inform users that:

- Their passwords remain the same
- Share links need to be recreated
- API tokens need to be regenerated
- 2FA needs to be re-enrolled (if used)

### 4. Regenerate API Tokens

Users with API access need to create new tokens:

**Via API:**
```bash
curl -X PUT \
  -H "Authorization: Bearer ${TOKEN}" \
  "http://localhost:8080/api/auth/token"
```

**Via UI:**
User Settings → API Tokens → Generate New Token

### 5. Re-enroll 2FA

If users had TOTP/2FA enabled:

1. Go to User Settings
2. Navigate to Security
3. Click "Enable Two-Factor Authentication"
4. Scan new QR code
5. Enter verification code

## User Permissions

Default user permissions are now configured in `config.yaml`:

```yaml
userDefaults:
  permissions:
    admin: false
    modify: true
    share: true
    create: true
    rename: true
    delete: true
    download: true
```

Existing user permissions override these defaults.

## Bulk User Operations

### List All Users

```bash
curl -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  http://localhost:8080/api/users
```

### Update User Permissions

```bash
curl -X PUT \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "which": ["permissions"],
    "data": {
      "permissions": {
        "modify": false,
        "download": true
      }
    }
  }' \
  "http://localhost:8080/api/users?id=2"
```

## Troubleshooting

For common issues and solutions, see the [Troubleshooting guide](/docs/getting-started/migration/troubleshooting/).

## Next Steps

- [Configure user defaults](/docs/configuration/users/)
- [Set up access control](/docs/access-control/)
- [Create new shares](/docs/shares/)

