import { useState, useEffect } from 'react';
import { engagements as mockData } from '../data/engagements';

const STORAGE_KEY = 'rig_engagements';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
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
