---
title: "Troubleshooting"
description: "Common issues and solutions for access control"
icon: "bug_report"
weight: 2
---

Common issues and solutions for access control.

## Access Rules

### Users Can't Access Files

Check:
1. User has source in scopes
2. No deny rules blocking access
3. denyByDefault is not set (or allow rules exist)
4. Path is correct (case-sensitive)

### Rules Not Taking Effect

- Refresh browser/clear cache
- Check rule specificity
- Verify user is in expected groups
- Review rule inheritance chain

## Next Steps

- [Access rules](/docs/access-control/rules/)
- [Set up user groups](/docs/access-control/groups/)
- [Configure user scopes](/docs/access-control/scopes/)
