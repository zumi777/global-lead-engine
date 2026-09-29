'use client';

import { FormEvent, useState } from 'react';

type Lead = { name: string; domain: string; description?: string; location?: string; source: string };

export default function Home() {
  const [query, setQuery] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function search(e: FormEvent) {
    e.preventDefault(); setLoading(true); setError(''); setLeads([]);
    try {
      const r = await fetch('/api/leads/search', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({query}) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Search failed');
      setLeads(data.leads || []);
    } catch (e) { setError(e instanceof Error ? e.message : 'Search failed'); }
    finally { setLoading(false); }
  }

  return <main>
    <header><div><b>GLOBAL LEAD ENGINE</b><span> B2B Intelligence</span></div><div className="live">● LIVE ENGINE</div></header>
    <section className="hero">
      <p className="eyebrow">WORLDWIDE BUSINESS DISCOVERY</p>
      <h1>Find real companies.<br/>Build better leads.</h1>
      <p className="sub">Search the live web for businesses by market, industry, product, or location. No hard-coded demo leads.</p>
      <form onSubmit={search}><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="e.g. textile importers in UAE" required/><button disabled={loading}>{loading ? 'Searching…' : 'Find companies →'}</button></form>
      <div className="examples">Try: construction companies Saudi Arabia · food importers Germany · logistics companies Singapore</div>
    </section>
    <section className="results">
      {error && <div className="error">{error}</div>}
      {leads.length > 0 && <><div className="resultHead"><h2>Live results</h2><span>{leads.length} companies discovered</span></div><div className="grid">{leads.map((x,i)=><article key={x.domain+i}><div className="score">{String(i+1).padStart(2,'0')}</div><h3>{x.name}</h3><a href={'https://'+x.domain} target="_blank">{x.domain}</a><p>{x.description || 'Business discovered from live company data.'}</p><footer><span>{x.location || 'Global'}</span><span>Source: {x.source}</span></footer></article>)}</div></>}
      {!loading && !leads.length && !error && <div className="empty"><b>Real-data pipeline ready</b><p>Run a search above. The engine calls a live business-data source instead of returning sample records.</p></div>}
    </section>
  </main>
}
