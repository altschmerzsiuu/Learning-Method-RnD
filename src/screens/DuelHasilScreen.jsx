// src/screens/DuelHasilScreen.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Zap, RotateCcw, Home } from 'lucide-react';
import { PageWrapper, Button } from '../components/ui';
import { useStreak } from '../hooks/useStreak';

export default function DuelHasilScreen() {
  const navigate   = useNavigate();
  const { state }  = useLocation();
  const { addXP }  = useStreak();
  const gameResult = state?.gameResult ?? 'kalah';
  const xp         = state?.xp ?? 10;

  useEffect(() => {
    addXP(xp);
    if (gameResult === 'menang') {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.3 }, colors: ['#22C55E', '#FB923C', '#38BDF8'] });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resultConfig = {
    menang: { emoji: null, title: 'Kamu Menang!', msg: 'Kamu berhasil mengalahkan AI. Kemampuan eksposisimu terbukti!' },
    seri:   { emoji: null, title: 'Seri!',        msg: 'Pertandingan imbang. Kamu hampir mengalahkan AI!' },
    kalah:  { emoji: null, title: 'Kamu Kalah',   msg: 'AI lebih kuat kali ini. Pelajari lagi materinya dan tantang AI!' },
  };

  const cfg = resultConfig[gameResult];

  return (
    <PageWrapper>
      <div className="min-h-dvh flex flex-col items-center justify-center px-4 gap-6">

        {/* Result icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${
            gameResult === 'menang' ? 'border-primary-500 bg-primary-50' :
            gameResult === 'seri'   ? 'border-accent bg-accent-light' :
            'border-border bg-surface-muted'
          }`}
        >
          {gameResult === 'menang' && (
            <div className="grid grid-cols-2 gap-1 w-10">
              {[0,1,2,3].map(i => (
                <div key={i} className={`aspect-square rounded-sm ${i%2===0?'bg-primary-500':'bg-primary-300'}`} />
              ))}
            </div>
          )}
          {gameResult === 'seri' && (
            <span className="font-serif text-[28px] font-black text-accent">=</span>
          )}
          {gameResult === 'kalah' && (
            <span className="font-serif text-[28px] font-black text-ink-muted">AI</span>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="font-serif text-[28px] font-black italic text-ink mb-2">{cfg.title}</h1>
          <p className="font-sans text-[13px] text-ink-muted leading-[1.65] max-w-[280px]">{cfg.msg}</p>
        </motion.div>

        {/* XP Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-accent-light border border-accent-border rounded-lg p-4 flex items-center gap-3 w-full"
        >
          <Zap size={24} strokeWidth={1.5} className="text-accent" />
          <div>
            <p className="font-sans text-[11px] text-ink-muted">XP Didapat</p>
            <p className="font-serif text-[24px] font-black text-ink">+{xp} XP</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full flex flex-col gap-2.5"
        >
          <Button fullWidth onClick={() => navigate('/latihan/duel')}>
            <RotateCcw size={16} strokeWidth={1.5} />
            <span>Duel Lagi</span>
          </Button>
          <Button fullWidth variant="ghost" onClick={() => navigate('/belajar')}>
            <Home size={16} strokeWidth={1.5} />
            <span>Kembali ke Beranda</span>
          </Button>
        </motion.div>

      </div>
    </PageWrapper>
  );
}
