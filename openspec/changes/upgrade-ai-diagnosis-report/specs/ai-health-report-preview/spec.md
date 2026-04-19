## ADDED Requirements

### Requirement: Health report preview presentation
The result preview page SHALL present the generated diagnosis as a mobile-first health report preview instead of a short text summary.

#### Scenario: Preview is shown after generation
- **WHEN** report generation succeeds or deterministic fallback completes
- **THEN** the preview MUST show the overall verdict, rating, total score, recommended start scene, dimension health results, and at least one visual analysis block

#### Scenario: Preview contains unlock value
- **WHEN** the user views the preview
- **THEN** the page MUST clearly indicate which deeper modules are available after lead submission without hiding the existence of the generated report

### Requirement: Full report unlock uses same generated report
The system SHALL unlock additional sections from the same generated report after lead submission, without generating a new report.

#### Scenario: User submits lead
- **WHEN** the user submits valid lead information from the preview flow
- **THEN** the success page MUST show complete report sections using the previously generated report data

#### Scenario: Lead submission fails
- **WHEN** lead submission fails
- **THEN** the generated preview report MUST remain available so the user does not lose the analysis

### Requirement: Mobile H5 report readability
The report UI SHALL be optimized for mobile H5 reading with concise cards, visible hierarchy, and tappable actions.

#### Scenario: User reads on mobile viewport
- **WHEN** the report is displayed on a mobile viewport
- **THEN** the content MUST fit a single-column flow with clear card hierarchy and no desktop-only layout dependency
