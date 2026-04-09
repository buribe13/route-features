---
slug: journey-cards
title: Journey Cards UI
ownerRole: design
status: active
origin: subproject
featureIds:
  - mock-crowd-density-indicator
updatedAt: "2026-04-07"
receivingTeam: engineer
summary: Hi-fi Journey Card component spec including states, animations, and accessibility annotations for engineering handoff.
risks:
  - Animation easing spec not finalized
  - Tablet breakpoint constraints still blocked on engineering
openQuestions:
  - What real-time data fields from GTFS-RT are surfaceable in card UI?
  - How does the card degrade on 4G connections given the <2s TTI budget?
---

## Journey Cards UI spec

Journey Cards are the primary navigation metaphor for the LA28 Route App. Each card narrates a transit journey as a memorable experience rather than a list of stops.

### Current status

- Hi-fi Figma prototype complete (journey-cards-v3.fig)
- Component states documented: empty, loading, disruption, multilingual variants
- Animation and easing spec is in progress
- Accessibility annotations (WCAG AA) pending

### Key decisions

- Cards as primary navigation metaphor (Decision Log #1)
- Leaflet + CartoDB over Mapbox to avoid cross-org credential friction (Decision Log #2)
- Predictive routing over reactive crowd management (Decision Log #3)

### Dependencies

- **From engineering:** Metro GTFS-RT API schema and latency specs are needed to finalize which data fields appear on cards.
- **From engineering:** Tablet breakpoint constraints (768-1024px) for Leaflet tile behavior — currently blocked.
- **From PM:** Brand Event Catalog v2 taxonomy has been delivered.

### Handoff scope

Design Agency is preparing the full card spec for Metro Engineering. The handoff checklist tracks remaining deliverables before submission.
