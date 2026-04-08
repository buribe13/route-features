'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { FeatureRequest } from '@/types'
import { FeatureTypeBadge, StatusBadge, UrgencyBadge } from '@/components/Badges'
const FEATURE_TYPES = ['UX', 'Workflow', 'Monetization', 'Teams', 'Performance', 'Other']
const URGENCIES = [
  { value: 'High', label: 'High — needed for launch' },
  { value: 'Medium', label: 'Medium — this quarter' },
  { value: 'Low', label: 'Low — flexible' },
]

interface FormState {
  name: string
  featureType: string
  problem: string
  desiredOutcome: string
  urgency: string
  links: string
  submitter: string
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-caption text-text-secondary mb-1.5 flex items-center gap-1">
      {children}
      {required && <span className="text-accent-red">*</span>}
    </label>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-surface-1 border border-border rounded-[6px] px-3 py-2.5 text-body text-text-primary placeholder-text-muted focus:outline-none focus:border-surface-4 transition-colors duration-100"
    />
  )
}

function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-surface-1 border border-border rounded-[6px] px-3 py-2.5 text-body text-text-primary placeholder-text-muted focus:outline-none focus:border-surface-4 transition-colors duration-100 resize-none"
    />
  )
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-surface-1 border border-border rounded-[6px] px-3 py-2.5 text-body text-text-primary focus:outline-none focus:border-surface-4 transition-colors duration-100 appearance-none cursor-pointer"
    >
      {placeholder && (
        <option value="" disabled className="text-text-muted">
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-surface-1">
          {o.label}
        </option>
      ))}
    </select>
  )
}

interface SubmitFormProps {
  recentFeatures?: FeatureRequest[]
}

export function SubmitForm({ recentFeatures = [] }: SubmitFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormState>({
    name: '',
    featureType: '',
    problem: '',
    desiredOutcome: '',
    urgency: '',
    links: '',
    submitter: '',
  })

  const set = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.featureType || !form.problem || !form.desiredOutcome || !form.urgency || !form.submitter) {
      toast.error('Please fill in all required fields.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          featureType: form.featureType,
          problem: form.problem,
          desiredOutcome: form.desiredOutcome,
          urgency: form.urgency,
          links: form.links || undefined,
          submitter: form.submitter,
        }),
      })

      if (!res.ok) throw new Error('Submission failed')

      toast.success('Request submitted. The team will review it.')
      router.push('/feature-requests')
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-10">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label required>Name</Label>
          <TextInput
            value={form.name}
            onChange={set('name')}
            placeholder="Short title for this feature or change"
          />
        </div>

        <div>
          <Label required>Feature Type</Label>
          <SelectInput
            value={form.featureType}
            onChange={set('featureType')}
            placeholder="Select a type"
            options={FEATURE_TYPES.map((t) => ({ value: t, label: t }))}
          />
        </div>

        <div>
          <Label required>What&apos;s the problem?</Label>
          <TextArea
            value={form.problem}
            onChange={set('problem')}
            placeholder="Describe the friction, gap, or issue you're running into."
            rows={4}
          />
        </div>

        <div>
          <Label required>What should happen instead?</Label>
          <TextArea
            value={form.desiredOutcome}
            onChange={set('desiredOutcome')}
            placeholder="Describe the ideal outcome — how it should look, feel, or work."
            rows={4}
          />
        </div>

        <div>
          <Label required>Urgency</Label>
          <SelectInput
            value={form.urgency}
            onChange={set('urgency')}
            placeholder="How time-sensitive is this?"
            options={URGENCIES}
          />
        </div>

        <div>
          <Label>Links / References</Label>
          <TextInput
            value={form.links}
            onChange={set('links')}
            type="url"
            placeholder="https://..."
          />
        </div>

        <div>
          <Label required>Your name</Label>
          <TextInput
            value={form.submitter}
            onChange={set('submitter')}
            placeholder="First name or handle"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-text-primary text-surface-0 text-body font-medium py-3 rounded-[6px] hover:bg-white transition-colors duration-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit request'}
          </button>
        </div>
      </form>

      {recentFeatures.length > 0 && (
        <aside>
          <p className="text-caption text-text-muted mb-4">Recent requests</p>
          <div className="space-y-2">
            {recentFeatures.slice(0, 5).map((f) => (
              <a
                key={f.id}
                href={`/feature/${f.id}`}
                className="block border border-subtle-20 rounded-[12px] p-5 hover:bg-surface-1 transition-all duration-100 group"
              >
                <p className="text-caption text-text-secondary group-hover:text-text-primary transition-colors truncate">
                  {f.name}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <FeatureTypeBadge type={f.featureType} />
                  <UrgencyBadge urgency={f.urgency} />
                  <StatusBadge status={f.status} />
                </div>
              </a>
            ))}
          </div>
        </aside>
      )}
    </div>
  )
}
