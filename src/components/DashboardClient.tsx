'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, Legend, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import StatsTable from './StatsTable';

// Define the Player type based on the supabase data structure
type Player = {
  id: string;
  name: string;
  position: string;
  pts: number;
  ast: number;
  reb: number;
  fg_pct: number;
  three_pct: number;
  mpg: number;
};

// Define the PlayerPerMinute type for API transformed stats
type PlayerPerMinute = {
  name: string;
  position: string;
  ppm: number;
  apm: number;
  rpm: number;
  tpm: number;
  fpm: number;
};

// Define the columns for the player stats table
const playerStatsColumns = [
  { key: 'name', label: 'Name' },
  { key: 'position', label: 'Position' },
  { key: 'pts', label: 'Points' },
  { key: 'ast', label: 'Assists' },
  { key: 'reb', label: 'Rebounds' },
  { key: 'fg_pct', label: 'Field Goal %' },
  { key: 'three_pct', label: 'Three Point %' },
  { key: 'mpg', label: 'Minutes Per Game' },
];

// Define the columns for the player per minute stats table
const playerPerMinuteStatsColumns = [
  { key: 'name', label: 'Name' },
  { key: 'position', label: 'Position' },
  { key: 'mpg', label: 'Minutes Per Game' },
  { key: 'ppm', label: 'Points' },
  { key: 'apm', label: 'Assists' },
  { key: 'rpm', label: 'Rebounds' },
  { key: 'tpm', label: 'Turnovers' },
  { key: 'fpm', label: 'Fouls' },
];

export default function DashboardClient() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playersPerMinute, setPlayersPerMinute] = useState<PlayerPerMinute[]>([]);
  const [loadingPerMinute, setLoadingPerMinute] = useState(true);
  const [errorPerMinute, setErrorPerMinute] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login?returnTo=/dashboard');
    }
  }, [isLoading, user, router]);

  // Fetch supabase data via the protected player Nextjs API route
  useEffect(() => {
    if (user) {
      fetch('/api/test-supabase')
        .then((res) => res.json())
        .then((data) => {
          setPlayers(data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to load player data');
          setLoading(false);
        });
    }
  }, [user]);

  // Fetch supabase data via the protected player-per-minute Nextjs API route
  useEffect(() => {
    fetch('/api/player-per-minute')
      .then((res) => res.json())
      .then((data) => {
        setPlayersPerMinute(data);
        setLoadingPerMinute(false);
      })
      .catch((err) => {
        setErrorPerMinute('Failed to load per-minute player data');
        setLoadingPerMinute(false);
      });
  }, []);

  const filteredPlayers = players.filter((p) => p.name && p.name.toLowerCase() !== 'total');
  const filteredPlayersPerMinute = playersPerMinute.filter(
    (p) => p.name && p.name.toLowerCase() !== 'total'
  );

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Dashboard</h2>
      <p className="mb-6">Welcome to the dashboard! Only authenticated users can see this.</p>

      {loading && <p>Loading player data...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {loadingPerMinute && <p>Loading player per minute data...</p>}
      {errorPerMinute && <p className="text-red-500">{errorPerMinute}</p>}

      {!loading && !error && !loadingPerMinute && !errorPerMinute && (
        <>
          <StatsTable data={filteredPlayers} columns={playerStatsColumns} title="Player Stats" />

          <StatsTable
            data={filteredPlayersPerMinute}
            columns={playerPerMinuteStatsColumns}
            title="Player Per Minute Stats"
          />

          <div className="mb-8">
            <h3 className="mb-2 text-xl font-semibold">Average Points Per Game</h3>
            <div
              className="p-4 bg-white border border-gray-200 rounded-lg"
              style={{ maxHeight: 400, overflowY: 'auto' }}
            >
              {filteredPlayers.length === 0 ? (
                <p className="text-gray-500">No player data available for chart.</p>
              ) : (
                <ResponsiveContainer width="100%" height={filteredPlayers.length * 40}>
                  <BarChart
                    data={filteredPlayers}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 90, bottom: 5 }}
                  >
                    <XAxis type="number" axisLine={true} tickLine={true} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={({ x, y, payload }) => (
                        <text
                          x={x}
                          y={y}
                          dy={4}
                          textAnchor="end"
                          style={{ whiteSpace: 'nowrap', fontSize: 14 }}
                        >
                          {payload.value}
                        </text>
                      )}
                      axisLine={true}
                      tickLine={true}
                    />
                    <Tooltip />
                    <Bar dataKey="pts" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-2 text-xl font-semibold">Field Goal and Three Point Percentages</h3>
            <div
              className="p-4 bg-white border border-gray-200 rounded-lg"
              style={{ maxHeight: 400, overflowY: 'auto' }}
            >
              {filteredPlayers.length === 0 ? (
                <p className="text-gray-500">No player data available for chart.</p>
              ) : (
                <ResponsiveContainer width="100%" height={filteredPlayers.length * 40}>
                  <BarChart
                    data={filteredPlayers}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 90, bottom: 5 }}
                  >
                    <XAxis type="number" axisLine={true} tickLine={true} domain={[0, 100]} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={({ x, y, payload }) => (
                        <text
                          x={x}
                          y={y}
                          dy={4}
                          textAnchor="end"
                          style={{ whiteSpace: 'nowrap', fontSize: 14 }}
                        >
                          {payload.value}
                        </text>
                      )}
                      axisLine={true}
                      tickLine={true}
                    />
                    <Bar dataKey="fg_pct" fill="#3b82f6" name="FG%" />
                    <Bar dataKey="three_pct" fill="#f59e42" name="3P%" />
                    <Tooltip />
                    <Legend verticalAlign="top" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
