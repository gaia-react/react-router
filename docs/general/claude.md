---
title: Claude Integration
layout: doc
outline: deep
---

# Claude Integration

GAIA comes with [Claude](https://claude.ai/) support built-in.

## Commands

- `/gaia-init`: Initializes a new GAIA project by removing example code and setting up the project based on your preferences (e.g., project name, languages). It also sets up Claude. This command should be run only once at the start of your project.
- `/update-react-router` - Updates React Router to the latest version and migrates your code, if necessary.

It also includes the following tools:

## Agents

### Code Review Audit Agent

This agent runs every time a PR is merged from the CLI.

## Hooks

GAIA comes with hooks that prevent Claude from modifying the:

- eslint config as a way to solve linting errors
- tsconfig to add vitest globals (use imports instead)

## Rules

GAIA comes with multiple rules files which enforce best practices for coding, testing, PR merging, and more. These rules are automatically applied when relevant files are modified.

## Skills

GAIA comes with custom skills tailored for GAIA for writing React code, TypeScript code, and pixel-perfect skeleton loaders.
