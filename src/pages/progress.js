// src/pages/progress.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';
import ProgressCharts from '../components/ProgressCharts';

const inputStyle = {
  padding: '8px',
  backgroundColor: '#111',
  color: 'white',
  border: '1px solid #444',
  borderRadius: 8,
};
const btnStyle = {
  padding: '10px 14px',
  backgroundColor: '#00cfff',
  color: 'white',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
};

export default function ProgressPage() {
  const [session, setSession] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  // form
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState(today);
  const [weightKg, setWeightKg] = useState('');
  const [bfPct, setBfPct] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data?.session ?? null);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  async function fetchRows() {
    setError('');
    setMsg('');
    const uid = session.user.id;
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', uid)
      .order('date', { ascending: false });

    if (error) setError(error.message);
    setRows(data ?? []);
  }

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    setMsg('');
    if (!session?.user?.id) return;

    // simple validation
    if (!date) return setError('Please choose a date.');
    const w = weightKg !== '' ? Number(weightKg) : null;
    const b = bfPct !== '' ? Number(bfPct) : null;
    if (w === null && b === null) return setError('Enter weight and/or BF%.');

    setSaving(true);

    // optimistic insert (unique per date)
    const tempId = `tmp-${Math.random().toString(36).slice(2)}`;
    const optimisticRow = {
      id: tempId,
      user_id: session.user.id,
      date,
      weight_kg: w,
      body_fat_pct: b,
      created_at: new Date().toISOString(),
    };
    // if an entry for this date exists, optimistically replace it
    const exists = rows.find(r => r.date === date);
    if (exists) {
      setRows(prev => [optimisticRow, ...prev.filter(r => r.date !== date)]);
    } else {
      setRows(prev => [optimisticRow, ...prev]);
    }

    const { data, error } = await supabase
      .from('progress')
      .upsert(
        {
          user_id: session.user.id,
          date,
          weight_kg: w,
          body_fat_pct: b,
        },
        { onConflict: ['user_id', 'date'] }
      )
      .select('*')
      .single();

    if (error) {
      setError(error.message);
      // rollback optimistic
      await fetchRows();
    } else {
      // replace temp with real
      setRows(prev => [data, ...prev.filter(r => r.id !== tempId && r.date !== data.date)]);
      setMsg('✅ Progress saved.');
      setWeightKg('');
      setBfPct('');
    }
    setSaving(false);
  }

  async function handleDelete(id) {
    setError('');
    setMsg('');
    setDeletingId(id);

    const prev = rows;
    setRows(rows.filter(r => r.id !== id));

    const { error } = await supabase.from('progress').delete().eq('id', id);
    if (error) {
      setError(error.message);
      setRows(prev); // rollback
    } else {
      setMsg('🗑️ Deleted.');
    }
    setDeletingId(null);
  }

  if (!session) {
    return (
      <div style={{ padding: 24, color: 'white' }}>
        <h2>Progress</h2>
        <p style={{ color: '#9aa0a6' }}>Please log in to view and track your progress.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, color: 'white' }}>
      <h2 style={{ marginTop: 0 }}>Progress</h2>

      {/* Alerts */}
      {error && <div style={{ marginBottom: 12, color: '#ff8d8d' }}>❌ {error}</div>}
      {msg && <div style={{ marginBottom: 12, color: '#00ff99' }}>{msg}</div>}

      {/* Chart */}
      <div style={{ marginBottom: 16, padding: 16, border: '1px solid #333', borderRadius: 12, background: '#1a1a1a' }}>
        <ProgressCharts rows={rows} />
      </div>

      {/* Add Entry */}
      <div style={{ marginBottom: 16, padding: 16, border: '1px solid #333', borderRadius: 12, background: '#1a1a1a' }}>
        <h3 style={{ marginTop: 0, color: '#00cfff' }}>Add Entry</h3>
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, color: '#9aa0a6' }}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, color: '#9aa0a6' }}>Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={weightKg}
              onChange={e => setWeightKg(e.target.value)}
              placeholder="e.g. 72.4"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, color: '#9aa0a6' }}>Body Fat %</label>
            <input
              type="number"
              step="0.1"
              value={bfPct}
              onChange={e => setBfPct(e.target.value)}
              placeholder="e.g. 16.8"
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <button type="submit" disabled={saving} style={btnStyle}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
        <p style={{ marginTop: 8, color: '#9aa0a6', fontSize: 13 }}>
          Tip: you can fill just weight, just BF%, or both. Entries are unique per date—new saves will overwrite that day.
        </p>
      </div>

      {/* Table */}
      <div style={{ border: '1px solid #333', borderRadius: 12, background: '#1a1a1a' }}>
        <div style={{ padding: 16, borderBottom: '1px solid #333' }}>
          <strong>History</strong>
        </div>
        {rows.length === 0 ? (
          <div style={{ padding: 16, color: '#9aa0a6' }}>No entries yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#181818', color: '#9aa0a6' }}>
                  <th style={th}>Date</th>
                  <th style={th}>Weight (kg)</th>
                  <th style={th}>Body Fat %</th>
                  <th style={th}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} style={{ borderTop: '1px solid #292929' }}>
                    <td style={td}>{r.date}</td>
                    <td style={td}>{r.weight_kg ?? '—'}</td>
                    <td style={td}>{r.body_fat_pct ?? '—'}</td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                        style={{
                          border: '1px solid #444',
                          background: '#2b2b2b',
                          color: '#ff8d8d',
                          padding: '6px 10px',
                          borderRadius: 8,
                          cursor: deletingId === r.id ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {deletingId === r.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const th = { textAlign: 'left', padding: '10px 12px', fontWeight: 600 };
const td = { padding: '10px 12px', color: '#ddd' };
