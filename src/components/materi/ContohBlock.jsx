// src/components/materi/ContohBlock.jsx
import { BookOpen } from 'lucide-react';
import FormattedText from '../ui/FormattedText';

export default function ContohBlock({ judul, teks }) {
  return (
    <div className="bg-surface-muted border border-border rounded-md p-4">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen size={15} strokeWidth={1.5} className="text-accent shrink-0" />
        <span className="font-sans text-[11px] font-bold text-accent uppercase tracking-[0.08em]">
          {judul}
        </span>
      </div>
      <p className="font-sans text-[13px] text-ink leading-[1.75] whitespace-pre-line">
        <FormattedText text={teks} />
      </p>
    </div>
  );
}
