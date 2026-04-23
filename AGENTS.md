# Agent Memory

## Learned User Preferences

- Notion internal integration secrets may start with `ntn_` (newer format) or `secret_`; use the value exactly as Notion provides.
- No uppercase/all-caps text styling; all section labels and headings use standard sentence casing.
- Unicode arrow characters (→, ←, ↗, ↔) should not appear in UI; use SVG components from `components/icons/ArrowIcons.tsx`.
- Status/urgency badge color scheme: done/complete = green, in-progress = yellow, waiting/high/blocked = red; in-progress and backlog pills should match the shared status-badge styling.
- Action buttons that sit alongside badges (e.g. "Open" resource buttons) should share the badge pill styling (same height, `BADGE_PILL_BASE`) while keeping their original text and background colors.

## Learned Workspace Facts

- This project uses `@notionhq/client` v3; v5 has a different API (e.g. `databases.query` moved to `dataSources`).
- Typography: Inter. Page titles and page descriptions (`PageHeader`) use 20px/24 medium with `tracking-[-0.01em]`; descriptions use `text-text-muted`. Body and caption use 14px/22 and 12px/18; large display headings use 24px/32 where used.
- `.env.local` must have content and each variable on its own line for Next.js to load env vars.
- For `NOTION_DATABASE_ID`, use the 32-character ID from the Notion page URL path, not the `v=` view parameter.
- Border radius: 12px for non-button containers with a border (cards, sections, sidebar); 6px for buttons, badges, form inputs, and nav items.
- Layout uses a 220px left sidebar (not a top header); sidebar branding is "LA28 Route Portal" with the LA28 mark from `public/la28-logo.png` via Next.js `Image` (20×20 in the sidebar, 32×32 on the login screen).
- Non-button container borders use `border-subtle-20` class (rgba(255,255,255,0.07)) for subtle 20% opacity.
- Content area is constrained to `max-w-[840px]` centered via `max-w-[1200px] mx-auto px-8 py-20` on the root flex layout (login renders outside `LoginGate` and is unaffected).
- Tag/badge pills (status, urgency, type, etc.) have no border — shared `BADGE_PILL_BASE` (inline-flex, `px-2 py-1`, caption line height, `whitespace-nowrap`), background fill only.
- Divider lines inside bordered containers use the `divide-inset` CSS utility (inset 20px to match content padding); sidebar dividers use explicit `mx-4` inset elements.
- Role state is managed via `RoleProvider` (React context + sessionStorage); three demo roles: design, pm, engineer.
- Documentation items (briefs, checklist items, action items, etc.) open as a lightbox overlay rather than navigating to a separate route.
- The AI agent is embedded into markdown creation/handoff workflows (subprojects and features convert to markdown; uploads are tracked universally); it is not a floating chat dock.

