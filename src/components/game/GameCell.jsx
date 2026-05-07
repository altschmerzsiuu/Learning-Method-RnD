// src/components/game/GameCell.jsx
import { motion } from 'framer-motion';
import { X, Circle } from 'lucide-react';

export default function GameCell({ index, value, isWinning, onClick }) {
  const isEmpty = value === '';

  let cellClass = 'aspect-square flex items-center justify-center rounded-md border-2 cursor-pointer transition-all';

  if (isWinning) {
    cellClass += ' border-primary-500 bg-primary-50';
  } else if (value === 'X') {
    cellClass += ' border-primary-300 bg-primary-50 cursor-default';
  } else if (value === 'O') {
    cellClass += ' border-accent-border bg-accent-light cursor-default';
  } else {
    cellClass += ' border-border bg-surface-card hover:border-primary-400 hover:bg-surface-green';
  }

  return (
    <motion.div
      className={cellClass}
      onClick={isEmpty ? onClick : undefined}
      whileHover={isEmpty ? { scale: 1.03 } : {}}
      whileTap={isEmpty ? { scale: 0.96 } : {}}
    >
      {value === 'X' && (
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <X
            size={32}
            strokeWidth={2.5}
            className={isWinning ? 'text-primary-600' : 'text-primary-500'}
          />
        </motion.div>
      )}
      {value === 'O' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Circle
            size={28}
            strokeWidth={2.5}
            className={isWinning ? 'text-accent' : 'text-accent opacity-80'}
          />
        </motion.div>
      )}
      {isEmpty && (
        <span className="font-serif text-[13px] text-ink-faint font-bold">{index + 1}</span>
      )}
    </motion.div>
  );
}
