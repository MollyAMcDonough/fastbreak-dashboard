# FastBreak Player Insights Dashboard

Welcome to the FastBreak Dashboard! This secure web application showcases player statistics for the Charlotte Hornets, featuring authentication, interactive visualizations, and leaderboard widgets.

## Features

- **Auth0 Authentication:** Login/logout and protected dashboard routes
- **Player Data:** Points, assists, rebounds, field goal percentage, minutes played, turnovers, fouls
- **Visualizations Implemented:**
  - Player Stats Table
  - Per-Minute Stats Table
  - Points Per Game Bar Chart
  - Grouped Bar Chart: FG% vs 3P% by Player
- **API Endpoints:** Next.js API routes for data transformation (e.g., per-minute stats)
- **Tech Stack:** Next.js App Router, Tailwind CSS, Auth0, TypeScript, Supabase, Recharts

## Data Source

Player statistics are sourced from ESPN home game data for the Charlotte Hornets 2024-2025 NBA season. Data was copied and uploaded as csv to Supabase into the table structure shown in `supabase/migrations/01_create_players_table.sql` (see file for details).

Supabase was chosen for its ease of integration and because FastBreak prefers Supabase for take-home projects. The Ball Don't Lie API was considered, but most data is paywalled and rate-limited.

## Example .env.local

For local development, create a `.env.local` file in the project root with the following structure:

```env
AUTH0_SECRET=your_auth0_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_KEY=your_supabase_service_role_key
```

Replace values with your actual Auth0 and Supabase credentials.

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- Login to access the dashboard and view Charlotte Hornets player statistics.
- Use the leaderboard and charts to explore player performance and efficiency.

## Deployment

Deployed to Vercel. See the repository for the public URL.

## Code Structure

- `src/components/StatsTable.tsx`: Reusable table component for player stats
- `pages/api/player-per-minute.ts`: API endpoint for per-minute stats transformation
- `src/components/DashboardClient.tsx`: Main dashboard logic and rendering

## Requirements

- Next.js App Router
- Tailwind CSS
- Auth0 integration
- TypeScript
- Public NBA API or Supabase

## License

MIT
