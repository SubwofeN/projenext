'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Project {
  id: string | number;
  title: string;
  description: string;
  likes?: number;
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
  const [likesCount, setLikesCount] = useState<number>(project.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ayrıştırma Regexleri
  const discordMatch = project.description?.match(/• Discord:\s*(https?:\/\/[^\s]+)/i);
  const emailMatch = project.description?.match(/• E-posta:\s*([^\s]+)/i);
  const demoMatch = project.description?.match(/• Canlı Demo:\s*(https?:\/\/[^\s]+)/i);
  const repoMatch = project.description?.match(/• (?:Kaynak Kod|Repo):\s*(https?:\/\/[^\s]+)/i);
  const categoryMatch = project.description?.match(/• Kategori:\s*([^\n]+)/i);
  const needsMatch = project.description?.match(/• Aranan Destek:\s*([^\n]+)/i);

  const discordUrl = discordMatch ? discordMatch[1] : null;
  const contactEmail = emailMatch ? emailMatch[1] : null;
  const demoUrl = demoMatch ? demoMatch[1] : null;
  const repoUrl = repoMatch ? repoMatch[1] : null;
  const category = categoryMatch ? categoryMatch[1].trim() : null;
  const needs = needsMatch ? needsMatch[1].trim() : null;

  // Beğeni Artırma
  const handleLike = async () => {
    if (hasLiked) return;
    const nextCount = likesCount + 1;
    setLikesCount(nextCount);
    setHasLiked(true);

    try {
      await supabase
        .from('projects')
        .update({ likes: nextCount })
        .eq('id', project.id);
    } catch {
      // sessiz fallback
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`"${project.title}" projesini silmek istediğinize emin misiniz?`)) return;

    setLoading(true);
    const { error } = await supabase.from('projects').delete().eq('id', project.id);

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
      .update({ title: editTitle, description: editDesc })
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
      <div className="relative flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-sm transition hover:border-zinc-700">
        <div>
          {/* Admin Kontrolleri */}
          {isAdmin && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
              <button
                onClick={() => setIsEditing(true)}
                title="Düzenle"
                type="button"
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition"
              >
                ✎
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                title="Sil"
                type="button"
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-rose-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>
          )}

          {/* Kategori Rozeti */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                {category || 'Proje'}
              </span>
            </div>

            {/* Beğeni Butonu */}
            <button
              onClick={handleLike}
              type="button"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                hasLiked
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30'
              }`}
            >
              <span>{hasLiked ? '❤️' : '🤍'}</span>
              <span>{likesCount}</span>
            </button>
          </div>

          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{project.title}</h3>
          
          <p className="text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>

          {/* Aranan Destek Rozeti */}
          {needs && (
            <div className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-800/40 text-[11px] text-blue-300 font-medium">
              <span>🎯 Destek:</span> {needs}
            </div>
          )}
        </div>

        {/* Alt Kısım: İletişim / Devralma & Detaylar */}
        <div className="mt-5 pt-3.5 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            {discordUrl ? (
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-[#5865F2]/20 border border-[#5865F2]/40 text-[#5865F2] hover:bg-[#5865F2] hover:text-white font-medium transition"
              >
                🤝 Devral / Discord ↗
              </a>
            ) : contactEmail ? (
              <a
                href={`mailto:${contactEmail}`}
                className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 hover:bg-cyan-500 hover:text-black font-medium transition"
              >
                ✉ Devral / İletişim ↗
              </a>
            ) : (
              <button
                type="button"
                onClick={() => setIsDetailsOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
              >
                İncele
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsDetailsOpen(true)}
            className="text-zinc-400 hover:text-cyan-300 transition font-medium cursor-pointer"
          >
            Detaylar →
          </button>
        </div>
      </div>

      {/* DETAYLAR MODALI */}
      {isDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between pb-3 mb-4 border-b border-zinc-900">
              <div>
                <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                  {category || 'Proje Detayları'}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{project.title}</h3>
              </div>
              <button
                onClick={() => setIsDetailsOpen(false)}
                type="button"
                className="text-zinc-400 hover:text-white text-lg px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line mb-6">
              {project.description}
            </div>

            {/* Bağlantılar */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-zinc-900">
              {demoUrl && (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-cyan-500 px-3.5 py-1.5 text-xs font-semibold text-black hover:bg-cyan-400 transition"
                >
                  🚀 Canlı Demo ↗
                </a>
              )}
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-1.5 text-xs text-zinc-300 hover:text-white transition"
                >
                  🐙 GitHub ↗
                </a>
              )}
              {discordUrl && (
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 px-3.5 py-1.5 text-xs text-[#5865F2] hover:bg-[#5865F2] hover:text-white transition"
                >
                  👾 Discord ↗
                </a>
              )}
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="rounded-xl border border-cyan-800 bg-cyan-950 px-3.5 py-1.5 text-xs text-cyan-300 transition"
                >
                  ✉ E-posta ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DÜZENLEME MODALI */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-900">
              <h4 className="text-base font-semibold text-white">Projeyi Düzenle</h4>
              <button onClick={() => setIsEditing(false)} type="button" className="text-zinc-400 hover:text-white cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Başlık</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Açıklama</label>
                <textarea
                  rows={4}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs text-zinc-300 hover:text-white cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-black hover:bg-cyan-400 disabled:opacity-50 cursor-pointer"
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