'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: () => void;
}

export default function NewProjectModal({
  isOpen,
  onClose,
  onProjectAdded,
}: NewProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const { error } = await supabase.from('projects').insert([
        {
          title: title.trim(),
          description: description.trim(),
        },
      ]);

      if (error) {
        setErrorMessage(error.message);
      } else {
        setTitle('');
        setDescription('');
        onProjectAdded();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Proje eklenirken bir hata meydana geldi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Kutusu */}
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        {/* Üst Başlık ve Kapat Butonu */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-black text-xs shadow-md shadow-cyan-500/20">
              +
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">
                Yeni Proje Oluştur
              </h3>
              <p className="text-[11px] text-zinc-400">
                Topluluğun görmesi için projenizi detaylandırın.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Alanı */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Proje Başlığı
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Örn: AI Destekli Kod Asistanı"
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Proje Açıklaması / Detayları
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Projenin amacı, kullanılan teknolojiler ve hedefler..."
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition resize-none"
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Alt Butonlar */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Yayınlanıyor...
                </span>
              ) : (
                'Projeyi Yayınla'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}