import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#191b24] border border-[var(--accent)]/40 text-white shadow-[0_4px_25px_var(--accent-glow)] backdrop-blur-xl">
        <CheckCircle2 className="w-4 h-4 text-[var(--accent)] flex-shrink-0" />
        <span className="text-[13px] font-semibold">{message}</span>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-[#e0c0af]/60 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
