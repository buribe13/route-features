export type FeatureType = 'UX' | 'Workflow' | 'Monetization' | 'Teams' | 'Performance' | 'Other'
export type Urgency = 'High' | 'Medium' | 'Low'
export type Status = 'Backlog' | 'In Progress' | 'Done' | 'On Hold'
export type Role = 'design' | 'pm' | 'engineer'
export type DependencyStatus = 'in_progress' | 'waiting' | 'done' | 'blocked'
export type DecisionStatus = 'adopted' | 'open'
export type ResourceAccess = 'all' | 'design' | 'metro' | 'restricted'
export type ResourceSection = 'all' | 'design' | 'metro' | 'restricted'
export type ResourceCategory = 'Design' | 'Engineering' | 'Planning' | 'Comms' | 'Research' | 'Legal'
export type ResourceTool =
  | 'Figma'
  | 'Notion'
  | 'Slack'
  | 'GitHub'
  | 'Zoom'
  | 'Linear'
  | 'Drive'
  | 'Vercel'
  | 'Internal'
  | 'Legal'
  | 'Vault'

export interface FeatureRequest {
  id: string
  name: string
  featureType: FeatureType
  problem: string
  desiredOutcome: string
  urgency: Urgency
  status: Status
  submitter: string
  org?: Role
  links?: string
  lastUpdateNote?: string
  lastUpdated: string
  createdAt: string
}

export interface SubmitFormData {
  name: string
  featureType: FeatureType
  problem: string
  desiredOutcome: string
  urgency: Urgency
  links?: string
  submitter: string
}

export interface SprintDependency {
  id: number
  from: Role
  to: Role
  feature: string
  desc: string
  status: DependencyStatus
  due: string
  urgency: Urgency
}

export interface DashboardActionItem {
  id: number
  role: Role
  title: string
  urgency: Extract<Urgency, 'High' | 'Medium'>
  href: string
}

export interface DecisionLogItem {
  id: number
  title: string
  rationale: string
  owner: Role
  date: string
  tag: string
  status: DecisionStatus
}

export interface HandoffChecklistItem {
  id: number
  label: string
  note?: string
  done: boolean
}

export interface ResourceItem {
  id: number
  name: string
  tool: ResourceTool
  category: ResourceCategory
  description: string
  section: ResourceSection
  access: ResourceAccess
  org?: Role
}
