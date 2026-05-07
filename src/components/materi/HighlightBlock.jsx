// src/components/materi/HighlightBlock.jsx
import { Lightbulb } from 'lucide-react';
import FormattedText from '../ui/FormattedText';

export default function HighlightBlock({ teks }) {
  return (
    <div className="bg-primary-50 border border-primary-200 rounded-md p-4 flex gap-3">
      <Lightbulb size={18} strokeWidth={1.5} className="text-primary-600 shrink-0 mt-0.5" />
      <p className="font-sans text-[13px] text-primary-700 leading-[1.7] font-medium">
        <FormattedText text={teks} />
      </p>
    </div>
  );
}
