## ADDED Requirements

### Requirement: Static style wall page
The system SHALL provide a dedicated page that displays a static gallery of style samples for the enterprise AI transformation survey theme without altering the existing homepage behavior.

#### Scenario: User opens the style wall page
- **WHEN** the user navigates to the style wall route
- **THEN** the system renders a standalone page containing a gallery of style samples
- **AND** the current homepage remains available unchanged at `/`

### Requirement: Fifteen comparable style cards
The system SHALL render exactly 15 style cards in the gallery, and each card MUST use the same information architecture so visual differences can be compared fairly.

#### Scenario: User compares cards
- **WHEN** the gallery page loads
- **THEN** the user sees 15 cards
- **AND** every card includes the same content sections for badge, title, summary, value points, primary call-to-action, and audience note

### Requirement: Enterprise AI survey-themed sample copy
The system SHALL present copy that is specific to the enterprise AI transformation survey use case rather than generic placeholder landing-page content.

#### Scenario: User reads a sample card
- **WHEN** the user inspects any card in the gallery
- **THEN** the card messaging references enterprise AI transformation assessment
- **AND** the card communicates business diagnosis, maturity evaluation, and action guidance as the value proposition

### Requirement: Style identity labeling
The system SHALL label each card with its style name so reviewers can identify and discuss candidate directions unambiguously.

#### Scenario: User reviews a preferred style
- **WHEN** the user looks at a card in the gallery
- **THEN** the card visibly identifies the associated style
