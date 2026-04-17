## Context

The repository currently exposes a single homepage with a scaffold-level enterprise AI survey introduction and a sample intake form. The new requirement is a static comparison surface where the same enterprise AI survey messaging can be viewed across 15 distinct visual styles without changing the existing homepage or introducing new user flow.

This change is UI-heavy but technically simple: one new App Router page, a normalized content model for the card body, and a style-token mapping layer that can express varied visual systems while keeping structure fixed.

## Goals / Non-Goals

**Goals:**
- Add a dedicated page for side-by-side comparison of 15 styles.
- Keep all cards structurally identical so style is the only primary variable.
- Keep the implementation local to presentation code and route files.
- Make it easy to swap, add, or prune styles in a later iteration.

**Non-Goals:**
- Replacing the current homepage.
- Implementing a style voting, selection, or persistence flow.
- Building the real questionnaire experience.
- Mirroring every detail from the `meoo-ui-design` style documents with full fidelity.

## Decisions

### Use a dedicated route instead of reworking `/`
- Decision: Add a separate App Router page for the style wall.
- Rationale: The existing home page is part of the current scaffold baseline and should remain stable while visual exploration happens in isolation.
- Alternative considered: Replace the home page directly. Rejected because it couples experimentation with the current baseline and makes regression review noisier.

### Drive cards from shared content plus per-style tokens
- Decision: Build a shared card content schema and pair it with a `stylePresets` array that defines colors, borders, typography, and decorative patterns.
- Rationale: This preserves comparability while keeping the implementation compact and maintainable.
- Alternative considered: Hand-code 15 independent cards. Rejected because drift between cards would make visual comparison less trustworthy and future edits expensive.

### Aim for “inspired by” rather than literal reproduction of all 15 style docs
- Decision: Translate each chosen style into a constrained local preset rather than importing every style document rule verbatim.
- Rationale: The page needs coherent performance, manageable code size, and fast iteration. The goal is screening direction, not pixel-perfect certification of the external style library.
- Alternative considered: Build a generic parser for all style markdown files. Rejected as unnecessary complexity for a static internal demo.

## Risks / Trade-offs

- [Style drift from source docs] → Keep style names explicit and encode the most recognizable traits for each preset.
- [Too much visual noise on one page] → Use a stable outer layout and consistent card dimensions so comparison remains readable.
- [Future content edits create inconsistencies] → Centralize the survey sample copy in one data object shared by all cards.
- [Some styles may feel weak in small-card format] → Use a card composition that includes headline, value points, CTA, and eligibility text so each style has enough surface area to express itself.
