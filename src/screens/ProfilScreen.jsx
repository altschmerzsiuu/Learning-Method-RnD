// src/screens/ProfilScreen.jsx
import { Flame, Zap, Target, BookOpen, Star } from 'lucide-react';
import { PageWrapper, TopBar, BottomNav } from '../components/ui';
import { useStreak }   from '../hooks/useStreak';
import { useProgress } from '../hooks/useProgress';

export default function ProfilScreen() {
  const { streak, totalXP, level, levelLabel, weekDots } = useStreak();
  const { getCompletedCount } = useProgress();

  const stats = [
    { icon: Zap,     label: 'Total XP',       value: totalXP,              color: 'text-accent' },
    { icon: Flame,   label: 'Streak',          value: `${streak} hari`,     color: 'text-orange-500' },
    { icon: BookOpen,label: 'Topik Selesai',   value: getCompletedCount(),  color: 'text-primary-500' },
    { icon: Star,    label: 'Level',           value: `${level} - ${levelLabel}`, color: 'text-yellow-500' },
  ];

  return (
    <PageWrapper>
      <TopBar title="Profil" />

      <div className="px-4 pb-28 pt-5 flex flex-col gap-5">

        {/* Avatar section */}
        <div className="flex flex-col items-center py-8 bg-primary-500 border border-primary-600 rounded-lg batik-overlay text-white">
          <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center mb-3 backdrop-blur-md">
            <img src="/explay-logo.png" alt="EksposiLab" className="w-14 h-14 object-contain brightness-0 invert" onError={(e) => { e.target.style.display='none'; }} />
          </div>
          <h2 className="font-serif text-[22px] font-black italic tracking-tight">Pelajar EksposiLab</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-sans text-[12px] font-bold text-white/80">Level {level} · {levelLabel}</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {stats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-surface-card border border-border rounded-md p-4">
              <Icon size={18} strokeWidth={1.5} className={`${color} mb-2`} />
              <p className="font-serif text-[22px] font-black text-ink leading-none">{value}</p>
              <p className="font-sans text-[11px] text-ink-muted mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Streak calendar */}
        <div className="bg-surface-card border border-border rounded-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame size={16} strokeWidth={1.5} className="text-accent" />
            <h3 className="font-sans text-[13px] font-bold text-ink">Aktivitas 7 Hari Terakhir</h3>
          </div>
          <div className="flex gap-2">
            {weekDots.map((dot, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className={`w-full h-8 rounded-md ${dot.isActive ? 'bg-primary-500' : 'bg-surface-muted border border-border'}`} />
                <span className="font-sans text-[9px] text-ink-faint">
                  {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* About app */}
        <div className="bg-surface-card border border-border rounded-md p-4 flex items-center gap-3">
          <img src="/fkip-logo.jpeg" alt="FKIP" className="w-10 h-10 object-contain rounded" onError={(e) => { e.target.style.display='none'; }} />
          <div>
            <p className="font-sans text-[12px] font-bold text-ink">EksposiLab v1.0</p>
            <p className="font-sans text-[11px] text-ink-muted">Media Pembelajaran Teks Eksposisi SMP · Skripsi FKIP</p>
          </div>
        </div>

      </div>

      <BottomNav />
    </PageWrapper>
  );
}
