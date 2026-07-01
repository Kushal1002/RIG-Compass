import { useState, useEffect } from 'react';
import { engagements as mockData } from '../data/engagements';

const STORAGE_KEY = 'rig_engagements';
const SEED_VERSION = mockData.map(e => [e.id, e.customerName, e.projectName, e.region, e.industry].join(':')).join('|');
const VERSION_KEY = 'rig_engagements_version';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const version = localStorage.getItem(VERSION_KEY);
    if (raw && version === SEED_VERSION) return JSON.parse(raw);
  } catch {
    // corrupted storage — fall back to mock data
  }
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

  function updateEngagement(id, changes) {
    setEngagements(prev =>
      prev.map(e => (e.id === id ? { ...e, ...changes } : e))
    );
  }

  return { engagements, updateEngagement };
}
