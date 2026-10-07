'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// SADECE SENİN E-POSTA ADRESİN
const ADMIN_EMAIL = 'yilmaznecati728@gmail.com';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || user.email !== ADMIN_EMAIL) {
        // Yetkisiz kullanıcıları login'e yolla
        router.push('/auth');
      } else {
        setIsAdmin(true);
      }
      setLoading(false);
    }

    checkAuth();
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Ekleniyor...');

    // Supabase'deki 'projects' tablosuna yeni içerik ekleme
    const { error } = await supabase.from('projects').insert([
      {
        title,
        description,
      },
    ]);

    if (error) {
      setStatus('Hata: ' + error.message);
    } else {
      setStatus('Başarıyla eklendi!');
      setTitle('');
      setDescription('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        Yetki kontrol ediliyor...
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 sm:p-12">
      <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Yönetim Paneli</h1>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/auth');
            }}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded text-zinc-300"
          >
            Çıkış Yap
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Proje / İçerik Başlığı
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              placeholder="Örn: Yeni Proje Başlığı"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">
              Açıklama / İçerik Yazısı
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
              placeholder="Sitede görünecek detaylar..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 font-semibold rounded-lg transition"
          >
            Siteye Gönder
          </button>
        </form>

        {status && (
          <p
            className={`mt-4 text-center text-sm ${
              status.includes('Başarıyla')
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}