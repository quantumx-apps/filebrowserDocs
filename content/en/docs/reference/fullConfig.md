---
title: "Full Config Example"
description: "Complete config file example"
icon: "settings"
date: "2025-10-09T00:23:04Z"
lastmod: "2026-07-23T17:03:27Z"
---

A config needs to be validated using a few simple rules:

{{% alert context="warning" title="Upgrading to v2.0.0?" %}}
v2.0.0 removes deprecated flat config formats and legacy fields from generated output. Convert your existing config with the config migration tool before upgrading — see {{< doclink path="getting-started/v2/migration/" text="v2 migration guide" />}}.
{{% /alert %}}

1. Invalid fields are no longer supported; this helps spot typos. For example, if you type `userdefaults` instead of `userDefaults`, it will let you know rather than ignoring all of your userDefault settings you intended to set.
2. required fields, such as `server.sources` and different keys based on the settings that you add.
3. some additional light validation, such as min values for things like `minLength` for password config if provided.

# Full Config Example

{{% alert context="info" %}}
The values may change between versions, to see your version, go to settings > "system & admin" > load config
{{% /alert %}}

You can also see the latest default [config with comments here](https://github.com/gtsteffaniak/filebrowser/blob/main/frontend/public/config.generated.yaml)