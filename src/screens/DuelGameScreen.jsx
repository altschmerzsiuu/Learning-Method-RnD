// src/screens/DuelGameScreen.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { X as XIcon, Circle, ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageWrapper, Button } from '../components/ui';
import GameBoard  from '../components/game/GameBoard';
import SoalModal  from '../components/game/SoalModal';
import AiThinking from '../components/game/AiThinking';
import { useDuel } from '../hooks/useDuel';
import { calculateDuelXP } from '../lib/gameUtils';

export default function DuelGameScreen() {
  const location   = useNavigate();
  const navigate   = useNavigate();
  const { state }  = useLocation();
  const difficulty = state?.difficulty ?? 'mudah';

  const {
    board, currentPlayer, winner, winLine, gameResult,
    showModal, currentQuestion, isAiThinking,
    handleCellClick, handleAnswer, setShowModal, resetGame,
  } = useDuel(difficulty);

  return (
    <PageWrapper>
      <header className="sticky top-0 z-50 bg-surface-card border-b border-border h-[52px] flex items-center px-4 gap-3">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-surface-muted">
          <ArrowLeft size={20} strokeWidth={1.5} className="text-ink" />
        </button>
        <span className="flex-1 text-center font-serif font-bold text-[17px] text-ink">Duel Eksposisi</span>
        <span className="badge badge-active w-9 justify-center capitalize">{difficulty}</span>
      </header>

      <div className="px-4 pt-6 pb-10 flex flex-col items-center gap-5">

        {/* Scoreboard */}
        <div className="w-full flex items-center justify-between">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all ${
            currentPlayer === 'X' && !winner ? 'border-primary-300 bg-primary-50' : 'border-border bg-surface-muted'
          }`}>
            <XIcon size={16} strokeWidth={2.5} className="text-primary-500" />
            <span className="font-sans text-[12px] font-bold text-ink">Kamu</span>
          </div>

          <div className="text-center">
            <p className="font-sans text-[10px] text-ink-muted uppercase tracking-[0.08em]">
              {winner ? 'Selesai' : isAiThinking ? 'AI berpikir...' : currentPlayer === 'X' ? 'Giliranmu' : 'Giliran AI'}
            </p>
          </div>

          <div className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all ${
            currentPlayer === 'O' && !winner ? 'border-accent-border bg-accent-light' : 'border-border bg-surface-muted'
          }`}>
            <span className="font-sans text-[12px] font-bold text-ink">AI</span>
            <Circle size={14} strokeWidth={2.5} className="text-accent" />
          </div>
        </div>

        {/* Board */}
        <GameBoard
          board={board}
          winLine={winLine}
          onCellClick={handleCellClick}
          disabled={!!winner || isAiThinking}
        />

        <AiThinking isVisible={isAiThinking} />

        {/* Prompter */}
        {!winner && !isAiThinking && (
          <p className="font-sans text-[12px] text-ink-muted text-center px-4">
            {currentPlayer === 'X'
              ? 'Klik kotak kosong untuk menjawab soal dan menguasai kotak tersebut.'
              : 'Tunggu AI membuat langkah...'}
          </p>
        )}
      </div>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {winner && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
            <motion.div
              className="relative bg-surface-card rounded-xl p-6 w-full max-w-[340px] text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 250 }}
            >
              <p className="font-serif text-[28px] font-black italic text-ink mb-2">
                {gameResult === 'menang' ? 'Kamu Menang!' : gameResult === 'seri' ? 'Seri!' : 'AI Menang'}
              </p>
              <p className="font-sans text-[13px] text-ink-muted mb-5">
                {gameResult === 'menang' ? 'Luar biasa! Kamu berhasil mengalahkan AI.' :
                 gameResult === 'seri'   ? 'Pertandingan imbang. Coba lagi!' :
                 'AI mengalahkanmu kali ini. Jangan menyerah!'}
              </p>
              <div className="flex flex-col gap-2.5">
                <Button
                  fullWidth
                  onClick={() => navigate('/latihan/duel/hasil', { state: { gameResult, xp: calculateDuelXP(gameResult) } })}
                >
                  Lihat Hasil
                </Button>
                <Button fullWidth variant="ghost" onClick={resetGame}>Mainkan Lagi</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Soal Modal */}
      <SoalModal
        isOpen={showModal}
        soal={currentQuestion}
        onAnswer={handleAnswer}
        onClose={() => setShowModal(false)}
      />
    </PageWrapper>
  );
}
