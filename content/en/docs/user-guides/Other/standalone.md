---
title: "Standalone docker guide"
description: "A basic working example on setting up FileBrowser in Docker with presistent indexing"
icon: "deployed_Code"
---

This guide will help you set up your FileBrowser instance alone. This will be helpful for users who just want to access there files over LAN for storage.


## Folder Structure

```
filebrowser-quantum/
├── .env
├── compose.yml
└── files/
└── data/
    ├── config.yml
    └── tmp/
```

## Initial Setup

- Run below commands in the terminal to initialize folder structure, or manually via desktop.

```bash
mkdir data
touch .env  compose.yml data/config.yaml
mkdir data/tmp
```

Volume bindings needed:

  - `./data:/home/filebrowser/data` is required to set the config file, database and tmp folder.
  - Any folder you want to have access to, in this example we use `./files` which will be created in the same directory
  - Other volume bindings that need to have access via Web.

Update the compose.yml,


```yaml title="compose.yml" linenums="1"
services:
  filebrowser:
    image: gtstef/filebrowser:stable
    container_name: quantum-prod
    ports:
      - 8900:80
    restart: unless-stopped
    # user: filebrowser
    networks:
      - proxy
    volumes:
      - ./data:/home/filebrowser/data
      - ./files:/files
      # - /other/dir:/dir # Add other sources
    environment:
      - "FILEBROWSER_CONFIG=data/config.yaml"
```

Update the config.yml,

```yaml
server:
  database: "data/database.db"
  cacheDir: "data/tmp"
  sources:
    - path: "/files"
      name: Home
      config:
        defaultUserScope: "/users/" # new users will get created in /users/<username>
        defaultEnabled: true # new users automatically get access to the source
        createUserDir: true # a user "bill" will see files from /files/users/bill
    - path: "/home/filebrowser" # mount the docker home folder for convenience
      name: Backend
    # Add your sources here.
  #externalUrl: 'https://<YOUR_IP>:8900' # if you plan to share externally, share links will be generated with this url
  maxArchiveSize: 50 # maxiumum pre-archive size users are allowed to download at once.
auth:
  tokenExpirationHours: 2
  methods:
    password:
      enabled: true
      minLength: 5
      signup: true
  adminUsername: admin
  adminPassword: admin # remove this after first startup if you want to change this password manually.

```

{{% alert context="info" %}}
Remember to update the `externalUrl` with your IP address of your machine. This can be found via `ipconfig` (windows) or `hostname -I` (linux) or `ifconfig` (for macOS).
{{% /alert %}}

## Non Root user

By default, FileBrowser uses root. You can use `filebrowser`, a built in user (with UID=1000 and GID=1000) but specifying in the compose file's `user` in the respective service. If you need a different ID, then Create a `.env` file and fill the contents with,

```
UID=1001
GID=1001 # or your required values
```

This way compose file will take the variables' value when docker compose starts FileBrowser.

Update the compose file with `user: "$UID:$GID"` instead. Lastly update the data folder owner with the same ID as well with,

```bash
chown -R 1001:1001 data
```

For most cases, `user: filebrowser` will suffice.

## Using FileBrowser

### Starting the service

Change to the directory where the compose file is in your terminal and run,

```bash
docker compose up -d
```

This will pull the image and start the container. You can now access it via `http://<YOUR_IP>:8900`.

### Updating the service

Change to the directory where the compose file is in your terminal and run,

```bash
docker compose pull   # Get the new image
docker compose down   # Shutdown container
docker compose up -d  # Load new image
```

With database and cache set up, your data will persist even with restarts.

## Next Steps

- {{< doclink path="configuration/" text="Configurations" />}}
- {{< doclink path="access-control/" text="Access Control" />}}
- {{< doclink path="features/" text="Features" />}}
- {{< doclink path="user-guides/office-integration/" text="OnlyOffice Integration" />}}
- {{< doclink path="reference/configuration/" text="View full config reference" />}}
