'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProjectCard from '@/components/ProjectCard';
import NewProjectModal from '@/components/NewProjectModal';
import Link from 'next/link';

const ADMIN_EMAIL = 'yilmaznecati728@gmail.com';

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [adminModeActive, setAdminModeActive] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleOpenAddModal = () => {
    if (!currentUser) {
      window.location.href = '/auth';
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-zinc-100">
      {/* Hafifletilmiş Ortam Işıkları (Sadece masaüstünde aktif) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden hidden sm:block">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-600/10 blur-[90px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
        {/* Navigasyon Barı */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 sm:py-4 px-4 sm:px-6 rounded-2xl border border-white/10 bg-zinc-950/80 mb-8 sm:mb-12 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-black">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Proje<span className="text-cyan-400">Next</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-center">
            <button
              onClick={handleOpenAddModal}
              type="button"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-xs font-semibold text-white transition cursor-pointer"
            >
              <span className="text-sm font-bold leading-none">+</span> Proje Ekle
            </button>

            {isAdminUser && (
              <button
                onClick={() => setAdminModeActive((prev) => !prev)}
                type="button"
                className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-full border transition cursor-pointer ${
                  adminModeActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-zinc-900 text-zinc-400 border-white/10 hover:text-white'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    adminModeActive ? 'bg-cyan-400' : 'bg-zinc-600'
                  }`}
                />
                {adminModeActive ? 'Yönetici: Açık' : 'Yönetici: Kapalı'}
              </button>
            )}

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <button
                  onClick={handleLogout}
                  type="button"
                  className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white transition"
              >
                Giriş Yap
              </Link>
            )}
          </div>
        </header>

        {/* Hero Bölümü */}
        <section className="text-center py-6 sm:py-10 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-zinc-900 text-xs text-zinc-400 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Canlı Topluluk Projeleri
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3 sm:mb-4">
            Geleceğin Fikirlerini <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Burada Keşfet ve Yönet
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-base text-zinc-400 mb-5 px-4">
            Açık kaynak fikirler, modern projeler ve topluluğun ürettiği tüm yenilikler tek bir merkezde.
          </p>

          <button
            onClick={handleOpenAddModal}
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 px-5 py-2.5 text-sm font-semibold text-white transition cursor-pointer"
          >
            <span className="text-cyan-400 font-bold">+</span> Yeni Proje Paylaş
          </button>
        </section>

        {/* Projeler Grid Alanı */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-7 h-7 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-xs text-zinc-500">Yükleniyor...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl p-6 bg-zinc-950">
            <p className="text-zinc-500 text-xs sm:text-sm">Henüz eklenmiş bir proje bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

      {isModalOpen && (
        <NewProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onProjectAdded={() => {
            setIsModalOpen(false);
            fetchProjects();
          }}
        />
      )}
    </div>
  );
}