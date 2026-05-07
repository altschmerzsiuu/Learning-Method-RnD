// src/components/materi/KontenRenderer.jsx
import { motion } from 'framer-motion';
import HighlightBlock  from './HighlightBlock';
import ContohBlock     from './ContohBlock';
import StrukturVisual  from './StrukturVisual';
import FormattedText   from '../ui/FormattedText';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export default function KontenRenderer({ konten = [] }) {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
    >
      {konten.map((item, idx) => {
        let content = null;

        switch (item.tipe) {
          case 'paragraf':
            content = (
              <p className="font-sans text-[15px] text-ink leading-[1.8] tracking-tight">
                <FormattedText text={item.teks} />
              </p>
            );
            break;
          case 'highlight':
            content = <HighlightBlock teks={item.teks} />;
            break;
          case 'contoh':
            content = <ContohBlock judul={item.judul} teks={item.teks} />;
            break;
          case 'struktur_visual':
            content = <StrukturVisual bagian={item.bagian} />;
            break;
          default:
            content = null;
        }

        if (!content) return null;

        return (
          <motion.div key={idx} variants={itemAnim}>
            {content}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
