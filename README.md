# CareerCompass — Smart Job Finder

Frontend-only React + Vite project for discovering jobs and tracking applications.

## Features
- Live job listings from Arbeitnow and Remotive public APIs
- Search by role, keywords, and location
- Fresher-oriented and work-mode filters
- Keyword-based skill match estimate
- Saved jobs and application status tracking
- Dashboard metrics and application chart
- Profile preferences stored in localStorage
- Responsive desktop and mobile design
- Job cache to reduce repeated API calls

## Setup
Requires Node.js 18+ and internet access.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production
```bash
npm run build
npm run preview
```

## Notes
This is frontend-only. Saved jobs and preferences are stored in the current browser, not synced between devices. Fresher eligibility and match scores are keyword estimates, not hiring guarantees. Public API coverage and availability can change. Remotive provides remote jobs. Verify every listing at its original URL and follow source attribution requirements.
