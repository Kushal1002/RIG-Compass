import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

function normalise(e) {
  return { ...e, id: e.ID };
}

export function useEngagements() {
  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.fetchEngagements();
      setEngagements(data.map(normalise));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function addEngagement(data) {
    const created = await api.createEngagement(data);
    setEngagements(prev => [...prev, normalise(created)]);
  }

  async function updateEngagement(id, changes) {
    await api.updateEngagement(id, changes);
    setEngagements(prev => prev.map(e => e.id === id ? { ...e, ...changes } : e));
  }

  async function deleteEngagement(id) {
    await api.deleteEngagement(id);
    setEngagements(prev => prev.filter(e => e.id !== id));
  }

  return { engagements, addEngagement, updateEngagement, deleteEngagement, loading, error };
}
