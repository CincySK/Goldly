import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => (
  <main style={{ fontFamily: 'sans-serif', padding: 16 }}>
    <h1>Goldly Marketplace</h1>
    <p>Browse approved gold/silver bullion and coin listings. Payments and shipping handled outside app.</p>
  </main>
);

createRoot(document.getElementById('root')!).render(<App />);
