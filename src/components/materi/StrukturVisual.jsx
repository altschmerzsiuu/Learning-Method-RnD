// src/components/materi/StrukturVisual.jsx
import { motion } from 'framer-motion';

const COLOR_MAP = {
  green: {
    card:   'struktur-tesis border',
    label:  'label-tesis',
    num:    'bg-primary-100 text-primary-700',
  },
  amber: {
    card:   'struktur-argumentasi border',
    label:  'label-argumentasi',
    num:    'bg-accent-light text-accent',
  },
  blue: {
    card:   'struktur-penegasan border',
    label:  'label-penegasan',
    num:    'bg-info-light text-info',
  },
};

export default function StrukturVisual({ bagian = [] }) {
  return (
    <div className="flex flex-col gap-3">
      {bagian.map((item, idx) => {
        const colors = COLOR_MAP[item.warna] ?? COLOR_MAP.green;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.12, duration: 0.3 }}
            className={`rounded-md p-4 ${colors.card}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${colors.num}`}>
                {idx + 1}
              </span>
              <span className={`font-sans text-[11px] font-bold uppercase tracking-[0.08em] ${colors.label}`}>
                {item.label}
              </span>
              <span className="font-serif text-[13px] font-bold text-ink ml-1">{item.nama}</span>
            </div>
            <p className="font-sans text-[13px] text-ink-muted leading-[1.65] mb-2">{item.deskripsi}</p>
            {item.contoh && (
              <p className="font-sans text-[12px] text-ink italic border-l-2 border-current pl-3 opacity-70">
                {item.contoh}
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
