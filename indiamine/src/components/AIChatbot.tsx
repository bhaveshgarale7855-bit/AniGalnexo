
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Lock, Send, Sparkles } from 'lucide-react';

interface AIChatbotProps {
  isLoggedIn: boolean;
  onRequireLogin: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChatbot({
  isLoggedIn,
  onRequireLogin,
}: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleOpen = () => {
    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }
    setIsOpen((open) => !open);
  };

  const handleSend = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const text = message.trim();
    if (!text || isLoading) return;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      setError('Gemini API key missing. Check your .env.local file.');
      return;
    }

    setMessages((previous) => [
      ...previous,
      { role: 'user', content: text },
    ]);
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      let response: Response | undefined;
      let result: any;

      for (let attempt = 0; attempt < 3; attempt++) {
        response = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [
                  {
                    text: "You are AniGalnexo AI, a friendly anime companion. Help users discover anime, discuss characters, explain plots, and recommend shows. Reply in the user's language. Keep answers concise and accurate.",
                  },
                ],
              },
              contents: [
                {
                  role: 'user',
                  parts: [{ text }],
                },
              ],
              generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 150,
              },
            }),
          }
        );

        result = await response.json();

        if (response.ok) break;

        const retryable = [429, 500, 502, 503, 504].includes(
          response.status
        );

        if (!retryable || attempt === 2) {
          throw new Error(
            result?.error?.message ||
              `Gemini API request failed (${response.status})`
          );
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt))
        );
      }

      if (!response?.ok) {
        throw new Error('Gemini API did not return a successful response.');
      }

      const reply = result?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text || '')
        .join('')
        .trim();

      if (!reply) {
        throw new Error(
          'The AI returned an empty response. Please try again.'
        );
      }

      setMessages((previous) => [
        ...previous,
        { role: 'assistant', content: reply },
      ]);
    } catch (err) {
      console.error('Anime chatbot error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Could not connect to AniGalnexo AI. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
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
                <p className="text-xs text-gray-400">
                  Your anime companion
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
              className="rounded-lg p-2 hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </header>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="m-auto flex flex-col items-center gap-3 p-3 text-center">
                <Sparkles size={34} className="text-violet-300" />
                <h3 className="text-lg font-semibold">
                  Hey, anime fan!
                </h3>
                <p className="text-sm leading-6 text-gray-400">
                  Ask me about anime, recommendations, or what to watch next.
                </p>
              </div>
            )}

            {messages.map((item, index) => (
              <div
                key={`${index}-${item.role}`}
                className={`max-w-[90%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm ${
                  item.role === 'user'
                    ? 'self-end bg-violet-600 text-white'
                    : 'self-start border border-white/10 bg-[#201d32] text-gray-200'
                }`}
              >
                {item.content}
              </div>
            ))}

            {isLoading && (
              <p className="self-start text-sm text-violet-300">
                AniGalnexo AI is thinking...
              </p>
            )}

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="flex gap-2 border-t border-white/10 p-3"
          >
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Message AniGalnexo AI..."
              aria-label="Chat message"
              disabled={isLoading}
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0e0e18] px-3 py-3 text-sm outline-none focus:border-violet-400 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
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
