'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';

const ADMIN_EMAIL = 'yilmaznecati728@gmail.com';

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
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
        setIsAdmin(true);
      }

      await fetchProjects();
      setLoading(false);
    }

    init();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsAdmin(false);
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 sm:p-12 max-w-6xl mx-auto">
      {/* ÜST BAR */}
      <header className="flex justify-between items-center pb-8 border-b border-zinc-800 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">ProjeNext</h1>
          {isAdmin && (
            <span className="inline-block mt-2 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-medium">
              Admin Modu Aktif
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <span className="text-xs text-zinc-400 hidden sm:inline">
                {currentUser.email}
              </span>
              <button
                onClick={handleLogout}
                type="button"
                className="text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg text-zinc-300 transition"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition"
            >
              Giriş / Kayıt Ol
            </Link>
          )}
        </div>
      </header>

      {/* PROJELER LİSTESİ */}
      {loading ? (
        <p className="text-zinc-500">Yükleniyor...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((item) => (
            <ProjectCard
              key={item.id}
              project={item}
              isAdmin={isAdmin}
              onRefresh={fetchProjects}
            />
          ))}
        </div>
      )}
    </main>
  );
}