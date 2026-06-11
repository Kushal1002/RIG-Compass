# RIG Engagement Tracker

> Track customer engagements, progress, risks, and insights.

A modern enterprise-grade web application for the SAP BTP Product Management - APJ Team. Built with React 19, Vite, and Recharts.

## Features

- **Dashboard KPIs** - Total, Active, Completed, Blocked engagements + average progress
- **Interactive Charts** - Status pie chart, engagement type bar chart, progress trend line chart
- **Filterable Table** - Search, sort, paginate engagements by status, industry, type, owner
- **Engagement Details** - Side panel with timeline, progress, blockers, notes
- **AI Summary Generator** - Executive-style summaries generated from engagement data (no external API)
- **Risk Indicators** - Automatic High/Medium/Low risk classification with visual badges
- **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- React 19+ (Functional Components, Hooks)
- Vite
- JavaScript (ES Modules)
- CSS Modules
- Recharts
- Lucide React (icons)
- Local state only (no backend)

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install and Run

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

Output is in `dist/`.

### Preview Production Build

```bash
npm run preview
```

## Deploy to Vercel

This project is ready for Vercel deployment:

1. Push to a Git repository
2. Import the project in Vercel
3. Deploy (no configuration needed - vercel.json is included)

Or use the Vercel CLI:

```bash
npx vercel
```

## Project Structure

```
src/
├── components/
│   ├── Header/           - App header with leadership view toggle
│   ├── KPISection/       - KPI metric cards
│   ├── FilterBar/        - Search and filter controls
│   ├── EngagementTable/  - Sortable, paginated data table
│   ├── EngagementCard/   - Detail side panel with timeline
│   ├── ProgressBar/      - Reusable progress bar
│   ├── AISummaryModal/   - AI-generated summary modal
│   ├── Charts/           - Recharts visualizations
│   └── EmptyState/       - Empty state placeholder
├── data/
│   └── engagements.js    - Mock engagement records
├── pages/
│   └── Dashboard/        - Main dashboard page
├── utils/
│   └── aiSummaryGenerator.js - AI summary + risk logic
├── styles/
│   └── global.css        - Global CSS variables and resets
├── App.jsx
└── main.jsx
```

## License

Internal use only - SAP BTP Product Management Team.
