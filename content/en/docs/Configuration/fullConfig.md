---
title: "Full Config Example"
description: "Complete config file example"
icon: "settings"
---

A config needs to be validated using a few simple rules:

1. Invalid fields are no longer supported; this helps spot typos. For example, if you type `userdefaults` instead of `userDefaults`, it will let you know rather than ignoring all of your userDefault settings you intended to set.
2. required fields, such as `server.sources` and different keys based on the settings that you add.
3. some additional light validation, such as min values for things like `minLength` for password config if provided.

# Full Config Example

{{% alert context="info" %}}
The values may change between versions, to see your version, go to settings > "system & admin" > load config
{{% /alert %}}

You can also see the latest default [config with comments here](https://github.com/gtsteffaniak/filebrowser/blob/main/frontend/public/config.generated.yaml)