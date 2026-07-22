const BASE = `${import.meta.env.VITE_API_BASE ?? ''}/odata/v4/engagement`;

// ── Engagements ───────────────────────────────────────────────────────────────

export async function fetchEngagements() {
  const res = await fetch(`${BASE}/Engagements`);
  if (!res.ok) throw new Error(`Failed to fetch engagements: ${res.status}`);
  return (await res.json()).value;
}

export async function createEngagement(data) {
  const res = await fetch(`${BASE}/Engagements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create engagement: ${res.status}`);
  return res.json();
}

export async function updateEngagement(id, changes) {
  const res = await fetch(`${BASE}/Engagements(${id})`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error(`Failed to update engagement: ${res.status}`);
}

export async function deleteEngagement(id) {
  const res = await fetch(`${BASE}/Engagements(${id})`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete engagement: ${res.status}`);
}

// ── Proposals ─────────────────────────────────────────────────────────────────

export async function fetchProposals() {
  const res = await fetch(`${BASE}/Proposals`);
  if (!res.ok) throw new Error(`Failed to fetch proposals: ${res.status}`);
  return (await res.json()).value;
}

export async function createProposal(data) {
  const res = await fetch(`${BASE}/Proposals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create proposal: ${res.status}`);
  return res.json();
}

export async function reviewProposal(id, changes) {
  const res = await fetch(`${BASE}/Proposals(${id})`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error(`Failed to update proposal: ${res.status}`);
}

// ── MXP ───────────────────────────────────────────────────────────────────────

export async function lookupCustomer(crmAccountId) {
  const digits = crmAccountId.trim().replace(/\D/g, '');
  const id = digits.padStart(10, '0');
  const encoded = encodeURIComponent(id);
  const res = await fetch(`${BASE}/MxpCustomers('${encoded}')`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Customer lookup failed: ${res.status}`);
  return res.json();
}
