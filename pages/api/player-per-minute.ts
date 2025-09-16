// pages/api/player-per-minute.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';
import { auth0 } from '../../lib/auth0';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check authentication
  const session = await auth0.getSession(req);
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Fetch player stats from Supabase
  const { data, error } = await supabase
    .from('players')
    .select('name, position, pts, ast, reb, tpg, fpg, mpg');

  if (error || !data) {
    return res.status(500).json({ error: error?.message || 'Failed to fetch player data' });
  }

  // Transform stats to per-minute metrics
  const transformed = data.map((player) => {
    const { name, position, pts, ast, reb, tpg, fpg, mpg } = player;
    // Avoid division by zero
    const safeMinutes = mpg > 0 ? mpg : 1;
    return {
      name,
      position,
      mpg,
      ppm: +(pts / safeMinutes).toFixed(2),
      apm: +(ast / safeMinutes).toFixed(2),
      rpm: +(reb / safeMinutes).toFixed(2),
      tpm: +(tpg / safeMinutes).toFixed(2),
      fpm: +(fpg / safeMinutes).toFixed(2),
    };
  });

  res.status(200).json(transformed);
}
