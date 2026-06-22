# AGENTS

Guidance for AI coding agents working in this repository.

## Project
Mock NestJS API that emulates Proofpoint's Secure Email Relay (SER) `send` endpoint and delivers messages over SMTP (Nodemailer + MailHog) for local development and testing.

## Tooling
- Package manager: **pnpm** (`packageManager: pnpm@10.11.0`). If pnpm is missing, enable it via `corepack enable && corepack prepare pnpm@10.11.0 --activate`.
- Install: `pnpm install`
- Lint: `pnpm lint`
- Build: `pnpm build`
- Run locally: `pnpm dev` (starts MailHog via docker compose, then the mock API)

## Commit messages
Use Conventional Commits / semantic-commit style: prefix every commit message with a type, e.g. `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`.
