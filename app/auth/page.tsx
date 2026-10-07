'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import ProjectCard from '@/components/ProjectCard';
import NewProjectModal from '@/components/NewProjectModal';
import Link from 'next/link';

const ADMIN_EMAIL = 'yilmaznecati728@gmail.com';
const CATEGORIES = ['Tümü', 'Web / SaaS', 'Yapay Zeka', 'Mobil Uygulama', 'Açık Kaynak', 'Oyun'];

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
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

  // Anlık Arama ve Filtreleme Mantığı
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'Tümü' ||
        project.description.toLowerCase().includes(`kategori: ${selectedCategory.toLowerCase()}`);

      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8">
        {/* Navigasyon Barı */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 sm:py-4 px-4 sm:px-6 rounded-2xl border border-zinc-800 bg-zinc-950 mb-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500 flex items-center justify-center font-bold text-black text-sm">
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
              className="flex items-center gap-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 px-3.5 py-2 text-xs font-semibold text-black transition cursor-pointer"
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
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
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
              <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
                <button
                  onClick={handleLogout}
                  type="button"
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white transition cursor-pointer"
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white transition"
              >
                Giriş Yap
              </Link>
            )}
          </div>
        </header>

        {/* Hero Başlık */}
        <section className="text-center py-6 sm:py-8 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-xs text-zinc-400 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Canlı Topluluk Projeleri
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
            Geleceğin Fikirlerini <br />
            <span className="text-cyan-400">Burada Keşfet ve Devral</span>
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-zinc-400 mb-6 px-4">
            Açık kaynak fikirler, devredilen projeler ve topluluk ürünleri tek bir merkezde.
          </p>

          {/* CANLI ARAMA ÇUBUĞU */}
          <div className="max-w-md mx-auto mb-6 px-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Proje ara (örn: AI, Rust, Not Alma)..."
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 pl-10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition shadow-inner"
              />
              <span className="absolute left-3.5 top-3.5 text-zinc-500 text-sm">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-zinc-500 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* KATEGORİ FİLTRE HAPLARI */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap px-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500 text-black border-cyan-500 font-semibold'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Projeler Grid Alanı */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-7 h-7 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-xs text-zinc-500">Yükleniyor...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl p-6 bg-zinc-950">
            <p className="text-zinc-500 text-xs sm:text-sm">
              {searchQuery || selectedCategory !== 'Tümü'
                ? 'Aradığınız kriterlere uygun proje bulunamadı.'
                : 'Henüz eklenmiş bir proje bulunmuyor.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProjects.map((item) => (
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