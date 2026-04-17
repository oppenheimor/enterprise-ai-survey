## Why

The project needs a fast way to compare UI directions before committing to a full questionnaire interface. A static style wall lets the team review the same enterprise AI survey content across multiple visual systems without mixing content decisions with style decisions.

## What Changes

- Add a dedicated showcase page that renders 15 style samples for the enterprise AI transformation survey theme.
- Keep the content structure identical across all cards so visual differences stay comparable.
- Preserve the current homepage and intake form; the showcase is a separate exploration surface.
- Do not add new survey logic, persistence, submission behavior, or style-selection workflow in this change.

## Capabilities

### New Capabilities
- `style-wall-showcase`: Present a single-page gallery of static, comparable style cards themed around the enterprise AI transformation survey.

### Modified Capabilities
- None.

## Impact

- Affected code: `app/` routes, shared presentation components, and supporting style data.
- No API, database, or Prisma schema changes.
- No survey scoring, submission, or data-flow changes.
