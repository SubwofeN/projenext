"use client";

import { useState } from "react";
import { Project, ProjectStatus } from "@/types/project";
import { X, Plus, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: (newProject: Project) => void;
}

export default function NewProjectModal({ isOpen, onClose, onProjectAdded }: Props) {
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [abandonReason, setAbandonReason] = useState("");
  const [techInput, setTechInput] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("fikir");
  const [repoUrl, setRepoUrl] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !abandonReason || !username) {
      alert("Lütfen zorunlu alanları doldurun (Başlık, Durma Sebebi, Kullanıcı Adı)");
      return;
    }

    setLoading(true);

    const payload = {
      title,
      tagline: tagline || "Açıklama belirtilmedi.",
      description: description || tagline,
      abandon_reason: abandonReason,
      tech_stack: techInput
        ? techInput.split(",").map((t) => t.trim()).filter(Boolean)
        : ["Genel"],
      status,
      respect_count: 0,
      repo_url: repoUrl || null,
      author_username: username.replace("@", ""),
    };

    const { data, error } = await supabase
      .from("projects")
      .insert([payload])
      .select()
      .single();

    setLoading(false);

    if (error) {
      alert("Kayıt sırasında hata oluştu: " + error.message);
      return;
    }

    if (data) {
      onProjectAdded(data as Project);
      onClose();

      setTitle("");
      setTagline("");
      setDescription("");
      setAbandonReason("");
      setTechInput("");
      setStatus("fikir");
      setRepoUrl("");
      setUsername("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl text-zinc-100">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm mb-1">
          <Sparkles className="h-4 w-4" />
          <span>Fikrini veya Projeni Topluluğa Devret</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Yeni Proje Bırak</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Proje Adı *</label>
            <input
              type="text"
              required
              placeholder="Örn: ProjeNext, DevLog..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Tek Cümlelik Özet *</label>
            <input
              type="text"
              required
              placeholder="Örn: Yazılımcılar için masaüstü not alma aracı."
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setStatus("fikir")}
              className={`rounded-lg border p-2.5 text-center text-xs font-medium transition ${
                status === "fikir"
                  ? "border-amber-500 bg-amber-500/10 text-amber-400"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              💡 Sadece Fikir
            </button>
            <button
              type="button"
              onClick={() => setStatus("tasarim")}
              className={`rounded-lg border p-2.5 text-center text-xs font-medium transition ${
                status === "tasarim"
                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              🎨 Tasarım Var
            </button>
            <button
              type="button"
              onClick={() => setStatus("kod_acik")}
              className={`rounded-lg border p-2.5 text-center text-xs font-medium transition ${
                status === "kod_acik"
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              ⚡ Kod / Repo Açık
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-red-400 mb-1">
              Neden Devrediyorsun / Neden Durdu? *
            </label>
            <textarea
              rows={2}
              required
              placeholder="Örn: Zaman ayıramadım, backend tarafı karmaşık geldi..."
              value={abandonReason}
              onChange={(e) => setAbandonReason(e.target.value)}
              className="w-full rounded-lg border border-red-500/30 bg-red-950/10 px-3.5 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Teknolojiler (Virgülle ayır)</label>
            <input
              type="text"
              placeholder="Next.js, Tailwind, Python"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Kullanıcı Adın *</label>
              <input
                type="text"
                required
                placeholder="Örn: necati"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Repo / Link (Opsiyonel)</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-5 py-2 text-xs font-bold text-black hover:bg-amber-400 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              {loading ? "Kaydediliyor..." : "Panoya Bırak"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}