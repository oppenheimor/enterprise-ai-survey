## 1. Dependency Migration

- [x] 1.1 Add Vercel AI SDK dependencies for core generation and OpenAI-compatible providers.
- [x] 1.2 Remove the direct `openai` package dependency.

## 2. Diagnosis Implementation

- [x] 2.1 Replace the OpenAI client implementation in `lib/survey/diagnosis.ts` with Vercel AI SDK `generateObject`.
- [x] 2.2 Preserve existing environment variable compatibility, model defaults, schema validation, and fallback behavior.

## 3. Verification

- [x] 3.1 Run type checking and diagnosis tests.
- [x] 3.2 Run OpenSpec validation for the new change.
