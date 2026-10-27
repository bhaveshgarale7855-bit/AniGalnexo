import React, { useState } from 'react';
import { X, Crown, Check, Sparkles, Zap, Shield, Heart } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (plan: string) => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  onSubscribe,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#191b24] border border-[var(--accent-border)] rounded-3xl shadow-[0_0_40px_var(--accent-glow)] p-6 sm:p-10 space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/15 text-[#e0c0af] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent)] text-black flex items-center justify-center mx-auto shadow-[0_0_20px_var(--accent-glow)]">
            <Crown className="w-8 h-8" />
          </div>
          <h2 className="font-headline text-3xl font-black text-white tracking-tight">
            AniGalnexo VIP Pass
          </h2>
          <p className="text-[14px] text-[#e0c0af]/80">
            Enjoy ad-free 4K HDR streams, same-day Japanese simulcasts, multi-track Indian dubs, and
            support indie animators directly.
          </p>
        </div>

        {/* Plan Switcher */}
        <div className="flex items-center justify-center p-1 bg-[#11131c] rounded-2xl border border-white/10 max-w-xs mx-auto">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`flex-1 py-2 rounded-xl text-[13px] font-bold transition-all ${
              selectedPlan === 'monthly'
                ? 'bg-white/15 text-white shadow-md'
                : 'text-[#e0c0af]/70 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedPlan('annual')}
            className={`flex-1 py-2 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all ${
              selectedPlan === 'annual'
                ? 'bg-[var(--accent)] text-white shadow-[0_0_15px_var(--accent)]'
                : 'text-[#e0c0af]/70 hover:text-white'
            }`}
          >
            <span>Annual</span>
            <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-black/40 text-amber-200">
              Save 40%
            </span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* VIP Pass */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-4 ${
              selectedPlan === 'monthly'
                ? 'bg-[var(--accent)]/10 border-[var(--accent)] shadow-[0_0_20px_var(--accent-glow)]'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div>
              <span className="text-[11px] font-bold uppercase text-[var(--accent)] tracking-wider">
                Monthly Pass
              </span>
              <h3 className="font-headline text-2xl font-black text-white mt-1">
                ₹199 <span className="text-[13px] font-normal text-[#e0c0af]/60">/ month</span>
              </h3>
            </div>
            <ul className="space-y-2 text-[13px] text-[#e0c0af]/90">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>100% Ad-Free 1080p FHD</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>All Indian Dubs & Subs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>2 Concurrent Screens</span>
              </li>
            </ul>
          </div>

          {/* VIP Annual Pass (Best Value) */}
          <div
            onClick={() => setSelectedPlan('annual')}
            className={`p-6 rounded-2xl border transition-all cursor-pointer space-y-4 relative overflow-hidden ${
              selectedPlan === 'annual'
                ? 'bg-[var(--accent)]/15 border-[var(--accent)] shadow-[0_0_25px_var(--accent-glow)]'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="absolute top-0 right-0 bg-[var(--accent)] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl shadow-md">
              Most Popular
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-[var(--accent)] tracking-wider">
                Annual Ultimate
              </span>
              <h3 className="font-headline text-2xl font-black text-white mt-1">
                ₹1,499 <span className="text-[13px] font-normal text-[#e0c0af]/60">/ year</span>
              </h3>
              <span className="text-[11px] text-emerald-400 font-bold">Only ₹125/month</span>
            </div>
            <ul className="space-y-2 text-[13px] text-[#e0c0af]/90">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>4K Ultra HD + Dolby Atmos 5.1</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Early Simulcast Access (1 hr ahead)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Unlimited Offline Downloads</span>
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Direct Creator Tip Pool (₹300)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              onSubscribe(selectedPlan);
              onClose();
            }}
            className="w-full py-4 bg-gradient-to-r from-[var(--accent)] via-[var(--accent)] to-[var(--accent)] hover:from-[var(--accent)] hover:to-[var(--accent)] text-black font-black text-[15px] rounded-2xl shadow-[0_0_25px_var(--accent-glow)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Activate {selectedPlan === 'annual' ? 'Annual Ultimate VIP' : 'Monthly VIP'}
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 text-[11px] text-[#e0c0af]/60 text-center">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted UPI & Cards</span>
          </span>
          <span>•</span>
          <span>Cancel anytime in 1 click</span>
        </div>
      </div>
    </div>
  );
};
