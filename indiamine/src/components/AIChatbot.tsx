
import React, { useState } from 'react';
import { MessageCircle, X, Lock, Send, Sparkles } from 'lucide-react';

interface AIChatbotProps {
  isLoggedIn: boolean;
  onRequireLogin: () => void;
}

export function AIChatbot({
  isLoggedIn,
  onRequireLogin,
}: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleOpen = () => {
    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }
    setIsOpen((open) => !open);
  };

  return (
    <>
      {isOpen && (
        <section className="fixed bottom-24 right-4 z-[100] flex h-[min(520px,70vh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#151522] text-white shadow-2xl">
          <header className="flex items-center justify-between border-b border-white/10 bg-[#201d32] p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-violet-500/20 p-2">
                <Sparkles className="text-violet-300" size={22} />
              </div>
              <div>
                <h2 className="font-semibold">AniGalnexo AI</h2>
                <p className="text-xs text-gray-400">Your anime companion</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
              className="rounded-lg p-2 hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </header>

          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <Sparkles size={34} className="text-violet-300" />
            <h3 className="text-lg font-semibold">Hey, anime fan!</h3>
            <p className="text-sm leading-6 text-gray-400">
              Your AI assistant is getting ready. Soon you can chat in your
              preferred language and discover your next favourite anime.
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              // AI backend will be connected in a later step.
              setMessage('');
            }}
            className="flex gap-2 border-t border-white/10 p-3"
          >
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Message AniGalnexo AI..."
              aria-label="Chat message"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0e0e18] px-3 py-3 text-sm outline-none focus:border-violet-400"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              aria-label="Send message"
              className="rounded-xl bg-violet-600 px-3 text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={handleOpen}
        aria-label="Open AI chatbot"
        title={isLoggedIn ? 'Chat with AniGalnexo AI' : 'Log in to use AI Chat'}
        className="fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-full border border-violet-300/30 bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-[0_8px_30px_rgba(109,40,217,0.4)] transition hover:scale-105"
      >
        {isLoggedIn ? <MessageCircle size={25} /> : <Lock size={23} />}
      </button>
    </>
  );
}
