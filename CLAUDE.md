# Enterprise AI Survey Harness

This repository uses OpenSpec for requirement capture and change execution.
Default workflow:

1. Explore the problem and repo state before proposing solutions.
2. Create or refine an OpenSpec change before implementation when the work changes product behavior, architecture, or data shape.
3. Implement only the scoped change.
4. Run local verification before declaring work complete.
5. Keep diffs surgical. Do not refactor unrelated code.

## Project Context

- Product: an H5-style enterprise AI transformation survey for business owners
- Runtime: Next.js App Router full-stack app
- Current scaffold: JavaScript-based Next.js bootstrap
- Planned stack direction: Next.js + TailwindCSS + Zod + PostgreSQL + Prisma
- Deployment target: local Docker in development, production target TBD

## Non-Negotiable Rules

- Check existing files and OpenSpec artifacts before coding.
- If a task changes requirements, flows, DB schema, or external contracts, create or update an OpenSpec change first.
- Prefer the simplest implementation that satisfies the active spec.
- Do not introduce abstractions “for later”.
- Do not silently choose between multiple valid interpretations; surface the ambiguity.
- Do not modify unrelated files “while here”.
- Every meaningful code change should have a verification step.

## Definition Of Done

A task is not done unless all applicable items below are true:

- OpenSpec artifacts match the implemented behavior.
- `pnpm lint` passes.
- `pnpm build` passes.
- Any task-specific checks or manual smoke steps are documented.
- New commands, workflow changes, or setup requirements are reflected in docs.

## Repo Working Agreements

- Use `app/` with App Router conventions already present in the repo.
- Keep product rules, architecture notes, and workflow guidance in `docs/`.
- Keep automation entrypoints in `scripts/`.
- Keep project-specific agent rules here and in `AGENTS.md`; avoid duplicating the same rule in many places.
- Treat `openspec/changes/*` as the source of truth for pending work.

## Preferred Execution Pattern

For medium or larger tasks, state a short plan in this shape before editing:

1. Step
   Verification: command or observable result
2. Step
   Verification: command or observable result

Then execute and verify.

## Current Gaps To Respect

- TypeScript is part of the target architecture, but the current scaffold is still JavaScript.
- Prisma, PostgreSQL, Tailwind, and test harnesses are not wired yet.
- Add those pieces through explicit changes rather than ad hoc drive-by edits.
