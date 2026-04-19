## ADDED Requirements

### Requirement: Diagnosis generation uses provider-agnostic SDK
The system SHALL generate AI diagnosis results through Vercel AI SDK instead of directly using the OpenAI client library.

#### Scenario: Configured compatible provider generates diagnosis
- **WHEN** a survey submission triggers diagnosis generation and a compatible LLM provider is configured
- **THEN** the system MUST call the configured model through Vercel AI SDK and return a result matching the diagnosis schema

#### Scenario: Model call fails
- **WHEN** the configured model call fails, returns invalid structure, or is not configured
- **THEN** the system MUST return the existing deterministic fallback diagnosis instead of failing the user submission

### Requirement: Existing model configuration remains compatible
The system SHALL continue to support existing `OPENAI_*` and generic `LLM_*` environment variables for diagnosis model configuration.

#### Scenario: MiMo compatible endpoint is configured
- **WHEN** `LLM_BASE_URL` points to the MiMo compatible endpoint and `LLM_API_KEY` is provided
- **THEN** the system MUST select the configured `LLM_MODEL` or the MiMo default model without requiring OpenAI SDK code

#### Scenario: No provider is configured
- **WHEN** no supported model API key is configured
- **THEN** the system MUST skip external generation and use deterministic fallback diagnosis
