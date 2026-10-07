"use client";

import { useEffect, useState, useMemo } from "react";
import ProjectCard from "@/components/ProjectCard";
import NewProjectModal from "@/components/NewProjectModal";
import AdoptModal from "@/components/AdoptModal";
import { Project, ProjectStatus } from "@/types/project";
import { 
  Sparkles, 
  Layers, 
  PlusCircle, 
  Search, 
  Loader2, 
  Flame, 
  Clock, 
  FolderSearch,
  Code2,
  Heart
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type SortOption = "latest" | "popular";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ProjectStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdoptProject, setSelectedAdoptProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Projeler çekilemedi:", error.message);
    } else {
      setProjects((data as Project[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectAdded = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  // Filtreleme ve Sıralama
  const processedProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      const matchesFilter = filter === "all" ? true : project.status === filter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.tagline.toLowerCase().includes(q) ||
        project.description?.toLowerCase().includes(q) ||
        project.tech_stack?.some((t) => t.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "popular") {
        return (b.respect_count || 0) - (a.respect_count || 0);
      }
      // latest
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [projects, filter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-amber-500 selection:text-black flex flex-col justify-between">
      <div>
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 font-black text-black shadow-lg shadow-amber-500/20">
                P
              </span>
              <div>
                <span className="text-xl font-bold tracking-tight">ProjeNext</span>
                <span className="ml-2 hidden sm:inline-block rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400 font-medium">
                  {projects.length} proje devir bekliyor
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-black transition-all hover:bg-amber-400 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-amber-500/20"
            >
              <PlusCircle className="h-4 w-4" />
              Proje Bırak
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 pt-16 pb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-medium text-amber-400 shadow-inner">
            <Sparkles className="h-3.5 w-3.5" />
            Yarım kalan projelerin yeni sahipleriyle buluştuğu yer
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
            Fikirler çöp olmasın, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">
              sıradaki sahibi sen ol.
            </span>
          </h1>
          <p className="mt-4 text-base text-zinc-400 sm:text-lg max-w-2xl mx-auto">
            Zaman yetersizliğinden veya motivasyon kaybından rafa kalkan projeleri keşfet,
            saygı duruşunda bulun (F bas) veya devralıp hayata geçir.
          </p>

          {/* Arama & Kontroller */}
          <div className="mx-auto mt-8 max-w-xl flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Proje adı, özet veya teknoloji ara (Rust, Next.js)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 focus:outline-none transition"
              />
            </div>

            {/* Sıralama Butonları */}
            <div className="flex w-full sm:w-auto items-center justify-end gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 p-1">
              <button
                onClick={() => setSortBy("latest")}
                title="En Yeniler"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  sortBy === "latest"
                    ? "bg-zinc-800 text-zinc-100 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Clock className="h-3.5 w-3.5" />
                <span>En Yeni</span>
              </button>
              <button
                onClick={() => setSortBy("popular")}
                title="En Çok Saygı Görenler"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  sortBy === "popular"
                    ? "bg-amber-500/20 text-amber-400 font-semibold shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                <span>En Çok F</span>
              </button>
            </div>
          </div>

          {/* Durum Filtreleri */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition ${
                filter === "all"
                  ? "bg-zinc-100 text-zinc-900 shadow-sm"
                  : "border border-zinc-800/80 bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Tümü ({projects.length})
            </button>
            <button
              onClick={() => setFilter("kod_acik")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                filter === "kod_acik"
                  ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                  : "border border-zinc-800/80 bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              ⚡ Kod / Repo Açık
            </button>
            <button
              onClick={() => setFilter("tasarim")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                filter === "tasarim"
                  ? "bg-blue-500 text-black shadow-md shadow-blue-500/20"
                  : "border border-zinc-800/80 bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              🎨 Tasarım Hazır
            </button>
            <button
              onClick={() => setFilter("fikir")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                filter === "fikir"
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                  : "border border-zinc-800/80 bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              💡 Sadece Fikir
            </button>
          </div>
        </section>

        {/* Proje Kartları Listesi */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500 mb-3" />
              <p className="text-sm font-medium">Projeler yükleniyor...</p>
            </div>
          ) : processedProjects.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 py-20 px-6 text-center max-w-lg mx-auto">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800/80 text-zinc-400 mb-4">
                <FolderSearch className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-zinc-200">Aradığın kriterde proje bulunamadı</h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                Filtreleri veya arama kelimelerini değiştirebilir ya da kendi terk ettiğin projeyi ilk bırakan sen olabilirsin.
              </p>
              <button
                onClick={() => {
                  setFilter("all");
                  setSearchQuery("");
                }}
                className="mt-5 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 transition"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {processedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onAdopt={(p) => setSelectedAdoptProject(p)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-300">ProjeNext</span>
            <span>—</span>
            <span>Yarım kalan fikirlerin yeni evi.</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-400">
            <span>Next.js & Supabase ile geliştirildi</span>
          </div>
        </div>
      </footer>

      {/* Modallar */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectAdded={handleProjectAdded}
      />

      <AdoptModal
        project={selectedAdoptProject}
        onClose={() => setSelectedAdoptProject(null)}
      />
    </div>
  );
}