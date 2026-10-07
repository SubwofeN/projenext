'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: () => void;
}

const CATEGORIES = ['Web / SaaS', 'Yapay Zeka', 'Mobil Uygulama', 'Açık Kaynak', 'Oyun'];
const NEEDS = ['Frontend Dev', 'Backend Dev', 'UI/UX Tasarım', 'Ekip Arkadaşı', 'Sadece Feedback'];

export default function NewProjectModal({
  isOpen,
  onClose,
  onProjectAdded,
}: NewProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web / SaaS');
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(['Sadece Feedback']);
  const [demoUrl, setDemoUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [author, setAuthor] = useState('');
  const [contactType, setContactType] = useState<'discord' | 'email'>('discord');
  const [contactValue, setContactValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const toggleNeed = (need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // İletişim linkini/metnini biçimlendir
      let contactLine = '';
      if (contactValue.trim()) {
        if (contactType === 'discord') {
          const formattedDiscord = contactValue.startsWith('http')
            ? contactValue.trim()
            : `https://discord.com/users/${contactValue.trim()}`;
          contactLine = `\n• Discord: ${formattedDiscord}`;
        } else {
          contactLine = `\n• E-posta: ${contactValue.trim()}`;
        }
      }

      const formattedDescription = `${description.trim()}\n\n• Kategori: ${category}\n• Aranan Destek: ${
        selectedNeeds.length > 0 ? selectedNeeds.join(', ') : 'Belirtilmedi'
      }${demoUrl ? `\n• Canlı Demo: ${demoUrl}` : ''}${
        repoUrl ? `\n• Kaynak Kod: ${repoUrl}` : ''
      }${author ? `\n• Geliştirici: ${author}` : ''}${contactLine}`;

      // tagline hatasını çözmek için açıklamadan kısa bir özet tagline olarak da gönderiliyor
      const { error } = await supabase.from('projects').insert([
        {
          title: title.trim(),
          description: formattedDescription,
          tagline: description.trim().slice(0, 150),
        },
      ]);

      if (error) throw error;

      onProjectAdded();
    } catch (err: any) {
      setErrorMsg(err.message || 'Proje eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-zinc-950/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        
        {/* Başlık Alanı */}
        <div className="flex items-start justify-between pb-4 mb-5 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-semibold text-cyan-400 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Topluluk Vitrini
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white">
              Yeni Proje Paylaş
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Proje Adı */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Proje Adı <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Örn: AI Destekli Kod Asistanı"
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
            />
          </div>

          {/* Kategori Seçimi */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Proje Kategorisi
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                    category === cat
                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/20'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Proje Açıklaması & Amacı <span className="text-cyan-400">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Proje ne işe yarıyor, hangi problemi çözüyor?"
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition resize-none"
            />
          </div>

          {/* Aranan Destek */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Topluluktan Ne Arıyorsun?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {NEEDS.map((need) => {
                const active = selectedNeeds.includes(need);
                return (
                  <button
                    key={need}
                    type="button"
                    onClick={() => toggleNeed(need)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                      active
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                        : 'bg-white/5 border-white/10 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {need}
                  </button>
                );
              })}
            </div>
          </div>

          {/* İletişim Bilgisi (Discord veya E-posta) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-zinc-400">
                İletişim Kanalı (Opsiyonel)
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setContactType('discord')}
                  className={`text-[11px] px-2 py-0.5 rounded-md transition cursor-pointer ${
                    contactType === 'discord'
                      ? 'bg-[#5865F2]/20 text-[#5865F2] font-semibold border border-[#5865F2]/40'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Discord
                </button>
                <button
                  type="button"
                  onClick={() => setContactType('email')}
                  className={`text-[11px] px-2 py-0.5 rounded-md transition cursor-pointer ${
                    contactType === 'email'
                      ? 'bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/40'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  E-posta
                </button>
              </div>
            </div>
            <input
              type={contactType === 'email' ? 'email' : 'text'}
              value={contactValue}
              onChange={(e) => setContactValue(e.target.value)}
              placeholder={
                contactType === 'discord'
                  ? 'Discord Davet Linki (https://discord.gg/...) veya ID'
                  : 'ornek@domain.com'
              }
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
            />
          </div>

          {/* Bağlantılar (Demo ve Repo) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Canlı Demo (Opsiyonel)
              </label>
              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                GitHub / Repo (Opsiyonel)
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

          {/* Ekleyen Kişi */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              İsmin veya Takma Adın
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Örn: necati"
              className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
            />
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
                '✦ Projeyi Yayınla'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}