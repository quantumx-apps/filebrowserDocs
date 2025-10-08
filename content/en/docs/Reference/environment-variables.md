---
title: "Environment Variables"
description: "Optional environment variables for configuration"
icon: "input"
weight: 1
---

The preferred configuration method is to use config.yaml. However, environment variables are available for **secrets**, **config override**, and **developer purposes**.

## Available Variables

| Variable | Config Equivalent | Description |
|----------|-------------------|-------------|
| `FILEBROWSER_CONFIG` | - | Config file path when no CLI argument provided |
| `FILEBROWSER_DATABASE` | `server.database` | Database file path |
| `FILEBROWSER_ADMIN_PASSWORD` | `auth.adminPassword` | Admin password |
| `FILEBROWSER_ONLYOFFICE_SECRET` | `integrations.office.secret` | OnlyOffice JWT secret |
| `FILEBROWSER_FFMPEG_PATH` | `integrations.media.ffmpegPath` | Path to FFmpeg binaries |
| `FILEBROWSER_OIDC_CLIENT_ID` | `auth.methods.oidc.clientId` | OIDC client ID |
| `FILEBROWSER_OIDC_CLIENT_SECRET` | `auth.methods.oidc.clientSecret` | OIDC client secret |
| `FILEBROWSER_JWT_TOKEN_SECRET` | `auth.key` | JWT signing key |
| `FILEBROWSER_TOTP_SECRET` | `auth.totpSecret` | TOTP encryption secret |
| `FILEBROWSER_RECAPTCHA_SECRET` | `auth.methods.password.recaptcha.secret` | reCAPTCHA secret key |

## Usage Example

**Docker Compose**:
```yaml
services:
  filebrowser:
    image: gtstef/filebrowser:latest
    environment:
      - FILEBROWSER_ADMIN_PASSWORD=secure-password
      - FILEBROWSER_ONLYOFFICE_SECRET=office-secret
    volumes:
      - ./config.yaml:/home/filebrowser/config.yaml
```

**Binary**:
```bash
export FILEBROWSER_ADMIN_PASSWORD="secure-password"
export FILEBROWSER_JWT_TOKEN_SECRET="jwt-secret"
./filebrowser -c config.yaml
```

## Next Steps

- [CLI commands](/docs/reference/cli/)
- [Configure authentication](/docs/configuration/authentication/)

