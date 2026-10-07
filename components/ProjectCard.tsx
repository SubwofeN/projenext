"use client";

import { useState } from "react";
import { Project } from "@/types/project";
import { Flame, Code2, Tag, AlertCircle, Handshake } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Props {
  project: Project;
  onAdopt: (project: Project) => void;
}

const statusMap = {
  fikir: { label: "Sadece Fikir", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
  tasarim: { label: "Tasarım Hazır", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  kod_acik: { label: "Kod/Repo Açık", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
};

export default function ProjectCard({ project, onAdopt }: Props) {
  const [respects, setRespects] = useState(project.respect_count);
  const [hasVoted, setHasVoted] = useState(false);

  const handleRespect = async () => {
    const nextCount = hasVoted ? respects - 1 : respects + 1;
    setRespects(nextCount);
    setHasVoted(!hasVoted);

    await supabase
      .from("projects")
      .update({ respect_count: nextCount })
      .eq("id", project.id);
  };

  const statusInfo = statusMap[project.status] || statusMap.fikir;

  return (
    <div className="group flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-black/50">
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
          <span className="text-xs text-zinc-500">
            {project.created_at ? new Date(project.created_at).toLocaleDateString("tr-TR") : "Yeni"}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-bold tracking-tight text-zinc-100">{project.title}</h3>
        <p className="mt-1 text-sm font-medium text-zinc-400">{project.tagline}</p>
        <p className="mt-3 text-sm text-zinc-300 leading-relaxed">{project.description}</p>

        {/* Neden Devrediliyor / Durdu? */}
        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-950/20 p-3 text-xs text-red-200">
          <div className="flex items-center gap-1.5 font-semibold text-red-400 mb-1">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Neden Devrediliyor / Durdu?</span>
          </div>
          {project.abandon_reason}
        </div>

        {/* Teknolojiler */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech_stack?.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-300"
            >
              <Tag className="h-3 w-3 text-zinc-500" />
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Alt Bar */}
      <div className="mt-6 flex flex-col gap-3 border-t border-zinc-800/80 pt-4">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <div>
            Geliştirici: <span className="font-medium text-zinc-200">@{project.author_username}</span>
          </div>
          <button
            onClick={() => onAdopt(project)}
            className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <Handshake className="h-3.5 w-3.5" />
            Sahiplen
          </button>
        </div>

        <div className="flex items-center justify-end gap-2">
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-xs text-zinc-200 hover:bg-zinc-700"
            >
              <Code2 className="h-3.5 w-3.5" />
              Repo
            </a>
          )}

          <button
            onClick={handleRespect}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              hasVoted
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-zinc-700 bg-zinc-800 text-zinc-200 hover:border-amber-500/50 hover:text-amber-400"
            }`}
          >
            <Flame className={`h-3.5 w-3.5 ${hasVoted ? "fill-black" : ""}`} />
            <span>F ({respects})</span>
          </button>
        </div>
      </div>
    </div>
  );
}