## ADDED Requirements

### Requirement: Structured health report generation
The system SHALL generate a complete structured AI transformation health report when a user completes the survey and requests the result preview.

#### Scenario: User requests result preview
- **WHEN** the user answers all required survey questions and clicks the result preview button
- **THEN** the system MUST calculate rule-based scoring and generate a structured report through the configured model before showing the preview

#### Scenario: Report output is validated
- **WHEN** the model returns a report
- **THEN** the system MUST validate it against the health report schema before rendering or persisting it

### Requirement: Model analysis is grounded in inputs
The system SHALL require model analysis to use the survey answers, profile labels, scoring result, top scene, and generation constraints as grounding data.

#### Scenario: Report explains a recommendation
- **WHEN** the report recommends a start point
- **THEN** the explanation MUST reference user answers or scoring data rather than unsupported external claims

#### Scenario: Report includes dimensions
- **WHEN** the report presents dimension analysis
- **THEN** each dimension MUST include a score, level, explanation, evidence, and risk or attention point

### Requirement: Full fallback report
The system SHALL return a complete deterministic fallback report matching the same schema when model generation is unavailable or invalid.

#### Scenario: Model call fails
- **WHEN** the model is not configured, times out, fails, or returns invalid structure
- **THEN** the system MUST return a full health report from deterministic rules instead of a short summary

### Requirement: Boundary controls
The system SHALL prohibit unsupported ROI, revenue, saving percentages, industry benchmark claims, and guaranteed implementation outcomes in the generated report.

#### Scenario: Report contains boundary notes
- **WHEN** the report is rendered
- **THEN** it MUST include a clear boundary note explaining that the result is an initial diagnosis and not a full implementation plan or ROI promise
