---
title: "Configuration Overview"
description: "Complete configuration guide for FileBrowser Quantum"
icon: "settings"
---

Complete configuration guide for all aspects of FileBrowser Quantum.

## Configuration Topics

- [Server Settings](/docs/configuration/server/) - Port, address, database, caching
- [Sources](/docs/configuration/sources/) - File system source configuration
- [Authentication](/docs/configuration/authentication/) - Auth methods (password, OIDC, proxy)
- [Users](/docs/configuration/users/) - User management and permissions
- [Logging](/docs/configuration/logging/) - Configure logging output and levels
- [Frontend](/docs/configuration/frontend/) - Customize UI, branding, themes
- [Multiple Configs](/docs/configuration/multiple-configs/) - Use multiple configuration files

## Basic Configuration Example

```yaml
server:
  port: 80
  sources:
    - path: "/data"
      config:
        defaultEnabled: true

auth:
  adminUsername: admin
  methods:
    password:
      enabled: true
      minLength: 8

frontend:
  name: "My FileBrowser"
```

## Advanced Configuration Examples

### OIDC Configuration

```yaml
auth:
  methods:
    password:
      enabled: false # set to false if you only want to allow OIDC
    oidc:
      enabled: true                              # whether to enable OIDC authentication
      clientId: "xxx"                            # client id of the OIDC application
      clientSecret: "xxx"                        # client secret of the OIDC application
      issuerUrl: "http://localhost/application/o/filebrowser/" # URL of the OIDC provider
      scopes: "email openid profile groups"             # scopes to request from the OIDC provider
      userIdentifier: "preferred_username"       # the attribute used as username. Default/typical is "preferred_username", can also be "email" or "username", or "phone"
      disableVerifyTLS: false        # disable TLS verification for the OIDC provider. This is insecure and should only be used for testing.
      logoutRedirectUrl: ""          # if provider logout url is provided, filebrowser will also redirect to logout url. Custom logout query params are respected.
      createUser: true               # create user if it does not exist
      adminGroup: "authentik Admins" # if set, OIDC will manage whether a user is `admin` or not.
      groupsClaim: "groups"          # the JSON field name to read groups from. Default is "groups"
```

### Frontend Configuration

```yaml
frontend:
  name: "My FileBrowser"                  # display name
  disableDefaultLinks: false              # disable default links in the sidebar
  disableUsedPercentage: false            # disable used percentage for the sources in the sidebar
  externalLinks:
    - text: my home page                  # the text to display on the link  validate:required
      title: my home page                 # the title to display on hover
      url: https://domain.com/            # the url to link to  validate:required
  disableNavButtons: false                # disable the nav buttons in the sidebar
  styling:
    customCSS: "customstyles.css"         # if a valid path to a css file is provided, it will be applied for all users. (eg. "reduce-rounded-corners.css")
    lightBackground: "white"              # specify a valid CSS color property value to use as the background color in light mode
    darkBackground: "#141D24"             # Specify a valid CSS color property value to use as the background color in dark mode
    customThemes:                         # A list of custom CSS files that each user can select to override the default styling. if "default" is key name then it will be the default option.
      default:                            # by naming default, all logged-in users will see this theme by default
        description: The default theme
        css: "your-custom-theme.css"
```

### Media Integration

```yaml
integrations:
  media:
    ffmpegPath: "/usr/local/bin" # wherever you have both ffmpeg and ffprobe installed at
```

### Office Integration

```yaml
integrations:
  office:
    url: "http://onlyoffice-server:8000"  # OnlyOffice Document Server URL
    secret: "your-secret-key"             # Optional JWT secret for security
```

### Advanced Source Configuration

```yaml
server:
  sources:
    - path: "/mnt/folder"
      name: "mysource" # optional, otherwise the source gets named the folder name
      config:
        disableIndexing: false # if set to true, nothing gets indexed but is still viewable in the UI
        exclude: # these items will be excluded from both the UI and indexing
          filePaths:
            - "myfile.txt"            # corresponds to "/mnt/folder/myfile.txt"
            - "subfolder/another.txt" # corresponds to "/mnt/folder/subfolder/another.txt"
          folderPaths:
            - "subfolder/ignoreMe"    # excludes exact folder path (only one folder)
          fileNames:
            - "ignoreMe.txt"          # excludes all files named this
          folderNames:
            - "ignoreAllFolders"      # excludes all folders named this
          fileEndsWith:
            - ".zip"                  # excludes any files that end with ".zip"
            - ".tar.gz"
            - "-hidden.jpg"
          folderEndsWith:
            - "-backups"              # excludes any folders that end with "-backups"
```

### User Directory Auto-Creation

```yaml
server:
  sources:
    - path: "/path/to/source1"
    - path: "/path/to/source2"
      config:
        defaultUserScope: "/subfolder" # include leading slash
        defaultEnabled: true
        createUserDir: true           # "/subfolder/username" directory will be created
```

## Configuration File Location

FileBrowser looks for `config.yaml` in:

1. Path specified with `-c` flag
2. Current directory
3. `FILEBROWSER_CONFIG` environment variable

## Next Steps

- [Configure sources](/docs/configuration/sources/)
- [Set up authentication](/docs/configuration/authentication/)
- [Manage users](/docs/configuration/users/)
- [View full config reference](/docs/reference/configuration/)
