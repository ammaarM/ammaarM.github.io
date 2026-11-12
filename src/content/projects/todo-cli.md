---
title: todoctl
description: A small task manager for the terminal, written in Go with JSON storage in your home directory.
repo: https://github.com/ammaarM/todo-cli
tech:
  - Go
  - CLI
kind: cli
highlights:
  - "Add, list, filter, complete and delete tasks from the shell"
  - "Tasks live in ~/.todo-cli/tasks.json, created on first run"
featured: false
sortOrder: 2
terminal:
  - "# add a new task"
  - todoctl add "Renew AZ-104"
  - "# list only uncompleted tasks"
  - todoctl list uncompleted
  - "# mark a task as complete"
  - todoctl complete 1
---

Add, list, filter, complete and delete tasks without leaving the shell. Tasks live in `~/.todo-cli/tasks.json`, created on first run.
