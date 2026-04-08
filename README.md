# LA28 Route — Feature Portal

An internal + public-facing feature request and feedback portal for the LA28 Route app. Editorial feed design, dark theme, powered by Notion as the backend database.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS v3**
- **`@notionhq/client`** — Notion API
- **`react-hot-toast`** — toast notifications
- **`date-fns`** — date formatting

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NOTION_TOKEN=secret_...
NOTION_DATABASE_ID=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Create the Notion database

Create a new full-page database in Notion with the following properties:

| Property | Type |
|---|---|
| `Name` | Title |
| `Feature Type` | Select |
| `Problem` | Rich text |
| `Desired Outcome` | Rich text |
| `Urgency` | Select |
| `Status` | Select |
| `Submitter` | Rich text |
| `Links` | URL |
| `Last Update Note` | Rich text |
| `Last Updated` | Last edited time |

**Select options to add:**

- **Feature Type:** UX, Workflow, Monetization, Teams, Performance, Other
- **Urgency:** High, Medium, Low
- **Status:** Backlog, In Progress, Done, On Hold

### 4. Connect your Notion integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) and create a new integration
2. Copy the **Internal Integration Secret** (starts with `ntn_` or `secret_`) → set as `NOTION_TOKEN`
3. Open your database in Notion → click `···` → **Connections** → add your integration
4. Copy the database ID from the URL (the 32-char hex string before `?v=`) → set as `NOTION_DATABASE_ID`

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Routes

| Route | Description |
|---|---|
| `/` | Feed of all feature requests, filterable by type and urgency |
| `/submit` | Submission form with recent-requests sidebar |
| `/feature/[id]` | Detail view with full description and last-update handoff section |

## API Routes

| Route | Method | Description |
|---|---|---|
| `/api/features` | GET | Returns all features sorted by newest first |
| `/api/features/[id]` | GET | Returns a single feature by Notion page ID |
| `/api/submit` | POST | Creates a new Notion page / feature request |

---

## Typography system

Three text styles only, all Inter:

| Class | Size | Line height |
|---|---|---|
| `.text-display` | 24px | 32px |
| `.text-body` | 14px | 22px |
| `.text-caption` | 12px | 18px |

---

## Deployment

Deploy to [Vercel](https://vercel.com) — add the three env vars in the project settings.
