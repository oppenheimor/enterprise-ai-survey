## 1. Report Contract

- [x] 1.1 Replace the old summary diagnosis schema with the full AI health report schema.
- [x] 1.2 Update submission payload typing and persistence shape to carry the full report.
- [x] 1.3 Add a Prisma migration that removes old diagnosis summary columns and stores the complete report JSON.

## 2. Generation Logic

- [x] 2.1 Rewrite the diagnosis prompt and structured output schema for health-report generation.
- [x] 2.2 Implement deterministic fallback generation for the full health report schema.
- [x] 2.3 Keep generation triggered by the result preview button and avoid second model generation after lead submission.

## 3. Report UI

- [x] 3.1 Redesign the preview page into a mobile-first health report preview with visual dimension analysis.
- [x] 3.2 Add full-report sections after lead submission, including tool recommendations and action roadmap.
- [x] 3.3 Preserve lead form behavior and keep the generated preview visible if lead submission fails.

## 4. Verification

- [x] 4.1 Update benchmark/unit tests for the expanded report schema and grounded analysis requirements.
- [x] 4.2 Run OpenSpec validation and project baseline checks.
- [x] 4.3 Run or update the relevant H5 e2e smoke flow for preview generation and unlock.
