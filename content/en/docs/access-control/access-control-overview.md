---
title: "Access Control Overview"
description: "How access control rules work in FileBrowser Quantum"
icon: "security"
order: 1
---

# File Browser Access Control Rules

{{% alert context="info" %}}
Access rules for shares apply based on the user that created the share.
{{% /alert %}}

This document explains how access control rules work in FileBrowser Quantum, including how rules are inherited and how they can be overridden.

{{% alert context="warning" %}}
FileBrowser Quantum access rules differ entirely from those in the original FileBrowser, and the rules do not carry over and need to be recreated if migrating from the OG filebrowser.
{{% /alert %}}

## Source default behavior

A user's access to files depends on:

1. **User scope**: User's won't see any info or access for a source without adding a source scope for the user. You must enable a user to have access to a source. This can be default for new users via `defaultEnabled: true` in source config, or by manually adding a source for a user via user management.
2. **DenyByDefault config**: When a user has a source scope, by default all files are accessible unless `denyByDefault: true` is set. If `denyByDefault` is set, a user can still see metadata about the source, but won't have access to browse or modify files.
3. **Access rules**: The "user/group" access rule logic applies as mentioned below.

## How Access Rules Work

The Directory-level Access control is managed through a system of "allow" and "deny" rules that are created based on users or groups for specific directories. When a user tries to access a file or directory, the system checks for rules in the following order:

1.  **Direct Path Check:** The system first looks for rules that apply directly to the file or directory being accessed.
2.  **Recursive Parent Directory Check:** If no rules are found for the direct path, the system recursively checks the parent directories, moving up the directory tree until it finds a matching rule or reaches the root.
3.  **Default Behavior:** If no rules are found all the way up to the root, access is granted by default unless `denyByDefault` is set for the source config.

## Rule Precedence and Overriding

The more specific a rule is, the higher its precedence. This means a rule on a subdirectory will always override a rule on its parent directory.

### Allow Rules take priority

Allow rules override deny rules.

## Examples

### Example 1: Basic Deny

-   **Rule:** Deny user `graham` access to `/`.
-   **Result:** `graham` cannot access any files or directories.

### Example 2: Overriding a Deny with an Allow

-   **Rule 1:** Deny user `graham` access to `/`.
-   **Rule 2:** Allow user `graham` access to `/subpath`.
-   **Result:** `graham` can only access the `/subpath` directory and its subdirectories. Access to all other directories is denied.

### Example 3: Deny All rule as blacklist

-   **Rule:** `denyAll` access to `/vip`.
-   **Result:**
    -   no users can access `/vip` unless you add an allow rule for a specific user (overrides any deny)

## Configuration

Access rules are configured through the admin interface or API. You can:

- Create rules for specific users or groups
- Set rules for specific directories
- Use allow or deny rules
- Override rules with more specific ones

## Next Steps

- {{< doclink path="access-control/rules/" text="Access Rules" />}}
- {{< doclink path="access-control/troubleshooting/" text="Troubleshooting" />}}
- {{< doclink path="configuration/users/" text="User Management" />}}