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

  // 1. Projeyi Silme (Çarpı butonu)
  const handleDelete = async () => {
    const confirmDelete = window.confirm(`"${project.title}" projesini silmek istediğinize emin misiniz?`);
    if (!confirmDelete) return;

    setLoading(true);
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id);

    if (error) {
      alert('Silinirken hata oluştu: ' + error.message);
    } else {
      onRefresh(); // Listeyi anında yenile
    }
    setLoading(false);
  };

  // 2. Projeyi Güncelleme/Düzeltme
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
      onRefresh(); // Değişikliği anında yansıt
    }
    setLoading(false);
  };

  return (
    <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow transition hover:border-zinc-700">
      {/* SADECE ADMIN GÖREBİLİR: Çarpı (Sil) ve Düzenle Butonları */}
      {isAdmin && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={() => setIsEditing(true)}
            title="Projeyi Düzenle"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-300 hover:bg-blue-600 hover:text-white transition text-xs"
          >
            ✎
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            title="Projeyi Sil"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-800 text-red-400 hover:bg-red-600 hover:text-white transition font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Kart İçeriği */}
      <h3 className="text-xl font-semibold text-white pr-16">{project.title}</h3>
      <p className="mt-2 text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
        {project.description}
      </p>

      {/* ADMIN DÜZENLEME MODALI */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-white">Projeyi Düzenle</h4>
              <button
                onClick={() => setIsEditing(false)}
                className="text-zinc-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Başlık</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Açıklama</label>
                <textarea
                  rows={4}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition"
                >
                  {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}