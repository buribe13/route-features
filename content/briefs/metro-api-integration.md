---
slug: metro-api-integration
title: Metro GTFS-RT API integration
ownerRole: engineer
status: active
origin: subproject
featureIds: []
updatedAt: "2026-04-05"
receivingTeam: design
summary: Real-time transit feed integration including schema documentation, latency specs, and endpoint reference for the Route App.
risks:
  - API rate limits may constrain real-time refresh intervals
  - Foreign SIM latency on event days could exceed TTI budget
openQuestions:
  - What is the acceptable staleness window for real-time data on Journey Cards?
  - Should the app fall back to scheduled data when real-time feed is unavailable?
---

## Metro GTFS-RT API integration

This brief covers the real-time transit data integration that powers Journey Cards and the map overlay.

### API overview

- GTFS-RT (General Transit Feed Specification - Realtime) provides vehicle positions, trip updates, and service alerts.
- The Metro endpoint delivers protobuf payloads with ~15s refresh intervals.
- Rate limits: 60 requests/minute per API key.

### Schema fields available

- Vehicle positions (lat/lng, bearing, speed)
- Trip updates (arrival/departure predictions per stop)
- Service alerts (cause, effect, description, active period)

### Performance constraints

- Target: Journey Cards must render with fresh data within 2s TTI on 4G (Decision Log #5).
- Strategy: pre-fetch and cache GTFS-RT responses at the edge, serve stale data with background revalidation.

### Handoff scope

Engineering is documenting the API schema and constraints for the Design Agency so card UI can reflect actual data availability.
