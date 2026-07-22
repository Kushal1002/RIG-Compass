import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

function normalise(p) {
  return { ...p, id: p.ID };
}

export function useProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.fetchProposals();
      setProposals(data.map(normalise));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addProposal(data) {
    const created = await api.createProposal(data);
    setProposals(prev => [...prev, normalise(created)]);
  }

  async function updateProposal(id, changes) {
    await api.reviewProposal(id, changes);
    setProposals(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));
  }

  return { proposals, addProposal, updateProposal, loading, error };
}
