// src/components/ProgressCharts.jsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';

/**
 * Props:
 *  rows: Array<{ date: 'YYYY-MM-DD', weight_kg: number|string|null, body_fat_pct: number|string|null }>
 */
export default function ProgressCharts({ rows = [] }) {
  // Normalize + sort ascending for nicer lines
  const data = [...rows]
    .map(r => ({
      date: r.date,
      weight_kg:
        r.weight_kg === '' || r.weight_kg === null || r.weight_kg === undefined
          ? null
          : Number(r.weight_kg),
      body_fat_pct:
        r.body_fat_pct === '' || r.body_fat_pct === null || r.body_fat_pct === undefined
          ? null
          : Number(r.body_fat_pct),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!data.length) {
    return <div style={{ color: '#9aa0a6' }}>No progress yet—add your first entry below.</div>;
  }

  return (
    <div style={{ height: 320, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="weight_kg"
            name="Weight (kg)"
            dot={false}
            connectNulls
          />
          <Line
            yAxisId="right"
            type="monotone"
            stroke="#ffffff"
            dataKey="body_fat_pct"
            name="BF%"
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
