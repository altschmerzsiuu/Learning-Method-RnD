// src/hooks/useProgress.js
import { useState, useEffect, useCallback } from 'react';
import materiData from '../data/materi.json';

const STORAGE_KEY = 'eksposilab_progress';

function getInitialProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}

  // Default: first topic active, rest locked
  return materiData.reduce((acc, topik, idx) => {
    acc[topik.id] = {
      status: idx === 0 ? 'active' : 'locked',
      xp_earned: 0,
      completed_at: null,
    };
    return acc;
  }, {});
}

export function useProgress() {
  const [progress, setProgress] = useState(getInitialProgress);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const getTopikStatus = useCallback(
    (topikId) => progress[topikId]?.status ?? 'locked',
    [progress]
  );

  const completeTopik = useCallback((topikId, xpEarned = 0) => {
    setProgress(prev => {
      const updated = { ...prev };
      updated[topikId] = {
        ...updated[topikId],
        status: 'done',
        xp_earned: (updated[topikId]?.xp_earned ?? 0) + xpEarned,
        completed_at: new Date().toISOString(),
      };

      // Unlock next topic
      const sortedTopics = [...materiData].sort((a, b) => a.urutan - b.urutan);
      const currentIdx   = sortedTopics.findIndex(t => t.id === topikId);
      const nextTopik    = sortedTopics[currentIdx + 1];
      if (nextTopik && updated[nextTopik.id]?.status === 'locked') {
        updated[nextTopik.id] = { ...updated[nextTopik.id], status: 'active' };
      }

      return updated;
    });
  }, []);

  const getTotalXP = useCallback(() => {
    return Object.values(progress).reduce((sum, p) => sum + (p.xp_earned || 0), 0);
  }, [progress]);

  const getCompletedCount = useCallback(() => {
    return Object.values(progress).filter(p => p.status === 'done').length;
  }, [progress]);

  return {
    progress,
    getTopikStatus,
    completeTopik,
    getTotalXP,
    getCompletedCount,
  };
}
