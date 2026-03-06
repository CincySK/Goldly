import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

type Tokens = { accessToken: string; refreshToken: string };
type Listing = {
  id: string;
  title: string;
  description: string;
  metalType: 'GOLD' | 'SILVER';
  itemType: 'BAR' | 'COIN';
  mint: string;
  weight: number;
  weightUnit: string;
  askingPrice: number;
  currency: string;
  status: string;
  seller?: { name: string; verificationStatus: string };
  photos?: { url: string }[];
};

const API_BASE = (window as any).__GOLDLY_API__ ?? 'http://localhost:4000';

const card: React.CSSProperties = { border: '1px solid #ddd', borderRadius: 8, padding: 12, marginBottom: 12 };
const inputStyle: React.CSSProperties = { padding: 8, marginBottom: 8, width: '100%', maxWidth: 360 };

const App = () => {
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [email, setEmail] = useState('user@goldly.local');
  const [password, setPassword] = useState('User12345!');
  const [name, setName] = useState('Sample User');
  const [message, setMessage] = useState('');

  const [me, setMe] = useState<any>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState('');

  const [title, setTitle] = useState('1 oz Gold Buffalo Coin');
  const [description, setDescription] = useState('Mint condition coin with original packaging and verification.');
  const [mint, setMint] = useState('U.S. Mint');
  const [metalType, setMetalType] = useState<'GOLD' | 'SILVER'>('GOLD');
  const [itemType, setItemType] = useState<'BAR' | 'COIN'>('COIN');
  const [weight, setWeight] = useState('1');
  const [weightUnit, setWeightUnit] = useState('oz');
  const [askingPrice, setAskingPrice] = useState('2400');
  const [currency, setCurrency] = useState('USD');
  const [photo, setPhoto] = useState<File | null>(null);

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${tokens?.accessToken ?? ''}` }), [tokens]);

  const call = async (path: string, options: RequestInit = {}) => {
    const res = await fetch(`${API_BASE}${path}`, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message ?? 'Request failed');
    return data;
  };

  const loadListings = async () => {
    try {
      const qs = search ? `?search=${encodeURIComponent(search)}` : '';
      const data = await call(`/api/listings${qs}`);
      setListings(data);
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  const loadMe = async () => {
    if (!tokens) return;
    try {
      const data = await call('/api/users/me', { headers: { ...authHeaders } });
      setMe(data);
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  useEffect(() => { loadListings(); }, []);
  useEffect(() => { loadMe(); }, [tokens]);

  const signup = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await call('/api/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      setMessage('Signup success. You can now login.');
    } catch (err: any) { setMessage(err.message); }
  };

  const login = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await call('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      setTokens(data);
      setMessage('Logged in successfully.');
    } catch (err: any) { setMessage(err.message); }
  };

  const createListing = async (e: FormEvent) => {
    e.preventDefault();
    if (!tokens) return setMessage('Login required to create listing.');
    if (!photo) return setMessage('Photo is required for listings.');

    try {
      const form = new FormData();
      form.set('title', title);
      form.set('description', description);
      form.set('metalType', metalType);
      form.set('itemType', itemType);
      form.set('mint', mint);
      form.set('weight', weight);
      form.set('weightUnit', weightUnit);
      form.set('askingPrice', askingPrice);
      form.set('currency', currency);
      form.append('photos', photo);

      await call('/api/listings', {
        method: 'POST',
        headers: { ...authHeaders },
        body: form
      });
      setMessage('Listing created and awaiting admin approval.');
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', margin: '0 auto', maxWidth: 980, padding: 16 }}>
      <h1>Goldly Marketplace</h1>
      <p>Working MVP shell: auth + profile + listings browse + create listing.</p>
      {message && <p style={{ background: '#f3f6ff', padding: 8 }}>{message}</p>}

      <section style={card}>
        <h3>Auth</h3>
        <form onSubmit={login}>
          <input style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
          <input style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
          <div><button type="submit">Login</button></div>
        </form>
        <form onSubmit={signup} style={{ marginTop: 8 }}>
          <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="name" />
          <button type="submit">Sign up</button>
        </form>
      </section>

      <section style={card}>
        <h3>My Profile</h3>
        {me ? <pre>{JSON.stringify(me, null, 2)}</pre> : <p>Login to load profile</p>}
      </section>

      <section style={card}>
        <h3>Create Listing (seller)</h3>
        <form onSubmit={createListing}>
          <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" />
          <input style={inputStyle} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="description" />
          <div>
            <select value={metalType} onChange={(e) => setMetalType(e.target.value as any)}><option>GOLD</option><option>SILVER</option></select>
            <select value={itemType} onChange={(e) => setItemType(e.target.value as any)} style={{ marginLeft: 8 }}><option>BAR</option><option>COIN</option></select>
          </div>
          <input style={inputStyle} value={mint} onChange={(e) => setMint(e.target.value)} placeholder="mint" />
          <input style={inputStyle} value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="weight" />
          <input style={inputStyle} value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)} placeholder="weight unit" />
          <input style={inputStyle} value={askingPrice} onChange={(e) => setAskingPrice(e.target.value)} placeholder="asking price" />
          <input style={inputStyle} value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="currency" />
          <div><input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} /></div>
          <button type="submit" style={{ marginTop: 8 }}>Submit Listing</button>
        </form>
      </section>

      <section style={card}>
        <h3>Listings</h3>
        <input style={inputStyle} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="search listings" />
        <div><button onClick={loadListings}>Refresh Listings</button></div>
        <div style={{ marginTop: 12 }}>
          {listings.length === 0 ? <p>No approved listings yet.</p> : listings.map((l) => (
            <article key={l.id} style={{ borderTop: '1px solid #eee', paddingTop: 8, marginTop: 8 }}>
              <strong>{l.title}</strong> — {l.metalType} {l.itemType} — {l.askingPrice} {l.currency}
              <p style={{ margin: '4px 0' }}>{l.description}</p>
              <small>Mint: {l.mint} | Weight: {l.weight} {l.weightUnit} | Seller: {l.seller?.name ?? 'Unknown'}</small>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
