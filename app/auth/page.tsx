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
    setMessage(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Giriş Yap
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          setMessage({ text: error.message, type: 'error' });
          setLoading(false);
        } else if (data?.user) {
          setMessage({ text: 'Giriş başarılı! Ana sayfaya aktarılıyorsunuz...', type: 'success' });
          
          // Next router yerine sert tarayıcı yönlendirmesi (Kesin çözüm)
          setTimeout(() => {
            window.location.href = '/';
          }, 400);
        }
      } else {
        // Kayıt Ol
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });

        if (error) {
          setMessage({ text: error.message, type: 'error' });
          setLoading(false);
        } else if (data?.user) {
          setMessage({
            text: 'Kayıt başarılı! Şimdi aynı bilgilerle giriş yapabilirsiniz.',
            type: 'success',
          });
          setIsLogin(true);
          setPassword('');
          setLoading(false);
        }
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Beklenmeyen bir hata oluştu.', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 flex items-center justify-center p-4 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Arka Plan Glow Efekti */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/15 to-transparent blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/60 p-8 backdrop-blur-2xl shadow-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-black shadow-lg shadow-cyan-500/20">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Proje<span className="text-cyan-400">Next</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-2">
            {isLogin ? 'Hesabınıza Giriş Yapın' : 'Yeni Hesap Oluşturun'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {isLogin
              ? 'Projeleri yönetmek için hesabınıza erişin.'
              : 'Ekosisteme katılmak için bilgilerinizi girin.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              E-posta Adresi
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ornek@domain.com"
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
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
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 transition disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                İşlem Yapılıyor...
              </span>
            ) : isLogin ? (
              'Giriş Yap'
            ) : (
              'Kayıt Ol'
            )}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-xl border text-xs text-center ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-white/5 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage(null);
            }}
            className="text-xs text-zinc-400 hover:text-cyan-300 transition cursor-pointer"
          >
            {isLogin
              ? 'Hesabınız yok mu? '
              : 'Zaten hesabınız var mı? '}
            <span className="text-cyan-400 font-semibold underline underline-offset-4">
              {isLogin ? 'Kayıt Olun' : 'Giriş Yapın'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}