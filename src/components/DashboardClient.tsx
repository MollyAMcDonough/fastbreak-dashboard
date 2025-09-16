'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

export default function DashboardClient() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login?returnTo=/dashboard');
    }
  }, [isLoading, user, router]);

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

  const filteredPlayers = players.filter((p) => p.name && p.name.toLowerCase() !== 'total');

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Dashboard</h2>
      <p className="mb-6">Welcome to the dashboard! Only authenticated users can see this.</p>

      {loading && <p>Loading player data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <div className="mb-8">
            <h3 className="mb-2 text-xl font-semibold">Players Table</h3>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                      Position
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                      Points
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                      Assists
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                      Rebounds
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                      Field Goal %
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                      Three Point %
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-500 uppercase">
                      Minutes Per Game
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPlayers.map((player) => (
                    <tr key={player.id}>
                      <td className="px-4 py-2 text-gray-900 whitespace-nowrap">
                        {player.name ?? 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-gray-900 whitespace-nowrap">
                        {player.position ?? 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-gray-900 whitespace-nowrap">
                        {player.pts ?? 0}
                      </td>
                      <td className="px-4 py-2 text-gray-900 whitespace-nowrap">
                        {player.ast ?? 0}
                      </td>
                      <td className="px-4 py-2 text-gray-900 whitespace-nowrap">
                        {player.reb ?? 0}
                      </td>
                      <td className="px-4 py-2 text-gray-900 whitespace-nowrap">
                        {player.fg_pct ?? 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-gray-900 whitespace-nowrap">
                        {player.three_pct ?? 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-gray-900 whitespace-nowrap">
                        {player.mpg ?? 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-2 text-xl font-semibold">Points by Player (Bar Chart)</h3>
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              {filteredPlayers.length === 0 ? (
                <p className="text-gray-500">No player data available for chart.</p>
              ) : (
                <ResponsiveContainer width="100%" height={filteredPlayers.length * 40}>
                  <BarChart
                    data={filteredPlayers}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 90, bottom: 5 }}
                  >
                    <XAxis type="number" />
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
                    />
                    <Tooltip />
                    <Bar dataKey="pts" fill="#3b82f6" />
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
