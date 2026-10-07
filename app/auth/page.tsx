'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setMessage(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (error) {
          setMessage({
            text: error.message.includes('Invalid login')
              ? 'E-posta veya şifre hatalı.'
              : error.message,
            type: 'error',
          });
          setLoading(false);
        } else if (data?.user) {
          setMessage({ text: 'Giriş yapıldı, yönlendiriliyorsunuz...', type: 'success' });
          window.location.href = '/';
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
        });

        if (error) {
          setMessage({ text: error.message, type: 'error' });
          setLoading(false);
        } else if (data?.user) {
          setMessage({
            text: 'Hesap açıldı! Şimdi giriş yapabilirsiniz.',
            type: 'success',
          });
          setIsLogin(true);
          setPassword('');
          setLoading(false);
        }
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Bağlantı hatası.', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500 flex items-center justify-center font-black text-black">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Proje<span className="text-cyan-400">Next</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white mt-1">
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </h2>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              E-posta
            </label>
            <input
              type="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ornek@domain.com"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 py-2.5 text-sm font-semibold text-black transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'İşleniyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-xl border text-xs text-center ${
              message.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-400'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-zinc-900 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage(null);
            }}
            className="text-xs text-zinc-400 hover:text-cyan-400 transition cursor-pointer"
          >
            {isLogin ? 'Hesabınız yok mu? ' : 'Zaten hesabınız var mı? '}
            <span className="text-cyan-400 font-semibold underline underline-offset-4">
              {isLogin ? 'Kayıt Olun' : 'Giriş Yapın'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}