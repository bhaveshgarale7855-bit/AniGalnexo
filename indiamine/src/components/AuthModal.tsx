import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, User, Lock, Mail } from 'lucide-react';
import { User as UserType } from '../types';
import { DEFAULT_AVATARS, BRAND_LOGO_URL } from '../data/animeData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserType) => void;
}
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  type LoginRole = 'viewer' | 'creator' | 'admin';

  const [activeRole, setActiveRole] = useState<LoginRole>('viewer');
  const ADMIN_EMAIL = "bhaveshgarale7855@gmail.com";
  const ADMIN_PASSWORD = "Admin@7588301650";

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!supabase) {
      setError('Real authentication is not configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file. Demo profiles remain available below.');
      return;
    }
    setBusy(true);
    try {
      if (isSignUp) {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim() } },
        });
        if (authError) throw authError;
        const authUser = data.user;
        if (!authUser) throw new Error('Account creation did not return a user. Please try again.');
        if (!data.session) {
          setError('Account created. Check your email to confirm the account, then sign in.');
          return;
        }


        const { data: adminRecord, error: adminCheckError } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', authUser.id)
          .maybeSingle();

        if (adminCheckError) throw adminCheckError;

        const verifiedRole = adminRecord ? 'admin' : 'viewer';

        onLogin({
          id: authUser.id,
          name: name.trim() || email.split('@')[0],
          email: authUser.email || email,
          avatar: DEFAULT_AVATARS.arjun,
          role: verifiedRole,
          isPremium: false,
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        });

      } else {
        const { data, error: authError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (authError) throw authError;

        const authUser = data.user;
        if (!authUser) {
          throw new Error('Login failed. Please try again.');
        }


        const { data: adminRecord, error: adminCheckError } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', authUser.id)
          .maybeSingle();

        if (adminCheckError) throw adminCheckError;

        let verifiedRole: 'viewer' | 'creator' | 'admin' = 'viewer';

        // Admin role verification
        if (adminRecord) {
          verifiedRole = 'admin';
        } else {
          // Approved creator verification
          const { data: creatorRecord, error: creatorCheckError } = await supabase
            .from('creator_profiles')
            .select('user_id, status')
            .eq('user_id', authUser.id)
            .maybeSingle();

          if (creatorCheckError) throw creatorCheckError;

          if (creatorRecord?.status === 'approved') {
            verifiedRole = 'creator';
          }
        }

        // Ensure the selected login tab matches the account's actual role
        if (activeRole === 'admin' && verifiedRole !== 'admin') {
          await supabase.auth.signOut();
          throw new Error('This account is not authorized as an administrator.');
        }

        if (activeRole === 'creator' && verifiedRole !== 'creator') {
          await supabase.auth.signOut();
          throw new Error(
            'Your Creator account is not approved yet. Please use an approved Creator account.'
          );
        }

        if (activeRole === 'viewer' && verifiedRole !== 'viewer') {
          await supabase.auth.signOut();
          throw new Error(
            `This is a ${verifiedRole} account. Please select the ${verifiedRole === 'admin' ? 'Admin' : 'Creator'} tab.`
          );
        }

        onLogin({
          id: authUser.id,
          name:
            (authUser.user_metadata?.full_name as string) ||
            email.split('@')[0],
          email: authUser.email || email,
          avatar: DEFAULT_AVATARS.arjun,
          role: verifiedRole,
          isPremium: false,
          joinedDate: new Date(authUser.created_at).toLocaleDateString(
            'en-US',
            { month: 'short', year: 'numeric' }
          ),
        });
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    if (!supabase) {
      setError('Google login needs Supabase credentials and Google OAuth enabled in Supabase Authentication settings.');
      return;
    }
    setBusy(true);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (authError) {
      setError(authError.message);
      setBusy(false);
    }
  };

  const handlePasswordReset = async () => {
    setError('');
    if (!supabase) {
      setError('Password reset needs Supabase credentials configured first.');
      return;
    }
    if (!email.trim()) {
      setError('Enter your email address first.');
      return;
    }
    setBusy(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/`,
    });
    setBusy(false);
    setError(resetError ? resetError.message : 'Password reset email requested. Check your inbox.');
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#191b24] border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-[#e0c0af] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-[0_0_15px_var(--accent-glow)] mx-auto">
            <img src={BRAND_LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="font-headline text-2xl font-bold text-white">
            {isSignUp ? 'Join AniGalnexo' : 'Welcome Back'}
          </h2>
          <p className="text-[13px] text-[#e0c0af]/70">
            Stream high-definition Indian anime originals & simulcasts.
          </p>
        </div>

        {/* Login Role Selector */}
        <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[#11131c] border border-white/10">
          {([
            { id: 'viewer', label: 'User' },
            { id: 'creator', label: 'Creator' },
            { id: 'admin', label: 'Admin' },
          ] as const).map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => {
                setActiveRole(role.id);
                setError('');
              }}
              className={`py-2.5 rounded-lg text-sm font-bold transition-all ${activeRole === role.id
                ? 'bg-[var(--accent)] text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
            >
              {role.label}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-[#e0c0af]/60">
          {activeRole === 'viewer' && 'Sign in or create your viewer account.'}
          {activeRole === 'creator' && 'Sign in with your approved creator account.'}
          {activeRole === 'admin' && 'Authorized administrators only.'}
        </p>

        {/* {activeRole !== 'admin' && (
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={busy}
            className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            Continue with Google
          </button>
        )} */}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#e0c0af]">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#e0c0af]/50 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#11131c] border border-white/15 rounded-xl text-[13px] text-white focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[12px] font-bold text-[#e0c0af]">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#e0c0af]/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full pl-9 pr-3 py-2.5 bg-[#11131c] border border-white/15 rounded-xl text-[13px] text-white focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[12px] font-bold text-[#e0c0af]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#e0c0af]/50 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-[#11131c] border border-white/15 rounded-xl text-[13px] text-white focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          {error && <p role="status" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs leading-relaxed text-red-200">{error}</p>}
          {!isSignUp && <button type="button" onClick={handlePasswordReset} disabled={busy} className="text-xs font-semibold text-[var(--accent)] hover:underline disabled:opacity-50">Forgot password?</button>}
          <button type="submit" disabled={busy} className="w-full py-3 bg-[var(--accent)] text-white font-bold text-[14px] rounded-xl glow-active transition-all shadow-lg hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
            {busy ? 'Please wait…' : isSignUp ? 'Create Free Account' : 'Sign In'}
          </button>
        </form>

        {activeRole !== 'admin' && (
          <div className="text-center text-[13px] text-[#e0c0af]/70">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-[var(--accent)] font-bold hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
