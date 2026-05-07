// src/components/game/AiThinking.jsx
import { motion } from 'framer-motion';

export default function AiThinking({ isVisible }) {
  if (!isVisible) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center gap-1.5 py-2"
    >
      <span className="font-sans text-[12px] text-ink-muted">AI sedang berpikir</span>
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-accent"
          animate={{ scale: [1, 1.6, 1] }}
          transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
        />
      ))}
    </motion.div>
  );
}
