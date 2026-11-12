---
title: Azure Resource Inspector
description: A Go CLI on the Azure SDK for auditing what's actually deployed across a subscription.
repo: https://github.com/ammaarM/Azure-Resource-Inspector
tech:
  - Go
  - Azure SDK
  - Cobra
kind: cli
highlights:
  - "ari list enumerates every resource in a subscription"
  - "Next up: filtering by type, region and tag"
  - "Next up: JSON and YAML output for pipelines"
featured: false
sortOrder: 1
terminal:
  - "# sign in with the Azure CLI"
  - az login
  - "# list every resource in a subscription"
  - ari list --subscription $SUB_ID
---

`ari list` enumerates every resource in a subscription today. Filtering by type, region and tag, plus JSON and YAML output for pipelines, are next on the list.
