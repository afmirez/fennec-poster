# Fennec Poster

<img width="404" height="404" alt="fennec" src="https://github.com/user-attachments/assets/bd3c1d0f-49d4-4485-b1b3-d0b60d1a1fc4" />

I wanted to write my notes in Obsidian and have them automatically published to a static site, so I built Fennec Poster.

Fennec Poster automates the publishing of my study notes.

Main components:
- Pre-commit hook: Adds and validates frontmatter for each note in /notes.
- GitHub Action: Detects file changes (additions, edits, deletions), revalidates them, and sends a request to the Next.js app.
- Next.js API: Exposes two GitHub OIDC-secured endpoints that handle authentication and database updates.
- Frontend: Fetches data from the database and displays it.

This is an experimental, slightly messy project...the first step toward a more complete portfolio/blog.
