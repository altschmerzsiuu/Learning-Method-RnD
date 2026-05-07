// src/hooks/useStreak.js
import { useState, useEffect, useCallback } from 'react';

const STREAK_KEY  = 'eksposilab_streak';
const XP_KEY      = 'eksposilab_total_xp';

function loadStreak() {
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY)) ?? { count: 0, lastActive: null };
  } catch { return { count: 0, lastActive: null }; }
}

function loadTotalXP() {
  return parseInt(localStorage.getItem(XP_KEY) ?? '0', 10);
}

function getLevel(xp) {
  if (xp <= 100)  return { level: 1, label: 'Pemula',      nextXP: 100  };
  if (xp <= 250)  return { level: 2, label: 'Pelajar',     nextXP: 250  };
  if (xp <= 500)  return { level: 3, label: 'Pengamat',    nextXP: 500  };
  if (xp <= 800)  return { level: 4, label: 'Analis',      nextXP: 800  };
  return          { level: 5, label: 'Ekspositor',  nextXP: Infinity };
}

function isToday(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr).toDateString() === new Date().toDateString();
}

function isYesterday(dateStr) {
  if (!dateStr) return false;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return new Date(dateStr).toDateString() === yesterday.toDateString();
}

export function useStreak() {
  const [streak, setStreak]   = useState(loadStreak);
  const [totalXP, setTotalXP] = useState(loadTotalXP);

  // Check and update streak on mount
  useEffect(() => {
    setStreak(prev => {
      if (isToday(prev.lastActive)) return prev; // already counted today

      const updated = {
        count:      isYesterday(prev.lastActive) ? prev.count + 1 : 1,
        lastActive: new Date().toISOString(),
      };
      localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addXP = useCallback((amount) => {
    setTotalXP(prev => {
      const next = prev + amount;
      localStorage.setItem(XP_KEY, String(next));
      return next;
    });
  }, []);

  const { level, label: levelLabel, nextXP } = getLevel(totalXP);

  // Build last 7 days active state
  const weekDots = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    // simplified: today and yesterday are active if streak >= 2
    const isActive = i === 6 || (i === 5 && streak.count >= 2);
    return { date: d, isActive };
  });

  return {
    streak:     streak.count,
    lastActive: streak.lastActive,
    totalXP,
    addXP,
    level,
    levelLabel,
    nextXP,
    weekDots,
  };
}
