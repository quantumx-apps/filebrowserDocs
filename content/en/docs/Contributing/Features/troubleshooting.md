---
title: "Troubleshooting"
description: "Common development issues and solutions"
icon: "bug_report"
---

Common issues and solutions for FileBrowser development.

## Build Issues

### Frontend Build Failures

```bash
cd frontend
rm -rf node_modules
npm install
```

### Backend Build Failures

```bash
cd backend
go mod tidy
go clean -modcache
```

## Authentication Issues

**Always enable debug logging first** in your test config:

```yaml
server:
  logging:
    - levels: "debug|info|warning|error"
```

### OIDC Login Fails

- Check redirect URLs match your config
- Verify OIDC provider settings
- Enable debug logs to see auth flow
- Common issue: mismatched callback URLs

### Proxy Auth Not Working

- Verify header names match config
- Check nginx/reverse proxy passes headers
- Test with: `curl -H "X-Auth: username" localhost:8080`

### TOTP Issues

- Ensure server time is synchronized
- Check QR code generation in logs
- Database might have stale TOTP secrets

### Session/Cookie Problems

- Clear browser cookies and localStorage
- Verify cookie domain settings
- Try incognito/private browsing mode

## Next Steps

- [Feature development](/docs/contributing/features/)
- [Translation guide](/docs/contributing/translations/)
