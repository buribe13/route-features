# Agent Memory

## Learned User Preferences

- Notion internal integration secrets may start with `ntn_` (newer format) or `secret_`; use the value exactly as Notion provides.
- No uppercase/all-caps text styling; all section labels and headings use standard sentence casing.
- Unicode arrow characters (→, ←, ↗, ↔) should not appear in UI; use SVG components from `components/icons/ArrowIcons.tsx`.

## Learned Workspace Facts

- This project uses `@notionhq/client` v3; v5 has a different API (e.g. `databases.query` moved to `dataSources`).
- Typography: only 3 text styles — 24px/32, 14px/22, 12px/18 — all Inter.
- `.env.local` must have content and each variable on its own line for Next.js to load env vars.
- For `NOTION_DATABASE_ID`, use the 32-character ID from the Notion page URL path, not the `v=` view parameter.
- Border radius for UI surfaces is 6px project-wide (Tailwind/components/globals).
- Layout uses a 220px left sidebar (not a top header); sidebar branding is "LA28 Route" with a white placeholder square; `la28-logo.png` is no longer rendered.
- Non-button container borders use `border-subtle-20` class (rgba(255,255,255,0.07)) for subtle 20% opacity.
- Content area is constrained to `max-w-[720px]` with `pl-[100px]` left margin in the root flex layout.
- Role state is managed via `RoleProvider` (React context + sessionStorage); three demo roles: design, pm, engineer.
