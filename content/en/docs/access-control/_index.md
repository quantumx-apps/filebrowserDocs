---
title: "Access Control"
description: "Fine-grained file and directory access control"
icon: "shield"
date: "2025-10-08T14:59:30Z"
lastmod: "2026-07-24T01:02:28Z"
order: 4
---

{{% alert context="warning" %}}
**v2.0.0 behavior change**

File-operation permissions (**view**, **download**, **modify**, **create**, **delete**) are **per source** on each user scope in v2.0.0 — not global user checkboxes. **`view` is new in v2.0.0** (always granted in v1.x). See {{< doclink path="access-control/access-control-overview/" text="Access control overview" />}}.
{{% /alert %}}
