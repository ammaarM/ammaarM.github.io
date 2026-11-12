---
title: Azure Resource Inspector
description: A Go CLI on the Azure SDK for auditing what's actually deployed across a subscription.
repo: https://github.com/ammaarM/Azure-Resource-Inspector
tech:
  - Go
  - Azure SDK
  - Cobra
featured: false
sortOrder: 1
terminal:
  - az login
  - ari list --subscription $SUB_ID
---

`ari list` enumerates every resource in a subscription today. Filtering by type, region and tag, plus JSON and YAML output for pipelines, are next on the list.
