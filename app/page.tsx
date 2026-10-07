'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';

const ADMIN_EMAIL = 'yilmaznecati728@gmail.com';

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [adminModeActive, setAdminModeActive] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
  };

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setCurrentUser(user);

      if (
        user?.email &&
        user.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim()
      ) {
        setIsAdminUser(true);
      }

      await fetchProjects();
      setLoading(false);
    }

    init();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAdminUser(false);
    setAdminModeActive(false);
  };

  return (
    <div className="relative min-h-screen bg-black text-zinc-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Arka Plan Glow Efektleri */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/15 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-indigo-600/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* Modern Navigasyon Barı */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl shadow-2xl mb-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-black shadow-lg shadow-cyan-500/20">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Proje<span className="text-cyan-400">Next</span>
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Yönetici Toggle Butonu */}
            {isAdminUser && (
              <button
                onClick={() => setAdminModeActive((prev) => !prev)}
                type="button"
                className={`flex items-center gap-2 text-xs font-medium px-3.5 py-1.5 rounded-full border transition duration-300 cursor-pointer ${
                  adminModeActive
                    ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/30'
                    : 'bg-zinc-800/40 text-zinc-400 border-white/5 hover:text-white hover:bg-zinc-800/70'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-all ${
                    adminModeActive ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-zinc-600'
                  }`}
                />
                {adminModeActive ? 'Yönetici Modu Açık' : 'Yönetici Modu Kapalı'}
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-3 pl-2 border-l border-white/10">
                <span className="text-xs text-zinc-400 font-mono hidden md:inline">
                  {currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
              >
                Giriş Yap / Kayıt Ol
              </Link>
            )}
          </div>
        </header>

        {/* Hero Bölümü */}
        <section className="text-center py-10 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-zinc-400 mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Canlı Topluluk Projeleri
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
            Geleceğin Fikirlerini <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Burada Keşfet ve Yönet
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-400">
            Açık kaynak fikirler, modern projeler ve öğrenci ekosisteminin ürettiği tüm yenilikler tek bir merkezde.
          </p>
        </section>

        {/* Projeler Grid Alanı */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-sm text-zinc-500">Projeler yükleniyor...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl p-8 bg-zinc-900/20">
            <p className="text-zinc-500 text-sm">Henüz eklenmiş bir proje bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((item) => (
              <ProjectCard
                key={item.id}
                project={item}
                isAdmin={isAdminUser && adminModeActive}
                onRefresh={fetchProjects}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}