import {
  DashboardActionItem,
  DecisionLogItem,
  FeatureRequest,
  HandoffChecklistItem,
  ResourceCategory,
  ResourceItem,
  ResourceSection,
  ResourceTool,
  Role,
  SprintDependency,
} from '@/types'

export const ROLE_META: Record<Role, { label: string; org: string }> = {
  design: { label: 'Design Lead', org: 'Design Agency' },
  pm: { label: 'Product Manager', org: 'LA Metro' },
  engineer: { label: 'Engineer', org: 'LA Metro' },
}

export const PORTAL_TABS = [
  { href: '/', label: 'Dashboard' },
  { href: '/sprint-board', label: 'Sprint Board' },
  { href: '/feature-requests', label: 'Feature Requests' },
  { href: '/decision-log', label: 'Decision Log' },
  { href: '/handoff', label: 'Handoff' },
  { href: '/resources', label: 'Resources' },
] as const

export const SPRINT_CONTEXT = {
  id: 'Sprint 3',
  theme: 'Journey Cards + Metro API Integration',
  range: 'Mar 31-Apr 14',
  progress: 34,
}

export const SPRINT_DEPENDENCIES: SprintDependency[] = [
  {
    id: 1,
    from: 'design',
    to: 'engineer',
    feature: 'Journey Card UI Spec',
    desc: 'Hi-fi prototype with states, edge cases, accessibility notes, and animation spec for the Journey Card component.',
    status: 'in_progress',
    due: 'Apr 4',
    urgency: 'High',
  },
  {
    id: 2,
    from: 'engineer',
    to: 'design',
    feature: 'Metro GTFS-RT API Schema',
    desc: 'Real-time feed schema and latency specs needed to finalize which data fields are surfaceable in Journey Cards.',
    status: 'waiting',
    due: 'Apr 3',
    urgency: 'High',
  },
  {
    id: 3,
    from: 'pm',
    to: 'design',
    feature: 'Brand Event Catalog v2',
    desc: 'Updated taxonomy: Nike x Stussy at The Grove, Adidas at Staples, plus 12 new venue additions for event discovery.',
    status: 'done',
    due: 'Apr 1',
    urgency: 'Medium',
  },
  {
    id: 4,
    from: 'design',
    to: 'pm',
    feature: 'Multilingual UX Synthesis',
    desc: 'Findings from six sessions across four language groups with prioritized design recommendations for release planning.',
    status: 'in_progress',
    due: 'Apr 7',
    urgency: 'Medium',
  },
  {
    id: 5,
    from: 'engineer',
    to: 'design',
    feature: 'Tablet Breakpoint Constraints',
    desc: 'Leaflet tile behavior at 768-1024px, including known constraints affecting Journey Card layout at mid-widths.',
    status: 'blocked',
    due: 'Apr 5',
    urgency: 'High',
  },
]

export const DASHBOARD_ACTIONS: DashboardActionItem[] = [
  { id: 1, role: 'design', title: 'Complete Journey Card animation spec', urgency: 'High', href: '/handoff' },
  { id: 2, role: 'design', title: 'Finish multilingual UX synthesis', urgency: 'Medium', href: '/sprint-board' },
  { id: 3, role: 'pm', title: 'Review open performance budget decision', urgency: 'High', href: '/decision-log' },
  { id: 4, role: 'pm', title: 'Confirm brand event catalog', urgency: 'Medium', href: '/sprint-board' },
  { id: 5, role: 'engineer', title: 'Deliver GTFS-RT API schema to Design - overdue', urgency: 'High', href: '/sprint-board' },
  { id: 6, role: 'engineer', title: 'Document tablet breakpoint constraints', urgency: 'High', href: '/sprint-board' },
]

export const DECISION_LOG_ITEMS: DecisionLogItem[] = [
  {
    id: 1,
    title: 'Journey Cards as primary navigation metaphor',
    rationale: 'Norman: memory of an event matters more than the event itself. Cards narrate the journey, not list transit steps.',
    owner: 'design',
    date: 'Mar 24',
    tag: 'UX Architecture',
    status: 'adopted',
  },
  {
    id: 2,
    title: 'Leaflet + CartoDB over Mapbox',
    rationale: 'No API token required. Eliminates cross-org credential management and setup friction for Metro engineering.',
    owner: 'engineer',
    date: 'Mar 26',
    tag: 'Technical',
    status: 'adopted',
  },
  {
    id: 3,
    title: 'Predictive routing over reactive crowd management',
    rationale: 'Yuan & Zheng (2018): reactive systems cause crowding oscillation. Pre-event simulations pre-position route suggestions.',
    owner: 'pm',
    date: 'Mar 28',
    tag: 'Product Strategy',
    status: 'adopted',
  },
  {
    id: 4,
    title: 'Tablet view deferred to post-launch',
    rationale: 'Mobile-first for Day 1. Scope decision documented here, not an oversight, to prevent rework.',
    owner: 'pm',
    date: 'Mar 30',
    tag: 'Scope',
    status: 'adopted',
  },
  {
    id: 5,
    title: 'Map performance budget: <2s TTI on 4G',
    rationale: 'Olympics attendees may be on foreign SIMs with degraded data. The map must work before full tile load completes.',
    owner: 'engineer',
    date: 'Apr 1',
    tag: 'Technical',
    status: 'open',
  },
]

export const HANDOFF_CHECKLIST: HandoffChecklistItem[] = [
  { id: 1, label: 'Hi-fi Figma prototype', note: 'journey-cards-v3.fig - linked in sprint doc', done: true },
  { id: 2, label: 'Component states documented', note: 'Empty, loading, disruption, multilingual variants', done: true },
  { id: 3, label: 'Animation & easing spec', done: false },
  { id: 4, label: 'Accessibility annotations (WCAG AA)', done: false },
  { id: 5, label: 'Open questions flagged', note: '3 open questions - see Decision Log #5', done: true },
  { id: 6, label: 'Performance budget acknowledged', note: 'Pending Decision #5 resolution', done: false },
]

export const RESOURCE_CATEGORIES: Array<'All' | ResourceCategory> = [
  'All', 'Design', 'Engineering', 'Planning', 'Comms', 'Research', 'Legal',
]

export const RESOURCE_SECTION_LABELS: Record<ResourceSection, string> = {
  all: 'Shared - All Orgs',
  design: 'Design Agency',
  metro: 'LA Metro',
  restricted: 'Restricted Access',
}

export const RESOURCES: ResourceItem[] = [
  { id: 1, name: 'Journey Cards - Figma', tool: 'Figma', category: 'Design', description: 'Master design file: Journey Cards v3, map overlay, and event discovery flow.', section: 'all', access: 'all' },
  { id: 2, name: 'Sprint 3 - Notion Doc', tool: 'Notion', category: 'Planning', description: 'Sprint goals, cross-org dependencies, and standup notes.', section: 'all', access: 'all' },
  { id: 3, name: '#la28-cross-org', tool: 'Slack', category: 'Comms', description: 'Primary async channel across all three orgs with no confidential content.', section: 'all', access: 'all' },
  { id: 4, name: 'Weekly Alignment', tool: 'Zoom', category: 'Comms', description: 'Mondays 10am PT recurring link for all leads.', section: 'all', access: 'all' },
  { id: 5, name: 'LA28 Route App - Staging', tool: 'Vercel', category: 'Engineering', description: 'Live staging build updated on every merge to main.', section: 'all', access: 'all' },
  { id: 6, name: 'LA28 Branding Guidelines', tool: 'Figma', category: 'Design', description: 'Typography, color system, and motion principles for internal reference.', section: 'design', access: 'design', org: 'design' },
  { id: 7, name: 'Multilingual Research Notes', tool: 'Drive', category: 'Research', description: 'Raw session notes for six participants across four language groups.', section: 'design', access: 'design', org: 'design' },
  { id: 8, name: '#design-internal', tool: 'Slack', category: 'Comms', description: 'Agency internal channel not visible to Metro.', section: 'design', access: 'design', org: 'design' },
  { id: 9, name: 'Design System (private)', tool: 'Figma', category: 'Design', description: 'Component library not synced to the Metro handoff file.', section: 'design', access: 'design', org: 'design' },
  { id: 10, name: 'Route App - GitHub Repo', tool: 'GitHub', category: 'Engineering', description: 'Main codebase with Metro engineering access only.', section: 'metro', access: 'metro', org: 'pm' },
  { id: 11, name: 'Metro Sprint Board', tool: 'Linear', category: 'Engineering', description: 'Metro internal sprint tracker for the LA28 Route track.', section: 'metro', access: 'metro', org: 'pm' },
  { id: 12, name: 'GTFS-RT API Documentation', tool: 'Notion', category: 'Engineering', description: 'Real-time feed schema, rate limits, and endpoint reference.', section: 'metro', access: 'metro', org: 'engineer' },
  { id: 13, name: 'Brand Event Catalog v2', tool: 'Drive', category: 'Planning', description: 'Nike x Stussy, Adidas at Staples, and 12 new venue additions.', section: 'metro', access: 'metro', org: 'pm' },
  { id: 14, name: 'Metro Infrastructure Map', tool: 'Internal', category: 'Planning', description: 'Station capacity, planned closures, and event-day service changes.', section: 'metro', access: 'metro', org: 'engineer' },
  { id: 15, name: 'Data Sharing Agreement', tool: 'Legal', category: 'Legal', description: 'Metro–Agency data governance MOU for legal and org leads only.', section: 'restricted', access: 'restricted' },
  { id: 16, name: 'API Credentials - Staging', tool: 'Vault', category: 'Legal', description: 'Staging environment keys for Metro eng lead and agency tech lead only.', section: 'restricted', access: 'restricted' },
  { id: 17, name: 'LA28 Organizing Committee Brief', tool: 'Drive', category: 'Planning', description: 'Confidential pre-release event-day operations brief.', section: 'restricted', access: 'restricted' },
]

export const FEATURE_REQUEST_SAMPLES: FeatureRequest[] = [
  {
    id: 'mock-crowd-density-indicator',
    name: 'Crowd density indicator on map',
    featureType: 'Performance',
    problem: 'Teams need a clearer way to anticipate crowded stations without opening a separate analytics view during event peaks.',
    desiredOutcome: 'Add an at-a-glance density indicator to the map so design and engineering can validate how crowding appears in the shared Journey Card experience.',
    urgency: 'High',
    status: 'In Progress',
    submitter: 'Ben U',
    org: 'design',
    lastUpdateNote: 'In review with Design Agency and Metro engineering.',
    lastUpdated: '2026-04-07T12:00:00.000Z',
    createdAt: '2026-04-05T12:00:00.000Z',
  },
]

const submitterOrgMap: Record<string, Role> = {
  'ben u': 'design',
  'ben k': 'pm',
}

export function inferOrgFromSubmitter(submitter?: string): Role | undefined {
  if (!submitter) return undefined
  return submitterOrgMap[submitter.trim().toLowerCase()]
}

export function mergeFeatureSamples(features: FeatureRequest[]): FeatureRequest[] {
  const seenIds = new Set(features.map((feature) => feature.id))
  const seenNames = new Set(features.map((feature) => feature.name.trim().toLowerCase()))
  const additions = FEATURE_REQUEST_SAMPLES.filter((feature) => {
    return !seenIds.has(feature.id) && !seenNames.has(feature.name.trim().toLowerCase())
  })
  return [...additions, ...features]
}
