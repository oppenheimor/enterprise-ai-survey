## ADDED Requirements

### Requirement: Tool category recommendations
The report SHALL recommend AI tool categories and usage patterns based on the user's priority scene, pain point, and feasibility constraints.

#### Scenario: Customer service scene is recommended
- **WHEN** the user's top scene is customer service efficiency
- **THEN** the report MUST recommend relevant tool categories such as knowledge-base Q&A, standard reply assistant, or customer service workflow automation

#### Scenario: Low feasibility constraints exist
- **WHEN** budget, ownership, tooling, or team adoption constraints are weak
- **THEN** the recommendations MUST favor lightweight trials and setup steps instead of heavy implementation

### Requirement: Recommendations avoid unsupported brand claims
The report SHALL avoid naming specific commercial tools unless they come from a maintained internal tool catalog.

#### Scenario: No tool catalog is configured
- **WHEN** the report generates recommendations
- **THEN** it MUST describe tool types, selection criteria, usage method, and expected value area rather than inventing specific vendor facts

### Requirement: Tool recommendations are actionable
Each tool recommendation SHALL include why it fits, how to use it first, expected value area, and caution.

#### Scenario: Tool recommendation is rendered
- **WHEN** the report displays a recommended AI tool category
- **THEN** the recommendation MUST include a fit reason, first use case, value area, and caution note
