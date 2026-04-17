## Goal

Add a dedicated sample-wall page for the enterprise AI transformation survey project. The page will show 15 static style cards with identical content so product and design decisions can focus on visual direction instead of flow or copy differences.

## Scope

- New standalone page under the App Router
- 15 style variants on one page
- Enterprise AI survey-themed copy shared by all cards
- No data submission, no filtering, no selection state, no screenshot export

## Content Skeleton

Each card uses the same structure:
- Style name label
- Product badge: `Enterprise AI Survey`
- Headline about helping business owners understand AI transformation readiness
- One short summary paragraph
- Three value points: business diagnosis, maturity evaluation, action guidance
- Primary CTA: `开始 3 分钟测评`
- Audience note for 20-500 person company leaders

## Style Set

Initial 15-style set:
- `corporate-clean`
- `minimalist-flat`
- `apple-style`
- `notion-style`
- `swiss-style`
- `bento-grid`
- `soft-ui`
- `glassmorphism`
- `neo-brutalist`
- `neo-brutalist-soft`
- `modern-gradient`
- `editorial`
- `dark-mode`
- `luxury-retail`
- `korean-minimal`

## Implementation Shape

- Keep data in one local module with shared copy plus a `stylePresets` list
- Render cards from a single reusable component
- Use Tailwind utility classes and lightweight decorative layers for each preset
- Do not replace the current homepage

## Verification

- `pnpm check`
- Quick manual review of the sample wall route in the browser if needed
