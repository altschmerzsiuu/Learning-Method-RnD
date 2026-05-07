// src/screens/DuelSetupScreen.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap } from 'lucide-react';
import { PageWrapper, Button } from '../components/ui';

export default function DuelSetupScreen() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <header className="sticky top-0 z-50 bg-surface-card border-b border-border h-[52px] flex items-center px-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-surface-muted">
          <ArrowLeft size={20} strokeWidth={1.5} className="text-ink" />
        </button>
        <h1 className="flex-1 text-center font-serif font-bold text-[17px] text-ink">Duel Eksposisi</h1>
        <div className="w-9" />
      </header>

      <div className="px-4 pt-8 pb-10 flex flex-col items-center gap-6">

        {/* Board preview */}
        <div className="grid grid-cols-3 gap-2 w-40">
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className={`aspect-square rounded-md border-2 flex items-center justify-center ${
              [0,4,8].includes(i) ? 'border-primary-300 bg-primary-50' :
              [2,6].includes(i)   ? 'border-accent-border bg-accent-light' :
              'border-border bg-surface-muted'
            }`}>
              {[0,4,8].includes(i) && <span className="font-serif font-black text-primary-500 text-[13px]">X</span>}
              {[2,6].includes(i)   && <span className="font-serif font-black text-accent text-[13px]">O</span>}
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="font-serif text-[22px] font-black italic text-ink mb-2">Pilih Tingkat</h2>
          <p className="font-sans text-[13px] text-ink-muted leading-[1.65]">
            Kamu vs AI. Jawab soal untuk menguasai kotak. Buat tiga baris untuk menang!
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/latihan/duel/main', { state: { difficulty: 'mudah' } })}
            className="w-full border-2 border-primary-200 bg-primary-50 rounded-lg p-5 text-left active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-done">Mudah</span>
            </div>
            <p className="font-sans text-[14px] font-bold text-ink">AI Santai</p>
            <p className="font-sans text-[12px] text-ink-muted">Soal mudah-sedang. AI bergerak acak.</p>
            <div className="flex items-center gap-1 mt-2">
              <Zap size={12} className="text-accent" />
              <span className="font-sans text-[11px] text-accent font-bold">+100 XP jika menang</span>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/latihan/duel/main', { state: { difficulty: 'susah' } })}
            className="w-full border-2 border-accent-border bg-accent-light rounded-lg p-5 text-left active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="badge badge-streak">Susah</span>
            </div>
            <p className="font-sans text-[14px] font-bold text-ink">AI Minimax</p>
            <p className="font-sans text-[12px] text-ink-muted">Soal sedang-susah. AI bermain optimal.</p>
            <div className="flex items-center gap-1 mt-2">
              <Zap size={12} className="text-accent" />
              <span className="font-sans text-[11px] text-accent font-bold">+100 XP jika menang</span>
            </div>
          </motion.button>
        </div>
      </div>
    </PageWrapper>
  );
}
