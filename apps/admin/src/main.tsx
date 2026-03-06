import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

const API_BASE = (window as any).__GOLDLY_API__ ?? 'http://localhost:4000';

const App = () => {
  const [email, setEmail] = useState('admin@goldly.local');
  const [password, setPassword] = useState('Admin1234!');
  const [token, setToken] = useState<string>('');
  const [message, setMessage] = useState('');

  const [pendingKyc, setPendingKyc] = useState<any[]>([]);
  const [pendingListings, setPendingListings] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const call = async (path: string, options: RequestInit = {}) => {
    const res = await fetch(`${API_BASE}${path}`, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message ?? 'Request failed');
    return data;
  };

  const loadAll = async () => {
    if (!token) return;
    try {
      const [kyc, listings, r] = await Promise.all([
        call('/api/admin/kyc/pending', { headers }),
        call('/api/admin/listings/pending', { headers }),
        call('/api/admin/reports', { headers })
      ]);
      setPendingKyc(kyc);
      setPendingListings(listings);
      setReports(r);
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  useEffect(() => { loadAll(); }, [token]);

  const login = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await call('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      setToken(data.accessToken);
      setMessage('Admin logged in.');
    } catch (err: any) { setMessage(err.message); }
  };

  const reviewKyc = async (id: string, approve: boolean) => {
    await call(`/api/admin/kyc/${id}/review`, {
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ approve, reason: approve ? undefined : 'Rejected by admin' })
    });
    await loadAll();
  };

  const reviewListing = async (id: string, approve: boolean) => {
    await call(`/api/admin/listings/${id}/review`, {
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ approve, reason: approve ? undefined : 'Rejected by admin' })
    });
    await loadAll();
  };

  return (
    <main style={{ fontFamily: 'Arial', margin: '0 auto', maxWidth: 1000, padding: 16 }}>
      <h1>Goldly Admin Dashboard</h1>
      {message && <p style={{ background: '#eef4ff', padding: 8 }}>{message}</p>}

      <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <h3>Admin Login</h3>
        <form onSubmit={login}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginRight: 8 }} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginRight: 8 }} />
          <button type="submit">Login</button>
          <button type="button" onClick={loadAll} style={{ marginLeft: 8 }}>Refresh</button>
        </form>
      </section>

      <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <h3>Pending KYC</h3>
        {pendingKyc.length === 0 ? <p>No pending KYC submissions.</p> : pendingKyc.map((k) => (
          <div key={k.id} style={{ borderTop: '1px solid #eee', paddingTop: 8, marginTop: 8 }}>
            <strong>{k.userId}</strong> — status {k.status}
            <div>
              <button onClick={() => reviewKyc(k.id, true)}>Approve</button>
              <button onClick={() => reviewKyc(k.id, false)} style={{ marginLeft: 8 }}>Reject</button>
            </div>
          </div>
        ))}
      </section>

      <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <h3>Pending Listings</h3>
        {pendingListings.length === 0 ? <p>No pending listings.</p> : pendingListings.map((l) => (
          <div key={l.id} style={{ borderTop: '1px solid #eee', paddingTop: 8, marginTop: 8 }}>
            <strong>{l.title}</strong> ({l.metalType}/{l.itemType}) — {l.askingPrice} {l.currency}
            <div>
              <button onClick={() => reviewListing(l.id, true)}>Approve</button>
              <button onClick={() => reviewListing(l.id, false)} style={{ marginLeft: 8 }}>Reject</button>
            </div>
          </div>
        ))}
      </section>

      <section style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
        <h3>Reports</h3>
        {reports.length === 0 ? <p>No reports.</p> : <pre>{JSON.stringify(reports, null, 2)}</pre>}
      </section>
    </main>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
