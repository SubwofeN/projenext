'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string | number;
  title: string;
  description: string;
  [key: string]: any;
}

interface ProjectCardProps {
  project: Project;
  isAdmin: boolean;
  onRefresh: () => void;
}

export default function ProjectCard({ project, isAdmin, onRefresh }: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(project.title);
  const [editDesc, setEditDesc] = useState(project.description);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`"${project.title}" projesini silmek istediğinize emin misiniz?`);
    if (!confirmDelete) return;

    setLoading(true);
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id);

    if (error) {
      alert('Silme hatası: ' + error.message);
    } else {
      onRefresh();
    }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('projects')
      .update({
        title: editTitle,
        description: editDesc,
      })
      .eq('id', project.id);

    if (error) {
      alert('Güncelleme hatası: ' + error.message);
    } else {
      setIsEditing(false);
      onRefresh();
    }
    setLoading(false);
  };

  return (
    <>
      <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-white/20 hover:shadow-cyan-500/5 hover:-translate-y-1">
        {/* Admin İşlem Butonları */}
        {isAdmin && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
            <button
              onClick={() => setIsEditing(true)}
              title="Düzenle"
              type="button"
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-500/40 transition duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              title="Sil"
              type="button"
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-rose-400 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/40 transition duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 ring-4 ring-cyan-400/20" />
          <span className="text-[11px] font-semibold tracking-wider text-cyan-400 uppercase">Proje</span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-white mb-2 group-hover:text-cyan-300 transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-zinc-400 leading-relaxed line-clamp-4 whitespace-pre-line">
          {project.description}
        </p>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
          <span>ID: #{project.id}</span>
          <span className="group-hover:text-zinc-300 transition-colors">Detaylar →</span>
        </div>
      </div>

      {/* Düzenleme Modalı */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
              <h4 className="text-lg font-semibold text-white">Projeyi Düzenle</h4>
              <button
                onClick={() => setIsEditing(false)}
                type="button"
                className="text-zinc-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Başlık</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Açıklama</label>
                <textarea
                  rows={4}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/10 transition"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 transition disabled:opacity-50"
                >
                  {loading ? 'Kaydediliyor...' : 'Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}