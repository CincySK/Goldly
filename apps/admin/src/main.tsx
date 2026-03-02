import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => (
  <main style={{ fontFamily: 'sans-serif', padding: 16 }}>
    <h1>Goldly Admin Dashboard</h1>
    <ul>
      <li>KYC approvals</li><li>Listing approvals</li><li>Reports moderation</li><li>User suspension</li><li>Audit logs</li>
    </ul>
  </main>
);

createRoot(document.getElementById('root')!).render(<App />);
