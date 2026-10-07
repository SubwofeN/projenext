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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(project.title);
  const [editDesc, setEditDesc] = useState(project.description);
  const [loading, setLoading] = useState(false);

  // Açıklamadaki özel alanları ayrıştır
  const discordMatch = project.description?.match(/• Discord:\s*(https?:\/\/[^\s]+)/i);
  const emailMatch = project.description?.match(/• E-posta:\s*([^\s]+)/i);
  const demoMatch = project.description?.match(/• Canlı Demo:\s*(https?:\/\/[^\s]+)/i);
  const repoMatch = project.description?.match(/• (?:Kaynak Kod|Repo):\s*(https?:\/\/[^\s]+)/i);

  const discordUrl = discordMatch ? discordMatch[1] : null;
  const contactEmail = emailMatch ? emailMatch[1] : null;
  const demoUrl = demoMatch ? demoMatch[1] : null;
  const repoUrl = repoMatch ? repoMatch[1] : null;

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
      <div className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-white/20 hover:shadow-cyan-500/5 hover:-translate-y-1">
        <div>
          {/* Admin İşlem Butonları */}
          {isAdmin && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
              <button
                onClick={() => setIsEditing(true)}
                title="Düzenle"
                type="button"
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-500/40 transition duration-200 cursor-pointer"
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
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-rose-400 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/40 transition duration-200 cursor-pointer"
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

          <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3 whitespace-pre-line">
            {project.description}
          </p>
        </div>

        {/* Alt Kısım: İletişim Butonları ve Detay Butonu */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            {discordUrl && (
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#5865F2]/15 text-[#5865F2] hover:bg-[#5865F2] hover:text-white font-medium transition cursor-pointer border border-[#5865F2]/30"
              >
                <span>👾</span> Discord ↗
              </a>
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500 hover:text-black font-medium transition cursor-pointer border border-cyan-500/30"
              >
                <span>✉</span> E-posta ↗
              </a>
            )}
          </div>

          {/* TIKLANABİLİR DETAYLAR BUTONU */}
          <button
            type="button"
            onClick={() => setIsDetailsOpen(true)}
            className="flex items-center gap-1 text-zinc-400 hover:text-cyan-300 transition cursor-pointer font-medium"
          >
            <span>Detaylar</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* DETAYLAR MODALI */}
      {isDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-start justify-between pb-4 mb-5 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-semibold text-cyan-400 mb-2">
                  Proje Detayları
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white">
                  {project.title}
                </h3>
              </div>

              <button
                onClick={() => setIsDetailsOpen(false)}
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tam Açıklama Alanı */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-sm text-zinc-300 leading-relaxed whitespace-pre-line mb-6 font-normal">
              {project.description}
            </div>

            {/* Dış Bağlantılar & Aksiyonlar */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10">
              {demoUrl && (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
                >
                  🚀 Canlı Demo Ziyaret Et ↗
                </a>
              )}
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition"
                >
                  🐙 GitHub / Repo ↗
                </a>
              )}
              {discordUrl && (
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-[#5865F2]/40 bg-[#5865F2]/15 px-4 py-2 text-xs font-medium text-[#5865F2] hover:bg-[#5865F2] hover:text-white transition"
                >
                  👾 Discord Topluluğu ↗
                </a>
              )}
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-4 py-2 text-xs font-medium text-cyan-300 hover:bg-cyan-500 hover:text-black transition"
                >
                  ✉ E-posta Gönder ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DÜZENLEME MODALI */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900/90 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
              <h4 className="text-lg font-semibold text-white">Projeyi Düzenle</h4>
              <button
                onClick={() => setIsEditing(false)}
                type="button"
                className="text-zinc-400 hover:text-white transition cursor-pointer"
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
                  rows={5}
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
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/10 transition cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
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