# Fennec Poster

<img width="404" height="404" alt="fennec" src="https://github.com/user-attachments/assets/bd3c1d0f-49d4-4485-b1b3-d0b60d1a1fc4" />

> ⚠️ This is an early-stage project. Expect frequent updates as the system evolves.

## Overview

The goal of **Fennec Poster** is to automate the process of publishing Markdown notes:

1. **Upload a Markdown file** → pushed to a GitHub repository.  
2. **CI/CD pipeline (GitHub Actions)** → extracts the file's *frontmatter* and sends it to a backend endpoint.  
3. **Next.js static site** → renders the notes using the stored metadata from **Supabase (Postgres)**.

## Structure (planned)

| Component | Description | Status |
|------------|-------------|--------|
| `pre-commit/` | Adds and validates frontmatter | ✅ Done |
| `ci/` | GitHub Actions pipeline for metadata sync | 🕓 Planned |
| `web/` | Next.js static site to render notes | 🕓 Planned |
| `db/` | Supabase (Postgres) backend | 🕓 Planned |
