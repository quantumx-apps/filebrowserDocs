---
title: "JWT Authentication"
description: "External JWT token authentication for SSO and proxy integration"
icon: "security"
---

Accept externally-signed JWT tokens for secure authentication, enabling single sign-on, proxy authentication, and iframe embedding scenarios.

{{% alert context="info" %}}
requires `v1.3.x` or newer
{{% /alert %}}

## Basic Configuration

```yaml
auth:
  methods:
    jwt:
      enabled: true
      secret: "your-shared-secret-key-here"  # Use environment variable
```

## Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `enabled` | `false` | Enable JWT external authentication |
| `secret` | *required* | Shared secret for verifying JWT signatures |
| `algorithm` | `HS256` | JWT signing algorithm (HS256, HS384, HS512, RS256, RS384, RS512, ES256, ES384, ES512) |
| `header` | `X-JWT-Assertion` | HTTP header name to check for JWT token |
| `userIdentifier` | `sub` | JWT claim field to use as username |
| `groupsClaim` | `groups` | JWT claim field containing user groups |
| `adminGroup` | `""` | Group name that grants admin privileges |
| `userGroups` | `[]` | List of allowed groups (empty = allow all) |
| `logoutRedirectUrl` | `""` | URL to redirect after logout |

## How It Works

1. External authentication service generates a JWT token with user identity
2. Token is passed to FileBrowser via HTTP header or query parameter
3. FileBrowser verifies the token signature using the shared secret
4. If valid, FileBrowser extracts username and creates the user if needed
5. A FileBrowser session token is generated for subsequent requests

## Token Delivery

### HTTP Header (Recommended)

Pass the JWT token in the configured header:

```bash
curl -H "X-JWT-Assertion: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  https://filebrowser.example.com/api/resources
```

### Query Parameter

The query parameter is hardcoded to `jwt`:

```
https://filebrowser.example.com?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

{{% alert context="warning" %}}
**Security Note**: Query parameter authentication exposes tokens in URLs, which may appear in logs and browser history. Always use HTTPS and prefer header-based authentication for sensitive deployments.
{{% /alert %}}

## JWT Token Requirements

### Required Claims

Your JWT token **must** contain:

- `sub` (or configured `userIdentifier`) - The username
- `exp` - Expiration timestamp (Unix timestamp)
- Valid signature using the configured secret and algorithm

### Optional Claims

- `email` - User's email address
- `name` - User's full name
- `groups` - Array of group names for authorization
- `iat` - Issued at timestamp
- `nbf` - Not before timestamp

### Example JWT Payload

```json
{
  "sub": "john.doe",
  "email": "john.doe@example.com",
  "name": "John Doe",
  "groups": ["users", "admin"],
  "exp": 1735689600,
  "iat": 1735603200
}
```

## Generating JWT Tokens

### Node.js

```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  {
    sub: 'john.doe',
    email: 'john.doe@example.com',
    groups: ['users', 'admin'],
    exp: Math.floor(Date.now() / 1000) + 3600  // 1 hour
  },
  'your-shared-secret-key-here',
  { algorithm: 'HS256' }
);
```

### Python

```python
import jwt
import time

token = jwt.encode(
    {
        'sub': 'john.doe',
        'email': 'john.doe@example.com',
        'groups': ['users', 'admin'],
        'exp': int(time.time()) + 3600  # 1 hour
    },
    'your-shared-secret-key-here',
    algorithm='HS256'
)
```

### Go

```go
import (
    "time"
    "github.com/golang-jwt/jwt/v4"
)

claims := jwt.MapClaims{
    "sub":    "john.doe",
    "email":  "john.doe@example.com",
    "groups": []string{"users", "admin"},
    "exp":    time.Now().Add(time.Hour).Unix(),
}

token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
tokenString, _ := token.SignedString([]byte("your-shared-secret-key-here"))
```

## Group-Based Authorization

### Admin Group

Automatically grant admin privileges to users in a specific group:

```yaml
auth:
  methods:
    jwt:
      enabled: true
      secret: "your-secret"
      adminGroup: "admin"
      groupsClaim: "groups"
```

Users with `"groups": ["admin"]` in their JWT token will have admin access.

### User Group Restrictions

Restrict access to specific groups only:

```yaml
auth:
  methods:
    jwt:
      enabled: true
      secret: "your-secret"
      userGroups: ["employees", "contractors"]
```

Only users with JWT tokens containing these groups can log in.

## Advanced Configuration

### Custom Username Field

Use a different JWT claim for username:

```yaml
auth:
  methods:
    jwt:
      enabled: true
      secret: "your-secret"
      userIdentifier: "email"  # Use email as username
```

JWT token payload:
```json
{
  "email": "john.doe@example.com",
  "exp": 1735689600
}
```

### Custom Header Name

Use a different HTTP header:

```yaml
auth:
  methods:
    jwt:
      enabled: true
      secret: "your-secret"
      header: "Authorization"
```

Then use:
```bash
curl -H "Authorization: <token>" https://filebrowser.example.com
```

### Different Signing Algorithm

Use RS256 (RSA) or ES256 (ECDSA) instead of HS256:

```yaml
auth:
  methods:
    jwt:
      enabled: true
      secret: "your-public-key-here"
      algorithm: "RS256"
```

{{% alert context="info" %}}
**Note**: For asymmetric algorithms (RS256, RS384, RS512, ES256, ES384, ES512), the `secret` field should contain the public key used to verify signatures.
{{% /alert %}}

## Integration Examples

### NGINX Reverse Proxy

Generate JWT tokens from authenticated users:

```nginx
server {
    listen 80;
    server_name filebrowser.example.com;

    location / {
        # Your custom logic to generate JWT token
        # This example assumes $jwt_token is set by auth module
        proxy_set_header X-JWT-Assertion $jwt_token;
        proxy_pass http://filebrowser:80;
    }
}
```

### Iframe Embedding

Embed FileBrowser with user identity:

```html
<iframe 
  src="https://filebrowser.example.com?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  width="100%" 
  height="600">
</iframe>
```

### Windows NTLM Proxy

Example Express.js proxy with NTLM authentication:

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const ntlm = require('express-ntlm');

const app = express();

app.use(ntlm({
  domain: 'DOMAIN',
  domaincontroller: 'dc.domain.com'
}));

app.use((req, res, next) => {
  const token = jwt.sign(
    { sub: req.ntlm.UserName },
    'your-shared-secret-key-here',
    { algorithm: 'HS256', expiresIn: '1h' }
  );
  req.headers['x-jwt-assertion'] = token;
  // Proxy to FileBrowser
});
```

## Security Best Practices

{{% alert context="warning" %}}
**Security Checklist**:
- ✅ Always use HTTPS in production
- ✅ Use strong secrets (minimum 32 characters, random)
- ✅ Set short expiration times (1-2 hours recommended)
- ✅ Rotate secrets regularly
- ✅ Use header authentication instead of query params when possible
- ✅ Monitor failed authentication attempts
- ✅ Store secrets in environment variables, not config files
{{% /alert %}}

### Environment Variable Best Practice

```bash
export FILEBROWSER_JWT_SECRET="your-generated-secret-here"
```

Then reference in config:
```yaml
auth:
  methods:
    jwt:
      enabled: true
      secret: "${FILEBROWSER_JWT_SECRET}"
```

## Troubleshooting

### "JWT authentication failed: invalid token"

**Causes:**
- Secret doesn't match between token issuer and FileBrowser
- Token is expired (`exp` claim in the past)
- Token signature is invalid
- Wrong signing algorithm

**Solution:** Verify the secret matches exactly and token is not expired.

### "JWT token missing required claim: sub"

**Cause:** Token doesn't include the username field.

**Solution:** Add `"sub": "username"` to your JWT payload, or configure `userIdentifier` to match your token structure.

### "JWT authentication failed - no user found"

This error no longer occurs as users are automatically created on first login.

### "user is not in allowed groups"

**Cause:** User's groups don't match `userGroups` restriction.

**Solution:** 
- Verify JWT token includes the `groups` claim
- Ensure group names match exactly (case-sensitive)
- Check `groupsClaim` configuration

## Comparison with Other Auth Methods

| Feature | JWT Auth | Proxy Auth | OIDC | Password |
|---------|----------|------------|------|----------|
| External Identity | ✅ | ✅ | ✅ | ❌ |
| Cryptographic Verification | ✅ | ❌ | ✅ | ✅ |
| Group Support | ✅ | ✅ | ✅ | ❌ |
| Iframe Embedding | ✅ | ⚠️ | ❌ | ❌ |
| No External Service | ✅ | ✅ | ❌ | ✅ |

**When to use JWT Auth:**
- Need cryptographic verification (more secure than proxy auth)
- Want iframe embedding support
- Have existing JWT infrastructure
- Need simple external identity integration
- Can't use OIDC (too complex/unavailable)

## Testing Your Setup

### 1. Generate Test Token

Using [jwt.io](https://jwt.io/):
1. Select algorithm: `HS256`
2. Set payload: `{"sub": "testuser", "exp": 9999999999}`
3. Enter your secret
4. Copy the generated token

### 2. Test Authentication

```bash
TOKEN="your-generated-token"
curl -v -H "X-JWT-Assertion: $TOKEN" \
  https://your-filebrowser.com/api/resources
```

Expected: HTTP 200 OK with file listing

### 3. Verify Logs

Check FileBrowser logs for:
```
JWT Auth configured successfully
Successfully verified JWT token for user: testuser
```

## Next Steps

- {{< doclink path="configuration/authentication/oidc/" text="OIDC authentication" />}}
- {{< doclink path="configuration/authentication/proxy/" text="Proxy authentication" />}}
- {{< doclink path="configuration/authentication/password/" text="Password authentication" />}}
- {{< doclink path="access-control/rules" text="Configure access rules" />}}
