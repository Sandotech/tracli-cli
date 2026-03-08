# TraCli (MVP)

_The zero-friction work logger for terminal-first developers._

TraCli is a lightweight Command Line Interface (CLI) for developers who find traditional time-tracking tools (Jira, Clockify, spreadsheets) disruptive to their workflow. It focuses on rapid time entry, local-first storage, and optional cloud synchronization so work logs are never lost.

## Executive summary

TraCli aims to make logging work feel as natural as writing a commit message: quick prompts, sane validation, and a storage model that works offline by default.

## Getting started (local development)

Prerequisites:

- Node.js **18+**

Install and build:

```bash
npm install
npm run build
```

Run the CLI in dev mode:

```bash
npm run dev -- --help
```

Install the CLI globally on your machine (from this repo):

```bash
npm run build
npm link

tracli --help
```

## CLI commands

- `tracli track` — guided prompt to log work (hours, optional ticket, description)
- `tracli status` — weekly summary as an ASCII table
- `tracli sync` — pushes unsynced local logs to the API

## Configuration

Environment variables:

- `TRACLI_STATE_FILE` — override local JSON state file path (default: `~/.tracli/state.json`)
- `TRACLI_API_BASE_URL` — API base URL for `tracli sync` (default: `http://localhost:3000`)

## Sync API contract

`tracli sync` is intentionally **server-agnostic**. It expects an HTTP API at:

- `POST /api/v1/logs` with JSON body `{ "entries": [...] }`

Point the CLI to your server with `TRACLI_API_BASE_URL`.

## Core features (lean MVP)

- **Command-driven entry:** a single command (e.g., `tracli track`) triggers a guided prompt sequence.
- **Validation logic:** hours must be between **0.5** and **12** per entry to improve data quality.
- **PBI/ticket association:** optional field for linking work to specific project IDs.
- **Local persistence:** data stored locally (SQLite or JSON) for offline-first speed.
- **Cloud sync (optional):** `tracli sync` pushes local logs to a central API.
- **Weekly summary:** `tracli status` visualizes progress in an ASCII table.

## System architecture & data flow

The system follows a client-server model where the CLI acts as a thin client and the API handles persistence and cross-device logic.

High-level flow:

1. User logs work via CLI.
2. Entry is persisted locally (offline-first).
3. When available, `tracli sync` pushes local entries to the API.
4. API stores and serves entries across devices.

## DDD / Clean Architecture layout

- `src/domain` — entities + value objects + domain validation (framework-free)
- `src/application` — use cases + ports (interfaces)
- `src/infrastructure` — JSON persistence, HTTP sync gateway, clock/id providers
- `src/interfaces`
  - `cli` — Commander-based CLI adapter
  - `http` — Express API adapter

## Data model (draft)

Entity relationship (draft):

| Field          | Type     | Description                                        |
| -------------- | -------- | -------------------------------------------------- |
| `id`           | UUID     | Unique identifier for the log entry.               |
| `user_id`      | UUID     | Links entry to the developer account (cloud sync). |
| `hours_worked` | Decimal  | Amount of time (e.g., `1.5`, `4.0`).               |
| `ticket_id`    | String   | Optional PBI/Jira/GitHub issue ID.                 |
| `description`  | String   | Brief text describing the work performed.          |
| `created_at`   | DateTime | Timestamp of the log entry.                        |

## Example interaction

```text
$ tracli track
Hours worked (0.5–12): 2
Ticket/PBI (Enter to skip): DEV-402
Description: Implemented auth middleware

Success! 2 hours logged to DEV-402. (Total today: 6.5h)
```

## Technology stack (proposed)

- **CLI:** Node.js with `commander` or `inquirer` for prompts.
- **API:** .NET 8 or Node.js (Express) implementing a RESTful API.
- **Local database:** SQLite (simple, single-file) or JSON.
- **Cloud database:** PostgreSQL or SQL Server.
- **Auth:** JWT-based tokens for a future `tracli login` command.

## Success metrics

- **Time to log:** can a single entry be logged in under 10 seconds?
- **Retention:** does a user log hours for 5 consecutive workdays?
