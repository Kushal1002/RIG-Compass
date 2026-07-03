import { useState, useEffect } from 'react';
import { engagements as mockData } from '../data/engagements';

const STORAGE_KEY = 'rig_engagements_v3';
const SEED_VERSION = mockData.map(e => [e.id, e.customerName, e.projectName, e.region, e.industry, e.owner, e.status].join(':')).join('|');
const VERSION_KEY = 'rig_engagements_version_v3';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const version = localStorage.getItem(VERSION_KEY);
    if (raw && version === SEED_VERSION) return JSON.parse(raw);
  } catch {
    // corrupted storage — fall back to mock data
  }
  // clear any stale keys
  Object.keys(localStorage).filter(k => k.startsWith('rig_')).forEach(k => localStorage.removeItem(k));
  return mockData;
}

export function useEngagements() {
  const [engagements, setEngagements] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(engagements));
      localStorage.setItem(VERSION_KEY, SEED_VERSION);
    } catch {
      // storage quota exceeded — continue without persisting
    }
  }, [engagements]);

  function addEngagement(data) {
    const newId = Math.max(0, ...engagements.map(e => e.id)) + 1;
    setEngagements(prev => [...prev, { id: newId, ...data }]);
  }

  function updateEngagement(id, changes) {
    setEngagements(prev =>
      prev.map(e => (e.id === id ? { ...e, ...changes } : e))
    );
  }

  function deleteEngagement(id) {
    setEngagements(prev => prev.filter(e => e.id !== id));
  }

  return { engagements, addEngagement, updateEngagement, deleteEngagement };
}
