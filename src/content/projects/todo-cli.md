---
title: todoctl
description: A small task manager for the terminal, written in Go with JSON storage in your home directory.
repo: https://github.com/ammaarM/todo-cli
tech:
  - Go
  - CLI
kind: cli
featured: false
sortOrder: 2
terminal:
  - todoctl add "Renew AZ-104"
  - todoctl list uncompleted
  - todoctl complete 1
---

Add, list, filter, complete and delete tasks without leaving the shell. Tasks live in `~/.todo-cli/tasks.json`, created on first run.
