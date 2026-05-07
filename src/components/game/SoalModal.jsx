// src/components/game/SoalModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import PilihanButton from '../quiz/PilihanButton';
import { useState } from 'react';

export default function SoalModal({ isOpen, soal, onAnswer, onClose }) {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && soal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />

          {/* Sheet */}
          <motion.div
            className="relative w-full max-w-[430px] bg-surface-card rounded-t-xl p-5 pb-8 z-10"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="badge badge-active capitalize">{soal.tingkat}</span>
              {!answered && (
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-surface-muted">
                  <X size={18} strokeWidth={1.5} className="text-ink-muted" />
                </button>
              )}
            </div>

            {/* Context / Soal Cerita if any */}
            {soal.context && (
              <div className="bg-surface-muted border-l-4 border-primary-500 p-4 mb-4 rounded-r-md max-h-[150px] overflow-y-auto">
                <p className="font-sans text-[12px] text-ink leading-[1.6] whitespace-pre-line italic">
                  {soal.context}
                </p>
              </div>
            )}

            {/* Question */}
            <p className="font-serif text-[16px] font-bold text-ink leading-[1.45] mb-4">
              {soal.pertanyaan}
            </p>

            {/* Options */}
            <div className="flex flex-col gap-2">
              {(soal.shuffledOptions || []).map((optionText, idx) => {
                const letter = String.fromCharCode(65 + idx);
                return (
                  <PilihanButton
                    key={letter}
                    pilihan={`${letter}. ${optionText}`}
                    isSelected={selected === letter}
                    isAnswered={answered}
                    isCorrect={optionText === soal.correctText}
                    onClick={() => {
                      if (answered) return;
                      setSelected(letter);
                      setAnswered(true);
                      const isCorrect = optionText === soal.correctText;
                      setTimeout(() => {
                        onAnswer(isCorrect);
                        setSelected(null);
                        setAnswered(false);
                      }, 900);
                    }}
                  />
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
