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
  const [status, setStatus] = useState<'idea' | 'design' | 'code'>('idea');
  const [reason, setReason] = useState('');
  const [techStack, setTechStack] = useState('');
  const [author, setAuthor] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Veritabanı tablosundaki kolonlara göre ekleme
      const { error } = await supabase.from('projects').insert([
        {
          title: title.trim(),
          description: description.trim(),
          // Eğer projeler tablon bu kolonları destekliyorsa gönderir:
          ...(reason && { reason: reason.trim() }),
          ...(techStack && { tech_stack: techStack.trim() }),
          ...(author && { author: author.trim() }),
          ...(repoUrl && { repo_url: repoUrl.trim() }),
          ...(status && { status }),
        },
      ]);

      if (error) {
        // Kolon hatası verirse sade başlık-açıklama ile fallback yapalım
        if (error.message.includes('column')) {
          const combinedDesc = `${description}\n\n• Durum: ${
            status === 'idea' ? 'Sadece Fikir' : status === 'design' ? 'Tasarım Var' : 'Kod/Repo Açık'
          }${reason ? `\n• Neden Devrediliyor: ${reason}` : ''}${
            techStack ? `\n• Teknolojiler: ${techStack}` : ''
          }${author ? `\n• Ekleyen: ${author}` : ''}${repoUrl ? `\n• Link: ${repoUrl}` : ''}`;

          const { error: retryError } = await supabase.from('projects').insert([
            {
              title: title.trim(),
              description: combinedDesc,
            },
          ]);

          if (retryError) throw retryError;
        } else {
          throw error;
        }
      }

      onProjectAdded();
    } catch (err: any) {
      setErrorMsg(err.message || 'Proje eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl scrollbar-thin scrollbar-thumb-zinc-800">
        
        {/* Üst Başlık & Rozet */}
        <div className="flex items-start justify-between pb-4 mb-5 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-semibold text-cyan-400 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Fikrini veya Projeni Topluluğa Devret
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white">
              Yeni Proje Bırak
            </h3>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Proje Adı <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Örn: ProjeNext, DevLog..."
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Tek Cümlelik Özet <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Örn: Yazılımcılar için masaüstü not alma aracı."
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
            />
          </div>

          {/* Durum Seçimi */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Proje Durumu
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('idea')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  status === 'idea'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/30'
                    : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                💡 Sadece Fikir
              </button>

              <button
                type="button"
                onClick={() => setStatus('design')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  status === 'design'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/30'
                    : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                🎨 Tasarım Var
              </button>

              <button
                type="button"
                onClick={() => setStatus('code')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  status === 'code'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/30'
                    : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:text-white'
                }`}
              >
                ⚡ Kod / Repo Açık
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Neden Devrediyorsun / Neden Durdu?
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Örn: Zaman ayıramadım, backend tarafı karmaşık geldi..."
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Teknolojiler (Virgülle ayır)
            </label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="Next.js, Tailwind, Supabase..."
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Kullanıcı Adı <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                placeholder="Örn: necati"
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Repo / Link (Opsiyonel)
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Aksiyon Butonları */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
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
                '✦ Panoya Bırak'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}